const User = require("../models/user");
const Education = require("../models/Education");
const Experience = require("../models/Experience");

const generateBio = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("skills");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const educations = await Education.find({ user_id: userId });
    const experiences = await Experience.find({ user_id: userId });

    const name = user.name || "I";

    const skills =
      user.skills?.map((s) => s.name || s.skill || s).join(", ") ||
      "various technologies";

    const latestExp = experiences?.[0];
    const role = latestExp?.role || "developer";

    const educationData = educations?.[0];
    const degree = educationData?.degree || "computer science";

    const templates = [
      `Hello, I am ${name}, a passionate and dedicated ${role}. I have a strong interest in software development and enjoy working with technologies like ${skills}. I am always eager to learn new concepts, improve my technical skills, and apply them in real-world projects. My goal is to build useful, efficient, and user-friendly digital solutions.`,

      `I am ${name}, a motivated learner with a background in ${degree}. I have knowledge of ${skills} and I enjoy exploring new technologies. I believe in continuous learning and practical implementation. I am looking forward to growing as a professional and contributing to meaningful projects.`,

      `${name} is an enthusiastic and hardworking ${role} with a keen interest in technology and development. Skilled in ${skills}, I enjoy solving problems and creating applications that provide real value to users. I am focused on improving my knowledge, gaining practical experience, and building a successful career in the tech industry.`,

      `Hi, I am ${name}. I am interested in building modern applications and improving my skills in ${skills}. I enjoy working on projects that help me learn, experiment, and solve real-world problems. I am a quick learner, a responsible team player, and always ready to take on new challenges.`,
    ];

    const randomBio = templates[Math.floor(Math.random() * templates.length)];

    return res.status(200).json({
      success: true,
      bio: randomBio,
    });
  } catch (error) {
    console.error("Generate Bio Error:", error);
    return res.status(500).json({
      success: false,
      message: "Bio generation failed",
    });
  }
};

module.exports = { generateBio };