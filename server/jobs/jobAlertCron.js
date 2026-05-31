const cron = require("node-cron");
const User = require("../models/User");
const Job = require("../models/job");
const { sendJobAlertEmail } = require("../services/notificationService");

const normalize = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/-/g, "")
    .replace(/\s+/g, " ")
    .trim();

const getSkillName = (skill) => {
  if (!skill) return "";

  if (typeof skill === "string") return skill;

  return (
    skill.name ||
    skill.skill ||
    skill.title ||
    skill.label ||
    skill.value ||
    ""
  );
};

const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const getRecommendedJobsForUser = async (user) => {
  const userSkills = (user.skills || [])
    .map(getSkillName)
    .filter(Boolean);

  let jobs = await Job.find({
    searchedBy: user._id,
  })
    .sort({ createdAt: -1 })
    .limit(300);

  if (jobs.length === 0) {
    jobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(300);
  }

  if (userSkills.length === 0) {
    return jobs.slice(0, 5).map((job) => ({
      ...job.toObject(),
      matchScore: 0,
      matchedSkills: [],
    }));
  }

  const recommendedJobs = jobs
    .map((job) => {
      const jobText = normalize(`
        ${job.title || ""}
        ${job.company || ""}
        ${job.description || ""}
        ${job.location || ""}
        ${job.city || ""}
        ${job.state || ""}
        ${job.country || ""}
        ${JSON.stringify(job.highlights || {})}
      `);

      let matchedSkills = [];

      userSkills.forEach((skill) => {
        const cleanSkill = normalize(skill);

        if (cleanSkill && jobText.includes(cleanSkill)) {
          matchedSkills.push(skill);
        }
      });

      matchedSkills = [...new Set(matchedSkills)];

      const matchScore = Math.round(
        (matchedSkills.length / userSkills.length) * 100
      );

      return {
        ...job.toObject(),
        matchScore,
        matchedSkills,
      };
    })
    .filter((job) => job.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);

  if (recommendedJobs.length === 0) {
    return jobs.slice(0, 5).map((job) => ({
      ...job.toObject(),
      matchScore: 0,
      matchedSkills: [],
    }));
  }

  return recommendedJobs.slice(0, 5);
};

const canSendJobAlert = (user) => {
  const now = new Date();

  if (!user.jobAlertEmailDate || !isSameDay(user.jobAlertEmailDate, now)) {
    user.jobAlertEmailCount = 0;
    user.jobAlertEmailDate = now;
  }

  return user.jobAlertEmailCount < 5;
};

const startJobAlertCron = () => {
  // every 1 hour
  cron.schedule("* * * * *", async () => {
    try {
      console.log("Running auto job alert email cron...");

      const users = await User.find({
        email: { $exists: true, $ne: "" },
      });

      for (const user of users) {
        if (!canSendJobAlert(user)) {
          console.log(`Daily mail limit reached: ${user.email}`);
          await user.save();
          continue;
        }

        const jobs = await getRecommendedJobsForUser(user);

        if (jobs.length === 0) {
          await user.save();
          continue;
        }

        const sent = await sendJobAlertEmail(user, jobs);

        if (sent) {
          user.jobAlertEmailCount += 1;
          user.lastJobAlertSentAt = new Date();

          console.log(
            `Job alert sent to ${user.email}. Count: ${user.jobAlertEmailCount}/5`
          );
        }

        await user.save();
      }
    } catch (error) {
      console.log("JOB ALERT CRON ERROR:", error.message);
    }
  });
};

module.exports = startJobAlertCron;