const { Order } = require("../models/order");

const { HttpError, ctrlWrapper } = require("../helpers");

const addOrder = async (req, res) => {
  const { services } = req.body;

  // number of order generator
  const numberOfOrders = ((await Order.find()).length + 1).toString();
  const numberOfZeros = Math.max(0, 7 - numberOfOrders.length);
  const zeros = "0".repeat(numberOfZeros);
  const orderNumber = zeros + numberOfOrders;
  // end

  const data = {
    orderNumber,
    totalCostOrder: 0,
    discountedCostOrder: 0,
    administratorPayment: 0,
    washerPayment: 0,
    revenue: 0,
  };

  // order calculation
  if (services && services.length > 0) {
    const totalCost = services.reduce((acc, service) => {
      const amount = service.amount ? service.amount : 1;
      const cost = parseFloat((service.price * amount).toFixed(2));
      return acc + cost;
    }, 0);
    const totalWasherPayment = services.reduce((acc, service) => {
      const amount = service.amount ? service.amount : 1;
      const washerPayment = parseFloat(
        (service.price * amount * (service.employeePercent / 100)).toFixed(2)
      );
      return acc + washerPayment;
    }, 0);

    const discount = req.body.discountPercent
      ? 1 - req.body.discountPercent / 100
      : 1;

    data.totalCostOrder = parseFloat(totalCost.toFixed(2));
    data.discountedCostOrder = parseFloat((totalCost * discount).toFixed(2));
    data.administratorPayment = parseFloat(
      (totalCost * discount * 0.07).toFixed(2)
    );
    data.washerPayment = parseFloat((totalWasherPayment * discount).toFixed(2));
    data.revenue = parseFloat(
      (
        data.discountedCostOrder -
        data.washerPayment -
        data.administratorPayment
      ).toFixed(2)
    );
  }
  // end

  const result = await Order.create({
    ...req.body,
    ...data,
  });

  res.status(201).json(result);
};

const getOrderByNumber = async (req, res) => {
  const { number } = req.params;
  const order = await Order.findOne(
    { orderNumber: number },
    "-createdAt -updatedAt"
  );

  if (!order) {
    throw HttpError(404, "Замовлення не знайдено");
  }

  res.status(200).json(order);
};

const updateOrderByNumber = async (req, res) => {
  const { number } = req.params;
  const { data } = req.body;

  const order = await Order.findOne({ orderNumber: number });

  if (!order) {
    throw HttpError(404, `Замовлення не знайдено`);
  }

  // order calculation
  if (data.services) {
    const totalCost = data.services.reduce((acc, service) => {
      const amount = service.amount ? service.amount : 1;
      const cost = parseFloat((service.price * amount).toFixed(2));
      return acc + cost;
    }, 0);

    const totalWasherPayment = data.services.reduce((acc, service) => {
      const amount = service.amount ? service.amount : 1;
      const washerPayment = parseFloat(
        (service.price * amount * (service.employeePercent / 100)).toFixed(2)
      );
      return acc + washerPayment;
    }, 0);

    const discount = order.discountPercent
      ? 1 - order.discountPercent / 100
      : 1;

    data.totalCostOrder = parseFloat(totalCost.toFixed(2));
    data.discountedCostOrder = parseFloat((totalCost * discount).toFixed(2));
    data.administratorPayment = parseFloat(
      (totalCost * discount * 0.07).toFixed(2)
    );
    data.washerPayment = parseFloat((totalWasherPayment * discount).toFixed(2));
    data.revenue = parseFloat(
      (
        data.discountedCostOrder -
        data.washerPayment -
        data.administratorPayment
      ).toFixed(2)
    );
  }

  if (data.discountPercent) {
    const totalWasherPayment = order.services.reduce((acc, service) => {
      const amount = service.amount ? service.amount : 1;
      const washerPayment = parseFloat(
        (service.price * amount * (service.employeePercent / 100)).toFixed(2)
      );
      return acc + washerPayment;
    }, 0);

    const discount = data.discountPercent ? 1 - data.discountPercent / 100 : 1;

    data.totalCostOrder = parseFloat(order.totalCostOrder.toFixed(2));
    data.discountedCostOrder = parseFloat(
      (order.totalCostOrder * discount).toFixed(2)
    );
    data.administratorPayment = parseFloat(
      (order.totalCostOrder * discount * 0.07).toFixed(2)
    );
    data.washerPayment = parseFloat((totalWasherPayment * discount).toFixed(2));
    data.revenue = parseFloat(
      (
        data.discountedCostOrder -
        data.washerPayment -
        data.administratorPayment
      ).toFixed(2)
    );
  }

  if (data.status === "В роботі") {
    // end

    data.orderExecutionDate = "";
  } else if (data.status === "Виконане" || data.status === "Скасоване") {
    data.orderExecutionDate = new Date().toJSON();
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    order._id,
    { ...data },
    { new: true }
  );
  res.status(200).json(updatedOrder);
};

const getAll = async (req, res) => {
  const { status = "", page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  let result;
  let totalCount;

  if (status) {
    result = await Order.find({ status }, "-createdAt -updatedAt", {
      skip,
      limit,
    }).sort({ createdAt: -1 });

    totalCount = await Order.countDocuments({ status });
  } else {
    result = await Order.find({}, "-createdAt -updatedAt", {
      skip,
      limit,
    }).sort({ createdAt: -1 });

    totalCount = await Order.countDocuments();
  }

  const totalPages = Math.ceil(totalCount / limit);
  const [
    allOrders,
    newOrders,
    inProcessOrders,
    completedOrders,
    cancelledOrders,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: "Нове" }),
    Order.countDocuments({ status: "В роботі" }),
    Order.countDocuments({ status: "Виконане" }),
    Order.countDocuments({ status: "Скасоване" }),
  ]);

  res.json({
    totalPages,
    orders: result,
    totalOrders: {
      allOrders,
      newOrders,
      inProcessOrders,
      completedOrders,
      cancelledOrders,
    },
  });
};

module.exports = {
  addOrder: ctrlWrapper(addOrder),
  getAll: ctrlWrapper(getAll),
  getOrderByNumber: ctrlWrapper(getOrderByNumber),
  updateOrderByNumber: ctrlWrapper(updateOrderByNumber),
};
