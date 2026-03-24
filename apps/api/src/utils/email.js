import 'dotenv/config';
import nodemailer from 'nodemailer';
import logger from './logger.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const emailTemplates = {
  new_message: (variables) => ({
    subject: `New message from ${variables.senderName}`,
    html: `<p>You have a new message from <strong>${variables.senderName}</strong>:</p><p>${variables.message}</p>`,
  }),
  task_reminder: (variables) => ({
    subject: `Reminder: ${variables.taskName}`,
    html: `<p>This is a reminder for your task: <strong>${variables.taskName}</strong></p><p>Due: ${variables.dueDate}</p>`,
  }),
  payment_reminder: (variables) => ({
    subject: `Payment Reminder - Invoice #${variables.invoiceNumber}`,
    html: `<p>This is a reminder that invoice <strong>#${variables.invoiceNumber}</strong> is due on ${variables.dueDate}.</p><p>Amount: $${variables.amount}</p>`,
  }),
  project_update: (variables) => ({
    subject: `Project Update: ${variables.projectName}`,
    html: `<p>Project <strong>${variables.projectName}</strong> has been updated.</p><p>Status: ${variables.status}</p><p>${variables.message}</p>`,
  }),
  file_upload: (variables) => ({
    subject: `New file uploaded: ${variables.fileName}`,
    html: `<p>A new file <strong>${variables.fileName}</strong> has been uploaded to project <strong>${variables.projectName}</strong>.</p>`,
  }),
  welcome: (variables) => ({
    subject: 'Welcome!',
    html: `<p>Welcome <strong>${variables.name}</strong>!</p><p>We're excited to have you on board.</p>`,
  }),
  password_reset: (variables) => ({
    subject: 'Password Reset Request',
    html: `<p>Click the link below to reset your password:</p><p><a href="${variables.resetLink}">Reset Password</a></p><p>This link expires in 1 hour.</p>`,
  }),
};

export const sendEmail = async (to, templateName, variables = {}) => {
  if (!emailTemplates[templateName]) {
    throw new Error(`Email template '${templateName}' not found`);
  }

  const template = emailTemplates[templateName](variables);

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject: template.subject,
    html: template.html,
  };

  const info = await transporter.sendMail(mailOptions);
  logger.info(`Email sent to ${to}: ${info.messageId}`);
  return { success: true, message_id: info.messageId };
};

export default { sendEmail };