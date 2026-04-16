const Comment = require("../models/Comment");

// 🟢 ADD COMMENT
exports.addComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      text: req.body.text,
      user: req.user.id,
      post: req.params.postId
    });

    res.json(comment);

  } catch (err) {
    console.log("ADD ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// 🟢 GET COMMENTS (🔥 NEW)
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username");

    res.json(comments);

  } catch (err) {
    console.log("FETCH ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// 🔴 DELETE COMMENT (SAFE VERSION)
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    // ❌ अगर comment नहीं मिला
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    // ❌ अगर user match नहीं
    if (
      comment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    await comment.deleteOne();

    res.json({ msg: "Deleted" });

  } catch (err) {
    console.log("DELETE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// 🟡 UPDATE COMMENT
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    // ❌ अगर comment नहीं मिला
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    // ❌ permission check
    if (
      comment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    comment.text = req.body.text;
    await comment.save();

    res.json(comment);

  } catch (err) {
    console.log("UPDATE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};