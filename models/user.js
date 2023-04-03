// // eslint-disable-next-line import/no-import-module-exports
// import urlRegExp from '../utils/constants';

const mongoose = require('mongoose');

const urlRegExp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return urlRegExp.test(v);
      },
      message: 'Некорректная ссылка',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
