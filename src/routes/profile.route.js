const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const profileValidation = require("../validations/profile.validation");
const { profileController } = require("../controllers/index");
const router = express.Router();

router.route("/").get(auth(), profileController.getProfiles);

router
  .route("/:id")
  .get(
    auth(),
    validate(profileValidation.getProfile),
    profileController.getProfile
  )
  .patch(
    auth(),
    validate(profileValidation.updateProfile),
    profileController.updateProfile
  );
module.exports = router;
