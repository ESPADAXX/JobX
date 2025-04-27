const router = require("express").Router();
const isAuthenticated = require("../../../middleware/isAuthenticate");
const { create, update, readAll, readOne, remove } = require("../controller");
const upload = require("../../../middleware/multer");

// GET ALL USERS
router.get("/", isAuthenticated, readAll);

// CREATE NEW USER
router.post("/", isAuthenticated, create);

// GET ONE USER
router.get("/:id", isAuthenticated, readOne); // Ensure readOne is a valid function

// UPDATE USER
router.put("/:id", isAuthenticated, upload.single('profilePicture'), update);

// DELETE USER
router.delete("/:id", isAuthenticated, remove);

module.exports = router;