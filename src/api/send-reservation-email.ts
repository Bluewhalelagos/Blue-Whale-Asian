import { Resend } from 'resend';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });

  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
const { reservation } = req.body; // Access the reservation data from the request body


    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'bluewhaleasian@gmail.com',
      subject: 'New Restaurant Reservation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>New Reservation Alert</h2>
          <p><strong>Reservation Details:</strong></p>
          <ul>
            <li><strong>Name:</strong> ${reservation.name}</li>
            <li><strong>Email:</strong> ${reservation.email}</li>
            <li><strong>Phone:</strong> ${reservation.phone}</li>
            <li><strong>Date:</strong> ${new Date(reservation.date).toLocaleDateString()}</li>
            <li><strong>Time:</strong> ${reservation.time}</li>
            <li><strong>Party Size:</strong> ${reservation.persons} ${parseInt(reservation.persons) === 1 ? 'person' : 'people'}</li>
            ${reservation.occasion ? `<li><strong>Occasion:</strong> ${reservation.occasion}</li>` : ''}
            ${reservation.specialRequests ? `<li><strong>Special Requests:</strong> ${reservation.specialRequests}</li>` : ''}
          </ul>
          <p>Please check the admin dashboard for full details.</p>
        </div>
      `
    });

    return res.status(200).json({ message: 'Email sent successfully', response });

  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ message: 'Error sending email', error });

  }
}
