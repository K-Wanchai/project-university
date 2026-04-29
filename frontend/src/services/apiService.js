// src/services/apiService.js
import { ENDPOINTS } from '../config';

const handleJsonResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์'
    );
  }

  return data;
};

const apiService = {
  // ==========================================
  // 0. Authentication
  // ==========================================
  login: async ({ identifier, password }) => {
    const response = await fetch(ENDPOINTS.AUTH_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await handleJsonResponse(response);

    if (data?.token) {
      localStorage.setItem('token', data.token);
    }

    if (data?.username) {
      localStorage.setItem('username', data.username);
    }

    if (data?.role) {
      localStorage.setItem('role', data.role);
    }

    return data;
  },
  parentLogin: async ({ citizenId }) => {
  const response = await fetch(ENDPOINTS.AUTH_PARENT_LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ citizenId }),
  });

  const data = await handleJsonResponse(response);

  if (data?.studentId) {
    localStorage.setItem("studentId", data.studentId);
  }

  if (data?.studentName) {
    localStorage.setItem("studentName", data.studentName);
  }

  if (data?.role) {
    localStorage.setItem("role", data.role);
  } else {
    localStorage.setItem("role", "parent");
  }

  return data;
},

  register: async (userData) => {
    const response = await fetch(ENDPOINTS.AUTH_REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return handleJsonResponse(response);
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentName");
  },

  // ==========================================
  // 1. หมวดหมู่ผู้ใช้งาน (Users)
  // ==========================================
  getUsersCount: () =>
    fetch(ENDPOINTS.ADMIN_USERS_COUNT).then((res) => res.json()),

  getAllUsers: () =>
    fetch(ENDPOINTS.ADMIN_USERS).then((res) => res.json()),

  getUserById: (id) =>
    fetch(`${ENDPOINTS.ADMIN_USERS}/${id}`).then((res) => res.json()),

  createUser: (formData) =>
    fetch(ENDPOINTS.ADMIN_USERS, {
      method: 'POST',
      body: formData,
    }),

  updateUser: (id, formData) =>
    fetch(`${ENDPOINTS.ADMIN_USERS}/${id}`, {
      method: 'PUT',
      body: formData,
    }),

  deleteUser: (id) =>
    fetch(`${ENDPOINTS.ADMIN_USERS}/${id}`, {
      method: 'DELETE',
    }),

  // ==========================================
  // 2. หมวดหมู่คอร์สเรียน (Courses)
  // ==========================================
  getCourses: () =>
    fetch(ENDPOINTS.ADMIN_COURSES).then((res) => res.json()),

  getCourseById: (id) =>
    fetch(`${ENDPOINTS.ADMIN_COURSES}/${id}`).then((res) => res.json()),

  createCourse: (formData) =>
    fetch(ENDPOINTS.ADMIN_COURSES, {
      method: 'POST',
      body: formData,
    }),

  updateCourse: (id, formData) =>
    fetch(`${ENDPOINTS.ADMIN_COURSES}/${id}`, {
      method: 'PUT',
      body: formData,
    }),

  deleteCourse: (id) =>
    fetch(`${ENDPOINTS.ADMIN_COURSES}/${id}`, {
      method: 'DELETE',
    }).then((res) => res.json()),

  // ==========================================
  // 3. หมวดหมู่สถาบันจัดสอบ (Institutes)
  // ==========================================
  getInstitutes: () =>
    fetch(ENDPOINTS.ADMIN_INSTITUTES).then((res) => res.json()),

  // ==========================================
  // 4. หมวดหมู่สถานที่สอบ / Examination
  // ==========================================
  getExaminations: () =>
    fetch(ENDPOINTS.EXAMINATIONS).then((res) => res.json()),

  getExaminationById: (id) =>
    fetch(`${ENDPOINTS.EXAMINATIONS}/${id}`).then((res) => res.json()),

  createExamination: (formData) =>
    fetch(ENDPOINTS.EXAMINATIONS, {
      method: 'POST',
      body: formData,
    }),

  updateExamination: (id, formData) =>
    fetch(`${ENDPOINTS.EXAMINATIONS}/${id}`, {
      method: 'PUT',
      body: formData,
    }),

  deleteExamination: (id) =>
    fetch(`${ENDPOINTS.EXAMINATIONS}/${id}`, {
      method: 'DELETE',
    }),
};

export default apiService;