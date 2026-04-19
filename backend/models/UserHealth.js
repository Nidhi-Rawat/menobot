const mongoose = require("mongoose");

const userHealthSchema = new mongoose.Schema(
  {
    lastPeriod: {
      type: Date,
    },
    cycles: [
      {
        type: Number,
      },
    ],
    cycleLength: {
      type: Number,
    },
    cramps: {
      type: Number,
    },
    mood: {
      type: Number,
    },
    fatigue: {
      type: Number,
    },
    flow: {
      type: Number,
    },
    painScore: {
      type: Number,
    },
    category: {
      type: String,
      trim: true,
    },
    nextPeriod: {
      type: Date,
    },
    phase: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserHealth", userHealthSchema);
