const Message = require("../models/Message");
const User = require("../models/User");

let ioInstance;

module.exports = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Join user to a room based on their userId
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    // Join user to a specific channel
    socket.on("joinChannel", (channelName) => {
      socket.join(channelName);
      console.log(`User ${socket.id} joined channel ${channelName}`);
    });
   

    // Handle sending messages
    socket.on("sendMessage", async ({ senderId, receiverId, messageText }) => {
      try {
        // Save message to database
        const newMessage = new Message({ senderId, receiverId, messageText });
        const savedMessage = await newMessage.save();

        // Emit message to the receiver
        io.to(receiverId).emit("receiveMessage", savedMessage);
        console.log(`Message sent from ${senderId} to ${receiverId}`);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    // Handle user typing indicator
    socket.on("typing", ({ senderId, receiverId }) => {
      io.to(receiverId).emit("userTyping", { senderId });
    });

    // Handle user stopped typing indicator
    socket.on("stopTyping", ({ senderId, receiverId }) => {
      io.to(receiverId).emit("userStoppedTyping", { senderId });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

// Export a function to get the io instance
module.exports.getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.io instance is not initialized!");
  }
  return ioInstance;
};
