const { default: mongoose } = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const featureSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    photoPath: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

featureSchema.plugin(toJSON);
featureSchema.plugin(paginate);
/**
 * @typedef News
 */
const Feature = mongoose.model("Feature", featureSchema);

module.exports = Feature;
