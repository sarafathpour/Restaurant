const Product = require('@models/product');
const asyncHandler = require('@middlewares/async');
const errorResponse = require('@utils/errorResponse');

exports.createOne = asyncHandler(async function(req, res){
  let { name, image, quantity, price } = req.body;
  let product = await Product.create({ name, image, quantity, price });
  res.status(201).json({
    success: true,
    data: product
  });
});

exports.getOne = asyncHandler(async function(req, res, next){
  let product = await Product.findById(req.params.id);
  if(!product){
    return next(new errorResponse("Product not found", 404))
  }
  res.status(200).json({
    success: true,
    data: product
  });
});

exports.getAll = asyncHandler(async function(req, res, next){
  let products = await Product.find();
  res.status(200).json({
    success: true,
    data: { count: products.length, products }
  });
});

exports.updateOne = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(
      new errorResponse(`Product not found`, 404, "_id", { _id: req.params.id })
    );
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

exports.deleteOne = asyncHandler(async function(req, res, next){
  let product = await Product.findOneAndDelete(req.params.id);
  if(!product){
    return next(new errorResponse("Product not found", 404))
  }
  res.status(200).json({
    success: true,
    data: product
  });
});