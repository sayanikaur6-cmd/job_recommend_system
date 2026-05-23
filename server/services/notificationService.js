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