import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {

    private transporter!: nodemailer.Transporter;
    private readonly logger = new Logger(EmailService.name)

    onModuleInit() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'localhost',
            port: parseInt(process.env.SMTP_PORT || '1025', 10),
            secure: false
        });

        this.logger.log('Email Service Initialized')
    }



    async sendEmail(to: string, subject: string, html: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: '"EventFlowApp" <noreply@eventflowapp.com>',
                to,
                subject,
                html
            })

            this.logger.log(`Email send to ${to}`);

        } catch (error) {
            this.logger.error(`Error send email to ${to}`, error)
        }

    }
}