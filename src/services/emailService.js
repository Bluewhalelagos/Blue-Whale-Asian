import { Resend } from "resend"

// Initialize Resend with the provided API key
const resend = new Resend("re_j2wxDqBR_5w2hhhyQLxkNSxYaXWCARMGZ")

export const sendEmail = async () => {
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #1a365d; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">New Reservation Alert</h1>
        
        <p style="font-size: 16px; line-height: 1.5;">A new reservation has been made at Blue Whale Asian Fusion Restaurant.</p>
        
        <p style="font-size: 16px; line-height: 1.5;">Please check the admin dashboard to view and manage this reservation.</p>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="https://blue-whale-asian-fusion.vercel.app/admin/reservations" 
             style="background-color: #1a365d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            View Reservation
          </a>
        </div>
        
        <p style="margin-top: 30px; font-size: 14px; color: #666; border-top: 1px solid #e0e0e0; padding-top: 15px;">
          This is an automated notification from the Blue Whale Reservation System.
        </p>
      </div>
    `

    const response = await resend.emails.send({
      from: "Blue Whale Reservations <onboarding@resend.dev>",
      to: "bluewhaleasian@gmail.com",
      subject: "New Reservation at Blue Whale Restaurant",
      html: emailHtml,
    })

    console.log("Email sent successfully:", response)
    return response
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

