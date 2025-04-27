const User = require("../../../models/User"); // Adjust the path if necessary
const { v4: uuidv4 } = require("uuid");
const uploadToGoogleDrive = require("../../../middleware/uploadFileToDrive");

// CREATE NEW User
exports.create = async (req, res) => {
  try {
    const newUser = new User(req.body);

    // Handle file uploads if applicable
    if (req.file) {
      const uniqueId = uuidv4(); // Generate a unique ID
      const { path: filePath, originalname } = req.file;
      const fileExtension = originalname.split(".").pop(); // Get file extension
      const uniqueFileName = `${uniqueId}.${fileExtension}`;
      // Upload file to Google Drive (or other storage service)
      const uploadResult = await uploadToGoogleDrive(
        filePath,
        uniqueFileName,
        process.env.PROFILE_FOLDER_ID
      );
      if (uploadResult.success) {
        newUser.profile = {
          profilePicture: uploadResult.fileId, // Store the file ID in the profile
        };
      } else {
        return res.status(500).json({
          status: 500,
          success: false,
          message: "Failed to upload profile picture",
          error: uploadResult.error,
        });
      }
    }

    const savedUser = await newUser.save(); // Save the new user using Mongoose
    res.status(201).json({
      status: 201,
      success: true,
      message: "User created successfully.",
      data: savedUser,
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

// GET ONE User BY ID
exports.readOne = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Replaced readOne with findById
    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      status: 200,
      success: true,
      data: user,
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

// UPDATE User
exports.update = async (req, res) => {
  try {
    const updateData = {};
    const { job, bio } = req.body;

    if (job && bio) updateData.profile = { job, bio };

    // Handle file uploads if applicable
    if (req.file) {
      const uniqueId = uuidv4(); // Generate a unique ID
      const { path: filePath, originalname } = req.file;
      const fileExtension = originalname.split(".").pop(); // Get file extension
      const uniqueFileName = `${uniqueId}.${fileExtension}`;
      // Upload file to Google Drive (or other storage service)
      const uploadResult = await uploadToGoogleDrive(
        filePath,
        uniqueFileName,
        process.env.PROFILE_FOLDER_ID
      );
      if (uploadResult.success) {
        if (!updateData.profile) {
          updateData.profile = {};
        }
        updateData.profile.profilePicture = uploadResult.fileId; // Store the file ID in the profile
      } else {
        return res.status(500).json({
          status: 500,
          success: false,
          message: "Failed to upload profile picture",
          error: uploadResult.error,
        });
      }
    }
    updateData.profileCreation = true;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "User updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: error.message || "Something went wrong",
    });
  }
};

// DELETE User
exports.remove = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      status: 200,
      success: true,
      message: "User deleted successfully.",
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