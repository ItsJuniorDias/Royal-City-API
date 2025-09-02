// const nodeMailer = require('nodemailer');
const sgMail = require("@sendgrid/mail");
const transporter = require("../config/nodemailer");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (item) => {};

module.exports = sendEmail;
