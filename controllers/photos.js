const { Photo } = require("../models/photo");

const { HttpError, ctrlWrapper } = require("../helpers");

const {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} = require("../utils");

const addPhotosGroup = async (req, res) => {
  // const { beforeAlt, afterAlt } = req.body;
  // const { before, after } = req.files;
  const { beforeAlt } = req.body;
  const { before } = req.files;
  const beforePhoto = await uploadImageToCloudinary(before[0].path);
  // const afterPhoto = await uploadImageToCloudinary(after[0].path);
  const result = await Photo.create({
    beforePhoto: {
      url: beforePhoto.secure_url,
      id: beforePhoto.public_id,
      alt: beforeAlt,
    },
    // afterPhoto: {
    //   url: afterPhoto.secure_url,
    //   id: afterPhoto.public_id,
    //   alt: afterAlt,
    // },
  });
  res.status(201).json(result);
};

const getGallery = async (req, res) => {
  const result = await Photo.find({}, "-createdAt -updatedAt").sort({
    createdAt: -1,
  });

  res.json(result);
};

const deletePhotosGroup = async (req, res) => {
  const { id } = req.params;

  const photosGroup = await Photo.findById(id);

  if (!photosGroup) {
    throw HttpError(404, `Зображення з id: ${id} не знайдено`);
  }

  await deleteImageFromCloudinary(photosGroup.beforePhoto.id);
  // await deleteImageFromCloudinary(photosGroup.afterPhoto.id);

  await Photo.findByIdAndDelete(id);
  res.status(200).json(id);
};

module.exports = {
  getGallery: ctrlWrapper(getGallery),
  addPhotosGroup: ctrlWrapper(addPhotosGroup),
  deletePhotosGroup: ctrlWrapper(deletePhotosGroup),
};
