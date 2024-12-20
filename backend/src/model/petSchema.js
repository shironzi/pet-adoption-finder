const mongoose = require("mongoose");
const { Schema } = mongoose;

const petSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  animal: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "pending", "adopted"],
    default: "available",
  },
});

petSchema.index({ animal: 1, breed: 1, location: 1 });

module.exports = mongoose.model("Pet", petSchema);
