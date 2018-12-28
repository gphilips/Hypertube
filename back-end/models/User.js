const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    default: '',
    unique: true,
    required: true,
  },
  password: {
    type: String,
    default: '',
    required: true,      
  },
  username: {
    type: String,
    default: '',
    unique: true,
    required: true,
  },
  firstname: {
    type: String,
    default: '',
    required: true,      
  },
  lastname: {
    type: String,
    default: '',
    required: true,      
  },
  gender: {
    type: String,
    enum: ['man', 'woman', 'both'],
  },
  lang: {
    type: String,
    default: 'en',
  },
  resetPwdToken: String,
  resetPwdTokenExpire: Date,
  location: String,
  picture: String,
  pictureURL: String,
  movies: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    user.password = bcrypt.hashSync(user.password, salt);
    next();
  });
});

userSchema.methods.comparePassword = function (inputPwd, cb) {
  bcrypt.compare(inputPwd, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

const User = mongoose.model('User', userSchema);
module.exports = User;