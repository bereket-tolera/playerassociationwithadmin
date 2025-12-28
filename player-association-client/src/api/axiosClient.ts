import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5121/api",
  headers: {
    "Accept": "application/json",
  },
});

// Add request interceptor to attach token
axiosClient.interceptors.request.use(
  (config) => {
    // Debug logging
    console.log("Request:", config.method?.toUpperCase(), config.url);
    
    // Log FormData contents for POST/PUT requests
    if (config.data instanceof FormData && (config.method === 'post' || config.method === 'put')) {
      const formData = config.data as FormData;
      console.log("FormData contents:");
      const entries = formData.entries();
      let entry = entries.next();
      while (!entry.done) {
        const [key, value] = entry.value;
        console.log(key + ':', value instanceof File ? value.name + ' (file)' : value);
        entry = entries.next();
      }
    }
    
    // Attach authorization token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token attached to request");
    }
    
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging and auth handling
axiosClient.interceptors.response.use(
  (response) => {
    console.log("Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("Response error:", error.response?.status, error.config?.url);
    console.error("Error details:", error.response?.data);
    
    // Handle 401 Unauthorized errors (token expired/invalid)
    if (error.response?.status === 401) {
      console.log("Authentication failed, clearing token");
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      
      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;