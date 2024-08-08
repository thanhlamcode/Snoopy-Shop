const express = require("express");
const router = express.Router();
const controller = require("../../controller/clients/cart-controller");

router.post("/add/:product", controller.addPost);

module.exports = router;
