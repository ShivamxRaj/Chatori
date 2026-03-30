import nodemailer from "nodemailer";
import { ENV } from "../lib/env.js";
import { createWelcomeEmailTemplate, createPasswordResetEmailTemplate } from "../emails/emailTemplates.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (email, name, clientURL) => {
  try {
    const info = await transporter.sendMail({
      from: `"${ENV.EMAIL_FROM_NAME}" <${ENV.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Chatify!",
      html: createWelcomeEmailTemplate(name, clientURL),
    });
    console.log("Welcome Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

export const sendPasswordResetEmail = async (email, name, resetURL) => {
  try {
    const info = await transporter.sendMail({
      from: `"${ENV.EMAIL_FROM_NAME}" <${ENV.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Chatify Password",
      html: createPasswordResetEmailTemplate(name, resetURL),
    });
    console.log("Password reset email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};
