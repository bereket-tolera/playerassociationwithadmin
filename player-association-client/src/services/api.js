import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:5121/api", // change to your API base URL
});

export default api;
