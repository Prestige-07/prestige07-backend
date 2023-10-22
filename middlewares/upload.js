const multer = require("multer");
const path = require("path");

const tempDir = path.join(__dirname, "../", "tmp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: multerConfig }).fields([
  { name: "before", maxCount: 1 },
  { name: "after", maxCount: 1 },
]);

module.exports = upload;
