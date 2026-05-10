const User = require("../models/user");
const Education = require("../models/Education");
const Experience = require("../models/Experience");
const Connection = require("../models/Connection");

const getConnectionStatus = async (myId, otherUserId) => {
  if (myId.toString() === otherUserId.toString()) {
    return "self";
  }

  const connection = await Connection.findOne({
    $or: [
      { sender: myId, receiver: otherUserId },
      { sender: otherUserId, receiver: myId },
    ],
  });

  if (!connection) return "none";

  if (connection.status === "accepted") return "connected";

  if (connection.status === "pending") {
    if (connection.sender.toString() === myId.toString()) {
      return "pending_sent";
    } else {
      return "pending_received";
    }
  }

  return "none";
};

// search users
exports.searchProfiles = async (req, res) => {
  try {
    const myId = req.user.id;
    const keyword = req.query.q || "";

    const users = await User.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
      ],
    }).select("name email profilePic role location bio skills");

    const result = await Promise.all(
      users.map(async (user) => {
        const status = await getConnectionStatus(myId, user._id);

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          profilePic: user.profilePic,
          role: user.role,
          location: user.location,
          bio: user.bio,
          skills: user.skills,
          connectionStatus: status,
        };
      })
    );

    res.json({
      success: true,
      users: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// public profile details
exports.getPublicProfile = async (req, res) => {
  try {
    const myId = req.user.id;
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("-password -password_hash -otp -otp_expiry")
      .populate("skills");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const education = await Education.find({
      $or: [{ user_id: userId }, { userId: userId }],
    }).sort({ createdAt: -1 });

    const experience = await Experience.find({
      $or: [{ user_id: userId }, { userId: userId }],
    }).sort({ start_date: -1 });

    const connectionStatus = await getConnectionStatus(myId, userId);

    res.json({
      success: true,
      profile: {
        ...user.toObject(),
        education,
        experience,
        connectionStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};