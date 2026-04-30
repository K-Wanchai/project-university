import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import apiService from "../../../services/apiService";
import "./Studentdata.css";

const DEFAULT_AVATAR =
  "https://api.dicebear.com/7.x/adventurer/svg?seed=student";

const fallbackStudent = {
  fullName: "ด.ช. ตั้งใจ เรียนดี",
  displayName: "น้องตั้งใจ เรียนดี",
  nickname: "น้องตั้งใจ",
  studentCode: "s400123",
  currentLevel: "ไทยคณิต ระดับ ม.3",
  birthday: "15 มกราคม 2558",
  age: 15,
  status: "นักเรียนปัจจุบัน",
  phone: "081-234-5784",
  parentName: "คุณแม่",
  email: "tangjai.r@email.com",
  address: "123 ถ.มิตรภาพ อ.เมือง จ.ขอนแก่น",
  avatar: DEFAULT_AVATAR,
};

const fallbackCourses = [
  {
    title: "ภาษาไทย",
    teacher: "ครูเมตรี ใจดี",
    schedule: "จันทร์ 17:00 - 18:30",
    progress: 86,
    status: "กำลังเรียน",
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "คณิตศาสตร์",
    teacher: "ครูวิชัย เก่งคณิต",
    schedule: "พุธ 18:00 - 19:30",
    progress: 74,
    status: "กำลังเรียน",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "ฟิสิกส์",
    teacher: "ครูมนตรี กลใจ",
    schedule: "เสาร์ 10:00 - 12:00",
    progress: 62,
    status: "กำลังเรียน",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80",
  },
];

function normalizeStudent(raw) {
  const data = raw?.data || raw?.student || raw || {};

  return {
    fullName:
      data.fullName ||
      data.full_name ||
      data.studentName ||
      fallbackStudent.fullName,

    displayName:
      data.displayName ||
      data.display_name ||
      data.studentName ||
      fallbackStudent.displayName,

    nickname:
      data.nickname ||
      data.nickName ||
      data.nick_name ||
      fallbackStudent.nickname,

    studentCode:
      data.studentCode ||
      data.student_code ||
      data.studentId ||
      data.student_id ||
      data.code ||
      fallbackStudent.studentCode,

    currentLevel:
      data.currentLevel ||
      data.current_level ||
      data.classLevel ||
      data.class_level ||
      data.grade ||
      data.level ||
      fallbackStudent.currentLevel,

    birthday:
      data.birthday ||
      data.birthDate ||
      data.birth_date ||
      data.dateOfBirth ||
      fallbackStudent.birthday,

    age: data.age || fallbackStudent.age,

    status:
      data.status ||
      data.studentStatus ||
      data.student_status ||
      fallbackStudent.status,

    phone:
      data.phone ||
      data.parentPhone ||
      data.parent_phone ||
      data.tel ||
      fallbackStudent.phone,

    parentName:
      data.parentName ||
      data.parent_name ||
      data.guardianName ||
      data.guardian_name ||
      fallbackStudent.parentName,

    email: data.email || fallbackStudent.email,

    address: data.address || fallbackStudent.address,

    avatar:
      data.avatar ||
      data.profileImage ||
      data.profile_image ||
      data.image ||
      DEFAULT_AVATAR,
  };
}

function normalizeCourses(raw) {
  const data = raw?.data || raw?.student || raw || {};
  const courses = data.courses || data.enrolledCourses || data.studentCourses;

  if (!Array.isArray(courses) || courses.length === 0) {
    return fallbackCourses;
  }

  return courses.map((course, index) => {
    const fallback = fallbackCourses[index % fallbackCourses.length];

    return {
      title:
        course.title ||
        course.courseName ||
        course.course_name ||
        course.name ||
        fallback.title,

      teacher:
        course.teacher ||
        course.teacherName ||
        course.teacher_name ||
        fallback.teacher,

      schedule:
        course.schedule ||
        course.studyTime ||
        course.study_time ||
        course.time ||
        fallback.schedule,

      progress: Number(
        course.progress ??
          course.percent ??
          course.attendancePercent ??
          fallback.progress
      ),

      status: course.status || fallback.status,

      image:
        course.image ||
        course.courseImage ||
        course.course_image ||
        fallback.image,
    };
  });
}

