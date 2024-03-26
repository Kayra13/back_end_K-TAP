const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Önce e-postanın zaten kayıtlı olup olmadığını kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'E-posta zaten kayıtlı.' });
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 12);

    // Yeni kullanıcı nesnesi oluştur
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    // Kullanıcıyı veritabanına kaydet
    await user.save();

    // Başarılı yanıt gönder
    res.status(201).send({
      message: 'Kullanıcı kaydedildi.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).send({ message: 'Kullanıcı kaydedilemedi.', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kullanıcı adı ile kullanıcıyı bul
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send({ message: 'Kullanıcı adı veya şifre hatalı.' });
    }

    // Şifre doğruluğunu kontrol et
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: 'Kullanıcı adı veya şifre hatalı.' });
    }

    // JWT Token oluştur (Örnek, jwt kullanımınız bağlı olarak değişebilir)
    const token = jwt.sign({ userId: user._id }, 'gizliAnahtar', { expiresIn: '1h' });

    // Başarılı yanıt ve token gönder
    res.status(200).send({
      message: 'Başarıyla giriş yapıldı.',
      token,
    });

  } catch (error) {
    res.status(500).send({ message: 'Giriş yapılamadı.', error: error.message });
  }
});

module.exports = router;
