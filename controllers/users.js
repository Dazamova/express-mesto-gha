const User = require('../models/user');

module.exports.getAllUsers = (req, res) => { // GET /users — возвращает всех пользователей
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => { // GET /users/:userId - возвращает пользователя по _id
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => { // POST /users — создаёт пользователя
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.updateProfile = (req, res) => { // PATCH /users/me — обновляет профиль
  const { newName, newAbout } = req.body;
  User.findByIdAndUpdate(req.user._id, { name: newName, about: newAbout }, { new: true })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.updateAvatar = (req, res) => { // PATCH /users/me/avatar — обновляет аватар
  const { newAvatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar: newAvatar }, { new: true })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
