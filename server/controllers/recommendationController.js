const User = require("../models/User");
const Job = require("../models/job");

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

const calculateMatch = (userSkills = [], job = {}) => {
  const jobText = normalize(`
    ${job.title || ""}
    ${job.company || ""}
    ${job.description || ""}
    ${job.location || ""}
    ${job.city || ""}
    ${job.state || ""}
    ${job.country || ""}
    ${JSON.stringify(job.highlights || {})}
    ${(job.employment_types || []).join(" ")}
    ${job.employment_type || ""}
  `);

  let matchedSkills = [];

  userSkills.forEach((skill) => {
    const cleanSkill = normalize(skill);

    if (cleanSkill && jobText.includes(cleanSkill)) {
      matchedSkills.push(skill);
    }
  });

  matchedSkills = [...new Set(matchedSkills)];

  const matchScore =
    userSkills.length > 0
      ? Math.round((matchedSkills.length / userSkills.length) * 100)
      : 0;

  return {
    matchScore,
    matchedSkills,
  };
};

exports.getRecommendedJobs = async (req, res) => {
  try {
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not found in token",
      });
    }

    const user = await User.findById(userId).populate("skills");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userSkills = (user.skills || [])
      .map(getSkillName)
      .filter(Boolean);

    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(500);

    const recommendedJobs = jobs
      .map((job) => {
        const result = calculateMatch(userSkills, job);

        return {
          ...job.toObject(),
          matchScore: result.matchScore,
          matchedSkills: result.matchedSkills,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 30);

    console.log("USER ID:", userId);
    console.log("USER SKILLS:", userSkills);
    console.log("TOTAL JOBS:", jobs.length);
    console.log("FINAL RECOMMENDED:", recommendedJobs.length);

    res.json({
      success: true,
      userSkills,
      totalJobs: jobs.length,
      totalRecommended: recommendedJobs.length,
      jobs: recommendedJobs,
    });
  } catch (error) {
    console.log("RECOMMEND ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};