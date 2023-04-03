const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routes/index');

const { PORT = 3000, BASE_PATH = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();
const HTTP_STATUS_NOT_FOUND = 404;

mongoose.connect(BASE_PATH, {})
  .then(() => {
    console.log('Connected');
  }).catch((err) => {
    console.log(`Error during connection ${err}`);
  });

app.use(bodyParser.json()); // для работы с телом запроса

app.use((req, res, next) => {
  req.user = {
    _id: '6425e620a32586832a40fa25', // id тестового пользователя
  };

  next();
});
app.use('/', router);

app.all('*', (req, res) => res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемая страница не найдена' }));

app.listen(PORT, () => {
  console.log(`Listing on port ${PORT}`);
  console.log(BASE_PATH);
});
