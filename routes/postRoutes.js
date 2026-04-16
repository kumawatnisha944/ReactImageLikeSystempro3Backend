const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const auth = require("../middleware/authMiddleware");

// 🔥 ADD THIS
const upload = require("../uploads/multer");

// ✅ CREATE POST (old URL method)
router.post("/create", auth, postController.createPost);

// 🔥 NEW FILE UPLOAD ROUTE
router.post("/upload", auth, upload.single("image"), postController.uploadPost);

// ✅ LIKE
router.post("/like/:id", auth, postController.likePost);

// ✅ DELETE
router.delete("/:id", auth, postController.deletePost);

// ✅ GET ALL POSTS
router.get("/", postController.getPosts);

module.exports = router;