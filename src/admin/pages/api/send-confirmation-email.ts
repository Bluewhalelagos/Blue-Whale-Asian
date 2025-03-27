import { Resend } from 'resend';

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

// Async function to send email
async function sendEmail() {
  try {
    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'bluewhaleasian@gmail.com',
      subject: 'Hello World',
      html: '<p>Check admin page a New reservation has been Made</strong>!</p>'
    });

    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Export the function or call it depending on your use case
export default sendEmail;