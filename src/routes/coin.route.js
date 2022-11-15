const express = require("express");
const validate = require("../middlewares/validate");
const authValidation = require("../validations/auth.validation");
const { coinController } = require("../controllers/index");
const auth = require("../middlewares/auth");
const primiumAuth = require("../middlewares/premimuAuthenticator");
const router = express.Router();

router.route("/").get(auth(), primiumAuth, coinController.fetchCoinMarketData);

module.exports = router;
