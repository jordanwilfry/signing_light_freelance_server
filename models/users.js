const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    secondName: {
      type: String,
      require: true,
    },
    dateOfBirth: {
      type: Date,
      require: true,
    },
    country: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    skills: {
      type: Array,
      default: [],
    },
    languages: {
      type: Array,
      default: ["french"],
    },
    profilePicture: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      require: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    verifiedEmail: {
      type: Boolean,
      default: false,
    },
    projects: {
      type: Array,
      default: [],
    },
    completedProjects: {
      type: Array,
      default: [],
    },
    favList: {
      type: Array,
      default: [],
    },
    stared: {
      type: Array,
      default: [],
    },
    haveStared: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
  { collection: "users" }
);

const model = mongoose.model("User", UserSchema);

module.exports = model;
