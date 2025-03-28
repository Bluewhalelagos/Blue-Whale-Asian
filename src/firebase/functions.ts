import { collection, addDoc } from 'firebase/firestore';
import { db } from './config';

interface EmailNotification {
  to: string;
  message: {
    subject: string;
    html: string;
    from: string;
  };
}

export const sendReservationEmail = async (reservationData: {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  persons: string;
  occasion?: string;
  specialRequests?: string;
}) => {
  const emailData: EmailNotification = {
    to: 'bluewhaleasian@gmail.com',
    message: {
      subject: 'New Restaurant Reservation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>New Reservation Received</h2>
          <p>A new reservation has been made. Please check the admin page for details.</p>
          
          <h3>Reservation Details:</h3>
          <ul>
            <li><strong>Reservation ID:</strong> ${reservationData.id}</li>
            <li><strong>Name:</strong> ${reservationData.name}</li>
            <li><strong>Email:</strong> ${reservationData.email}</li>
            <li><strong>Phone:</strong> ${reservationData.phone}</li>
            <li><strong>Date:</strong> ${new Date(reservationData.date).toLocaleDateString()}</li>
            <li><strong>Time:</strong> ${reservationData.time}</li>
            <li><strong>Party Size:</strong> ${reservationData.persons} ${parseInt(reservationData.persons) === 1 ? 'person' : 'people'}</li>
            ${reservationData.occasion ? `<li><strong>Occasion:</strong> ${reservationData.occasion}</li>` : ''}
            ${reservationData.specialRequests ? `<li><strong>Special Requests:</strong> ${reservationData.specialRequests}</li>` : ''}
          </ul>
          
          <p>Please log into the admin dashboard to view full details and confirm the reservation.</p>
          
          <a href="https://www.bluewhalelagos.com/admin" 
             style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View in Admin Dashboard
          </a>
        </div>
      `,
      from: 'Blue Whale Lagos <noreply@bluewhalelagos.com>'
    }
  };

  try {
    await addDoc(collection(db, 'mail'), emailData);
    console.log('Email notification queued successfully');
    return true;
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
};