export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
export const HTTP_STATUS_BAD_REQUEST = 400;
export const HTTP_STATUS_NOT_FOUND = 404;

// class ValidationError extends Error {
//   constructor(message) {
//     super(message);
//     this.name = "ValidationError";
//     this.statusCode = 400;
//   }
// }

// Обработка ошибок в приложении:
// Чеклист для самопроверки №13 3
// Если в любом из запросов что-то идёт не так, сервер возвращает ответ с ошибкой и соответствующим ей
// статусом:
// 400 — переданы некорректные данные в методы создания карточки, пользователя, обновления аватара
// пользователя или профиля;
// HTTP_STATUS_NOT_FOUND 404 — карточка или пользователь не найден или был запрошен несуществующий роут;
// 500 — ошибка по умолчанию. Сопровождается сообщением: «На сервере произошла ошибка».
