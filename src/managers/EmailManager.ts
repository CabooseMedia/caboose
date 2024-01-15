import { Manager } from '@caboose/managers';
import logger from "@logger";

import nodemailer from 'nodemailer';

export class EmailManager extends Manager {

    private transporter!: nodemailer.Transporter;

    public initialize(): void {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER ?? '',
                pass: process.env.EMAIL_PASS ?? ''
            }
        });
    }

    public async sendTextEmail(to: string | string[], subject: string, text: string): Promise<void> {
        let info = await this.transporter.sendMail({
            from: `"Caboose" <${process.env.EMAIL_USER ?? ""}>`,
            to: to,
            subject: subject,
            text: text
        });
        console.log(info);
    }

    public async sendInviteEmail(to: string, code: string): Promise<void> {
        let info = await this.transporter.sendMail({
            from: `"Caboose" <${process.env.EMAIL_USER ?? ""}>`,
            to: to,
            subject: "Caboose Invite",
            html: `<p>You have been invited to Caboose! Click <a href="${process.env.WEB_URL}/join?code=${code}&email=${encodeURIComponent(to)}">here</a> to sign up.</p>`
        });
        if (info.accepted.length > 0) {
            logger.info(`Sent invite email to ${to}.`);
        } else {
            logger.warn(`Failed to send invite email to ${to}.`);
        }
    }

    public getTransporter(): nodemailer.Transporter {
        return this.transporter;
    }

}