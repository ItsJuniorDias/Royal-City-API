const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "reabilitado97@gmail.com",
    pass: process.env.PASSWORD_NODEMAILER,
  },
});

module.exports = transporter;
