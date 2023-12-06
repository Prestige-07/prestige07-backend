const express = require("express");
const router = express.Router();

const photos = require("../../controllers/photos");
const { authenticate, checkFileSize, upload } = require("../../middlewares");

router.get("/", photos.getGallery);

router.post("/", authenticate, upload, checkFileSize, photos.addPhotosGroup);

router.delete("/:id", authenticate, photos.deletePhotosGroup);

module.exports = router;
