const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  // Buraya daha fazla alan ekleyebilirsiniz, örneğin yorumlar veya beğeniler.
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;