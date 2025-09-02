const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const PropertySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    profit: {
      type: Number,
      required: true,
    },
    returns: {
      type: Number,
      required: true,
    },
    investors: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", PropertySchema);

module.exports = Property;
