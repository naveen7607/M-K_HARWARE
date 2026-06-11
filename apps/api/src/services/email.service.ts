import nodemailer from "nodemailer";
import { env } from "../config/env.js";

function hasSmtpConfig() {
  return Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
}

function getTransporter() {
  if (!hasSmtpConfig()) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  });
}

export async function sendEmail(options: { to: string; subject: string; html: string; text?: string }) {
  const transporter = getTransporter();

  if (!transporter) {
    console.log("Email skipped because SMTP is not configured", options.subject, options.to);
    return;
  }

  await transporter.sendMail({
    from: env.MAIL_FROM,
    ...options
  });
}

export async function sendInquiryConfirmation(to: string, customerName: string, inquiryId: string) {
  await sendEmail({
    to,
    subject: "Your inquiry has been received",
    html: `
      <p>Hello ${customerName},</p>
      <p>Thank you for contacting M/S Manikyam Agriculture Hardware, Electrical & Cement.</p>
      <p>Your inquiry <strong>${inquiryId}</strong> has been received. Our team will call you shortly with availability and pricing.</p>
    `
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await sendEmail({
    to,
    subject: "Reset your password",
    html: `
      <p>Use the link below to reset your password. The link expires in 30 minutes.</p>
      <p><a href="${resetUrl}">Reset password</a></p>
    `
  });
}

export async function sendLowStockEmail(to: string, productName: string, stock: number) {
  await sendEmail({
    to,
    subject: `Low stock warning: ${productName}`,
    html: `<p>${productName} has reached low stock. Current stock: <strong>${stock}</strong>.</p>`
  });
}
