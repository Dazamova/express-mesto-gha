const router = require('express').Router();

const userRouter = require('./users');
const cardRouter = require('./cards');
const authRouter = require('./auth');

const auth = require('../middlewares/auth');

router.use('/', authRouter);
router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

module.exports = router;
