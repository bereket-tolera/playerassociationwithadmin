import axiosClient from "./axiosClient";

export const EventService = {
  getAll: () => axiosClient.get("/events"),
  
  getById: (id: number) => axiosClient.get(`/events/${id}`),
  
  create: (data: FormData) => 
    axiosClient.post("/events", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  
  update: (id: number, data: FormData) => 
    axiosClient.put(`/events/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  
  delete: (id: number) => axiosClient.delete(`/events/${id}`)
};