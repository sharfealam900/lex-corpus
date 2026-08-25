import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  const info = await transporter.sendMail({
    from: `"Lex Corpus" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("Email Sent:", info.messageId);

  return info;
};

export default sendEmail;