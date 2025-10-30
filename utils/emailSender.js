const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or use SMTP config
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReportEmail = async ({ to, subject, text, attachmentPath }) => {
  const mailOptions = {
    from: '"SmartBiz Reports" <reports@smartbiz.com>',
    to,
    subject,
    text,
    attachments: attachmentPath
      ? [{ filename: "report.pdf", path: attachmentPath }]
      : [],
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendReportEmail;