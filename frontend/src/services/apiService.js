// src/services/apiService.js
import { ENDPOINTS } from "../config";

const handleJsonResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์"
    );
  }

  return data;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const apiService = {
  // ==========================================
  // 0. Authentication
  // ==========================================

  login: async ({ identifier, password }) => {
    const response = await fetch(ENDPOINTS.AUTH_LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await handleJsonResponse(response);

    if (data?.token) {
      localStorage.setItem("token", data.token);
    }

    if (data?.username) {
      localStorage.setItem("username", data.username);
    }

    if (data?.role) {
      localStorage.setItem("role", data.role);
    }

    if (data?.studentId) {
      localStorage.setItem("studentId", data.studentId);
    }

    if (data?.studentName) {
      localStorage.setItem("studentName", data.studentName);
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

    if (data?.token) {
      localStorage.setItem("token", data.token);
    }

    if (data?.studentId) {
      localStorage.setItem("studentId", data.studentId);
    }

    if (data?.studentName) {
      localStorage.setItem("studentName", data.studentName);
    }

    if (data?.username) {
      localStorage.setItem("username", data.username);
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    return handleJsonResponse(response);
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentName");
  },

  // ==========================================
  // 1. หมวดหมู่ผู้ใช้งาน (Users)
  // ==========================================

  getUsersCount: async () => {
    const response = await fetch(ENDPOINTS.ADMIN_USERS_COUNT, {
      headers: getAuthHeaders(),
    });

    return handleJsonResponse(response);
  },

  getAllUsers: async () => {
    const response = await fetch(ENDPOINTS.ADMIN_USERS, {
      headers: getAuthHeaders(),
    });

    return handleJsonResponse(response);
  },

  getUserById: async (id) => {
    const response = await fetch(`${ENDPOINTS.ADMIN_USERS}/${id}`, {
      headers: getAuthHeaders(),
    });

    return handleJsonResponse(response);
  },

  createUser: async (formData) => {
    const token = localStorage.getItem("token");

    const response = await fetch(ENDPOINTS.ADMIN_USERS, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    return handleJsonResponse(response);
  },

  updateUser: async (id, formData) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${ENDPOINTS.ADMIN_USERS}/${id}`, {
      method: "PUT",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    return handleJsonResponse(response);
  },

  deleteUser: async (id) => {
    const response = await fetch(`${ENDPOINTS.ADMIN_USERS}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    return handleJsonResponse(response);
  },

  // ==========================================
  // 2. หมวดหมู่คอร์สเรียน (Courses)
  // ==========================================

  getCourses: async () => {
    const response = await fetch(ENDPOINTS.ADMIN_COURSES, {
      headers: getAuthHeaders(),
    });

    return handleJsonResponse(response);
  },

  getCourseById: async (id) => {
    const response = await fetch(`${ENDPOINTS.ADMIN_COURSES}/${id}`, {
      headers: getAuthHeaders(),
    });

    return handleJsonResponse(response);
  },

  createCourse: async (formData) => {
    const token = localStorage.getItem("token");

    const response = await fetch(ENDPOINTS.ADMIN_COURSES, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    return handleJsonResponse(response);
  },

  updateCourse: async (id, formData) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${ENDPOINTS.ADMIN_COURSES}/${id}`, {
      method: "PUT",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    return handleJsonResponse(response);
  },

  deleteCourse: async (id) => {
    const response = await fetch(`${ENDPOINTS.ADMIN_COURSES}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    return handleJsonResponse(response);
  },

  // ==========================================
  // 3. หมวดหมู่สถาบันจัดสอบ (Institutes)
  // ==========================================

  getInstitutes: async () => {
    const response = await fetch(ENDPOINTS.ADMIN_INSTITUTES, {
      headers: getAuthHeaders(),
    });

    return handleJsonResponse(response);
  },

  // ==========================================
  // 4. หมวดหมู่สถานที่สอบ / Examination
  // ==========================================

  getExaminations: async () => {
    const response = await fetch(ENDPOINTS.EXAMINATIONS, {
      headers: getAuthHeaders(),
    });

    return handleJsonResponse(response);
  },

  getExaminationById: async (id) => {
    const response = await fetch(`${ENDPOINTS.EXAMINATIONS}/${id}`, {
      headers: getAuthHeaders(),
    });

    return handleJsonResponse(response);
  },

  createExamination: async (formData) => {
    const token = localStorage.getItem("token");

    const response = await fetch(ENDPOINTS.EXAMINATIONS, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    return handleJsonResponse(response);
  },

  updateExamination: async (id, formData) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${ENDPOINTS.EXAMINATIONS}/${id}`, {
      method: "PUT",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    return handleJsonResponse(response);
  },

  deleteExamination: async (id) => {
    const response = await fetch(`${ENDPOINTS.EXAMINATIONS}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    return handleJsonResponse(response);
  },

  // ==========================================
  // 5. ข้อมูลนักเรียน / Student Profile
  // ==========================================

  getStudentProfile: async () => {
    const studentId = localStorage.getItem("studentId");

    if (!studentId) {
      throw new Error("ไม่พบรหัสนักเรียน กรุณาเข้าสู่ระบบใหม่");
    }

    const response = await fetch(`${ENDPOINTS.STUDENT_BY_ID}/${studentId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    return handleJsonResponse(response);
  },

  getStudentById: async (studentId) => {
    if (!studentId) {
      throw new Error("ไม่พบรหัสนักเรียน");
    }

    const response = await fetch(`${ENDPOINTS.STUDENT_BY_ID}/${studentId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    return handleJsonResponse(response);
  },

  updateStudentProfile: async (studentId, payload) => {
    if (!studentId) {
      throw new Error("ไม่พบรหัสนักเรียน");
    }

    const response = await fetch(`${ENDPOINTS.STUDENT_BY_ID}/${studentId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    return handleJsonResponse(response);
  },
};

export default apiService;