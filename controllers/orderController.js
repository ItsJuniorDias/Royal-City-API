const axios = require("axios");
const asyncErrorHandler = require("../middlewares/helpers/asyncErrorHandler");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/sendEmail");
const transporter = require("../config/nodemailer");
const userModel = require("../models/userModel");

// Create New Order
exports.newOrder = asyncErrorHandler(async (req, res, next) => {
  const { shippingInfo, orderItems, paymentInfo, totalPrice, orderNumber } =
    req.body;

  const orderExist = await Order.findOne({ paymentInfo });

  if (orderExist) {
    return next(new ErrorHandler("Order Already Placed", 400));
  }

  const order = await Order.create({
    orderNumber,
    shippingInfo,
    orderItems,
    paymentInfo,
    totalPrice,
    paidAt: Date.now(),
    user: req.body.user,
  });

  const user = await User.findById(req.body.user);

  res.json({
    order,
    user,
  });

  const mailOptions = {
    from: "reabilitado97@gmail.com",
    to: user.email,
    subject: "Cryptocurrency Purchase Confirmation",
    text: `Hello ${user.name},

      Thank you for your purchase! We have received your request to pay using cryptocurrency.

      Transaction Details:

      Product/Service: ${order.orderItems[0].name}

      Quantity: ${order.orderItems[0].quantity}

      Total Amount:  ${order.orderItems[0].price}

      Please confirm the transaction so we can process your order. Once the payment is verified, you will receive a confirmation of shipment or access to the purchased service.

      If you have any questions, our support team is available at: itsjuniordias1997@gmail.com.

      Thank you for your business!`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.json({
        error,
      });
    } else {
      console.log(info.response, "INFO RESPONSE");
    }
  });
});

// Get Single Order Details
exports.getSingleOrderDetails = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get Logged In User Orders
exports.myOrders = asyncErrorHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  if (!orders) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get All Orders ---ADMIN
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {
  const orders = await Order.find();

  if (!orders) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    orders,
    totalAmount,
  });
});

// Update Order Status ---ADMIN
exports.updateOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("Already Delivered", 400));
  }

  if (req.body.status === "Shipped") {
    order.shippedAt = Date.now();
    order.orderItems.forEach(async (i) => {
      await updateStock(i.product, i.quantity);
    });
  }

  order.orderStatus = req.body.status;
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// Delete Order ---ADMIN
exports.deleteOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
