const { default: axios } = require("axios");
const config = require("../config/config");
const logger = require("../config/logger");
const { Crypto } = require("../models");

const fetachCoinsData = async () => {
  const count = await Crypto.find().count();
  console.log(count);
  if (count == 0) {
    const data = await axios.get(`${config.cryptoCoinsUrl}?limit=5000`, {
      headers: {
        "X-CMC_PRO_API_KEY": config.cointMarketApiKey,
      },
    });
    const cryptoData = data.data.data;
    const insertData = [];
    for (i = 0; i < cryptoData.length; i++) {
      const crypto = {
        id: cryptoData[i].id,
        name: cryptoData[i].name,
        photoPath: null,
      };
      insertData.push(crypto);
    }
    await Crypto.insertMany(insertData);
    logger.info("Successfully Added Crypto Data");
  } else {
    logger.info("Coins data already added!");
  }
};

const bindLogosToCryptoData = async () => {
  const cryptoData = await Crypto.find({ photoPath: null }).limit(
    config.cryptoDataLimit
  );
  let metaData = {};
  if (cryptoData.length > 0) {
    for (let i = 0; i < cryptoData.length; i++) {
      metaData = await axios.get(
        `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${cryptoData[i].id}`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": config.cointMarketApiKey,
          },
        }
      );
      await Crypto.updateOne(
        { _id: cryptoData[i]._id },
        { $set: { photoPath: metaData.data.data[cryptoData[i].id].logo } }
      );
    }
    logger.info("Crypto Coin Path Updated");
  } else {
    logger.info("Crypto coins logo path is already updated");
  }
};
module.exports = {
  fetachCoinsData,
  bindLogosToCryptoData,
};
