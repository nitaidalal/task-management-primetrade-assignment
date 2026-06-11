import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Auth ─────────────────────────────────────────────

export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const logoutUser = () => api.post("/auth/logout");
export const getMe = () => api.get("/auth/me");

// ─── Tasks ────────────────────────────────────────────

export const createTask = (data) => api.post("/tasks", data);
export const getTasks = (params) => api.get("/tasks", { params }); // supports search, page, limit
export const getTask = (id) => api.get(`/tasks/${id}`);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// ─── Admin ────────────────────────────────────────────
export const getAdminTasks = (params) => api.get("/admin/tasks", { params });
export const getAdminUsers = () => api.get("/admin/users");

export default api;
