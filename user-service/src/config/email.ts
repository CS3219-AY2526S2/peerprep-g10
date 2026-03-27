import { Resend } from 'resend';

console.log('All Env Vars:', process.env.JWT_SECRET);
console.log('API KEY:', process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.APP_URL}/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: 'PeerPrep <noreply@yourdomain.com>',
    to: email,
    subject: 'Verify your PeerPrep account',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify your email</h2>
        <p>Click the link below to verify your PeerPrep account. This link expires in 15 minutes.</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; background: #2563eb; color: white; 
                  padding: 12px 24px; border-radius: 8px; text-decoration: none;">
          Verify Email
        </a>
        <p style="color: #666; font-size: 12px; margin-top: 24px;">
          If you didn't create an account, you can ignore this email.
        </p>
      </div>
    `,
  });
};