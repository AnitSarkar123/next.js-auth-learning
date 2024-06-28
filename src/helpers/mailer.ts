import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

interface SendEmailParams {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: SendEmailParams) => {
  try {
    // Hash the userId to create a token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    // Update the user document with the appropriate token and expiry
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000, // 1 hour expiry
        },
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour expiry
        },
      });
    }

    // Configure the mail transporter
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "2525"),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Define the mail options
    const mailOptions = {
      from: "anitsarkar04@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `
        <p>
          Click <a href="${
            process.env.DOMAIN
          }/verifyemail?token=${hashedToken}">here to ${
        emailType === "VERIFY" ? "VERIFY YOUR EMAIL" : "RESET YOUR PASSWORD"
      }</a> or copy and paste the link below in your browser.
          <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
        </p>
      `,
    };

    // Send the email
    const mailResponse = await transport.sendMail(mailOptions);
    console.log("Message sent: %s", mailResponse.messageId);
    return mailResponse;
  } catch (error: any) {
    console.log(error.message);
  }
};
