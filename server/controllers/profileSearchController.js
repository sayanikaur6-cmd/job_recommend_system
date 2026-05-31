const User = require("../models/user");
const Education = require("../models/Education");
const Experience = require("../models/Experience");

exports.searchProfiles = async (req, res) => {
  try {
    const myId = req.user?.id || req.user?._id || req.user?.userId;
    const q = (req.query.q || "").trim();

    if (!q) {
      return res.json({
        success: true,
        users: [],
      });
    }

    const users = await User.find({
      _id: { $ne: myId },
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { role: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
      ],
    })
      .select("_id name email profilePic role headline location bio skills")
      .limit(10);

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.log("PROFILE SEARCH ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "-password -password_hash -otp -otp_expiry"
    ).populate("skills");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const education = await Education.find({
      $or: [{ user_id: req.params.userId }, { userId: req.params.userId }],
    });

    const experience = await Experience.find({
      $or: [{ user_id: req.params.userId }, { userId: req.params.userId }],
    });

    res.json({
      success: true,
      profile: {
        ...user.toObject(),
        education,
        experience,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};