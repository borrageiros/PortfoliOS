import { json } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

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
				user: env.GMAIL_USER,
				pass: env.GMAIL_APP_PASSWORD
			}
		});

		const mailOptions = {
			from: env.GMAIL_USER,
			to: env.EMAIL_TO,
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

		if (env.TELEGRAM_TOKEN && env.PHONE_TO) {
			const telegramText = `📨 New portfolio contact:\n\n*Name:* ${name}\n${email ? `*Email:* ${email}\n` : ''}${phone ? `*Phone:* ${phone}\n` : ''}${company ? `*Company:* ${company}\n` : ''}\n*Message:*\n${message}`;

			await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					chat_id: env.PHONE_TO,
					text: telegramText,
					parse_mode: 'Markdown'
				})
			});
		}

		return json({
			success: true,
			message:
				env.TELEGRAM_TOKEN && env.PHONE_TO
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
