'use server'

import { Resend } from 'resend'

export async function sendEmail(formData: FormData) {
  // Debug logging
  console.log('All env variables:', process.env)
  console.log('RESEND_API_KEY:', process.env.NEXT_PUBLIC_RESEND_API_KEY)
  console.log('Current working directory:', process.cwd())
  
  if (!process.env.NEXT_PUBLIC_RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY')
  }

  const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY)

  const name = formData.get('name')
  const email = formData.get('email')
  const message = formData.get('message')

  if (!name || !email || !message) {
    throw new Error('Name, email and message are required')
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'zero.energy.passive.house@gmail.com',
      replyTo: email.toString(),
      subject: `New Contact Form Message from ${name}`,
      html: `
        <h3>New Contact Form Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.toString().replace(/\n/g, '<br>')}</p>
      `
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: true, data }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to send message')
  }
}
