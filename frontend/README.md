# 🎓 ระบบจัดการโรงเรียนกวดวิชา (Tutor School Management System)

โปรเจคระบบจัดการโรงเรียนกวดวิชาแบบครบวงจร พัฒนาขึ้นเพื่อช่วยอำนวยความสะดวกในการบริหารจัดการข้อมูลนักเรียน คอร์สเรียน การชำระเงิน และการติดตามผลการเรียน โดยแบ่งการทำงานออกเป็นระบบ Frontend และ Backend อย่างชัดเจน

---

## 🚀 เทคโนโลยีที่ใช้ (Tech Stack)

### Frontend (User Interface)
* **Framework:** React.js (สร้างด้วย Vite + TypeScript)
* **Routing:** React Router DOM
* **HTTP Client:** Axios
* **Form & Validation:** React Hook Form + Yup

### Backend (RESTful API)
* **Framework:** Java Spring Boot
* **Security:** Spring Security (JWT Authentication)
* **Database Access:** Spring Data JPA
* **Database:** MySQL
* **Tools:** Lombok

git : https://github.com/K-Wanchai/project-university.git

## 🗺️ การจับคู่ Process กับโครงสร้างไฟล์ (File & Module Mapping)

เพื่อความสะดวกในการแบ่งงานและค้นหาโค้ด ระบบได้จับคู่การทำงาน 14 ขั้นตอน ไว้ในโครงสร้างโฟลเดอร์ดังนี้

### 💻 ฝั่ง Frontend (React.js)
ไฟล์ทั้งหมดจะอยู่ในโฟลเดอร์ `frontend/src/pages/` โดยแบ่งตามกลุ่มผู้ใช้งาน (Role)

| Process ที่ | ชื่อฟังก์ชันการทำงาน | กลุ่มผู้ใช้งาน | ตำแหน่งไฟล์ (Path) |
| :---: | :--- | :--- | :--- |
| **1, 2** | สมัครสมาชิก & ล็อคอิน | ผู้ใช้ทั่วไป | `Auth/Register.tsx`, `Auth/Login.tsx` |
| **3** | จัดการข้อมูลพื้นฐาน | Admin | `Admin/MasterData.tsx` |
| **4** | จัดคอร์สเรียน | Admin | `Admin/CourseManage.tsx` |
| **5** | สมัครเรียน | Student | `Student/Enrollment.tsx` |
| **6** | แจ้งชำระเงิน | Student | `Student/PaymentSubmit.tsx` |
| **7** | ยืนยันการชำระเงิน | Admin | `Admin/PaymentVerify.tsx` |
| **8** | สร้างตารางการสอบย่อย | Teacher | `Teacher/ExamSchedule.tsx` |
| **9** | บันทึกการเข้าเรียน | Teacher | `Teacher/AttendanceRecord.tsx` |
| **10** | บันทึกผลการสอบย่อย | Teacher | `Teacher/ExamScore.tsx` |
| **11** | ประเมินความพึงพอใจ | Student | `Student/CourseEvaluation.tsx` |
| **12** | บันทึกสถิติการสอบเข้า | Teacher | `Teacher/AdmissionStats.tsx` |
| **13** | ติดตามการเข้าเรียน | Admin | `Admin/AttendanceMonitor.tsx` |
| **14** | รายงานและสถิติ | Admin | `Admin/DashboardReport.tsx` |

---

### ⚙️ ฝั่ง Backend (Spring Boot)
ไฟล์จะอยู่ใน `backend/src/main/java/com/tutorschool/backend/` แบ่งตามโมดูลข้อมูล โดยแต่ละโมดูลจะมี 3 ส่วนประกอบหลักคือ Controller, Service และ Repository

| Process ที่ | หมวดหมู่ (Module) | ไฟล์หลัก (Controller / Service) |
| :---: | :--- | :--- |
| **1, 2** | Authentication | `AuthController.java`, `AuthService.java` |
| **3** | User Management | `UserController.java`, `UserService.java` |
| **3, 4** | Course Management | `CourseController.java`, `CourseService.java` |
| **5** | Enrollment | `EnrollmentController.java`, `EnrollmentService.java` |
| **6, 7** | Payment | `PaymentController.java`, `PaymentService.java` |
| **8, 10** | Exam & Grading | `ExamController.java`, `ExamService.java` |
| **9, 13** | Attendance | `AttendanceController.java`, `AttendanceService.java` |
| **11** | Evaluation | `EvaluationController.java`, `EvaluationService.java` |
| **12** | Admission Stats | `StatisticController.java`, `StatisticService.java` |
| **14** | Dashboard & Report | `ReportController.java`, `ReportService.java` |