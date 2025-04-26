const Application = require("../../../models/Application"); // Adjust the path if necessary
const { v4: uuidv4 } = require("uuid");
const uploadToGoogleDrive = require("../../../middleware/uploadFileToDrive");

// CREATE NEW Application
exports.create = async (req, res) => {
  try {
    const newApplication = new Application(req.body);
    const savedApplication = await newApplication.save();
    res.status(201).json({
      status: 201,
      success: true,
      message: "Application created successfully.",
      data: savedApplication,
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

// GET ALL Applications
exports.readAll = async (req, res) => {
  try {
    const Applications = await Application.find();
    res.status(200).json({
      status: 200,
      success: true,
      data: Applications,
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

// GET ONE Application BY ID
exports.readOne = async (req, res) => {
  try {
    const Application = await Application.findById(req.params.id);
    if (!Application) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Application not found",
      });
    }
    res.status(200).json({
      status: 200,
      success: true,
      data: Application,
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

// UPDATE Application
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

    const updatedApplication = await Application.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updatedApplication) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Application updated successfully.",
      data: updatedApplication,
    });
  } catch (error) {
    console.error("Error updating Application:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: error.message || "Something went wrong",
    });
  }
};

// DELETE Application
exports.remove = async (req, res) => {
  try {
    const deletedApplication = await Application.findByIdAndDelete(req.params.id);
    if (!deletedApplication) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Application not found",
      });
    }
    res.status(200).json({
      status: 200,
      success: true,
      message: "Application deleted successfully.",
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