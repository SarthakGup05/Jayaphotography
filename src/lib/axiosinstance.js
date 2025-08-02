import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "https://oriera-admin.onrender.com/api/v1",
  withCredentials: true
})

// Add token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosInstance
