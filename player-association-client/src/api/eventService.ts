import axiosClient from "./axiosClient";

export const EventService = {
  getAll: () => axiosClient.get("/events"),
  getById: (id: number) => axiosClient.get(`/events/${id}`),
  create: (data: any) => axiosClient.post("/events", data),
  update: (id: number, data: any) => axiosClient.put(`/events/${id}`, data),
  delete: (id: number) => axiosClient.delete(`/events/${id}`)
};
