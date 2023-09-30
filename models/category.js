const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: String,
  image: {
    type: String,
    default: "files\\defaultfood.jpg",
  },
  imageMin: {
    type: String,
    default: "files\\defaultfood.jpg",
  },
});

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

module.exports = Category;
