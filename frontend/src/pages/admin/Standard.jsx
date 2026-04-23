import React, { useState, useEffect } from 'react';
import './Standard.css'; 
import { Link } from 'react-router-dom'; 
import Sidebar from '../../components/Sidebar';

function Standard() {
  const [totalUsersCount, setTotalUsersCount] = useState('กำลังโหลด...');

  useEffect(() => {
    // โค้ดตรงนี้แหละครับที่มักจะเผลอลบคำว่า fetch() ออกไป
    fetch("http://localhost:8080/api/admin/users/count")
      .then(response => {
        if (!response.ok) throw new Error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
        return response.json();
      })
      .then(data => {
        setTotalUsersCount(data.totalUsers.toLocaleString());
      })
      .catch(error => {
        console.error("Error loading user count:", error);
        setTotalUsersCount('ไม่สามารถโหลดได้');
      });
  }, []);

  return (
    <div className="container" style={{ display: 'flex' }}>
      
      {/* เรียกใช้งาน Sidebar Component */}
      <Sidebar />

      {/* ดันเนื้อหาหลักออกไป 260px เพื่อไม่ให้ Sidebar ทับ */}
      <main className="main-content" style={{ flex: 1, marginLeft: '260px' }}>
        <header className="top-bar">
          <div className="user-info">
            {/* ดึงรูป Avatar จำลองมาใส่ให้ดูสวยงามขึ้น */}
            <img src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff" alt="Admin Avatar" className="avatar" style={{ borderRadius: '50%', width: '40px' }} />
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