require('dotenv').config({ path: 'd:/JUNEINTERN/backend/.env' });
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('Testing SMTP connection with:');
    console.log('User:', process.env.SMTP_USER);
    console.log('Pass:', process.env.SMTP_PASS ? '********' : 'NOT SET');

    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true", 
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        console.log('Attempting to send email...');
        let info = await transporter.sendMail({
            from: `"SMG Portal Test" <${process.env.SMTP_USER}>`,
            to: "tuskydv@gmail.com",
            subject: "SMG Portal - SMTP Test",
            text: "Hello! If you are reading this, the SMTP configuration is working perfectly.",
            html: "<b>Hello!</b><br>If you are reading this, the SMTP configuration is working perfectly."
        });

        console.log("Message sent successfully! Message ID: %s", info.messageId);
    } catch (error) {
        console.error("Failed to send email. Error details:");
        console.error(error.message);
        if (error.responseCode === 535) {
            console.error("\n--- IMPORTANT ---\nAuthentication failed! This usually means Google rejected the standard password. You MUST use a 16-character Google App Password instead of your regular password.");
        }
    }
}

testEmail();
