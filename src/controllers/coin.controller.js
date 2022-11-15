const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const config = require("../config/config");
const { Crypto } = require("../models");
const { default: axios } = require("axios");

const fetchCoinMarketData = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit) || 100;
  console.log("Limit => ", limit);
  let data = [];
  let response = null;
  response = await axios.get(
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=${limit}`,
    {
      headers: {
        "X-CMC_PRO_API_KEY": config.cointMarketApiKey,
      },
    }
  );
  data = response.data.data;
  const ids = data.map((d) => d.id);
  const cryptoData = await Crypto.find({
    id: { $in: ids },
    photoPath: { $ne: null },
  }).limit(limit);
  for (let i = 0; i < data.length; i++) {
    const coin = cryptoData.filter((re) => re.id == data[i].id)[0];
    if (coin) {
      console.log(data[i], coin);
      if (data[i].id == coin.id) {
        data[i].logo = coin.photoPath;
      } else {
        data[i].logo = null;
      }
    } else data[i].logo = null;
  }
  res.send(data);
});

module.exports = {
  fetchCoinMarketData,
};
