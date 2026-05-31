const baseTemplate = (title, body) => `
  <div style="font-family:Arial;background:#f4f7fb;padding:30px">
    <div style="max-width:600px;margin:auto;background:white;border-radius:18px;padding:30px">
      <h2 style="color:#4f46e5">${title}</h2>
      <div style="font-size:15px;color:#334155;line-height:1.7">
        ${body}
      </div>
      <hr/>
      <p style="font-size:12px;color:#94a3b8">
        CareerSync - AI Job Recommendation System
      </p>
    </div>
  </div>
`;

exports.otpTemplate = (otp) =>
  baseTemplate(
    "Password Reset OTP",
    `
      <p>Your OTP is:</p>
      <h1 style="letter-spacing:6px;color:#0ea5e9">${otp}</h1>
      <p>This OTP will expire in 5 minutes.</p>
    `
  );

exports.jobAlertTemplate = (name, jobs = []) =>
  baseTemplate(
    "New Job Alerts For You",
    `
      <p>Hello ${name},</p>
      <p>We found some jobs matching your profile.</p>
      ${jobs
        .slice(0, 5)
        .map(
          (job) => `
          <div style="border:1px solid #e2e8f0;padding:15px;border-radius:12px;margin:12px 0">
            <h3>${job.title}</h3>
            <p>${job.company || "Company not specified"}</p>
            <p>${job.location || "Location not specified"}</p>
            ${
              job.apply_link
                ? `<a href="${job.apply_link}" style="color:#4f46e5">Apply Now</a>`
                : ""
            }
          </div>
        `
        )
        .join("")}
    `
  );

exports.connectionRequestTemplate = (receiverName, senderName) =>
  baseTemplate(
    "New Connection Request",
    `
      <p>Hello ${receiverName},</p>
      <p><b>${senderName}</b> sent you a connection request.</p>
      <a href="${process.env.FRONTEND_URL}/connections"
        style="background:#4f46e5;color:white;padding:12px 18px;border-radius:10px;text-decoration:none">
        View Request
      </a>
    `
  );

exports.interviewReminderTemplate = (name, jobTitle, time) =>
  baseTemplate(
    "Interview Reminder",
    `
      <p>Hello ${name},</p>
      <p>This is a reminder for your interview.</p>
      <p><b>Role:</b> ${jobTitle}</p>
      <p><b>Time:</b> ${time}</p>
      <p>Best of luck!</p>
    `
  );