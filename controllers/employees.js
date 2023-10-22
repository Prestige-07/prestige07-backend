const { Employee } = require("../models/employee");

const { ctrlWrapper, HttpError } = require("../helpers");

const getAllEmployees = async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Employee.find({}, "-createAt -updateAt", {
    skip,
    limit,
  });
  res.json(result);
};

const addEmployee = async (req, res) => {
  const result = await Employee.create({
    ...req.body,
  });

  res.status(201).json(result);
};

const getAllEmployeesForUsers = async (req, res) => {
  const result = await Employee.find(
    {},
    "-createdAt -updatedAt -phone -criminal -worksFromDate"
  );
  res.json(result);
};

const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const employee = await Employee.findById(id);
  if (!employee) {
    throw HttpError(404, "Працівника не знайдено");
  }
  const result = await Employee.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json(result);
};

const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  const employee = await Employee.findById(id);

  if (!employee) {
    throw HttpError(404, "Працівника не знайдено");
  }

  const result = await Employee.findByIdAndDelete(id);

  res.json(result);
};

module.exports = {
  addEmployee: ctrlWrapper(addEmployee),
  getAllEmployees: ctrlWrapper(getAllEmployees),
  getAllEmployeesForUsers: ctrlWrapper(getAllEmployeesForUsers),
  updateEmployee: ctrlWrapper(updateEmployee),
  deleteEmployee: ctrlWrapper(deleteEmployee),
};
