import mongoose from "mongoose";


const reminderSchema = new mongoose.Schema({
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
        required: true,
    },
    daysBefore: {
        type: Number,
        required: true,
        enum: [7, 5, 3, 1],
    },
    status: {
        type: String,
        enum: ['sending', 'sent', 'failed'],
        default: 'sending',
        index: true,
    },
    attempts: {
        type: Number,
        default: 1,
    },
    sentAt: Date,
    lastError: String,
}, { timestamps: true });

// This index is what makes a double send impossible. Creating the row IS the
// claim: a second attempt for the same (subscription, daysBefore) fails with a
// duplicate key error instead of sending another email. Checking first and then
// inserting would leave a gap two instances could both pass through.
reminderSchema.index({ subscription: 1, daysBefore: 1 }, { unique: true });


const Reminder = mongoose.model("Reminder", reminderSchema);

export default Reminder;
