const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Yeni yorum ekleme
router.post('/blog/:blogId/comments', async (req, res) => {
  const { content } = req.body;
  const { blogId } = req.params;
  const author = req.user._id; // Kimlik doğrulama middleware'inden alınan kullanıcı ID'si

  try {
    const comment = new Comment({ content, author, blog: blogId });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: 'Yorum eklenemedi', error: error.message });
  }
});

module.exports = router;
