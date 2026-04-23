import React, { useState, useEffect } from 'react';
import './Standard.css'; // นำเข้า CSS ของหน้านี้ (ตรวจสอบชื่อไฟล์ให้ตรงด้วยนะครับ)
import { Link } from 'react-router-dom'; // ใช้ Link เพื่อสลับหน้าโดยไม่รีเฟรช

function Standard() {
  // 1. สร้าง State ไว้เก็บตัวเลขจำนวนผู้ใช้
  const [totalUsersCount, setTotalUsersCount] = useState('กำลังโหลด...');

  // 2. ดึงข้อมูลเมื่อโหลดหน้าเว็บ
  useEffect(() => {
    // หมายเหตุ: ผมเปลี่ยน IP จาก 172.24.177.13 เป็น localhost ให้ตรงกับหน้า User.jsx เพื่อป้องกันปัญหาเชื่อมต่อข้ามเครื่องครับ
    fetch("http://localhost:8080/api/admin/users/count")
      .then(response => {
        if (!response.ok) throw new Error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
        return response.json();
      })
      .then(data => {
        // อัปเดตตัวเลขลงใน State พร้อมใส่ลูกน้ำ (,)
        setTotalUsersCount(data.totalUsers.toLocaleString());
      })
      .catch(error => {
        console.error("Error loading user count:", error);
        setTotalUsersCount('ไม่สามารถโหลดได้');
      });
  }, []);

  return (
    <div className="container">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="logo-section">
          <div className="logo-icon"><i className="fas fa-brain"></i></div>
          <h2>ครูปุ๊ก ติวเตอร์</h2>
        </div>
        
        <ul className="nav-menu">
          {/* ใช้ Link แทน a href */}
          <li className="active"><Link to="/"><i className="fas fa-home"></i> หน้าหลัก</Link></li>
          
          <li className="menu-header">การจัดการผู้ใช้</li>
          <li><Link to="/user"><i className="fas fa-users"></i> ข้อมูลผู้ใช้งาน</Link></li>
          
          <li className="menu-header">การจัดการสถาบัน</li>
          <li><a href="#"><i className="fas fa-school"></i> ข้อมูลโรงเรียนกวดวิชา</a></li>
          <li><a href="#"><i className="fas fa-map-marker-alt"></i> ข้อมูลสถาบันที่จัดสอบ</a></li>
          
          <li className="menu-header">การจัดการเนื้อหา</li>
          <li><a href="#"><i className="fas fa-book"></i> ข้อมูลคอร์สเรียน</a></li>
          <li className="bottom-menu"><a href="#"><i className="fas fa-key"></i> เปลี่ยนรหัสผ่าน</a></li>
          

        </ul>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <div className="user-info">
            <img src="https://via.placeholder.com/40" alt="Admin Avatar" className="avatar" />
            <span>สวัสดี, <strong>ผู้ดูแลระบบ</strong></span>
          </div>
        </header>

        <section className="dashboard-content">
          <h3>สรุปการจัดการ</h3>
          <div className="stats-grid">
            
            <div className="stat-card">
              <i className="fas fa-users-cog icon"></i>
              <div className="stat-info">
                <p>ผู้ใช้งานทั้งหมด</p>
                {/* ดึงค่าจาก State มาแสดงที่นี่ */}
                <span className="number">{totalUsersCount}</span>
              </div>
            </div>

            <div className="stat-card">
              <i className="fas fa-book-open icon"></i>
              <div className="stat-info">
                <p>คอร์สเรียนทั้งหมด</p>
                <span className="number">120</span>
              </div>
            </div>
            
            <div className="stat-card">
              <i className="fas fa-star icon"></i>
              <div className="stat-info">
                <p>สถาบันสอบทั้งหมด</p>
                <span className="number">10</span>
              </div>
            </div>
          </div>

          <div className="activity-section">
            <h4><i className="fas fa-globe"></i> กิจกรรมและข่าวสาร</h4>
            <ul className="activity-list">
              <li><span>เพิ่มผู้ใช้งานใหม่: user_janesmith (นักเรียน)</span> <small>เมื่อ 5 นาที</small></li>
              <li><span>อัปเดตข้อมูลโรงเรียน: สาขา ขอนแก่น</span> <small>เมื่อ 2 ชั่วโมง</small></li>
              <li><span>สร้างคอร์สใหม่: วิทยาศาสตร์ ม.3</span> <small>เมื่อวาน</small></li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Standard;