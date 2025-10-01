import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // ändra till din serveradress
});

// Lägg till token automatiskt
/*api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && token !== "null") {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
*/
export default api;
