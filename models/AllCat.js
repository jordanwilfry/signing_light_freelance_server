const mongoose = require("mongoose");

const AllCatSchema = new mongoose.Schema(
  {
    categorie: {
      type: String,
      required: true,
    },
    categorieId: {
      type: String,
      required: true,
    },
    subCategorie: {
      type: String,
      required: true,
    },
    images: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AllCat", AllCatSchema);
