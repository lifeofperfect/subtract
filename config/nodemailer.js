import nodemailer from "nodemailer";
import {EMAIL_USER, EMAIL_PASSWORD} from "./env.js";

// Gmail requires an App Password, not the account password. Generate one at
// https://myaccount.google.com/apppasswords with 2FA enabled.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
    },
});

export const isMailConfigured = Boolean(EMAIL_USER && EMAIL_PASSWORD);

export default transporter;
