const User = require("../models/User");
const { sendConnectionRequestEmail } = require("../services/notificationService");

exports.sendConnectionRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.body;

    // tomar existing connection create logic ekhane thakbe

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (sender && receiver) {
      await sendConnectionRequestEmail(receiver, sender);
    }

    res.status(201).json({
      success: true,
      message: "Connection request sent",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};