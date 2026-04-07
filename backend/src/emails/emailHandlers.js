import { Resend } from "resend";
import { ENV } from "../lib/env.js";
import { createWelcomeEmailTemplate, createPasswordResetEmailTemplate } from "../emails/emailTemplates.js";

const resend = new Resend(ENV.RESEND_API_KEY);

export const sendWelcomeEmail = async (email, name, clientURL) => {
  try {
    const data = await resend.emails.send({
      from: `${ENV.EMAIL_FROM_NAME} <${ENV.EMAIL_FROM}>`,
      to: email,
      subject: "Welcome to Chatify!",
      html: createWelcomeEmailTemplate(name, clientURL),
    });
    console.log("Welcome Email sent successfully:", data.id);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

export const sendPasswordResetEmail = async (email, name, resetURL) => {
  try {
    const data = await resend.emails.send({
      from: `${ENV.EMAIL_FROM_NAME} <${ENV.EMAIL_FROM}>`,
      to: email,
      subject: "Reset Your Chatify Password",
      html: createPasswordResetEmailTemplate(name, resetURL),
    });
    console.log("Password reset email sent successfully:", data.id);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};
