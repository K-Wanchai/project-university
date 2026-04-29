import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";
import Sidebar from "../components/Sidebar";

function Homepage() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth > 900;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const userName = localStorage.getItem("username") || "น้องตั้งใจ";
  const role = localStorage.getItem("role") || "student";

  const courses = [
    {
      id: 1,
      title: "ภาษาไทย",
      teacher: "ครูเมตรี ใจดี",
      hours: 20,
      image:
        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80",
      path: "/my-courses",
      accent: "orange",
    },
    {
      id: 2,
      title: "คณิตศาสตร์",
      teacher: "ครูวิชัย เก่งคณิต",
      hours: 30,
      image:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80",
      path: "/my-courses",
      accent: "blue",
    },
    {
      id: 3,
      title: "ฟิสิกส์",
      teacher: "คุณครูมนตรี กลใจ",
      hours: 20,
      image:
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80",
      path: "/my-courses",
      accent: "purple",
    },
  ];

  const quickMenus = [
    {
      title: "ลงทะเบียนเรียน",
      text: "เลือกคอร์สเรียนใหม่",
      icon: "📝",
      path: "/register-course",
    },
    {
      title: "ตารางเรียน",
      text: "ดูวันและเวลาเรียน",
      icon: "📅",
      path: "/schedule",
    },
    {
      title: "ใบแจ้งชำระเงิน",
      text: "ตรวจสอบค่าใช้จ่าย",
      icon: "💳",
      path: "/payment-notice",
    },
    {
      title: "ผลการศึกษา",
      text: "ดูคะแนนและผลเรียน",
      icon: "📊",
      path: "/study-result",
    },
  ];

  const announcements = [
    "ติวสดฟรี! เตรียมสอบเข้า มทร.ขอนแก่น เสาร์นี้",
    "เปิดคอร์สใหม่: ฟิสิกส์ กลศาสตร์ สำหรับมัธยมปลาย",
    "อย่าลืมตรวจสอบตารางเรียนประจำสัปดาห์",
  ];

  return (
    <div className={`homepage ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <Sidebar
        collapsed={!sidebarOpen}
        onMobileOpen={() => setSidebarOpen(true)}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && window.innerWidth <= 900 && (
        <button
          type="button"
          className="homepage-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="ปิดเมนู"
        />
      )}

      <main className="homepage-main">
        <section className="homepage-hero">
          <div className="hero-profile">
            <div className="hero-avatar">
              <img
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=student"
                alt="student avatar"
              />
            </div>

            <div className="hero-content">
              <p className="hero-kicker">ยินดีต้อนรับกลับมา</p>

              <h1>
                สวัสดี, {userName} <span>เรียนดี</span>
              </h1>

              <p className="hero-subtitle">
                ความพยายามอยู่ที่ไหน ความสำเร็จอยู่ที่นั่น
              </p>
            </div>
          </div>

          <div className="hero-status-card">
            <span className="status-label">สถานะผู้ใช้งาน</span>
            <strong>{role === "student" ? "นักเรียน" : role}</strong>
          </div>
        </section>

        <section className="quick-section">
          <div className="section-header">
            <div>
              <p className="section-kicker">เมนูลัด</p>
              <h2>จัดการข้อมูลการเรียน</h2>
            </div>
          </div>

          <div className="quick-grid">
            {quickMenus.map((item) => (
              <Link to={item.path} className="quick-card" key={item.title}>
                <div className="quick-icon">{item.icon}</div>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="course-section">
          <div className="section-header">
            <div>
              <p className="section-kicker">Recommended Courses</p>
              <h2>คอร์สเรียนแนะนำสำหรับคุณ</h2>
            </div>

            <Link to="/register-course" className="view-all-link">
              ดูคอร์สทั้งหมด
            </Link>
          </div>

          <div className="course-grid">
            {courses.map((course) => (
              <article className={`course-card ${course.accent}`} key={course.id}>
                <div className="course-image">
                  <img src={course.image} alt={course.title} />
                </div>

                <div className="course-body">
                  <h3>{course.title}</h3>

                  <p className="course-teacher">
                    <span>👨‍🏫</span>
                    {course.teacher}
                  </p>

                  <p className="course-hours">
                    <span>⏱</span>
                    {course.hours} ชั่วโมงที่เรียน
                  </p>

                  <Link to={course.path} className="course-button">
                    ดูรายละเอียด
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bottom-section">
          <div className="announcement-card">
            <div className="announcement-header">
              <span>📢</span>
              <h2>กิจกรรมและข่าวสาร</h2>
            </div>

            <ul>
              {announcements.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>

          <div className="progress-card">
            <div>
              <p className="section-kicker">Learning Progress</p>
              <h2>ภาพรวมการเรียน</h2>
            </div>

            <div className="progress-list">
              <div className="progress-item">
                <span>เข้าเรียน</span>
                <strong>86%</strong>
              </div>

              <div className="progress-bar">
                <div style={{ width: "86%" }} />
              </div>

              <div className="progress-item">
                <span>งานที่ส่งแล้ว</span>
                <strong>12/15</strong>
              </div>

              <div className="progress-bar">
                <div style={{ width: "80%" }} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Homepage;