const User = require("../../../models/User");
const Message = require("../../../models/Message");
const { getIO } = require("../../../config/Socket");

// SEND MESSAGE
exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, messageText } = req.body;

    // Validate sender and receiver
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    if (!sender || !receiver) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Sender or receiver not found",
      });
    }

    // Save message to database
    const newMessage = new Message({ senderId, receiverId, messageText });
    const savedMessage = await newMessage.save();

    // Emit message to receiver via socket
    const io = getIO();
    io.to(receiverId.toString()).emit("receiveMessage", savedMessage);

    res.status(201).json({
      status: 201,
      success: true,
      message: "Message sent successfully.",
      data: savedMessage,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: error.message || "Something went wrong",
    });
  }
};
