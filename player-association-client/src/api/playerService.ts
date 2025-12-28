import axiosClient from "./axiosClient";

export const PlayerService = {
  getAll: () => axiosClient.get("/players"),
  
  getById: (id: number) => axiosClient.get(`/players/${id}`),
  
  create: (data: FormData) => 
    axiosClient.post("/players", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  
  update: (id: number, data: FormData) => 
    axiosClient.put(`/players/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  
  delete: (id: number) => axiosClient.delete(`/players/${id}`)
};