const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");
const auth = require("../middleware/authMiddleware");

// ✅ Add comment
router.post("/:postId", auth, commentController.addComment);

// ✅ Get comments (🔥 NEW ADD)
router.get("/:postId", commentController.getComments);

// ✅ Delete comment
router.delete("/:id", auth, commentController.deleteComment);
// 🟡 UPDATE comment (ADD THIS)
router.put("/:id", auth, commentController.updateComment);

module.exports = router;
