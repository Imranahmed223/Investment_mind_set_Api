const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const stockSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      default: "",
    },
    analysis: {
      overall: {
        type: Number,
        default: 0,
      },
      fundamental: {
        type: Number,
        default: 0,
      },
      shortTermTechnical: {
        type: Number,
        default: 0,
      },
      longTermTechnical: {
        type: Number,
        default: 0,
      },
      analysisRating: {
        type: Number,
        default: 0,
      },
      valuation: {
        type: Number,
        default: 0,
      },
    },
    sentiment: {
      type: Number,
      default: 0,
    },
    photoPath: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

stockSchema.plugin(toJSON);
stockSchema.plugin(paginate);
/**
 * @typedef Stock
 */
const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;
