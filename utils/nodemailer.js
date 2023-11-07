const nodemailer = require("nodemailer");

const config = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "prestige.07@meta.ua",
    pass: process.env.PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

const sendNotificication = ({ subject, text }) => {
  const emailOptions = {
    from: "prestige.07@meta.ua",
    to: "anatoliy.prestige07@gmail.com",
    subject,
    text,
  };
  transporter.sendMail(emailOptions);
};

module.exports = sendNotificication;
