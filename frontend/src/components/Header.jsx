import React, { useState, useEffect } from 'react';
import './Header.css';

function Header({ title }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // อัปเดตเวลาทุกวินาที
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('th-TH', options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <header className="main-header">
      <div className="header-left">
        <h2 className="header-title">{title}</h2>
      </div>

      <div className="header-right">

        {/* ข้อมูลผู้ใช้ */}
        <div className="header-user-profile">
          <div className="user-text">
            <span className="user-name">ผู้ดูแลระบบ</span>
            <span className="user-role">Administrator</span>
          </div>
          <div className="user-avatar">AD</div>
        </div>
      </div>
    </header>
  );
}

export default Header;