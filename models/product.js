const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    select: false,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
  },
  category: String,
  description: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  // status: {
  //   type: String,
  //   enum: ["active", "block", "inActive"],
  //   default: "active",
  //   required: true,
  // },
  quantity: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Product", productSchema);