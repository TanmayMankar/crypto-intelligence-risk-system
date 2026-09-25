const WebSocket = require("ws");

let wss;

function initializeMarketSocket(server) {
  wss = new WebSocket.Server({
    server,
    path: "/ws/market",
  });

  console.log("Market WebSocket server initialized");

  wss.on("connection", (client) => {
    console.log("React client connected to market WebSocket");

    client.send(
      JSON.stringify({
        type: "connection",
        message: "Connected to market stream",
      })
    );

    client.on("close", () => {
      console.log("React client disconnected");
    });
  });
}

function broadcastMarketUpdate(data) {
  if (!wss) return;

  const message = JSON.stringify({
    type: "market_update",
    data,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

module.exports = {
  initializeMarketSocket,
  broadcastMarketUpdate,
};