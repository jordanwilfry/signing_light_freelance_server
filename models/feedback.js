const mongoose = require('mongoose')

const FeedbackSchema = new mongoose.Schema(
    {
      feedbackerId: {
        type: String,
        required: true,
      },
      projectId: {
          type: String,
          required: true
      },
      text: {
        type: String,
      },
      likes: {
        type: Array,
        default: [],
      },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("Feedback", FeedbackSchema);