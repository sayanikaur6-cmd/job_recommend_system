const Connection = require("../models/Connection");

exports.sendConnectionRequest = async (req, res) => {
  try {
    const senderId = req.user.id;

    const {
      receiverId,
      message = "",
      source = "profile",
    } = req.body;

    // self request block
    if (senderId === receiverId) {
      return res.status(400).json({
        success: false,
        message: "You cannot connect with yourself",
      });
    }

    // sender = primary
    const primary_user = senderId;

    // receiver = secondary
    const secondary_user = receiverId;

    // check existing connection
    const existingConnection = await Connection.findOne({
      primary_user,
      secondary_user,
    });

    if (existingConnection) {
      return res.status(400).json({
        success: false,
        message: "Connection already exists",
      });
    }

    // create connection request
    const connection = await Connection.create({
      primary_user,
      secondary_user,
      requested_by: senderId,
      status: "pending",
      message,
      source,
      date_of_request: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Connection request sent",
      connection,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};