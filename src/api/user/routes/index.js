const router = require("express").Router();
const isAuthenticated = require("../../../middleware/isAuthenticate");
const { create, update, readAll, readOne, remove } = require("../controller");
const upload = require("../../../middleware/multer");

// GET ALL USERS
router.get("/", readAll);

// CREATE NEW USER
router.post("/", create);

// GET ONE USER
router.get("/:id", readOne); // Ensure readOne is a valid function

// UPDATE USER
router.put("/:id", upload.single('profilePicture'), update);

// DELETE USER
router.delete("/:id", remove);

module.exports = router;