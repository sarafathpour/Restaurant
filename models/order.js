const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User"
  },
  products: [{
    product: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Product"
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
  }],
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  address: {
    type: mongoose.Schema.Types.Mixed,
  },
  status: {
    type: String,
    enum: ["pending", "canceled", "complete"],
    required: true,
    default: "pending",
  },
  payment: {
    method: {
      type: String,
      required: true
    },
    transaction_id: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model("Order", orderSchema);;