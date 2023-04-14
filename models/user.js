const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../errors/unauthorized-err');

const urlRegExp = /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    required: false,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    required: false,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    required: false,
    validate: {
      validator(v) {
        return urlRegExp.test(v);
      },
      message: 'Некорректная ссылка',
    },
  },
});

userSchema.methods.toJSON = function () {
  const data = this.toObject();
  delete data.password;
  delete data.__v;
  return data;
};

userSchema.statics.findUser = function (email, password) {
  return this.findOne({ email }).select('+password')
    .orFail()
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          throw new UnauthorizedError('Неправильные почта или пароль');
        }

        return user; // теперь user доступен
      }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new UnauthorizedError('Неправильные почта или пароль');
      } else {
        throw err;
      }
    });
};

module.exports = mongoose.model('user', userSchema);
