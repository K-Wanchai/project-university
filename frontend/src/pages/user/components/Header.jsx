import React from "react";
import "./Header.css";

function Header({
  title = "แดชบอร์ด",
  subtitle = "ระบบจัดการข้อมูลครูปุ๊ก ติวเตอร์",
  userName,
  role,
  avatarText,
  notificationCount = 0,
  onMenuClick,
}) {
  const displayName =
    userName ||
    localStorage.getItem("studentName") ||
    localStorage.getItem("username") ||
    "ผู้ใช้งาน";

  const displayRole =
    role ||
    (localStorage.getItem("role") === "student" ? "Student" : "User");

  const displayAvatar =
    avatarText ||
    displayName
      .trim()
      .slice(0, 2)
      .toUpperCase();

  const todayText = new Date().toLocaleDateString("th-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="app-header">
      <div className="header-glow" />

      <div className="header-left">
        <button
          type="button"
          className="header-menu-btn"
          onClick={onMenuClick}
          aria-label="เปิดเมนู"
        >
          <i className="fas fa-bars" />
        </button>

        <div className="header-title-box">
          <div className="header-kicker">
            <span className="header-kicker-dot" />
            Student Console
          </div>

          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="header-right">
        <div className="header-date-card">
          <i className="far fa-calendar-days" />

          <div>
            <span>วันนี้</span>
            <strong>{todayText}</strong>
          </div>
        </div>

        <button type="button" className="header-icon-btn" aria-label="แจ้งเตือน">
          <i className="far fa-bell" />

          {notificationCount > 0 && (
            <span className="header-notification-badge">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </button>

        <div className="header-user-card">
          <div className="header-user-info">
            <strong>{displayName}</strong>
            <span>{displayRole}</span>
          </div>

          <div className="header-avatar">{displayAvatar}</div>
        </div>
      </div>
    </header>
  );
}

export default Header;