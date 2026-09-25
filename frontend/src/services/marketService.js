const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getLiveMarketData = async () => {
  const response = await fetch(
    `${API_URL}/api/market/live`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch market data");
  }

  return response.json();
};