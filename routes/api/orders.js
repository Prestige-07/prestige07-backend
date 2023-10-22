const express = require("express");
const router = express.Router();

const { validateBody, authenticate } = require("../../middlewares");

const { schemas } = require("../../models/order");
const orders = require("../../controllers/orders");

router.post("/", validateBody(schemas.addOrderSchema), orders.addOrder);
router.get("/", authenticate, orders.getAll);
router.get("/:number", authenticate, orders.getOrderByNumber);
router.patch("/:number/update", authenticate, orders.updateOrderByNumber);

// router.get("/category/:category", notices.getAll);

// router.get("/notice/:noticeId", validNoticeId, notices.getById);

// router.patch(
//   "/:noticeId/favorite",
//   authenticate,
//   validNoticeId,
//   notices.updateFavoriteNotice
// );

// router.get("/favorite", authenticate, notices.getFavorite);

// router.post(
//   "/",
//   authenticate,
//   upload.single("avatarURL"),
//   checkFileSize,
//   validateBody(schemas.addSchema),
//   notices.addUserNotice
// );

// router.get("/own", authenticate, notices.getUserNotices);

// router.delete("/:noticeId", authenticate, validNoticeId, notices.removeById);

module.exports = router;
