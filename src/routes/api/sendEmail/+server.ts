import { json } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import { GMAIL_USER, GMAIL_APP_PASSWORD, EMAIL_TO, TELEGRAM_TOKEN, PHONE_TO } from '$env/static/private';

export const config = {
  csrf: {
    checkOrigin: false
  }
};

export const POST = async ({ request }) => {
  try {
    const { name, message, email, phone, company } = await request.json();

    if (!name || !message) {
      return json({ success: false, message: 'Name and message are required' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD
      }
    });

    const mailOptions = {
      from: GMAIL_USER,
      to: EMAIL_TO,
      subject: `Portfolio Contact: ${name}`,
      text: `
Name: ${name}
${email ? `Email: ${email}` : ''}
${phone ? `Phone: ${phone}` : ''}
${company ? `Company: ${company}` : ''}

Message:
${message}
      `,
      html: `
<p><strong>Name:</strong> ${name}</p>
${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    if (TELEGRAM_TOKEN && PHONE_TO) {
      const telegramText = `📨 Nuevo contacto en portfolio:\n\n*Nombre:* ${name}\n${email ? `*Email:* ${email}\n` : ''}${phone ? `*Teléfono:* ${phone}\n` : ''}${company ? `*Empresa:* ${company}\n` : ''}\n*Mensaje:*\n${message}`;
      
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: PHONE_TO,
          text: telegramText,
          parse_mode: 'Markdown'
        })
      });
    }

    return json({ 
      success: true, 
      message: TELEGRAM_TOKEN && PHONE_TO 
        ? 'Email and Telegram notification sent successfully' 
        : 'Email sent successfully' 
    });
  } catch (error) {
    console.error('Error sending email or telegram message:', error);
    return json({ success: false, message: 'Failed to send email' }, { status: 500 });
  }
};

export const OPTIONS = () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'content-type'
    }
  });
};
