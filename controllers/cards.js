const HTTP_STATUS_OK = 200;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_NOT_FOUND = 404;

const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(HTTP_STATUS_OK).send(cards))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const ownerId = req.user._id;

  const { name, link } = req.body;
  Card.create({ name, link, owner: ownerId })
    .then((data) => {
      data.populate(['owner', 'likes'])
        .then((card) => res.status(HTTP_STATUS_OK).send(card))
        .catch(() => { res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }); });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else { res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }); }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail()
    .then((card) => res.status(HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан некорректный _id карточки' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail()
    .then((card) => res.status(HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      } else if (err.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail()
    .then((card) => res.status(HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      } else if (err.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
