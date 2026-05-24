const Connection = require("../models/Connection");
const User = require("../models/User");
const {
  sendConnectionRequestEmail,
} = require("../services/notificationService");

const TEN_DAYS = 10 * 24 * 60 * 60 * 1000;

const getUserId = (req) =>
  req.user?.id || req.user?._id || req.user?.userId;

exports.sendConnectionRequest = async (req, res) => {
  try {
    const senderId = getUserId(req);
    const { receiverId } = req.body;

    console.log("SEND CONNECTION BODY:", req.body);
    console.log("SENDER:", senderId);
    console.log("RECEIVER:", receiverId);

    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: "Sender and receiver required",
      });
    }

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot connect with yourself",
      });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({
        success: false,
        message: "Sender or receiver user not found",
      });
    }

    let connection = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (connection) {
      console.log("EXISTING CONNECTION:", connection);

      if (connection.status === "pending") {
        return res.status(400).json({
          success: false,
          message: "Connection request already pending",
          connection,
        });
      }

      if (connection.status === "accepted") {
        return res.status(400).json({
          success: false,
          message: "Already connected",
          connection,
        });
      }

      if (connection.status === "rejected") {
        const rejectedAt = connection.rejectedAt
          ? new Date(connection.rejectedAt)
          : new Date(connection.updatedAt);

        const now = new Date();

        if (now - rejectedAt < TEN_DAYS) {
          const remainingDays = Math.ceil(
            (TEN_DAYS - (now - rejectedAt)) / (24 * 60 * 60 * 1000)
          );

          return res.status(403).json({
            success: false,
            message: `Request was rejected. Try again after ${remainingDays} days.`,
            connection,
          });
        }

        connection.sender = senderId;
        connection.receiver = receiverId;
        connection.status = "pending";
        connection.rejectedAt = null;
        await connection.save();
      }
    } else {
      connection = await Connection.create({
        sender: senderId,
        receiver: receiverId,
        status: "pending",
      });
    }

    try {
      if (receiver.email) {
        await sendConnectionRequestEmail(receiver, sender);
      }
    } catch (mailError) {
      console.log("CONNECTION MAIL ERROR:", mailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Connection request sent",
      connection,
    });
  } catch (error) {
    console.log("SEND CONNECTION ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getReceivedRequests = async (req, res) => {
  try {
    const userId = getUserId(req);

    console.log("GET RECEIVED FOR:", userId);

    const requests = await Connection.find({
      receiver: userId,
      status: "pending",
    })
      .populate("sender", "_id name email profilePic role location bio")
      .sort({ createdAt: -1 });

    console.log("RECEIVED COUNT:", requests.length);

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.log("GET RECEIVED ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSentRequests = async (req, res) => {
  try {
    const userId = getUserId(req);

    console.log("GET SENT FOR:", userId);

    const requests = await Connection.find({
      sender: userId,
      status: "pending",
    })
      .populate("receiver", "_id name email profilePic role location bio")
      .sort({ createdAt: -1 });

    console.log("SENT COUNT:", requests.length);

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.log("GET SENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { connectionId } = req.params;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (connection.receiver.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    connection.status = "accepted";
    await connection.save();

    res.json({
      success: true,
      message: "Connection accepted",
      connection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { connectionId } = req.params;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (connection.receiver.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    connection.status = "rejected";
    connection.rejectedAt = new Date();
    await connection.save();

    res.json({
      success: true,
      message: "Connection rejected. Sender cannot request again for 10 days.",
      connection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getConnectedPeople = async (req, res) => {
  try {
    const userId = getUserId(req);

    const connections = await Connection.find({
      status: "accepted",
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "_id name email profilePic role location bio")
      .populate("receiver", "_id name email profilePic role location bio")
      .sort({ updatedAt: -1 });

    const people = connections.map((conn) =>
      conn.sender._id.toString() === userId.toString()
        ? conn.receiver
        : conn.sender
    );

    res.json({
      success: true,
      people,
    });
  } catch (error) {
    console.log("GET CONNECTED ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};