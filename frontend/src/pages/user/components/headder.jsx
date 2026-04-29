import React from 'react';
import './Header.css';

function Header({
  title = 'แดชบอร์ด',
  subtitle = 'ระบบจัดการข้อมูลครูปุ๊ก ติวเตอร์',
  userName = 'ผู้ดูแลระบบ',
  role = 'Administrator',
  avatarText = 'AD',
  notificationCount = 0,
  onMenuClick
}) {
  const todayText = new Date().toLocaleDateString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="app-header">
      <div className="header-glow"></div>

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
            <span className="header-kicker-dot"></span>
            Admin Console
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
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </button>

        <div className="header-user-card">
          <div className="header-user-info">
            <strong>{userName}</strong>
            <span>{role}</span>
          </div>

          <div className="header-avatar">
            {avatarText}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;