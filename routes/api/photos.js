const express = require("express");
const router = express.Router();

const photos = require("../../controllers/photos");
const {
  authenticate,
  // validateBody,
  checkFileSize,
  upload,
} = require("../../middlewares");
// const { schemas } = require("../../models/photo");

router.get("/", photos.getGallery);

router.post(
  "/",
  authenticate,
  upload,
  checkFileSize,
  // validateBody(schemas.addPhotosGroup),
  photos.addPhotosGroup
);

router.delete("/:id", authenticate, photos.deletePhotosGroup);

module.exports = router;
