const Role = require("../models/Role");

const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find(); // সব data fetch
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const mongoose = require("mongoose");
const Skill = require("../models/skill");
// const Role = require("./models/role");

const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, "");

const findBestMatch = (input, skillMap) => {
  const normalizedInput = normalize(input);

  // exact match first
  if (skillMap[normalizedInput]) return skillMap[normalizedInput];

  // partial match
  for (let key in skillMap) {
    if (key.includes(normalizedInput) || normalizedInput.includes(key)) {
      return skillMap[key];
    }
  }

  return null;
};

const insertRolesWithMapping = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const skills = await Skill.find();

  // 🔥 normalize skill map
  const skillMap = {};
  skills.forEach(s => {
    skillMap[normalize(s.skill)] = s._id;
  });

  const roles = [
    {
      role: "Frontend Developer",
      skills: ["HTML", "CSS", "JavaScript", "React"]
    },
    {
      role: "Backend Developer",
      skills: ["NodeJS", "Express", "Mongo DB"]
    },
    {
      role: "Full Stack Developer",
      skills: ["ReactJS", "Node.js", "MongoDB"]
    }
  ];

  const finalRoles = roles.map(r => {
    const mappedSkills = r.skills
      .map(skill => findBestMatch(skill, skillMap))
      .filter(Boolean); // null remove

    return {
      role: r.role,
      skills: mappedSkills
    };
  });

  await Role.insertMany(finalRoles);

  console.log("✅ Roles inserted with smart mapping");
  process.exit();
};

// insertRolesWithMapping();
module.exports = { getAllRoles ,insertRolesWithMapping};