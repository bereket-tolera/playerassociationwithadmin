import axiosClient from "./axiosClient";

export const InsightService = {
  getAll: () => axiosClient.get("/insights"),
  getById: (id: number) => axiosClient.get(`/insights/${id}`),
  create: (data: any) => axiosClient.post("/insights", data),
  update: (id: number, data: any) => axiosClient.put(`/insights/${id}`, data),
  delete: (id: number) => axiosClient.delete(`/insights/${id}`)
};
