const {
  getLatestCandles,
} = require("../services/binanceService");

const getLiveMarketData = (req, res) => {
  const candles = getLatestCandles();

  if (candles.length === 0) {
    return res.status(503).json({
      success: false,
      message: "Market data is not available yet",
    });
  }

  const latestCandle = candles[candles.length - 1];

  res.json({
    success: true,
    symbol: latestCandle.symbol,
    latestPrice: latestCandle.close,
    latestCandle,
    candles,
  });
};

module.exports = {
  getLiveMarketData,
};