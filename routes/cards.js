const router = require('express').Router();

const {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards); // GET /cards — возвращает все карточки
router.post('/', createCard); // POST /cards — создаёт карточку
router.delete('/:cardId', deleteCard); // DELETE /cards/:cardId — удаляет карточку по идентификатору
router.put('/:cardId/likes', likeCard); // PUT /cards/:cardId/likes — поставить лайк карточке
router.delete('/:cardId/likes', dislikeCard); // DELETE /cards/:cardId/likes — убрать лайк с карточки

module.exports = router;
