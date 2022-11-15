const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const analysisSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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

analysisSchema.plugin(toJSON);
analysisSchema.plugin(paginate);
/**
 * @typedef Analysis
 */
const Analysis = mongoose.model("Analysis", analysisSchema);

module.exports = Analysis;
