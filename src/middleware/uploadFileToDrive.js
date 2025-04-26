const fs = require("fs");
const drive = require("../config/googleAuth");

const uploadToGoogleDrive = async (
  filePath,
  fileName,
  folderId = process.env.PROFILE_FOLDER_ID
) => {
  try {
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };
    const media = {
      mimeType: "image/*", // Adjust as needed
      body: fs.createReadStream(filePath),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id",
    });

    // Clean up local file after upload
    fs.unlinkSync(filePath);
    return { success: true, fileId: file.data.id };
  } catch (error) {
    console.error("Error uploading to Google Drive:", error);
    return { success: false, error: error.message };
  }
};

module.exports = uploadToGoogleDrive;