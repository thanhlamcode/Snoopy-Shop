const express = require("express");
const router = express.Router();
const controller = require("../../controller/clients/users-controller");
const validate = require("../../validate/client/user.valide");
const userMiddle = require("../../middleware/client/require.middleware");

router.get("/not-friend", controller.notFriend);
router.get("/request", controller.request);
router.get("/accept", controller.accept);
router.get("/friends", controller.listFriend);

module.exports = router;
