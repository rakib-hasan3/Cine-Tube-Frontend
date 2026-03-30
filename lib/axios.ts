import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api/v1", // একদম ক্লিন ইউআরএল
});

// প্রতিবার রিকোয়েস্ট পাঠানোর সময় টোকেন সাথে নিয়ে যাবে
axiosInstance.interceptors.request.use((config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;