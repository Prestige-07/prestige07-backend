const fs = require("fs/promises");
const { HttpError } = require("../helpers");

const checkFileSize = async (req, res, next) => {
  const { files } = req;
  const maxFileSize = 10 * 1024 * 1024;
  let fileExceedsLimit = false;

  for (const key in files) {
    const file = files[key][0];
    if (file.size > maxFileSize) {
      // Якщо розмір файлу перевищує ліміт, встановлюємо флаг і виходимо з циклу
      fileExceedsLimit = true;
      break;
    }
  }

  if (fileExceedsLimit) {
    // Якщо хоча б один файл перевищує ліміт, видаляємо всі файли і відправляємо помилку
    for (const key in files) {
      const file = files[key][0];
      await fs.unlink(file.path);
    }
    return next(
      HttpError(400, "Розмір принаймні одного файлу перевищує 10 МБ")
    );
  }

  next();
};

module.exports = checkFileSize;
