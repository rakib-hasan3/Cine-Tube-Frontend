import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

// প্রতিবার রিকোয়েস্ট পাঠানোর সময় টোকেন সাথে নিয়ে যাবে
axiosInstance.interceptors.request.use((config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized! Token is missing or invalid.");
            // টোকেন ইনভ্যালিড হলে লোকাল স্টোরেজ ক্লিয়ার করতে পারেন
            // localStorage.removeItem("accessToken");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;