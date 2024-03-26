require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Rota dosyalarının dahil edilmesi
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require('./routes/userRoutes');
const likeRoutes = require('./routes/likeRoutes'); // likeRoutes'i dahil edin

// Rotaların kullanılması
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blogs', likeRoutes); // likeRoutes için /api/blogs prefix'ini kullanın

// Veritabanı bağlantısı ve sunucunun başlatılması
mongoose.connect('mongodb://localhost:27017/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor...`);
  });
}).catch((err) => {
  console.error('Veritabanı bağlantısı başarısız:', err);
});
