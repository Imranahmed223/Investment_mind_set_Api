const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { stockValidation } = require("../validations");
const { stockController } = require("../controllers/index");
const { fileUpload } = require("../utils/fileUpload");
const primiumAuth = require("../middlewares/premimuAuthenticator");
const router = express.Router();

router
  .route("/")
  .post(
    auth("manageStocks"),
    fileUpload.single("photoPath"),
    validate(stockValidation.createStock),
    stockController.createStock
  )
  .get(
    auth(),
    primiumAuth,
    validate(stockValidation.queryStock),
    stockController.queryStock
  );

router
  .route("/:id")
  .get(
    auth(),
    primiumAuth,
    validate(stockValidation.getStock),
    stockController.getStock
  )
  .patch(
    auth("manageStocks"),
    fileUpload.single("photoPath"),
    validate(stockValidation.updateStock),
    stockController.updateStock
  )
  .delete(
    auth("manageStocks"),
    validate(stockValidation.deleteStock),
    stockController.deleteStock
  );

router
  .route("/search/stock")
  .get(
    auth(),
    primiumAuth,
    validate(stockValidation.searchStock),
    stockController.searchStock
  );
module.exports = router;
