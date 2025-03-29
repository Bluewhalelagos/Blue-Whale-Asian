import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY || 'fallback-api-key');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { name, date, time, persons, phone, email, occasion, preferredSeating, specialRequests } = req.body;

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const emailHtml = `
      <h2>New Reservation Received</h2>
      <p>A new reservation has been made with the following details:</p>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr><td><strong>Guest Name:</strong></td><td>${name}</td></tr>
        <tr><td><strong>Date:</strong></td><td>${formattedDate}</td></tr>
        <tr><td><strong>Time:</strong></td><td>${time}</td></tr>
        <tr><td><strong>Party Size:</strong></td><td>${persons}</td></tr>
        <tr><td><strong>Phone:</strong></td><td>${phone}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
        ${occasion ? `<tr><td><strong>Occasion:</strong></td><td>${occasion}</td></tr>` : ''}
        ${preferredSeating ? `<tr><td><strong>Seating Preference:</strong></td><td>${preferredSeating}</td></tr>` : ''}
        ${specialRequests ? `<tr><td><strong>Special Requests:</strong></td><td>${specialRequests}</td></tr>` : ''}
      </table>
    `;

    const response = await resend.emails.send({
      from: 'Reservation System <onboarding@resend.dev>',
      to: 'bluehwaleasian@gmail.com',
      subject: `New Reservation - ${name} for ${persons} on ${formattedDate}`,
      html: emailHtml
    });

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
