const sendEmail = require("../utils/sendEmail");

const {
  otpTemplate,
  jobAlertTemplate,
  connectionRequestTemplate,
  interviewReminderTemplate,
} = require("../templates/emailTemplates");

exports.sendOtpEmail = async (email, otp) => {
  return await sendEmail({
    to: email,
    subject: "CareerSync Password Reset OTP",
    html: otpTemplate(otp),
  });
};

exports.sendJobAlertEmail = async (user, jobs) => {
  return await sendEmail({
    to: user.email,
    subject: "New Jobs Matching Your Profile",
    html: jobAlertTemplate(user.name, jobs),
  });
};

exports.sendConnectionRequestEmail = async (receiver, sender) => {
  return await sendEmail({
    to: receiver.email,
    subject: `${sender.name} sent you a connection request`,
    html: connectionRequestTemplate(receiver.name, sender.name),
  });
};

exports.sendInterviewReminderEmail = async (user, interview) => {
  return await sendEmail({
    to: user.email,
    subject: "Interview Reminder",
    html: interviewReminderTemplate(
      user.name,
      interview.jobTitle,
      interview.time
    ),
  });
};

exports.sendConnectionRequestEmail = async (receiver, sender) => {
  return await sendEmail({
    to: receiver.email,
    subject: `${sender.name} sent you a connection request`,
    html: `
      <div style="font-family:Arial;background:#f4f7fb;padding:30px">
        <div style="max-width:600px;margin:auto;background:white;border-radius:18px;padding:30px">
          <h2 style="color:#2563eb">New Connection Request</h2>
          <p>Hello ${receiver.name},</p>
          <p><b>${sender.name}</b> sent you a connection request on CareerSync.</p>
          <a href="${process.env.FRONTEND_URL}/connections"
             style="display:inline-block;background:#2563eb;color:white;padding:12px 18px;border-radius:10px;text-decoration:none">
             View Request
          </a>
        </div>
      </div>
    `,
  });
};