const { Schema, model } = require("mongoose");
const joi = require("joi");

const { stringRegexp, phoneRegexp } = require("../utils");

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: String,
    criminal: Boolean,
    worksFromDate: String,
  },
  { versionKey: false, timestamps: true }
);

const addEmployeeSchema = joi.object({
  name: joi.string().pattern(stringRegexp).required().messages({
    "string.base": "Поле ім'я повинно бути текстом без чисел чи знаків",
    "string.pattern.base": "Поле ім'я повинно бути текстом без чисел чи знаків",
    "any.required": "Поле ім'я обов'язкове",
  }),
  phone: joi.string().pattern(phoneRegexp).messages({
    "string.base": "Поле телефон повинно бути номером",
    "string.pattern.base":
      "Некоректний формат. Введіть номер в форматі +380123456789",
  }),
  criminal: joi.boolean().messages({
    "boolean.base": "Поле судимість повинно бути булевим",
  }),
  worksFromDate: joi.string().messages({
    "string.base": "Поле дата повинно бути реченням",
  }),
});

const updateEmployeeSchema = joi
  .object({
    name: joi.string().pattern(stringRegexp).messages({
      "string.base": "Поле ім'я повинно бути текстом без чисел чи знаків",
      "string.pattern.base":
        "Поле ім'я повинно бути текстом без чисел чи знаків",
    }),
    phone: joi.string().pattern(phoneRegexp).messages({
      "string.base": "Поле телефон повинно бути номером",
      "string.pattern.base":
        "Некоректний формат. Введіть номер в форматі +380123456789",
    }),
    criminal: joi.boolean().messages({
      "boolean.base": "Поле судимість повинно бути булевим",
    }),
    worksFromDate: joi.string().messages({
      "string.base": "Поле дата повинно бути реченням",
    }),
  })
  .or("name", "phone", "criminal", "worksFromDate");

const Employee = model("employee", employeeSchema);

const schemas = { addEmployeeSchema, updateEmployeeSchema };

module.exports = { Employee, schemas };
