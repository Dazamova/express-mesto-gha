const User = require('../models/user');

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_NOT_FOUND = 404;

module.exports.getAllUsers = (req, res) => { // GET /users — возвращает всех пользователей
  User.find({})
    .then((users) => res.status(HTTP_STATUS_OK).send(users))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => { // POST /users — создаёт пользователя
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.getUser = (req, res) => { // GET /users/:userId - возвращает пользователя по _id
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else if (err.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateProfile = (req, res) => { // PATCH /users/me — обновляет профиль
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else if (err.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' });
      } else if (err.name === 'ValidationError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => { // PATCH /users/me/avatar — обновляет аватар
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else if (err.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' });
      } else if (err.name === 'ValidationError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
