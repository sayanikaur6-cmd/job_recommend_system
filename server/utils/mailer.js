const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendContactMail = async ({
  name,
  email,
  subject,
  message,
}) => {
  const mailOptions = {
    from: `"CareerSync Contact" <${process.env.MAIL_USER}>`,

    to: process.env.CONTACT_RECEIVER,

    replyTo: email,

    subject: `CareerSync Contact: ${subject}`,

    text: `
New Contact Us Message

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
    `,

    html: `
      <div style="
        margin:0;
        padding:40px 20px;
        background:#f1f5ff;
        font-family:Arial,Helvetica,sans-serif;
      ">

        <div style="
          max-width:650px;
          margin:auto;
          background:#ffffff;
          border-radius:24px;
          overflow:hidden;
          box-shadow:0 15px 50px rgba(0,0,0,0.10);
        ">

          <!-- HEADER -->

          <div style="
            padding:30px;
            background:linear-gradient(
              135deg,
              #4f46e5,
              #7c3aed,
              #0ea5e9
            );
            color:white;
          ">

            <h1 style="
              margin:0 0 8px;
              font-size:28px;
            ">
              Career<span style="color:#dbeafe;">Sync</span>
            </h1>

            <p style="
              margin:0;
              opacity:.9;
              font-size:14px;
            ">
              New Contact Us Message
            </p>

          </div>

          <!-- BODY -->

          <div style="
            padding:32px;
          ">

            <div style="
              margin-bottom:20px;
              padding:18px;
              background:#f8fafc;
              border-radius:16px;
              border:1px solid #e2e8f0;
            ">

              <div style="
                font-size:11px;
                color:#64748b;
                font-weight:bold;
                text-transform:uppercase;
                margin-bottom:6px;
              ">
                Name
              </div>

              <div style="
                font-size:16px;
                color:#0f172a;
                font-weight:bold;
              ">
                ${name}
              </div>

            </div>

            <div style="
              margin-bottom:20px;
              padding:18px;
              background:#f8fafc;
              border-radius:16px;
              border:1px solid #e2e8f0;
            ">

              <div style="
                font-size:11px;
                color:#64748b;
                font-weight:bold;
                text-transform:uppercase;
                margin-bottom:6px;
              ">
                Email
              </div>

              <div style="
                font-size:16px;
                color:#4f46e5;
                font-weight:bold;
              ">
                ${email}
              </div>

            </div>

            <div style="
              margin-bottom:20px;
              padding:18px;
              background:#f8fafc;
              border-radius:16px;
              border:1px solid #e2e8f0;
            ">

              <div style="
                font-size:11px;
                color:#64748b;
                font-weight:bold;
                text-transform:uppercase;
                margin-bottom:6px;
              ">
                Subject
              </div>

              <div style="
                font-size:16px;
                color:#0f172a;
                font-weight:bold;
              ">
                ${subject}
              </div>

            </div>

            <div style="
              padding:20px;
              background:#eef2ff;
              border-radius:18px;
              border-left:5px solid #4f46e5;
            ">

              <div style="
                font-size:11px;
                color:#64748b;
                font-weight:bold;
                text-transform:uppercase;
                margin-bottom:10px;
              ">
                Message
              </div>

              <div style="
                font-size:15px;
                color:#334155;
                line-height:1.8;
                white-space:pre-wrap;
              ">
                ${message}
              </div>

            </div>

          </div>

          <!-- FOOTER -->

          <div style="
            padding:20px 30px;
            background:#f8fafc;
            border-top:1px solid #e2e8f0;
            text-align:center;
          ">

            <p style="
              margin:0;
              color:#94a3b8;
              font-size:12px;
            ">
              This message was sent from the CareerSync Contact Us page.
            </p>

          </div>

        </div>

      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendContactMail,
};