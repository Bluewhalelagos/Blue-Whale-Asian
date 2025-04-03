export const sendCustomerConfirmationEmail = async (reservation) => {
  try {
    // Format the date for display
    const reservationDate = new Date(reservation.date);
    const formattedDate = reservationDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Create HTML email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #d97706; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">Reservation Confirmation</h1>
        
        <p style="font-size: 16px; line-height: 1.5;">Dear ${reservation.name},</p>
        
        <p style="font-size: 16px; line-height: 1.5;">Thank you for your reservation at Blue Whale Asian Fusion Restaurant. We're looking forward to serving you!</p>
        
        <div style="background-color: #fffbeb; padding: 15px; border-left: 4px solid #d97706; margin: 20px 0;">
          <h2 style="color: #d97706; margin-top: 0;">Reservation Details</h2>
          <p style="margin: 5px 0;"><strong>Reservation ID:</strong> ${reservation.reservationId}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${reservation.time}</p>
          <p style="margin: 5px 0;"><strong>Party Size:</strong> ${reservation.persons} ${reservation.persons === "1" ? "person" : "people"}</p>
          ${reservation.occasion ? `<p style="margin: 5px 0;"><strong>Occasion:</strong> ${reservation.occasion}</p>` : ''}
          ${reservation.preferredSeating !== "no preference" ? `<p style="margin: 5px 0;"><strong>Seating Preference:</strong> ${reservation.preferredSeating}</p>` : ''}
          ${reservation.specialRequests ? `<p style="margin: 5px 0;"><strong>Special Requests:</strong> ${reservation.specialRequests}</p>` : ''}
        </div>
        
        <p style="font-size: 16px; font-weight: bold; color: #b45309; background-color: #fffbeb; padding: 15px; border-radius: 4px;">
          If you need to cancel or modify your reservation, please contact us at least 24 hours in advance at +351 920 221 805.
        </p>
        
        <div style="margin-top: 30px; text-align: center;">
          <p style="font-size: 18px; font-weight: bold; color: #d97706;">We look forward to welcoming you!</p>
          <p>Blue Whale Asian Fusion Restaurant</p>
          <p>+351 920 221 805</p>
        </div>
        
        <p style="margin-top: 30px; font-size: 14px; color: #666; border-top: 1px solid #e0e0e0; padding-top: 15px;">
          This is an automated confirmation from the Blue Whale Reservation System.
        </p>
      </div>
    `;

    // Send email using Brevo API
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { name: "Blue Whale Restaurant", email: "bluewhaleasian@gmail.com" },
        to: [{ email: reservation.email, name: reservation.name }],
        subject: "Your Reservation at Blue Whale Restaurant is Confirmed",
        htmlContent: emailHtml
      })
    });

    const result = await response.json();
    console.log("Customer confirmation email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending customer confirmation email:", error);
    throw error;
  }
};