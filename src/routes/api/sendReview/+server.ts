import { json } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import { GMAIL_USER, GMAIL_APP_PASSWORD, EMAIL_TO, TELEGRAM_TOKEN, PHONE_TO } from '$env/static/private';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export const config = {
  csrf: {
    checkOrigin: false
  }
};

// Ensure the avatar uploads directory exists
const uploadDir = join(process.cwd(), 'static/data/images/reviews/uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

export const POST = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const review = formData.get('review') as string;
    const job = formData.get('job') as string || '';
    const url = formData.get('url') as string || '';
    const avatarFile = formData.get('avatar') as File || null;
    
    if (!name || !review) {
      return json({ success: false, message: 'Name and review are required' }, { status: 400 });
    }

    // Process the avatar file if it exists
    let avatarPath = '';
    if (avatarFile) {
      const fileExtension = avatarFile.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        return json({ success: false, message: 'Invalid file format. Please use jpg, png, gif, or webp.' }, { status: 400 });
      }
      
      if (avatarFile.size > 2 * 1024 * 1024) { // 2MB limit
        return json({ success: false, message: 'Avatar file is too large. Maximum size is 2MB.' }, { status: 400 });
      }
      
      const fileName = `${name}.${fileExtension}`;
      const filePath = join(uploadDir, fileName);
      
      // Save the file
      const arrayBuffer = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      writeFileSync(filePath, buffer);
      
      // Save the relative path for the database
      avatarPath = `/data/images/reviews/uploads/${fileName}`;
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
      subject: `Portfolio Review: ${name}`,
      text: `
New Review Submission

Name: ${name}
${job ? `Job: ${job}` : ''}
${url ? `LinkedIn/URL: ${url}` : ''}
${avatarPath ? `Avatar File: ${avatarPath}` : 'No avatar uploaded'}

Review:
${review}
      `,
      html: `
<h2>New Review Submission</h2>
<p><strong>Name:</strong> ${name}</p>
${job ? `<p><strong>Job:</strong> ${job}</p>` : ''}
${url ? `<p><strong>LinkedIn/URL:</strong> <a href="${url}">${url}</a></p>` : ''}
${avatarPath ? `
<p><strong>Avatar:</strong></p>
<p><img src="${process.env.ORIGIN || 'http://localhost:5173'}${avatarPath}" alt="User Avatar" style="max-width: 200px; max-height: 200px;"></p>
<p>Path: ${avatarPath}</p>
` : '<p><strong>No avatar uploaded</strong></p>'}
<p><strong>Review:</strong></p>
<p>${review.replace(/\n/g, '<br>')}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    if (TELEGRAM_TOKEN && PHONE_TO) {
      const telegramText = `⭐ New portfolio review:\n\n*Name:* ${name}\n${job ? `*Job:* ${job}\n` : ''}${url ? `*LinkedIn/URL:* ${url}\n` : ''}${avatarPath ? `*Avatar:* Uploaded (${avatarPath})\n` : '*No avatar uploaded*\n'}\n*Review:*\n${review}`;
      
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
        ? 'Review submitted successfully via email and Telegram' 
        : 'Review submitted successfully via email' 
    });
  } catch (error) {
    console.error('Error sending review:', error);
    return json({ success: false, message: 'Failed to submit review' }, { status: 500 });
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