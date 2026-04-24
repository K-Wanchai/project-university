// src/services/apiService.js
import { ENDPOINTS } from '../config';

const apiService = {
    // ==========================================
    // 1. หมวดหมู่ผู้ใช้งาน (Users)
    // ==========================================
    getUsersCount: () => fetch(ENDPOINTS.ADMIN_USERS_COUNT).then(res => res.json()),
    getAllUsers: () => fetch(ENDPOINTS.ADMIN_USERS).then(res => res.json()),
    getUserById: (id) => fetch(`${ENDPOINTS.ADMIN_USERS}/${id}`).then(res => res.json()),
    createUser: (formData) => fetch(ENDPOINTS.ADMIN_USERS, { method: 'POST', body: formData }),
    updateUser: (id, formData) => fetch(`${ENDPOINTS.ADMIN_USERS}/${id}`, { method: 'PUT', body: formData }),
    deleteUser: (id) => fetch(`${ENDPOINTS.ADMIN_USERS}/${id}`, { method: 'DELETE' }),

    // ==========================================
    // 2. หมวดหมู่คอร์สเรียน (Courses)
    // ==========================================
    getCourses: () => fetch(ENDPOINTS.ADMIN_COURSES).then(res => res.json()),
    getCourseById: (id) => fetch(`${ENDPOINTS.ADMIN_COURSES}/${id}`).then(res => res.json()),
    createCourse: (formData) => fetch(ENDPOINTS.ADMIN_COURSES, { method: 'POST', body: formData }), // 🌟 บรรทัดนี้แหละครับที่หายไป!
    updateCourse: (id, formData) => fetch(`${ENDPOINTS.ADMIN_COURSES}/${id}`, { method: 'PUT', body: formData }),
    deleteCourse: (id) => fetch(`${ENDPOINTS.ADMIN_COURSES}/${id}`, { method: 'DELETE' }).then(res => res.json()),

    // ==========================================
    // 3. หมวดหมู่สถาบันจัดสอบ (Institutes)
    getInstitutes: () => fetch(ENDPOINTS.ADMIN_INSTITUTES).then(res => res.json()),
    // ==========================================
    getExaminations: () => fetch(ENDPOINTS.EXAMINATIONS).then(res => res.json()),
    getExaminationById: (id) => fetch(`${ENDPOINTS.EXAMINATIONS}/${id}`).then(res => res.json()),
    createExamination: (formData) => fetch(ENDPOINTS.EXAMINATIONS, { method: 'POST', body: formData }),
    updateExamination: (id, formData) => fetch(`${ENDPOINTS.EXAMINATIONS}/${id}`, { method: 'PUT', body: formData }),
    deleteExamination: (id) => fetch(`${ENDPOINTS.EXAMINATIONS}/${id}`, { method: 'DELETE' }),
};

export default apiService;