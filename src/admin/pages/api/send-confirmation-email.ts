import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { reservation } = req.body;

    if (!reservation || !reservation.email) {
      return res.status(400).json({ error: 'Missing reservation data' });
    }

    const response = await resend.emails.send({
      from: 'adithyaj2910@gmail.com',
      to: reservation.email,
      subject: 'Reservation Confirmed - Blue Whale Restaurant',
      html: `
        <h1>Reservation Confirmed!</h1>
        <p>Dear ${reservation.name},</p>
        <p>Your reservation at Blue Whale Restaurant has been confirmed:</p>
        <ul>
          <li>Date: ${new Date(reservation.date).toLocaleDateString()}</li>
          <li>Time: ${reservation.time}</li>
          <li>Number of Guests: ${reservation.persons}</li>
        </ul>
        <p>We look forward to serving you!</p>
        <p>Best regards,<br>Blue Whale Restaurant Team</p>
      `
    });

    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}