function Studentdata() {
  const navigate = useNavigate();

  const [studentRaw, setStudentRaw] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadStudentProfile = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await apiService.getStudentProfile();

        if (mounted) {
          setStudentRaw(data);
        }
      } catch (error) {
        if (mounted) {
          setErrorMessage(
            error.message ||
              "โหลดข้อมูลจริงไม่สำเร็จ ระบบจะแสดงข้อมูลตัวอย่างชั่วคราว"
          );
          setStudentRaw(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadStudentProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const student = useMemo(() => normalizeStudent(studentRaw), [studentRaw]);
  const courses = useMemo(() => normalizeCourses(studentRaw), [studentRaw]);

  const overview = useMemo(() => {
    const totalCourses = courses.length;

    const averageProgress =
      totalCourses > 0
        ? Math.round(
            courses.reduce(
              (sum, course) => sum + Number(course.progress || 0),
              0
            ) / totalCourses
          )
        : 0;

    return [
      {
        label: "คอร์สทั้งหมด",
        value: String(totalCourses),
        unit: "คอร์ส",
        icon: "📚",
        tone: "blue",
      },
      {
        label: "ความคืบหน้าเฉลี่ย",
        value: String(averageProgress),
        unit: "%",
        icon: "✅",
        tone: "green",
      },
      {
        label: "ชั่วโมงเรียนสะสม",
        value: studentRaw?.totalHours || studentRaw?.data?.totalHours || "70",
        unit: "ชม.",
        icon: "⏱️",
        tone: "purple",
      },
      {
        label: "งานที่ส่งแล้ว",
        value:
          studentRaw?.submittedTasks ||
          studentRaw?.data?.submittedTasks ||
          "12/15",
        unit: "งาน",
        icon: "📝",
        tone: "orange",
      },
    ];
  }, [courses, studentRaw]);

  const activities = [
    {
      icon: "📌",
      title: "ลงทะเบียนคอร์สเรียนล่าสุด",
      detail: courses[0]?.title || "ยังไม่มีข้อมูล",
      date: "ล่าสุด",
    },
    {
      icon: "✅",
      title: "สถานะนักเรียน",
      detail: student.status,
      date: "ข้อมูลจากระบบ",
    },
    {
      icon: "🎓",
      title: "ระดับชั้นปัจจุบัน",
      detail: student.currentLevel,
      date: "ข้อมูลจากฐานข้อมูล",
    },
  ];

  if (isLoading) {
    return (
      <Layout>
        <section className="studentdata-page">
          <div className="studentdata-loading-card">
            <div className="studentdata-loader" />
            <h2>กำลังโหลดข้อมูลนักเรียน...</h2>
            <p>กรุณารอสักครู่ ระบบกำลังดึงข้อมูลจากฐานข้อมูล</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="studentdata-page">
        {errorMessage && (
          <div className="studentdata-alert">
            <strong>โหลดข้อมูลจริงไม่สำเร็จ</strong>
            <span>{errorMessage}</span>
            <small>ระบบจะแสดงข้อมูลตัวอย่างชั่วคราว</small>
          </div>
        )}

        <div className="studentdata-page-header">
          <div>
            <p className="studentdata-eyebrow">Student Profile</p>
            <h1>ประวัตินักเรียน</h1>
            <span>ภาพรวมข้อมูลส่วนตัว การเรียน และสถานะล่าสุดของนักเรียน</span>
          </div>
        </div>

        <section className="studentdata-profile-card">
          <div className="studentdata-profile-top">
            <div className="studentdata-avatar-box">
              <img
                src={student.avatar || DEFAULT_AVATAR}
                alt={student.fullName}
              />
            </div>

            <div className="studentdata-profile-main">
              <div className="studentdata-profile-title-row">
                <div>
                  <span className="studentdata-status-pill">
                    <span className="studentdata-status-dot" />
                    {student.status}
                  </span>

                  <h2>{student.fullName}</h2>
                  <p>{student.currentLevel}</p>
                </div>

                <button
                  type="button"
                  className="studentdata-edit-profile-btn"
                  onClick={() => navigate("/student-profile/edit")}
                >
                  <span>✏️</span>
                  แก้ไขโปรไฟล์
                </button>
              </div>

              <div className="studentdata-profile-info-grid">
                <div className="studentdata-profile-info-item">
                  <span className="studentdata-info-icon">👤</span>
                  <div>
                    <small>ชื่อเล่น</small>
                    <strong>{student.nickname}</strong>
                  </div>
                </div>

                <div className="studentdata-profile-info-item">
                  <span className="studentdata-info-icon">🪪</span>
                  <div>
                    <small>รหัสนักเรียน</small>
                    <strong>{student.studentCode}</strong>
                  </div>
                </div>

                <div className="studentdata-profile-info-item">
                  <span className="studentdata-info-icon">🎓</span>
                  <div>
                    <small>ระดับชั้นปัจจุบัน</small>
                    <strong>{student.currentLevel}</strong>
                  </div>
                </div>

                <div className="studentdata-profile-info-item">
                  <span className="studentdata-info-icon">⭐</span>
                  <div>
                    <small>ชื่อที่แสดง</small>
                    <strong>{student.displayName}</strong>
                  </div>
                </div>

                <div className="studentdata-profile-info-item">
                  <span className="studentdata-info-icon">🎂</span>
                  <div>
                    <small>วันเดือนปีเกิด</small>
                    <strong>
                      {student.birthday} อายุ {student.age} ปี
                    </strong>
                  </div>
                </div>

                <div className="studentdata-profile-info-item">
                  <span className="studentdata-info-icon">🟢</span>
                  <div>
                    <small>สถานะนักเรียน</small>
                    <strong>{student.status}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="studentdata-overview-grid">
          {overview.map((item) => (
            <article
              className={`studentdata-overview-card ${item.tone}`}
              key={item.label}
            >
              <div className="studentdata-overview-icon">{item.icon}</div>

              <div>
                <strong>
                  {item.value}
                  <span>{item.unit}</span>
                </strong>
                <p>{item.label}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="studentdata-main-grid">
          <article className="studentdata-card">
            <div className="studentdata-card-header">
              <div>
                <p>Contact</p>
                <h2>ข้อมูลการติดต่อ</h2>
              </div>

              <span className="studentdata-card-icon">📞</span>
            </div>

            <div className="studentdata-contact-list">
              <div className="studentdata-contact-row">
                <span>📱</span>
                <div>
                  <small>เบอร์โทรผู้ปกครอง</small>
                  <strong>{student.phone}</strong>
                  <p>{student.parentName}</p>
                </div>
              </div>

              <div className="studentdata-contact-row">
                <span>✉️</span>
                <div>
                  <small>อีเมล</small>
                  <strong>{student.email}</strong>
                </div>
              </div>

              <div className="studentdata-contact-row">
                <span>📍</span>
                <div>
                  <small>ที่อยู่</small>
                  <strong>{student.address}</strong>
                </div>
              </div>
            </div>
          </article>

          <article className="studentdata-card">
            <div className="studentdata-card-header">
              <div>
                <p>Activity</p>
                <h2>กิจกรรมล่าสุด</h2>
              </div>

              <span className="studentdata-card-icon">⚡</span>
            </div>

            <div className="studentdata-activity-list">
              {activities.map((item) => (
                <div className="studentdata-activity-item" key={item.title}>
                  <div className="studentdata-activity-icon">{item.icon}</div>

                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                    <small>{item.date}</small>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="studentdata-card studentdata-course-section">
          <div className="studentdata-card-header">
            <div>
              <p>Learning Progress</p>
              <h2>คอร์สเรียนของนักเรียน</h2>
            </div>

            <span className="studentdata-card-icon">📈</span>
          </div>

          <div className="studentdata-course-list">
            {courses.map((course) => (
              <article className="studentdata-course-item" key={course.title}>
                <div className="studentdata-course-image">
                  <img src={course.image} alt={course.title} />
                </div>

                <div className="studentdata-course-info">
                  <h3>{course.title}</h3>
                  <p>{course.teacher}</p>
                  <small>{course.schedule}</small>
                </div>

                <div className="studentdata-course-progress">
                  <div className="studentdata-course-meta">
                    <span>{course.status}</span>
                    <strong>{course.progress}%</strong>
                  </div>

                  <div className="studentdata-progress-bar">
                    <div style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </Layout>
  );
}

export default Studentdata;