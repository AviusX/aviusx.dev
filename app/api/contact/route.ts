import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Option 1: Use a service like Resend, SendGrid, or Nodemailer
    // For now, using a simple mailto fallback approach.
    // To set up email delivery, configure one of these:
    //
    // --- Resend (recommended) ---
    // bun add resend
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'portfolio@aviusx.dev',
    //   to: 'hrijulbhatnagar@protonmail.com',
    //   subject: `Portfolio Contact: ${name}`,
    //   text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    // });

    // --- Nodemailer ---
    // const transporter = nodemailer.createTransport({...});
    // await transporter.sendMail({...});

    // For now, log the message (replace with email service in production)
    console.log("Contact form submission:", { name, email, message });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
