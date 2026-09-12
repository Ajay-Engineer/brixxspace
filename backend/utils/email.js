const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const { generateEmailTemplate } = require('./emailTemplate');

const sendEmail = async (options) => {
    // 1) Create a transporter
    let transporter;

    const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASSWORD || process.env.EMAIL_PASS;
    const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
    const secure = process.env.SMTP_SECURE === 'true' || process.env.EMAIL_SECURE === 'true' || port === 465;

    if (host && user) {
        // Use SMTP
        transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
                user,
                pass
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    } else {
        // Dev: Log to console if no SMTP config
        console.log('WARNING: No SMTP_HOST/EMAIL_HOST or SMTP_USER/EMAIL_USER in .env. Using mock sender.');
        transporter = {
            sendMail: async (mailOptions) => {
                console.log('-------------------------------------------');
                console.log('📧 EMAIL MOCK');
                console.log(`To: ${mailOptions.to}`);
                console.log(`Subject: ${mailOptions.subject}`);
                console.log(`Text: ${mailOptions.text}`);
                console.log('-------------------------------------------');
                return true;
            }
        };
    }

    // 2) Resolve company logo attachment
    const attachments = [];
    const logoPaths = [
        path.join(__dirname, '../assets/brixxspace-logo.png'),
        path.join(__dirname, '../../src/assets/brixxspace-logo.png')
    ];

    for (const logoPath of logoPaths) {
        if (fs.existsSync(logoPath)) {
            attachments.push({
                filename: 'brixxspace-logo.png',
                path: logoPath,
                cid: 'brixxlogo'
            });
            break;
        }
    }

    // 3) Generate HTML content if not explicitly provided
    let htmlContent = options.html;
    if (!htmlContent) {
        htmlContent = generateEmailTemplate({
            title: options.title || options.subject,
            name: options.name || '',
            content: options.message || options.content || '',
            otpCode: options.otp || options.otpCode || '',
            quote: options.quote,
            quoteAuthor: options.quoteAuthor,
            ctaText: options.ctaText || '',
            ctaUrl: options.ctaUrl || '',
            footerNote: options.footerNote || ''
        });
    }

    // 4) Define the email options
    const fromAddress = process.env.EMAIL_FROM || process.env.SMTP_FROM || (user ? `BRIXXSPACE Support <${user}>` : 'BRIXXSPACE Support <support@brixxspace.com>');
    const mailOptions = {
        from: fromAddress,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: htmlContent,
        attachments: attachments.length > 0 ? attachments : undefined
    };

    // 5) Actually send the email
    return await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
