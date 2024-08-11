const express = require("express");
const router = express.Router();
const controller = require("../../controller/clients/cart-controller");

router.get("/", controller.index);
router.post("/add/:product", controller.addPost);

module.exports = router;
