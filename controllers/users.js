const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err'); // 404
const BadRequestError = require('../errors/bad-request-err'); // 400
const ConflictError = require('../errors/conflict-err'); // 409

const HTTP_STATUS_OK = 200;

module.exports.getAllUsers = (req, res, next) => { // GET /users — возвращает всех пользователей
  User.find({})
    .then((users) => res.status(HTTP_STATUS_OK).send(users))
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => { // POST /users — создаёт пользователя
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10) // динамическая соль, 10 иттераций случайных шифрований
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => res.status(HTTP_STATUS_OK).send(user.toJSON()))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
          } else if (err.code === 11000) {
            next(new ConflictError('Данный email уже зарегистрирован'));
          } else {
            next(err);
          }
        });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUser(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'ya-practicum', { expiresIn: '7d' }); // Пейлоуд токена — зашифрованный в строку объект пользователя и секретный ключ

      res.cookie('jwt', token, { maxAge: 6048e5, httpOnly: true }).send(user.toJSON());
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getUser = (req, res, next) => { // GET /users/:userId - найдет пользователя по _id
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => { // PATCH /users/me — обновляет профиль
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => { // PATCH /users/me/avatar — обновляет аватар
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
};
