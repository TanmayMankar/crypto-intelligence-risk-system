const express = require("express");

const {
  getLiveMarketData,
} = require("../controllers/marketController");

const router = express.Router();

router.get("/live", getLiveMarketData);

module.exports = router;