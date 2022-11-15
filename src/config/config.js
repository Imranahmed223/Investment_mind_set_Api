const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");
dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    ROOT_PATH: Joi.string(),
    WRITE_PATH: Joi.string(),
    HTTP_PORT: Joi.number().default(3000),
    HTTPS_PORT: Joi.number().default(3001),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    //MONGODB_URL_MASTER : Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_DAYS: Joi.number()
      .default(92)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(182)
      .description("days after which refresh tokens expire"),
    COINT_MARKET_API_KEY: Joi.string()
      .required()
      .description("Coin Market API key is required."),
    CRYPTO_COINS_API_URL: Joi.string()
      .required()
      .description("Crypto Api Url is required"),
    CRYPTO_COINS_MATA_DATA_URL: Joi.string()
      .required()
      .description("Crypto Meta Api url is required"),
    CRYPTO_DATA_LIMIT: Joi.number()
      .required()
      .description("Crypto Data Limit Number is required"),
    STRIP_API_SECRET: Joi.string()
      .required()
      .description("Strip api secret key"),
    SUBSCRIPTION_PRICE: Joi.number()
      .required()
      .description("Subscription price is required"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  rootPath: envVars.ROOT_PATH,
  thumbPath: envVars.THUMB_PATH,
  writePath: envVars.WRITE_PATH,
  writePathReplication: envVars.WRITE_PATH_PATH_REPLICATION,
  httpPort: envVars.HTTP_PORT,
  httpsPort: envVars.HTTPS_PORT,
  download: envVars.IMAGE_DOWNLOAD_CRON,
  otherMachine: envVars.IMS_OTHER_MACHINE,
  subtratcTimeForUnlock: envVars.TIME_SUBTARCT_FOR_UNLOCK,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === "test" ? "-test" : ""),
    options: {
      // useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationDays: envVars.JWT_ACCESS_EXPIRATION_DAYS,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
  },
  cointMarketApiKey: envVars.COINT_MARKET_API_KEY,
  cryptoCoinsUrl: envVars.CRYPTO_COINS_API_URL,
  cryptoMetaUrl: envVars.CRYPTO_COINS_MATA_DATA_URL,
  cryptoDataLimit: envVars.CRYPTO_DATA_LIMIT,
  strip: {
    secretKey: envVars.STRIP_API_SECRET,
  },
  subscriptionPrice: envVars.SUBSCRIPTION_PRICE,
};
