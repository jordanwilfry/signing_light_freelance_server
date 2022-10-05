const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    smallDesc: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    detail: {
      type: Array,
      required: true,
      default: [],
    },
    star: {
      type: Array,
      default: [],
    },
    deliveryTime: {
      type: String,
      required: true,
    },
    responseTime: {
      type: String,
    },
    categorie: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    subCategorie: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
