const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getGlobalProgress,
  getApplicationProgress,
} = require("../controllers/progressController");

const router = express.Router();

router.get("/global", protect, getGlobalProgress);

router.get("/application/:id", protect, getApplicationProgress);

module.exports = router;
