export const sendEmail = async (reservationData) => {
  try {
    // Format reservation details
    const reservationDetailsHtml = `
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1a365d;">Reservation Details:</h3>
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Reservation ID:</strong> ${reservationData.reservationId}</li>
          <li><strong>Name:</strong> ${reservationData.name}</li>
          <li><strong>Date:</strong> ${new Date(reservationData.date).toLocaleDateString()}</li>
          <li><strong>Time:</strong> ${reservationData.time}</li>
          <li><strong>Party Size:</strong> ${reservationData.persons} ${Number.parseInt(reservationData.persons) === 1 ? "person" : "people"}</li>
          <li><strong>Phone:</strong> ${reservationData.phone}</li>
          <li><strong>Email:</strong> ${reservationData.email}</li>
          ${reservationData.occasion ? `<li><strong>Occasion:</strong> ${reservationData.occasion}</li>` : ""}
          ${reservationData.preferredSeating ? `<li><strong>Seating Preference:</strong> ${reservationData.preferredSeating}</li>` : ""}
          ${reservationData.specialRequests ? `<li><strong>Special Requests:</strong> ${reservationData.specialRequests}</li>` : ""}
        </ul>
      </div>
    `;

    // Format date for customer email
    const reservationDate = new Date(reservationData.date);
    const formattedDate = reservationDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // 1. Admin Email HTML
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #1a365d; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">New Reservation Alert</h1>
        <p style="font-size: 16px; line-height: 1.5;">A new reservation has been made at Blue Whale Asian Fusion Restaurant.</p>
        ${reservationDetailsHtml}
        <p style="font-size: 16px; line-height: 1.5;">Please check the admin dashboard to view and manage this reservation.</p>
        <div style="margin-top: 30px; text-align: center;">
          <a href="https://bluewhalelagos.com/admin/reservations" 
             style="background-color: #1a365d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            View Reservation
          </a>
        </div>
        <p style="margin-top: 30px; font-size: 14px; color: #666; border-top: 1px solid #e0e0e0; padding-top: 15px;">
          This is an automated notification from the Blue Whale Reservation System.
        </p>
      </div>
    `;

    // 2. Customer Email HTML
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #d97706; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">Reservation Confirmation</h1>
        
        <p style="font-size: 16px; line-height: 1.5;">Dear ${reservationData.name},</p>
        
        <p style="font-size: 16px; line-height: 1.5;">Thank you for your reservation at Blue Whale Asian Fusion Restaurant. We're looking forward to serving you!</p>
        
        <div style="background-color: #fffbeb; padding: 15px; border-left: 4px solid #d97706; margin: 20px 0;">
          <h2 style="color: #d97706; margin-top: 0;">Reservation Details</h2>
          <p style="margin: 5px 0;"><strong>Reservation ID:</strong> ${reservationData.reservationId}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${reservationData.time}</p>
          <p style="margin: 5px 0;"><strong>Party Size:</strong> ${reservationData.persons} ${Number.parseInt(reservationData.persons) === 1 ? "person" : "people"}</p>
          ${reservationData.occasion ? `<p style="margin: 5px 0;"><strong>Occasion:</strong> ${reservationData.occasion}</p>` : ''}
          ${reservationData.preferredSeating !== "no preference" ? `<p style="margin: 5px 0;"><strong>Seating Preference:</strong> ${reservationData.preferredSeating}</p>` : ''}
          ${reservationData.specialRequests ? `<p style="margin: 5px 0;"><strong>Special Requests:</strong> ${reservationData.specialRequests}</p>` : ''}
        </div>
        
        <p style="font-size: 16px; font-weight: bold; color: #b45309; background-color: #fffbeb; padding: 15px; border-radius: 4px; text-align: center;">
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

    // Define an array of email operations
    const emailOperations = [
      // 1. Admin Email
      fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
          sender: {
            name: "Blue Whale Reservations",
            email: "bluewhaleasian@gmail.com",
          },
          to: [
            {
              email: "bluewhaleasian@gmail.com",
              name: "Blue Whale Admin",
            },
          ],
          subject: "New Reservation at Blue Whale Restaurant",
          htmlContent: adminEmailHtml,
        }),
      }),
      
      // 2. Customer Email
      fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
          sender: {
            name: "Blue Whale Restaurant",
            email: "bluewhaleasian@gmail.com",
          },
          to: [
            {
              email: reservationData.email,
              name: reservationData.name,
            },
          ],
          subject: "Your Reservation at Blue Whale Restaurant is Confirmed",
          htmlContent: customerEmailHtml,
        }),
      })
    ];

    // Execute both API calls in parallel and wait for both to complete
    const responses = await Promise.all(emailOperations);
    
    // Process responses
    const results = await Promise.all(responses.map(response => response.json()));
    
    console.log("Admin email sent successfully:", results[0]);
    console.log("Customer email sent successfully:", results[1]);
    
    return { 
      admin: results[0], 
      customer: results[1] 
    };
  } catch (error) {
    console.error("Error sending emails:", error);
    throw error;
  }
}