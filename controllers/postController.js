const Post = require("../models/Post");


// ✅ CREATE POST (URL se)
exports.createPost = async (req, res) => {
  try {
    const post = await Post.create({
      image: req.body.image,
      user: req.user.id,
      likes: [],
    });

    res.json(post);
  } catch (err) {
    console.log("CREATE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// 🔥 NEW: FILE UPLOAD POST
exports.uploadPost = async (req, res) => {
  try {
    // ❌ agar file nahi mili
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const post = await Post.create({
      image: `http://localhost:5000/uploads/${req.file.filename}`,
      user: req.user.id,
      likes: [],
    });

    res.json(post);
  } catch (err) {
    console.log("UPLOAD ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// ✅ LIKE / UNLIKE
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (!post.likes) post.likes = [];

    const userId = req.user.id;

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json(post);
  } catch (err) {
    console.log("LIKE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// ✅ DELETE POST (🔥 FULL SAFE VERSION)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // 🔥 IMPORTANT FIX (old posts ke liye)
    if (
      post.user && 
      post.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    await post.deleteOne();

    res.json({ msg: "Deleted" });
  } catch (err) {
    console.log("DELETE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// ✅ GET POSTS
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user");
    res.json(posts);
  } catch (err) {
    console.log("GET ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};