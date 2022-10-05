const mongoose = require("mongoose");

const EducationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    school: {
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

module.exports = mongoose.model("Education", EducationSchema);
