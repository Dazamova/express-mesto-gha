const express = require('express');
// const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { PORT = 3000, BASE_PATH = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

app.use(bodyParser.json()); // для работы с телом запроса

mongoose.connect(BASE_PATH).then(() => {
  console.log('connected');
}).catch((err) => {
  console.log(err);
});

app.use((req, res, next) => {
  req.user = {
    _id: '6425e620a32586832a40fa25', // айди тестового пользователя
  };

  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
  console.log(BASE_PATH);
});
