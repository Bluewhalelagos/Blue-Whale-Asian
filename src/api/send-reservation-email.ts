import * as admin from 'firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';

// Ensure Firebase Admin is initialized only once
if (admin.apps.length === 0) {
  admin.initializeApp();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate request method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { reservation } = req.body;

  // Validate reservation data
  if (!reservation || !reservation.id || !reservation.email) {
    return res.status(400).json({ message: 'Invalid reservation data' });
  }

  // Email configuration
  const mailOptions = {
    from: 'Blue Whale Lagos <reservations@bluewhalelagos.com>',
    to: 'bluewhaleasian@gmail.com',
    subject: 'New Restaurant Reservation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>New Reservation Received</h2>
        <p>A new reservation has been made. Please check the admin page for details.</p>
        
        <h3>Reservation Details:</h3>
        <ul>
          <li><strong>Reservation ID:</strong> ${reservation.id}</li>
          <li><strong>Name:</strong> ${reservation.name}</li>
          <li><strong>Email:</strong> ${reservation.email}</li>
          <li><strong>Phone:</strong> ${reservation.phone}</li>
          <li><strong>Date:</strong> ${new Date(reservation.date).toLocaleDateString('en-US')}</li>
          <li><strong>Time:</strong> ${reservation.time}</li>
          <li><strong>Party Size:</strong> ${reservation.persons} ${parseInt(reservation.persons) === 1 ? 'person' : 'people'}</li>
          ${reservation.occasion ? `<li><strong>Occasion:</strong> ${reservation.occasion}</li>` : ''}
          ${reservation.specialRequests ? `<li><strong>Special Requests:</strong> ${reservation.specialRequests}</li>` : ''}
        </ul>
        
        <p>Please log into the admin dashboard to view full details and confirm the reservation.</p>
        
        <a href="https://www.bluewhalelagos.com/admin/login" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          View in Admin Dashboard
        </a>
      </div>
    `
  };

  try {
    // Send email using Firebase Admin SDK's mail collection
    await admin.firestore().collection('mail').add({
      to: mailOptions.to,
      message: {
        subject: mailOptions.subject,
        html: mailOptions.html,
        from: mailOptions.from
      }
    });

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending reservation notification:', error);
    return res.status(500).json({ 
      message: 'Failed to send reservation notification',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
