const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  getAllUsers, getUser, getMe, updateProfile, updateAvatar,
} = require('../controllers/users');

const urlRegExp = /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/;

router.get('/', getAllUsers); // GET /users — возвращает всех пользователей
router.get('/me', getMe); // GET /users/me - возвращает пользователя
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUser); // GET /users/:userId - возвращает пользователя по _id
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile); // PATCH /users/me — обновляет профиль
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegExp),
  }),
}), updateAvatar); // PATCH /users/me/avatar — обновляет аватар

module.exports = router;
