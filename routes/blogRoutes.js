const express = require('express');
const router = express.Router();
const Blog = require('../models/blog'); // Model dosya adının doğru olduğundan emin olun

// Blog yazılarını arama ve filtreleme
router.get('/search', async (req, res) => {
    const { search, author, tags, startDate, endDate } = req.query;
    
    let query = {};
    if (search) {
      // Metin araması yapmak için 'title' ve 'content' alanlarında metin indeksi olmalı
      query.$text = { $search: search };
    }
    if (author) {
      // Author ObjectId ise direkt kullanabilirsiniz, isimse önce dönüştürmeniz gerekir
      query.author = author;
    }
    if (tags) {
      // Tags alanı dizi ise ve virgülle ayrılmış string olarak gelirse
      query.tags = { $in: tags.split(',') };
    }
    if (startDate || endDate) {
      // Tarih aralığına göre filtreleme
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }
  
    try {
      // Populate metodu ile ilişkili dokümanları çekebilirsiniz (eğer ilişkili bir model varsa)
      const blogs = await Blog.find(query).populate('author');
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ message: 'Blog araması yapılamadı', error: error.message });
    }
});

// Blog yazısı oluşturma
router.post('/', async (req, res) => {
  const { title, content, author } = req.body;
  
  const newBlog = new Blog({
    title,
    content,
    author // Burada author'ın ObjectId'sini kabul etmektesiniz
  });

  try {
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Blog yazısı oluşturulamadı', error: error.message });
  }
});

// Diğer route tanımlamalarınız burada yer alabilir...

module.exports = router;
