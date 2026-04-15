import { Resend } from 'resend';

const FROM_ADDRESS = 'PeerPrep <noreply@peerprep.site>';
const SERVER_PATH = process.env.SERVER_IP;
const FRONTEND_PATH = SERVER_PATH != null ? `https://${SERVER_PATH}` : process.env.FRONTEND_URL?.replace(/\/$/, '') ?? 'https://localhost';

const getEmailTemplate = (title: string, body: string, ctaLabel: string, verificationUrl: string, footerNote: string): string => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:#0F62FE;padding:36px 48px;">
          <span style="font-family:'Segoe UI',Arial,sans-serif;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">PeerPrep</span>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px 48px 8px;">
          <h2 style="margin:0 0 12px;font-size:22px;font-weight:600;color:#0f172a;">${title}</h2>
          <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#475569;">${body}</p>

          <!-- CTA Button -->
          <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td style="background:#0F62FE;border-radius:8px;">
                <a href="${verificationUrl}"
                   style="display:inline-block;padding:13px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.1px;">
                  ${ctaLabel}
                </a>
              </td>
            </tr>
          </table>

          <!-- Expiry notice -->
          <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;width:100%;">
            <tr>
              <td style="background:#eff6ff;border-left:3px solid #0F62FE;border-radius:0 6px 6px 0;padding:12px 16px;">
                <p style="margin:0;font-size:13px;color:#1e40af;">
                  &#9679;&nbsp; This link expires in <strong>15 minutes</strong>.
                </p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:0 48px 36px;">
          <hr style="border:none;border-top:1px solid #e2e8f0;margin-bottom:24px;"/>
          <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
            ${footerNote}<br/>
            &copy; ${new Date().getFullYear()} PeerPrep. All rights reserved.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
`;

// Sends an email verification link to a newly registered user
export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  const verificationUrl = `${FRONTEND_PATH}/auth/verify-email?token=${encodeURIComponent(token)}`;
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: 'Verify your PeerPrep account',
    html: getEmailTemplate(
      'Verify your email',
      'Thanks for signing up! Click the button below to verify your PeerPrep account and get started.',
      'Verify Email',
      verificationUrl,
      "If you didn't create an account, you can safely ignore this email."
    ),
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
    html: getEmailTemplate(
      'Verify your new email',
      'We received a request to update your email address. Click the button below to confirm this change.',
      'Verify New Email',
      verificationUrl,
      'If you did not request this change, you can safely ignore this email.'
    ),
  });
};