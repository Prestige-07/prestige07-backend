const { Service } = require("../models/service");

const { ctrlWrapper, HttpError } = require("../helpers");

const addService = async (req, res) => {
  const result = await Service.create({
    ...req.body,
  });

  res.status(201).json(result);
};

const getAllServices = async (req, res) => {
  const { page = 1, limit = 100 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Service.find({}, "-createAt -updateAt", {
    skip,
    limit,
  }).sort({ name: 1 });
  res.json(result);
};

const updateService = async (req, res) => {
  const { id } = req.params;

  const service = await Service.findById(id);

  if (!service) {
    throw HttpError(404, "Послугу не знайдено");
  }

  const result = await Service.findByIdAndUpdate(id, req.body, { new: true });

  res.status(200).json(result);
};

const deleteService = async (req, res) => {
  const { id } = req.params;

  const service = await Service.findById(id);

  if (!service) {
    throw HttpError(404, "Послугу не знайдено");
  }

  const result = await Service.findByIdAndDelete(id);

  res.json(result);
};

module.exports = {
  addService: ctrlWrapper(addService),
  getAllServices: ctrlWrapper(getAllServices),
  updateService: ctrlWrapper(updateService),
  deleteService: ctrlWrapper(deleteService),
};
