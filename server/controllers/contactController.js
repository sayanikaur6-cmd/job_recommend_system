// const { sendContactMail } = require("../utils/mailer");
const { sendEmail } = require("../utils/emailService");

exports.sendContactMessage = async (req, res) => {
  try {
    const {
      name,
      email,
      subject,
      message,
    } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // =========================
    // EMAIL VALIDATION
    // =========================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // =========================
    // LENGTH VALIDATION
    // =========================

    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid name.",
      });
    }

    if (subject.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid subject.",
      });
    }

    if (message.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Message is too short.",
      });
    }

    // =========================
    // SEND EMAIL
    // =========================

      await sendEmail({
      to: process.env.EMAIL_USER,

      subject: `📩 CareerSync Contact: ${subject}`,

      html: `
        <div style="
          margin: 0;
          padding: 30px 15px;
          background: #f4f7fb;
          font-family: Arial, Helvetica, sans-serif;
        ">

          <div style="
            max-width: 650px;
            margin: auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(0,0,0,0.10);
          ">

            <!-- HEADER -->
            <div style="
              background: linear-gradient(135deg, #4f46e5, #7c3aed);
              padding: 30px 25px;
              text-align: center;
              color: white;
            ">

              <h1 style="
                margin: 0;
                font-size: 28px;
              ">
                Career<span style="color:#c4b5fd;">Sync</span>
              </h1>

              <p style="
                margin: 10px 0 0;
                font-size: 14px;
                opacity: 0.9;
              ">
                New Contact Us Message
              </p>

            </div>


            <!-- BODY -->

            <div style="
              padding: 35px;
            ">

              <h2 style="
                margin-top: 0;
                color: #1e293b;
              ">
                📩 New Message Received
              </h2>

              <p style="
                color: #64748b;
                font-size: 15px;
                line-height: 1.6;
              ">
                Someone has submitted a new message through
                the CareerSync Contact Us form.
              </p>


              <!-- USER DETAILS -->

              <div style="
                margin-top: 25px;
                background: #f8faff;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 20px;
              ">

                <p style="
                  margin: 0 0 12px;
                  color: #334155;
                ">
                  <strong>👤 Name:</strong>
                  ${name}
                </p>

                <p style="
                  margin: 0 0 12px;
                  color: #334155;
                ">
                  <strong>📧 Email:</strong>
                  ${email}
                </p>

                <p style="
                  margin: 0;
                  color: #334155;
                ">
                  <strong>📌 Subject:</strong>
                  ${subject}
                </p>

              </div>


              <!-- MESSAGE -->

              <div style="
                margin-top: 25px;
              ">

                <h3 style="
                  color: #1e293b;
                  margin-bottom: 10px;
                ">
                  💬 Message
                </h3>

                <div style="
                  background: #f1f5ff;
                  border-left: 5px solid #6366f1;
                  padding: 20px;
                  border-radius: 10px;
                  color: #475569;
                  font-size: 15px;
                  line-height: 1.7;
                  white-space: pre-wrap;
                ">
                  ${message}
                </div>

              </div>


              <!-- REPLY BUTTON -->

              <div style="
                text-align: center;
                margin-top: 30px;
              ">

                <a
                  href="mailto:${email}"
                  style="
                    display: inline-block;
                    padding: 13px 28px;
                    background: linear-gradient(
                      135deg,
                      #4f46e5,
                      #7c3aed
                    );
                    color: white;
                    text-decoration: none;
                    border-radius: 999px;
                    font-size: 15px;
                    font-weight: bold;
                  "
                >
                  ✉️ Reply to ${name}
                </a>

              </div>

            </div>


            <!-- FOOTER -->

            <div style="
              background: #f8fafc;
              padding: 20px;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            ">

              <p style="
                margin: 0;
                color: #64748b;
                font-size: 12px;
              ">
                This message was sent from the
                CareerSync Contact Us form.
              </p>

              <p style="
                margin: 8px 0 0;
                color: #94a3b8;
                font-size: 11px;
              ">
                © 2026 CareerSync. All rights reserved.
              </p>

            </div>

          </div>

        </div>
      `,
    });

    console.log(
      "CONTACT MESSAGE SENT:",
      email
    );

    return res.status(200).json({
      success: true,
      message:
        "Your message has been sent successfully.",
    });

  } catch (error) {

    console.error(
      "CONTACT EMAIL ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to send message right now. Please try again later.",
    });
  }
};