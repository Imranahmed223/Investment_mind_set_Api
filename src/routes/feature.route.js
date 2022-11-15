const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { featureValidation } = require("../validations");
const { featureController } = require("../controllers/index");
const { fileUpload } = require("../utils/fileUpload");
const primiumAuth = require("../middlewares/premimuAuthenticator");
const router = express.Router();

router
  .route("/")
  .post(
    auth("manageFeature"),
    fileUpload.single("photoPath"),
    validate(featureValidation.createFeature),
    featureController.createFeature
  )
  .get(auth(), primiumAuth, featureController.queryFeature);

router
  .route("/:id")
  .get(
    auth(),
    primiumAuth,
    validate(featureValidation.getFeature),
    featureController.getFeature
  )
  .patch(
    auth("manageFeature"),
    fileUpload.single("photoPath"),
    validate(featureValidation.updateFeature),
    featureController.updateFeature
  )
  .delete(
    auth("manageFeature"),
    validate(featureValidation.deleteFeature),
    featureController.deleteFeature
  );

router
  .route("/search/feature")
  .get(
    auth(),
    primiumAuth,
    validate(featureValidation.searchFeature),
    featureController.searchFeature
  );
module.exports = router;
