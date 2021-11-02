const Order = require('@models/order');
const asyncHandler = require('@middlewares/async');
const errorResponse = require('@utils/errorResponse');

exports.createOne = asyncHandler(async function (req, res) {
  let { products, address, payment } = req.body;
  let totalPrice = 0;
  for (let { quantity, price } of products) {
    totalPrice += quantity * price;
  }
  totalPrice = totalPrice.toFixed(2);
  let order = await Order.create({
    _user: req.user.id,
    products,
    totalPrice,
    address,
    status: "pending",
    payment
  });
  res.status(201).json({
    success: true,
    data: order
  });
});

exports.getOne = asyncHandler(async function (req, res, next) {
  let order = await Order.findOne({ _id: req.params.id, _user: req.user.id });
  if (!Order) {
    return next(new errorResponse("Order not found", 404))
  }
  res.status(200).json({
    success: true,
    data: order
  });
});

exports.getAll = asyncHandler(async function (req, res, next) {
  let orders = await Order.find({_user: req.user.id});
  res.status(200).json({
    success: true,
    data: {
      count: orders.length,
      data: orders
    }
  });
});

exports.updateOne = asyncHandler(async (req, res, next) => {
  const order = await Order.findOneAndUpdate({ _id: req.params.id, _user: req.user.id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!order) {
    return next(
      new errorResponse(`Coupon not found`, 404, "_id", { _id: req.params.id })
    );
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

exports.cancelOne = asyncHandler(async (req, res, next) => {
  let order = await Order.findOne({ _id: req.params.id, _user: req.user.id });
  if (!order) {
    return next(
      new errorResponse(`Order not found`, 404, "_id", { _id: req.params.id })
    );
  }
  if(order.status === "complete"){
    return next(
      new errorResponse(`Your order completed, you can't cancel this!`, 400, "_id", { _id: req.params.id })
    );
  }
  order.status = 'canceled';
  await order.save();

  res.status(200).json({
    success: true,
    data: {
      message: "Your order canceled successfully."
    },
  });
});

exports.deleteOne = asyncHandler(async function (req, res, next) {
  let order = await Order.findOneAndDelete({ _id: req.params.id, _user: req.user.id });
  if (!order) {
    return next(new errorResponse("Order not found", 404))
  }
  res.status(200).json({
    success: true,
    data: order
  });
});

// return stripe.checkout.sessions.create({
//   payment_method_types: ['card'],
//   line_items: products.map((p) => {
//     return {
//       name: p.productId.title,
//       description: p.productId.description,
//       // Have to specify price in cents
//       // Using Math.round to ensure that I get an integer, due to JS floating point error causing Stripe invalid integer error "'Invalid integer: 819.9999999999999'" https://stackoverflow.com/questions/28025804/stripe-checkout-price-error-invalid-integer/28067229
//       amount: Math.round(p.productId.price * 100),
//       currency: 'usd',
//       quantity: p.quantity,
//     };
//   }),
//   // Routes Stripe will redirect to once payment is confirmed or canceled
//   // Generating dynamically so can use on local testing server and once deployed
//   success_url: `${req.protocol}://${req.get('host')}/checkout/success`,
//   cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`,
// });