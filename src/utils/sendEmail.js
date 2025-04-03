export const sendEmail = async (reservationData) => {
  try {
    // Format reservation details for both emails
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

    // Admin email content with link to admin dashboard
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

    // Customer email content - confirmation without admin link
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #1a365d; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">Reservation Confirmation</h1>
        <p style="font-size: 16px; line-height: 1.5;">Thank you for choosing Blue Whale Asian Fusion Restaurant. Your reservation has been confirmed.</p>
        ${reservationDetailsHtml}
        <div style="margin-top: 20px; padding: 15px; background-color: #f0f9ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
          <p style="margin: 0; font-size: 16px;">We look forward to serving you. If you need to make any changes to your reservation, please call us at +(351) 920 221 805.</p>
        </div>
        <p style="margin-top: 30px; font-size: 14px; color: #666; border-top: 1px solid #e0e0e0; padding-top: 15px;">
          Blue Whale Asian Fusion Restaurant<br>
          Largo Salazar Moscoso, Lote 4, Loja A, 8600-522, Lagos<br>
          <a href="https://bluewhalelagos.com" style="color: #3b82f6; text-decoration: none;">bluewhalelagos.com</a>
        </p>
      </div>
    `;

    // Send separate emails to admin and customer
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": "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",
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
          }
        ],
        subject: "New Reservation at Blue Whale Restaurant",
        htmlContent: adminEmailHtml,
      }),
    });

    // Send confirmation email to customer
    const customerResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": "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",
      },
      body: JSON.stringify({
        sender: {
          name: "Blue Whale Reservations",
          email: "bluewhaleasian@gmail.com",
        },
        to: [
          {
            email: `${reservationData.email}`,
            name: `${reservationData.name}`,
          }
        ],
        subject: "Your Blue Whale Restaurant Reservation Confirmation",
        htmlContent: customerEmailHtml,
      }),
    });

    const result = await response.json();
    const customerResult = await customerResponse.json();
    
    console.log("Admin email sent successfully:", result);
    console.log("Customer email sent successfully:", customerResult);
    
    return { admin: result, customer: customerResult };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};