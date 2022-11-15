const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { analysisValidation } = require("../validations");
const { analysisController } = require("../controllers");
const { fileUpload } = require("../utils/fileUpload");
const primiumAuth = require("../middlewares/premimuAuthenticator");
const router = express.Router();

router
  .route("/")
  .post(
    auth("manageAnalysis"),
    fileUpload.single("photoPath"),
    validate(analysisValidation.createAnalysis),
    analysisController.createAnalysis
  )
  .get(auth(), primiumAuth, analysisController.queryAnalysis);

router
  .route("/:id")
  .get(
    auth(),
    primiumAuth,
    validate(analysisValidation.getAnalysis),
    analysisController.getAnalysis
  )
  .patch(
    auth("manageAnalysis"),
    fileUpload.single("photoPath"),
    validate(analysisValidation.updateAnalysis),
    analysisController.updateAnalysis
  )
  .delete(
    auth("manageAnalysis"),
    validate(analysisValidation.deleteAnalysis),
    analysisController.deleteAnalysis
  );

router
  .route("/search/analysis")
  .get(
    auth(),
    primiumAuth,
    validate(analysisValidation.searchAnalysis),
    analysisController.searchAnalysis
  );
module.exports = router;
