import express from 'express';
import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const baseTemplate = (content) => `
  <div style="background-color: #0a0f0d; color: #e8e4df; font-family: sans-serif; padding: 40px 20px;">
    <div style="max-width: xl mx-auto bg-[#141210] border border-[#c4a850]/20 rounded-xl p-8">
      ${content}
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(196,168,80,0.2); font-size: 12px; color: #888888; text-align: center;">
        <p>Fragen? Kontaktiere uns unter support@${process.env.DOMAIN || 'agensia.de'}</p>
        <p>&copy; ${new Date().getFullYear()} agensia. Alle Rechte vorbehalten.</p>
      </div>
    </div>
  </div>
`;

const emailTemplates = {
  subscriptionActivated: (data) => ({
    subject: 'Willkommen bei agensia - Dein Abo ist aktiv!',
    html: baseTemplate(`
      <h1 style="color: #c4a850; margin-bottom: 20px; font-size: 24px;">Willkommen bei agensia!</h1>
      <p style="line-height: 1.6;">Hallo ${data.name},</p>
      <p style="line-height: 1.6;">Dein Abonnement für das Paket <strong style="color: #c4a850;">${data.package}</strong> wurde erfolgreich aktiviert.</p>
      <p style="line-height: 1.6;">Wir freuen uns darauf, dein Projekt umzusetzen und stehen dir bei Fragen jederzeit zur Verfügung.</p>
    `)
  }),
  paymentFailed: (data) => ({
    subject: 'Zahlungsversuch fehlgeschlagen',
    html: baseTemplate(`
      <h1 style="color: #ef4444; margin-bottom: 20px; font-size: 24px;">Zahlung fehlgeschlagen</h1>
      <p style="line-height: 1.6;">Hallo ${data.name},</p>
      <p style="line-height: 1.6;">Leider ist die Zahlung für dein Abonnement fehlgeschlagen. Bitte aktualisiere deine Zahlungsmethode in deinem Dashboard, um Unterbrechungen deines Hostings zu vermeiden.</p>
    `)
  }),
  subscriptionCancelled: (data) => ({
    subject: 'Abo gekündigt',
    html: baseTemplate(`
      <h1 style="color: #c4a850; margin-bottom: 20px; font-size: 24px;">Abonnement gekündigt</h1>
      <p style="line-height: 1.6;">Hallo ${data.name},</p>
      <p style="line-height: 1.6;">Dein Abonnement wurde wunschgemäß gekündigt. Dein Hosting läuft noch bis zum <strong style="color: #c4a850;">${data.endDate}</strong>.</p>
      <p style="line-height: 1.6;">Schade, dass du gehst! Wir hoffen, dich in Zukunft wieder bei uns begrüßen zu dürfen.</p>
    `)
  }),
  domainActivated: (data) => ({
    subject: 'Deine Domain ist aktiv!',
    html: baseTemplate(`
      <h1 style="color: #10b981; margin-bottom: 20px; font-size: 24px;">Domain erfolgreich verbunden</h1>
      <p style="line-height: 1.6;">Hallo ${data.name},</p>
      <p style="line-height: 1.6;">Gute Neuigkeiten: Deine Domain <strong style="color: #c4a850;">${data.domain}</strong> ist nun aktiv und mit deiner Website verbunden!</p>
      <p style="line-height: 1.6;">Deine Website ist ab sofort unter dieser Adresse erreichbar.</p>
    `)
  })
};

export const sendEmail = async (templateName, data) => {
  if (!emailTemplates[templateName]) {
    throw new Error(`Template ${templateName} not found`);
  }
  const template = emailTemplates[templateName](data);
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"agensia" <noreply@agensia.de>',
    to: data.email,
    subject: template.subject,
    html: template.html,
  });
  logger.info(`Email sent: ${templateName} to ${data.email}`);
};

export default router;