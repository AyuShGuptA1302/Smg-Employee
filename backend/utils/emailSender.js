const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, htmlContent) => {
    try {
        let transporter;
        
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
            // Real SMTP configured in .env
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT || 587,
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
        } else {
            // Development fallback: Ethereal automatically generated account
            console.log('No SMTP config found in .env. Generating Ethereal test account...');
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
        }

        const info = await transporter.sendMail({
            from: `"SMG Portal Admin" <${process.env.SMTP_USER || 'admin@smg.com'}>`,
            to: to,
            subject: subject,
            html: htmlContent
        });

        console.log(`Email sent to ${to}. Message ID: ${info.messageId}`);
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            console.log(`Preview URL: ${previewUrl}`);
        }
        return { success: true, url: previewUrl || null };
    } catch (err) {
        console.error('Email sending failed:', err);
        return { success: false, error: err.message };
    }
};

module.exports = { sendEmail };
