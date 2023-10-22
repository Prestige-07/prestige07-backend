const { Schema, model } = require("mongoose");
const joi = require("joi");

const { phoneRegexp } = require("../utils");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    accessToken: String,
    refreshToken: String,
    phone: String,
  },
  { versionKey: false, timestamps: true }
);

const registerSchema = joi.object({
  name: joi.string().required().messages({
    "string.base": "Поле ім'я повинно бути текстовим",
    "any.required": "Поле ім'я обов'язкове",
  }),
  email: joi.string().email().required().messages({
    "string.base": "Поле ел.пошти повинно бути текстовим",
    "string.email": "Поле ел.пошти повинно бути в форматі user@example.com",
    "any.required": "Поле ел.пошти обов'язкове",
  }),
  password: joi.string().min(8).max(30).required().messages({
    "string.base": "Поле пароль повинно бути текстовим",
    "string.min": "Поле пароль повинно мати мінімум 8 символів",
    "string.max": "Поле пароль повинно мати не більше 30 символів",
    "any.required": "Поле пароль обов'язкове",
  }),
});

const loginSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.base": "Поле ел.пошти повинно бути текстовим",
    "string.email": "Поле ел.пошти повинно бути в форматі user@example.com",
    "any.required": "Поле ел.пошти обов'язкове",
  }),
  password: joi.string().min(8).max(30).required().messages({
    "string.base": "Поле пароль повинно бути текстовим",
    "string.min": "Поле пароль повинно мати мінімум 8 символів",
    "string.max": "Поле пароль повинно мати не більше 30 символів",
    "any.required": "Поле пароль обов'язкове",
  }),
});

const updateSchema = joi
  .object({
    name: joi.string().messages({
      "string.base": "Поле ім'я повинно бути текстовим",
    }),
    email: joi.string().email().messages({
      "string.base": "Поле ел.пошти повинно бути текстовим",
      "string.email": "Поле ел.пошти повинно бути в форматі user@example.com",
    }),
    phone: joi.string().pattern(phoneRegexp).messages({
      "string.base": "Поле телефон повинно бути текстовим",
      "string.pattern.base":
        "Поле телефон повинно бути в форматі +380123456789",
    }),
  })
  .or("name", "email", "phone");

const refreshSchema = joi.object({
  refreshToken: joi.string().required().messages({
    "string.base": "Поле refreshToken повинно бути текстовим",
    "any.required": "Поле refreshToken обов'язкове",
  }),
});

const User = model("user", userSchema);

const schemas = { registerSchema, loginSchema, updateSchema, refreshSchema };

module.exports = { User, schemas };
