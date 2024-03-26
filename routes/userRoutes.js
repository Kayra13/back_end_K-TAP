const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const bcrypt = require('bcryptjs');

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: 'Kullanıcı bulunamadı.' });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: 'Kullanıcı getirilemedi.', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { username, email }, { new: true });
    if (!user) {
      return res.status(404).send({ message: 'Kullanıcı bulunamadı.' });
    }
    res.status(200).send({ message: 'Kullanıcı güncellendi.', user });
  } catch (error) {
    res.status(500).send({ message: 'Kullanıcı güncellenemedi.', error: error.message });
  }
});

// User profilini güncelleme
router.put('/profile/:id', async (req, res) => {
    const { username, bio } = req.body;
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, { username, bio }, { new: true });
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: 'Profil güncellenirken bir hata oluştu', error: error.message });
    }
  });
  
  // User profil resmi yükleme
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });
  
  router.post('/profile/:id/photo', upload.single('photo'), async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await User.findById(userId);
      user.profileImage = req.file.path;
      await user.save();
      res.status(200).json({ message: 'Profil resmi yüklendi', user });
    } catch (error) {
      res.status(400).json({ message: 'Resim yüklenirken bir hata oluştu', error: error.message });
    }
  });
  

  router.post('/login', async (req, res) => {
    try {
      // Kullanıcıyı e-posta adresine göre bul
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).send({ message: 'E-posta adresi ile bir kullanıcı bulunamadı.' });
      }
  
      // Parolanın doğruluğunu kontrol et (bcrypt ile hash'lenmiş parolalar için)
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(400).send({ message: 'Yanlış parola.' });
      }
  
      // JWT token oluştur
      const token = jwt.sign({ id: user._id }, 'gizliAnahtar', { expiresIn: '1h' }); // 'gizliAnahtar' yerine güçlü bir anahtar kullanın
  
      res.status(200).send({ token });
    } catch (error) {
      res.status(500).send({ message: 'Giriş işlemi sırasında bir hata oluştu.', error: error.message });
    }
  });

module.exports = router;
