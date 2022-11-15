const { default: mongoose } = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const cryptoSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    id: {
      type: Number,
      default: null,
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

cryptoSchema.plugin(toJSON);
cryptoSchema.plugin(paginate);
/**
 * @typedef Crypto
 */
const Crypto = mongoose.model("Crypto", cryptoSchema);

module.exports = Crypto;
