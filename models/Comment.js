const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
