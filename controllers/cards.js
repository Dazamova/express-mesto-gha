const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-err'); // 404
const BadRequestError = require('../errors/bad-request-err'); // 400
const ForbiddenError = require('../errors/forbidden-err'); // 403

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_CREATED = 201;

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(HTTP_STATUS_OK).send(cards))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const ownerId = req.user._id;

  const { name, link } = req.body;
  Card.create({ name, link, owner: ownerId })
    .then((data) => {
      data.populate(['owner', 'likes'])
        .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
        .catch((err) => next(err));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.deleteOne({ _id: cardId })
          .orFail()
          .then(() => res.status(HTTP_STATUS_OK).send(card))
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new BadRequestError('Передан некорректный _id карточки'));
            } else if (err.name === 'DocumentNotFoundError') {
              next(new NotFoundError('Карточка с указанным _id не найдена'));
            } else {
              next(err);
            }
          });
      } else {
        next(new ForbiddenError('Нет прав для удаления карточки')); // return res.status(HTTP_STATUS_FORBIDDEN).send({ message: 'Нет прав для удаления карточки' });
      }
    }).catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id карточки'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
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
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
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
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
      } else {
        next(err);
      }
    });
};
