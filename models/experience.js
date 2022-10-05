const mongoose = require("mongoose");

const ExperienceSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    started: {
      type: Date,
      required: true,
    },
    ended: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Experience", ExperienceSchema);
