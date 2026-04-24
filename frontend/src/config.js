// src/config.js

// 1. กำหนด SERVER_URL หลัก
export const SERVER_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// 2. นำ SERVER_URL มาต่อท้ายด้วย /api
export const API_BASE_URL = `${SERVER_URL}/api`;

// 3. รวมเส้นทาง (Endpoints) ทั้งหมดไว้ที่นี่
export const ENDPOINTS = {
    ADMIN_USERS: `${API_BASE_URL}/admin/users`,
    ADMIN_USERS_COUNT: `${API_BASE_URL}/admin/users/count`,
    ADMIN_COURSES: `${API_BASE_URL}/admin/courses`,
    ADMIN_INSTITUTES: `${API_BASE_URL}/admin/institutes`,
    EXAMINATIONS: `${API_BASE_URL}/examinations`,
};