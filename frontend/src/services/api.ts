import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export async function getPortfolio() {
  const response = await api.get("/api/portfolio/");
  return response.data;
}

export async function addStock(
  ticker: string,
  quantity: number,
  buyPrice: number
) {
  const response = await api.post("/api/portfolio/", {
    ticker,
    quantity,
    buy_price: buyPrice,
  });

  return response.data;
}

export async function deleteStock(id: number) {
  const response = await api.delete(`/api/portfolio/${id}`);
  return response.data;
}

export async function getStock(ticker: string) {
  const response = await api.get(`/api/stocks/${ticker}`);
  return response.data;
}

export async function getNews(ticker: string) {
  const response = await api.get(`/api/news/${ticker}`);
  return response.data;
}
export async function getAutomationStatus() {
  const response = await api.get(
    "/api/automation/"
  );

  return response.data;
}
export default api;