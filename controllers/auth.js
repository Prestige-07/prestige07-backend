const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/user");
const { HttpError, ctrlWrapper } = require("../helpers");

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

// const register = async (req, res) => {
//   const { name, email, password } = req.body;
//   const user = await User.findOne({ email });

//   if (user) {
//     throw HttpError(409, "Ел.пошта вже використовується");
//   }

//   const hashPassword = await bcrypt.hash(password, 10);

//   const newUser = await User.create({
//     name,
//     email: email.toLowerCase(),
//     password: hashPassword,
//   });

//   res.status(201).json({
//     user: {
//       email: newUser.email,
//     },
//   });
// };

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw HttpError(401, "Ел.пошта або пароль введені неправильно");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Ел.пошта або пароль введені неправильно");
  }

  const payload = { id: user._id };
  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
    expiresIn: "7D",
  });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: "7D",
  });

  await User.findByIdAndUpdate(user._id, {
    accessToken,
    refreshToken,
  });

  res.json({
    accessToken,
    refreshToken,
    email: user.email,
    name: user.name,
  });
};

const refresh = async (req, res) => {
  const { refreshToken: token } = req.body;
  try {
    const { id } = jwt.verify(token, REFRESH_SECRET_KEY);
    const isExist = await User.findOne({ refreshToken: token });
    if (!isExist) {
      throw HttpError(403, "Авторизуйтесь повторно");
    }

    const payload = { id };
    const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
      expiresIn: "7D",
    });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
      expiresIn: "7D",
    });

    await User.findByIdAndUpdate(isExist._id, { accessToken, refreshToken });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    throw HttpError(403, error.message);
  }
};

const getCurrent = async (req, res) => {
  const { _id, name, email, phone, accessToken, refreshToken } = req.user;
  res.json({
    _id,
    name,
    email,
    phone,
    accessToken,
    refreshToken,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { accessToken: "", refreshToken: "" });

  res.status(204).json();
};

const getAdministrators = async (req, res) => {
  const result = await User.find({}, "-password -accessToken -refreshToken");
  res.json(result);
};

module.exports = {
  // register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  getAdministrators: ctrlWrapper(getAdministrators),
  refresh: ctrlWrapper(refresh),
};
