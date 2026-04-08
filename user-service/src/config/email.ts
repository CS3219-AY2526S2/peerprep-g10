import { Resend } from 'resend';

const FROM_ADDRESS = 'PeerPrep <noreply@peerprep.site>';
const SERVER_PATH = process.env.SERVER_IP;
const FRONTEND_PATH = SERVER_PATH != null ? `https://${SERVER_PATH}` : process.env.FRONTEND_URL?.replace(/\/$/, '') ?? 'https://localhost';

// Sends an email verification link to a newly registered user
export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  const verificationUrl = `${FRONTEND_PATH}/auth/verify-email?token=${encodeURIComponent(token)}`;
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: FROM_ADDRESS,
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

// Sends a verification link to confirm an email address change
export const sendEmailChangeVerification = async (newEmail: string, token: string): Promise<void> => {
  const verificationUrl = `${FRONTEND_PATH}/auth/verify-email?token=${encodeURIComponent(token)}`;
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: newEmail,
    subject: 'Verify your new email address',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify your new email</h2>
        <p>Click the link below to confirm your new email address. This link expires in 15 minutes.</p>
        <a href="${verificationUrl}"
           style="display: inline-block; background: #2563eb; color: white;
                  padding: 12px 24px; border-radius: 8px; text-decoration: none;">
          Verify New Email
        </a>
        <p style="color: #666; font-size: 12px; margin-top: 24px;">
          If you did not request this change, you can ignore this email.
        </p>
      </div>
    `,
  });
};