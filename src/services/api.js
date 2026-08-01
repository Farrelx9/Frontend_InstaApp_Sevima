import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

// Attach token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => api.post("/register", data);
export const login = (data) => api.post("/login", data);
export const logout = () => api.post("/logout");
export const getUser = () => api.get("/user");

// Posts
export const getPosts = (page = 1) => api.get(`/posts?page=${page}`);
export const getPost = (id) => api.get(`/posts/${id}`);
export const createPost = (data) =>
  api.post("/posts", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deletePost = (id) => api.delete(`/posts/${id}`);

// Posts by User
export const getUserPosts = (userId) => api.get(`/users/${userId}/posts`);

// Comments
export const getComments = (postId) => api.get(`/posts/${postId}/comments`);
export const createComment = (postId, data) =>
  api.post(`/posts/${postId}/comments`, data);
export const deleteComment = (commentId) =>
  api.delete(`/comments/${commentId}`);
export const updateComment = (commentId, body) =>
  api.put(`/comments/${commentId}`, { body });

// Likes
export const toggleLike = (postId) => api.post(`/posts/${postId}/like`);

export default api;
