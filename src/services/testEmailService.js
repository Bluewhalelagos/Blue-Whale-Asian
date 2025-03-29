import { sendEmail } from './emailService.js';

const testSendEmail = async () => {
  try {
    console.log("Testing email sending...");
    const response = await sendEmail();
    console.log("Test email sent successfully:", response);
  } catch (error) {
    console.error("Test email failed:", error);
  }
};

testSendEmail();
