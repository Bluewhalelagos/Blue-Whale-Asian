import { Resend } from 'resend';

// For browser environments, you'll need a different approach than dotenv
const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY; // If using Vite

interface ReservationData {
  name: string;
  date: string;
  time: string;
  persons: string;
  phone: string;
  email: string;
  occasion?: string;
  preferredSeating?: string;
  specialRequests?: string;
}

const resend = new Resend(RESEND_API_KEY);

export const sendEmail = async () => {
  try {
    
    
   
    
    const emailHtml = `
      <h1>New Reservation Received</h1>
      
      <p>A new reservation has been made.</p>
      
      <p>Please check the admin section for complete reservation details.</p>
    `;
    
    const response = await resend.emails.send({
      from: 'Reservation System <reservations@your-domain.com>',
      to: 'bluehwaleasian@gmail.com',
      subject: `New Reservation `,
      html: emailHtml
    });
    
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};