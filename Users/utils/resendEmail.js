import { Resend } from "resend";
import dotenv from "dotenv";


dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const resendEmail = async (to, subject, html) => {
  return await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to,
    subject,
    html,
  });
};

export default resendEmail;
