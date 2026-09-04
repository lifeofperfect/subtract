const formatMoney = (subscription) =>
    `${subscription.currency} ${Number(subscription.price).toFixed(2)}`;

const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
    });

export const renewalReminderEmail = (subscription, daysBefore) => {
    const when = daysBefore === 1 ? 'tomorrow' : `in ${daysBefore} days`;
    const name = subscription.user?.name ?? 'there';

    return {
        subject: `Your ${subscription.name} subscription renews ${when}`,
        text:
            `Hi ${name},\n\n` +
            `Your ${subscription.name} subscription renews ${when} on ${formatDate(subscription.renewalDate)}.\n\n` +
            `Amount: ${formatMoney(subscription)}\n` +
            `Payment method: ${subscription.paymentMethod}\n\n` +
            `If you no longer want this subscription, cancel it before the renewal date.\n`,
        html: `
<div style="font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
    <h2 style="margin: 0 0 16px; font-size: 20px;">Your ${subscription.name} subscription renews ${when}</h2>
    <p style="margin: 0 0 20px; line-height: 1.6;">Hi ${name}, this is a reminder so the charge does not take you by surprise.</p>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr><td style="padding: 8px 0; color: #666;">Subscription</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">${subscription.name}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Amount</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">${formatMoney(subscription)}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Renews on</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">${formatDate(subscription.renewalDate)}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Payment method</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">${subscription.paymentMethod}</td></tr>
    </table>
    <p style="margin: 0; line-height: 1.6; color: #666; font-size: 13px;">If you no longer want this subscription, cancel it before the renewal date.</p>
</div>`.trim(),
    };
};

export default renewalReminderEmail;
