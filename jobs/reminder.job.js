import {schedule} from "node-cron";
import mongoose from "mongoose";
import Subscription from "../models/subscription.model.js";
import Reminder from "../models/reminder.model.js";
import transporter, {isMailConfigured} from "../config/nodemailer.js";
import {EMAIL_USER} from "../config/env.js";
import {renewalReminderEmail} from "../utils/emailTemplate.js";

const REMINDER_DAYS = [7, 5, 3, 1];
const MAX_ATTEMPTS = 3;
const STUCK_AFTER_MS = 15 * 60 * 1000;
const BATCH_LIMIT = 200;

// The UTC calendar day that is `daysFromNow` days away, as a half open range.
const dayWindow = (daysFromNow) => {
    const start = new Date();
    start.setUTCDate(start.getUTCDate() + daysFromNow);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    return {start, end};
};

// Sends, then records the outcome. Never throws: one bad address must not stop
// the rest of the batch.
const deliver = async (reminder, subscription) => {
    try {
        const {subject, text, html} = renewalReminderEmail(subscription, reminder.daysBefore);

        await transporter.sendMail({
            from: EMAIL_USER,
            to: subscription.user.email,
            subject,
            text,
            html,
        });

        await Reminder.updateOne(
            {_id: reminder._id},
            {$set: {status: 'sent', sentAt: new Date(), lastError: null}},
        );

        return 'sent';
    } catch (err) {
        await Reminder.updateOne(
            {_id: reminder._id},
            {$set: {status: 'failed', lastError: err.message}},
        );

        console.error(`[reminders] send failed for subscription ${reminder.subscription} at ${reminder.daysBefore}d: ${err.message}`);

        return 'failed';
    }
};

// Phase one: pick up wreckage from earlier runs. Rows left in 'sending' mean a
// process died mid send; 'failed' rows are retried until MAX_ATTEMPTS.
const retryOutstanding = async () => {
    const stuckBefore = new Date(Date.now() - STUCK_AFTER_MS);

    const outstanding = await Reminder.find({
        attempts: {$lt: MAX_ATTEMPTS},
        $or: [
            {status: 'sending', updatedAt: {$lt: stuckBefore}},
            {status: 'failed'},
        ],
    }).limit(BATCH_LIMIT);

    let sent = 0;

    for (const row of outstanding) {
        try {
            // Re-claim atomically, so two instances cannot retry the same row.
            const claimed = await Reminder.findOneAndUpdate(
                {_id: row._id, status: row.status, attempts: {$lt: MAX_ATTEMPTS}},
                {$set: {status: 'sending'}, $inc: {attempts: 1}},
                {returnDocument: 'after'},
            );

            if (!claimed) continue;

            const subscription = await Subscription
                .findById(claimed.subscription)
                .populate('user', 'name email');

            // The subscription was deleted or cancelled since we queued this.
            if (!subscription || subscription.status !== 'active' || !subscription.user?.email) {
                await Reminder.deleteOne({_id: claimed._id});
                continue;
            }

            if (await deliver(claimed, subscription) === 'sent') sent++;
        } catch (err) {
            console.error(`[reminders] retry error on ${row._id}: ${err.message}`);
        }
    }

    return sent;
};

// Phase two: new reminders that fall due today.
const sendDueReminders = async () => {
    let sent = 0;

    for (const daysBefore of REMINDER_DAYS) {
        const {start, end} = dayWindow(daysBefore);

        const due = await Subscription
            .find({status: 'active', renewalDate: {$gte: start, $lt: end}})
            .populate('user', 'name email')
            .limit(BATCH_LIMIT);

        for (const subscription of due) {
            if (!subscription.user?.email) continue;

            try {
                // Creating the row IS the claim. A duplicate key error means
                // this reminder is already handled, so there is nothing to do.
                const reminder = await Reminder.create({
                    subscription: subscription._id,
                    daysBefore,
                    status: 'sending',
                    attempts: 1,
                });

                if (await deliver(reminder, subscription) === 'sent') sent++;
            } catch (err) {
                if (err.code === 11000) continue;
                console.error(`[reminders] claim error for ${subscription._id} at ${daysBefore}d: ${err.message}`);
            }
        }
    }

    return sent;
};

export const runReminderJob = async () => {
    if (mongoose.connection.readyState !== 1) {
        console.warn('[reminders] skipped, database not connected');
        return;
    }

    if (!isMailConfigured) {
        console.warn('[reminders] skipped, EMAIL_USER and EMAIL_PASSWORD are not set');
        return;
    }

    try {
        const retried = await retryOutstanding();
        const fresh = await sendDueReminders();

        if (retried || fresh) console.log(`[reminders] sent ${fresh} new, ${retried} retried`);
    } catch (err) {
        console.error(`[reminders] run failed: ${err.message}`);
    }
};

// Hourly rather than daily. Repeat runs are free because the ledger makes them
// no ops, so a few hours of downtime cannot lose anyone's reminder.
export const startReminderJob = () => {
    schedule('0 * * * *', runReminderJob);
    console.log('[reminders] scheduled hourly');
};

export default startReminderJob;
