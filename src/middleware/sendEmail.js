const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs').promises;
require("dotenv").config();

const loadTemplate = async (templatePath, code) => {
  const template = await fs.readFile(templatePath, 'utf-8');
  return ejs.render(template, { code });
};

exports.sendEmail = async (req, res) => {
  try {
    const emailContent = await loadTemplate(req.path, req.code);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "houssam@nhs.ma",
        pass: process.env.PASSWORD_EMAIL_APP
      },
    });

    const mailOptions = {
      from: "allumni",
      to: req.email,
      subject: "Email Verification",
      html: emailContent
    };

    // Wrap the sending of email in a Promise
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject({
            success: false,
            message: "Error sending verification email"
          });
        } else {
          resolve({
            success: true,
            message: req.successMessage,
          });
        }
      });
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error sending verification email"
    };
  }
};