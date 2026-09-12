/**
 * Generates a responsive, modern HTML email template for BRIXXSPACE
 */
const generateEmailTemplate = ({
    title = 'Notification from BRIXXSPACE',
    preheader = 'BRIXXSPACE - Architecture & Construction',
    name = '',
    content = '',
    otpCode = '',
    quote = "At BRIXXSPACE, we don't just build structures — we build trust, relationships, and the future of our community.",
    quoteAuthor = "BRIXXSPACE Leadership",
    ctaText = '',
    ctaUrl = '',
    footerNote = ''
}) => {
    // Format paragraph breaks in content if provided as plain text
    const formattedContent = content
        ? content
            .split('\n\n')
            .map(p => `<p style="margin: 0 0 16px 0; line-height: 1.7; color: #334155; font-size: 15px;">${p.replace(/\n/g, '<br/>')}</p>`)
            .join('')
        : '';

    return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${title}</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    
    <!-- Preheader preview text for mail clients -->
    <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px; color: #fff;">
        ${preheader}
    </div>

    <!-- Main Container Table -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F1F5F9; padding: 30px 10px;">
        <tr>
            <td align="center">
                <!-- Email Card -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #E2E8F0;">
                    
                    <!-- Header with Logo -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0A0E1A 0%, #161E31 100%); padding: 32px 24px; text-align: center; border-bottom: 3px solid #D4AF37;">
                            <a href="https://brixxspace.com" target="_blank" style="text-decoration: none; display: inline-block;">
                                <img src="cid:brixxlogo" alt="BRIXXSPACE" style="height: 48px; max-width: 220px; object-fit: contain; display: block; margin: 0 auto; border: 0;" />
                            </a>
                            <div style="color: #E2B13C; font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase; font-weight: 600; margin-top: 10px;">
                                ARCHITECTURE &bull; ENGINEERING &bull; CONSTRUCTION
                            </div>
                        </td>
                    </tr>

                    <!-- Welcome Quote Banner -->
                    ${quote ? `
                    <tr>
                        <td style="padding: 24px 32px 0 32px;">
                            <div style="background-color: #FCF9F2; border-left: 4px solid #D4AF37; border-radius: 0 8px 8px 0; padding: 14px 18px;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td style="vertical-align: top; width: 24px; font-size: 26px; line-height: 1; color: #D4AF37; font-family: Georgia, serif;">
                                            “
                                        </td>
                                        <td style="vertical-align: middle; color: #475569; font-size: 13.5px; line-height: 1.55; font-style: italic; font-weight: 400;">
                                            ${quote}
                                            ${quoteAuthor ? `<div style="font-size: 11.5px; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.8px; margin-top: 6px; font-style: normal;">— ${quoteAuthor}</div>` : ''}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    ` : ''}

                    <!-- Main Content Area -->
                    <tr>
                        <td style="padding: 28px 32px;">
                            ${name ? `<p style="margin: 0 0 14px 0; font-size: 16px; font-weight: 600; color: #0F172A;">Hello ${name},</p>` : ''}
                            
                            ${title && !name ? `<h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0F172A; letter-spacing: -0.3px;">${title}</h2>` : ''}

                            ${formattedContent}

                            <!-- OTP Badge (if applicable) -->
                            ${otpCode ? `
                            <div style="text-align: center; margin: 28px 0; padding: 22px; background: #F8FAFC; border: 1.5px dashed #CBD5E1; border-radius: 10px;">
                                <div style="font-size: 12px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                                    Your Verification Code
                                </div>
                                <div style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #0F172A; margin: 8px 0 10px 0; text-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                                    ${otpCode}
                                </div>
                                <div style="font-size: 12.5px; color: #94A3B8; margin-top: 6px;">
                                    ⏰ Valid for <strong>10 minutes</strong>. Please do not share this code with anyone.
                                </div>
                            </div>
                            ` : ''}

                            <!-- Call To Action Button (if applicable) -->
                            ${ctaText && ctaUrl ? `
                            <div style="text-align: center; margin: 28px 0 20px 0;">
                                <a href="${ctaUrl}" target="_blank" style="background: linear-gradient(135deg, #D4AF37 0%, #B89228 100%); color: #0A0E1A; font-weight: 700; font-size: 14px; text-decoration: none; padding: 13px 32px; border-radius: 6px; display: inline-block; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(212,175,55,0.25);">
                                    ${ctaText}
                                </a>
                            </div>
                            ` : ''}

                            ${footerNote ? `<p style="margin: 20px 0 0 0; font-size: 12.5px; color: #94A3B8; line-height: 1.5;">${footerNote}</p>` : ''}
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 32px;">
                            <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 0;" />
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F8FAFC; padding: 24px 32px; text-align: center;">
                            <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: #334155;">
                                BRIXXSPACE Construction & Consultation
                            </p>
                            <p style="margin: 0 0 12px 0; font-size: 12px; color: #64748B; line-height: 1.6;">
                                Krishnapuram, Tirunelveli, Tamil Nadu, India<br/>
                                Phone: <a href="tel:+919363063013" style="color: #ca8a04; text-decoration: none;">+91 93630 63013</a> &bull; Email: <a href="mailto:admin@brixxspace.com" style="color: #ca8a04; text-decoration: none;">admin@brixxspace.com</a>
                            </p>
                            <p style="margin: 0; font-size: 11px; color: #94A3B8;">
                                &copy; ${new Date().getFullYear()} BRIXXSPACE. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
};

module.exports = { generateEmailTemplate };
