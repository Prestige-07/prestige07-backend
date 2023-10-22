const { Order } = require("../models/order");

const { ctrlWrapper } = require("../helpers");

const getReportingByDates = async (req, res) => {
  const { startDate: start, endDate: end } = req.query;

  const startDate = new Date(start);
  const endDate = new Date(end);

  startDate.setHours(0, 0, 0);
  endDate.setHours(23, 59, 59);

  const data = {};

  // orders
  const orders = await Order.find(
    {
      status: "Виконане",
      orderExecutionDate: {
        $gte: startDate.toJSON(),
        $lt: endDate.toJSON(),
      },
    },
    "-createdAt -updatedAt"
  ).sort({
    orderExecutionDate: -1,
  });
  data.orders = orders;

  // employees and their payments
  const uniqueEmployees = [
    ...new Set(orders.flatMap((order) => [order.washer, order.administrator])),
  ];
  const employees = uniqueEmployees.map((employee) => {
    const employeeOrders = orders.filter(
      (order) => order.washer === employee || order.administrator === employee
    );
    const totalPayment = employeeOrders.reduce((sum, order) => {
      if (order.washer === employee) {
        return sum + order.washerPayment;
      } else if (order.administrator === employee) {
        return sum + order.administratorPayment;
      }
      return sum;
    }, 0);
    return { name: employee, payment: totalPayment };
  });
  data.employees = employees;

  // reporting categories
  const totalEmployeesPayments = employees.reduce((sum, employee) => {
    return sum + employee.payment;
  }, 0);
  const totalPayments = orders.reduce((sum, order) => {
    return sum + order.discountedCostOrder;
  }, 0);
  const totalCash = orders.reduce((sum, order) => {
    if (order.payment === "Готівка") {
      return sum + order.discountedCostOrder;
    }
    return sum;
  }, 0);
  const totalCard = orders.reduce((sum, order) => {
    if (order.payment === "Безготівка") {
      return sum + order.discountedCostOrder;
    }
    return sum;
  }, 0);
  data.payments = {
    totalEmployeesPayments,
    totalPayments,
    totalCash,
    totalCard,
    profit: totalPayments - totalEmployeesPayments,
  };

  res.json(data);
};

module.exports = {
  getReportingByDates: ctrlWrapper(getReportingByDates),
};
