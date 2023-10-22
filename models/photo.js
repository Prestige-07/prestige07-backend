const { Schema, model } = require("mongoose");
const joi = require("joi");

const photoGroupSchema = new Schema(
  {
    beforePhoto: Object,
    beforeAlt: String,
    afterPhoto: Object,
    afterAlt: String,
  },
  { versionKey: false, timestamps: true }
);

const addPhotosGroup = joi.object({
  beforePhoto: joi.object().messages({
    "object.base": "Поле фото до повинно бути об'єктом",
  }),
  beforeAlt: joi.string().messages({
    "string.base": "Поле опис фото до повинно бути текстовим",
  }),
  afterPhoto: joi.object().messages({
    "object.base": "Поле фото після повинно бути об'єктом",
  }),
  afterAlt: joi.string().messages({
    "string.base": "Поле опис фото після повинно бути текстовим",
  }),
});

const Photo = model("photo", photoGroupSchema);

const schemas = { addPhotosGroup };

module.exports = { Photo, schemas };
