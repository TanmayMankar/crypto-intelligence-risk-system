const WebSocket = require("ws");

const {
  broadcastMarketUpdate,
} = require("./marketSocket");

const BINANCE_WS_URL =
  "wss://stream.binance.com:9443/ws/btcusdt@kline_1m";

const BINANCE_REST_URL =
  "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=120";

const candleBuffer = [];

let ws;

function normalizeCandle(kline) {
  return {
    symbol: kline.s,
    openTime: new Date(kline.t),
    closeTime: new Date(kline.T),

    open: Number(kline.o),
    high: Number(kline.h),
    low: Number(kline.l),
    close: Number(kline.c),

    volume: Number(kline.v),
    quoteVolume: Number(kline.q),

    trades: Number(kline.n),

    takerBuyBaseVolume: Number(kline.V),
    takerBuyQuoteVolume: Number(kline.Q),

    isClosed: kline.x,
  };
}

function normalizeHistoricalCandle(kline) {
  return {
    symbol: "BTCUSDT",
    openTime: new Date(kline[0]),
    closeTime: new Date(kline[6]),

    open: Number(kline[1]),
    high: Number(kline[2]),
    low: Number(kline[3]),
    close: Number(kline[4]),

    volume: Number(kline[5]),
    quoteVolume: Number(kline[7]),

    trades: Number(kline[8]),

    takerBuyBaseVolume: Number(kline[9]),
    takerBuyQuoteVolume: Number(kline[10]),

    isClosed: true,
  };
}

async function loadHistoricalCandles() {
  try {
    console.log("Loading latest 60 BTCUSDT candles...");

    const response = await fetch(BINANCE_REST_URL);

    if (!response.ok) {
      throw new Error(
        `Binance REST API returned ${response.status}`
      );
    }

    const data = await response.json();

    candleBuffer.length = 0;

    for (const kline of data) {
      candleBuffer.push(normalizeHistoricalCandle(kline));
    }

    console.log(
      `Loaded ${candleBuffer.length} historical candles`
    );
  } catch (error) {
    console.error(
      "Failed to load historical candles:",
      error.message
    );
  }
}

function addClosedCandle(candle) {
  const lastCandle = candleBuffer[candleBuffer.length - 1];

  // Prevent duplicate candles
  if (
    lastCandle &&
    lastCandle.openTime.getTime() === candle.openTime.getTime()
  ) {
    candleBuffer[candleBuffer.length - 1] = candle;
    return;
  }

  candleBuffer.push(candle);

  // Keep only latest 60 candles
  if (candleBuffer.length > 120) {
    candleBuffer.shift();
  }
}

function startBinanceStream() {
  ws = new WebSocket(BINANCE_WS_URL);

  ws.on("open", () => {
    console.log("Connected to Binance WebSocket");
  });

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);

      const kline = message.k;

      if (!kline) {
        return;
      }

      const candle = normalizeCandle(kline);

      // Send live Binance data to React
      broadcastMarketUpdate({
        symbol: candle.symbol,
        price: candle.close,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        volume: candle.volume,
        trades: candle.trades,
        timestamp: new Date(),
        isClosed: candle.isClosed,
      });

      // Only add completed candles to the ML buffer
      if (candle.isClosed) {
        addClosedCandle(candle);

        console.log(
          `Closed candle: ${candle.openTime.toISOString()} | ` +
          `Close: ${candle.close} | ` +
          `Buffer: ${candleBuffer.length}/120`
        );
      }
    } catch (error) {
      console.error(
        "Error processing Binance message:",
        error.message
      );
    }
  });

  ws.on("error", (error) => {
    console.error(
      "Binance WebSocket error:",
      error.message
    );
  });

  ws.on("close", () => {
    console.log("Binance WebSocket connection closed");
  });
}

async function initializeBinance() {
  await loadHistoricalCandles();
  startBinanceStream();
}

function getLatestCandles() {
  return [...candleBuffer];
}

module.exports = {
  initializeBinance,
  getLatestCandles,
};