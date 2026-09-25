import { useEffect, useState } from "react";
import { getLiveMarketData } from "../services/marketService";

const Dashboard = () => {
  const [marketData, setMarketData] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Initial data from REST API
    const loadInitialData = async () => {
      try {
        const data = await getLiveMarketData();

        setMarketData({
          symbol: data.symbol,
          price: data.latestPrice,
          open: data.latestCandle.open,
          high: data.latestCandle.high,
          low: data.latestCandle.low,
          volume: data.latestCandle.volume,
          trades: data.latestCandle.trades,
        });
      } catch (error) {
        console.error("Failed to load market data:", error);
      }
    };

    loadInitialData();

    // Connect to Node WebSocket
    const socket = new WebSocket("ws://localhost:3000/ws/market");

    socket.onopen = () => {
      console.log("Connected to market WebSocket");
      setConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === "market_update") {
          const data = message.data;

          setMarketData({
            symbol: data.symbol,
            price: data.price,
            open: data.open,
            high: data.high,
            low: data.low,
            volume: data.volume,
            trades: data.trades,
          });
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnected(false);
    };

    socket.onclose = () => {
      console.log("Market WebSocket disconnected");
      setConnected(false);
    };

    // Cleanup when dashboard unmounts
    return () => {
      socket.close();
    };
  }, []);

  if (!marketData) {
    return <div>Loading market data...</div>;
  }

  return (
    <div>
      <h1>Crypto Intelligence Dashboard</h1>

      <p>WebSocket Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</p>

      <h2>{marketData.symbol}</h2>

      <h3>${marketData.price?.toLocaleString()}</h3>

      <p>Open: ${marketData.open?.toLocaleString()}</p>

      <p>High: ${marketData.high?.toLocaleString()}</p>

      <p>Low: ${marketData.low?.toLocaleString()}</p>

      <p>Volume: {marketData.volume?.toFixed(4)} BTC</p>

      <p>Trades: {marketData.trades?.toLocaleString()}</p>
    </div>
  );
};

export default Dashboard;
