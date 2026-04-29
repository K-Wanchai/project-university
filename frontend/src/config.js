// src/config.js

export const SERVER_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const API_BASE_URL = `${SERVER_URL}/api`;

export const ENDPOINTS = {
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_REGISTER: `${API_BASE_URL}/auth/register`,
   AUTH_PARENT_LOGIN: `${API_BASE_URL}/auth/parentlogin`,

  ADMIN_USERS: `${API_BASE_URL}/admin/users`,
  ADMIN_USERS_COUNT: `${API_BASE_URL}/admin/users/count`,

  ADMIN_COURSES: `${API_BASE_URL}/admin/courses`,

  ADMIN_INSTITUTES: `${API_BASE_URL}/admin/institutes`,

  EXAMINATIONS: `${API_BASE_URL}/examinations`,
};