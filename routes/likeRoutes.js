const express = require('express');
const router = express.Router();
const Like = require('../models/Like');
const authMiddleware = require('../middlewares/authMiddleware'); // authMiddleware'ı dahil edin

// authMiddleware ile korunan yeni beğeni ekleme endpoint'i
router.post('/:blogId/likes', authMiddleware, async (req, res) => { // authMiddleware'i burada kullanın
  const { blogId } = req.params;
  const userId = req.user.id; // JWT'den alınan kullanıcı ID'si

  try {
    const existingLike = await Like.findOne({ user: userId, blog: blogId });
    if (existingLike) {
      await Like.findByIdAndRemove(existingLike._id);
      return res.status(200).json({ message: 'Beğeni kaldırıldı' });
    }

    const like = new Like({ user: userId, blog: blogId });
    await like.save();
    res.status(201).json({ message: 'Beğeni eklendi', likeId: like._id });
  } catch (error) {
    res.status(400).json({ message: 'Beğeni eklenemedi', error: error.message });
  }
});

module.exports = router;
