const mongoose = require("mongoose");

const ResponseSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    unLikes: {
      type: Array,
      default: [],
    },
    response: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Response", ResponseSchema);
