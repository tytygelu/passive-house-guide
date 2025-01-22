import { Resend } from 'resend'

// Force Node.js runtime instead of Edge
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email and message are required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Initialize Resend inside the function
    const resend = new Resend(process.env.RESEND_API_KEY)
    console.log('API Key:', process.env.RESEND_API_KEY) // Debug log

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'zero.energy.passive.house@gmail.com',
      replyTo: email,
      subject: `New Contact Form Message from ${name}`,
      html: `
        <h3>New Contact Form Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    })

    if (error) {
      console.error('Resend error:', error) // Debug log
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Failed to send email:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to send message',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
