const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const Post = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    res: 'users'
  },
  test: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  likes: [{
    user: {
      types: Schema.Types.ObjectId,
      ref: 'users'
    }
  }],
  comments: [{
    user: {
      types: Schema.Types.ObjectId,
      ref: 'users'
    },
    text: {
      type: String,
      require: true
    },
    name: {
      type: String,
    },
    avatar: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = Post = mongoose.model('post', PostSchema);
