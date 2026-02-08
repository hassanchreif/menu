const express = require("express");
const router = express.Router();
const {
  createMember,
  getMembers,
} = require("../controllers/memberController");

router.post("/", createMember);
router.get("/", getMembers);

module.exports = router;
