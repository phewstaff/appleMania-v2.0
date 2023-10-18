const mongoose = require("mongoose");

const ImageSchema = {
  url: String,
  key: String,
  name: String,
  size: Number,
};

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: ImageSchema,
    required: true,
  },
  description: String,
  price: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;
