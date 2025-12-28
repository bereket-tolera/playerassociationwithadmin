import axiosClient from "./axiosClient";

export const InsightService = {
  getAll: () => axiosClient.get("/insights"),
  
  getById: (id: number) => axiosClient.get(`/insights/${id}`),
  
  create: (data: FormData) => 
    axiosClient.post("/insights", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  
  update: (id: number, data: FormData) => 
    axiosClient.put(`/insights/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  
  delete: (id: number) => axiosClient.delete(`/insights/${id}`)
};