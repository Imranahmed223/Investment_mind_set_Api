const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { newsValidation } = require("../validations");
const { newsController } = require("../controllers/index");
const { fileUpload } = require("../utils/fileUpload");
const primiumAuth = require("../middlewares/premimuAuthenticator");
const router = express.Router();

router
  .route("/")
  .post(
    auth("manageNews"),
    fileUpload.single("photoPath"),
    validate(newsValidation.createNews),
    newsController.createNews
  )
  .get(auth(), primiumAuth, newsController.queryNews);

router
  .route("/:id")
  .get(
    auth(),
    primiumAuth,
    validate(newsValidation.getNews),
    newsController.getNews
  )
  .patch(
    auth("manageNews"),
    fileUpload.single("photoPath"),
    validate(newsValidation.updateNews),
    newsController.updateNews
  )
  .delete(
    auth("manageNews"),
    validate(newsValidation.deleteNews),
    newsController.deleteNews
  );

router
  .route("/search/news")
  .get(
    auth(),
    primiumAuth,
    validate(newsValidation.searchNews),
    newsController.searchNews
  );
module.exports = router;
