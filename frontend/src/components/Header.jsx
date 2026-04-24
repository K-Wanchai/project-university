import React, { useEffect, useMemo, useState } from 'react';
import './Header.css';

function Header({
  title = 'แดชบอร์ด',
  subtitle = 'ภาพรวมการทำงานของระบบ',
  userName = 'ผู้ดูแลระบบ',
  userRole = 'Administrator',
  notificationCount = 3,
  onMenuClick,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = useMemo(() => {
    return currentTime.toLocaleDateString('th-TH', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }, [currentTime]);

  const formattedTime = useMemo(() => {
    return currentTime.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, [currentTime]);

  const initials = useMemo(() => {
    const words = userName.trim().split(/\s+/);
    if (!words.length || !words[0]) return 'AD';
    if (/^[A-Za-z]/.test(words[0])) {
      return words.map((word) => word[0]).join('').slice(0, 2).toUpperCase();
    }
    return words[0].slice(0, 2);
  }, [userName]);

  return (
    <header className="main-header">
      <div className="header-left">
        <button
          type="button"
          className="header-menu-toggle"
          onClick={onMenuClick}
          aria-label="เปิดหรือปิดเมนู"
        >
          <i className="fas fa-bars" />
        </button>

        <div className="header-title-group">
          <div className="breadcrumb" aria-label="ตำแหน่งหน้าเว็บ">
            <span>ระบบจัดการ</span>
            <i className="fas fa-chevron-right" />
            <span className="current-page">{title}</span>
          </div>
          <h2 className="header-title">{title}</h2>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="header-right">
        <div className="header-search" role="search">
          <i className="fas fa-search" />
          <input type="search" placeholder="ค้นหาเมนูหรือข้อมูล..." aria-label="ค้นหา" />
        </div>

        <div className="header-datetime" aria-label="วันที่และเวลา">
          <span className="date">{formattedDate}</span>
          <span className="time">{formattedTime}</span>
        </div>

        <button type="button" className="header-icon-btn" aria-label="การแจ้งเตือน">
          <i className="fas fa-bell" />
          {notificationCount > 0 && <span className="notification-dot">{notificationCount}</span>}
        </button>

        <button type="button" className="header-icon-btn" aria-label="ช่วยเหลือ">
          <i className="fas fa-circle-question" />
        </button>

        <div className="header-user-profile">
          <div className="user-text">
            <span className="user-name">{userName}</span>
            <span className="user-role">{userRole}</span>
          </div>
          <div className="user-avatar" aria-hidden="true">{initials}</div>
          <i className="fas fa-chevron-down user-dropdown-icon" />
        </div>
      </div>
    </header>
  );
}

export default Header;
