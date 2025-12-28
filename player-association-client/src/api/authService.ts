import axiosClient from "./axiosClient";

export const AuthService = {
  login: (username: string, password: string) => 
    axiosClient.post("/auth/login", { username, password }),
  
  verifyToken: () => 
    axiosClient.post("/auth/verify", {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }),
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/';
  }
};