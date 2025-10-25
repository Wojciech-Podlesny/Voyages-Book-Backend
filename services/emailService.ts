import { transporter } from "../config/nodemailer";


interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from: string;
}

export const sendEmail = async ({ to, subject, html, from }: EmailOptions) => {
    try {
        await transporter.sendMail({
            from: from ||  `"No Reply" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        throw new Error('Email could not be sent');
    }
}