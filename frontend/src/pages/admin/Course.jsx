import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Course.css';
import Sidebar from '../../components/Sidebar';

function Course() {
  const [courses] = useState([
    { id: 1, icon: '🧮', name: 'คณิตศาสตร์ ม.ปลาย', category: 'วิทยาศาสตร์', time: 'จ.-ศ. 18:00-20:00', tutor: 'ครูปุ๊ก', status: 'เปิดรับสมัคร', statusType: 'open' },
    { id: 2, icon: '📜', name: 'ภาษาไทย ม.ต้น', category: 'ภาษาไทย', time: 'เสาร์ 09:00-12:00', tutor: 'ครูพี่วิน', status: 'กำลังสอน', statusType: 'ongoing' },
    { id: 3, icon: '🧪', name: 'วิทยาศาสตร์ ม.ต้น', category: 'วิทยาศาสตร์', time: 'อาทิตย์ 13:00-16:00', tutor: 'ครูสมศรี', status: 'จบแล้ว', statusType: 'closed' },
    { id: 4, icon: '🇬🇧', name: 'ภาษาอังกฤษ ม.ปลาย', category: 'ภาษาต่างประเทศ', time: 'พุธ 16:30-18:30', tutor: 'Mr. Johnson', status: 'จบแล้ว', statusType: 'closed' },
    { id: 5, icon: '🎨', name: 'ศิลปะและออกแบบ', category: 'ศิลปะ', time: 'ศุกร์ 16:00-18:00', tutor: 'ครูวราภรณ์', status: 'จบแล้ว', statusType: 'closed' },
  ]);

  const getStatusClass = (type) => {
    if (type === 'open') return 'status-open';
    if (type === 'ongoing') return 'status-ongoing';
    return 'status-closed';
  };

  const getDotClass = (type) => {
    if (type === 'open') return 'dot-green';
    if (type === 'ongoing') return 'dot-yellow';
    return 'dot-gray';
  };

  return (
    <div className="container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      
      {/* เรียกใช้งาน Sidebar Component */}
      <Sidebar />
      
      {/* 🌟 จุดที่แก้ไข: ดันเนื้อหาหนี Sidebar 260px และจัดการไม่ให้ตารางล้นจอ 🌟 */}
      <main className="main-content" style={{ flex: 1, marginLeft: '260px', padding: '30px', overflowX: 'hidden' }}>
        <div className="info-bar" style={{ marginBottom: '20px', color: '#64748b' }}>
          ข้อมูลสถาบัน : : สาขาหลัก กรุงเทพฯ (BKK001)
        </div>

        <div className="course-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, color: '#1e293b' }}>การจัดการคอร์สเรียน</h1>
          <Link to="/add-course" className="btn-add-course" style={{ background: '#1e1e4b', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none' }}>
            <i className="fas fa-plus"></i> เพิ่มคอร์สใหม่
          </Link>
        </div>

        <div className="filter-section" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <input type="text" className="search-input" placeholder="ค้นหาคอร์ส..." style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', flex: 1 }} />
          <select className="filter-select" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <option>ตัวกรองประเภทคอร์ส</option>
          </select>
          <select className="filter-select" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <option>ตัวกรองสถานะคอร์ส</option>
          </select>
        </div>

        <section className="course-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>รายการคอร์สเรียนทั้งหมด</h3>
          <table className="course-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px' }}>#</th>
                <th style={{ padding: '12px' }}>โลโก้คอร์ส</th>
                <th style={{ padding: '12px' }}>ชื่อคอร์ส</th>
                <th style={{ padding: '12px' }}>วิชา/หมวดหมู่</th>
                <th style={{ padding: '12px' }}>เวลาที่สอน</th>
                <th style={{ padding: '12px' }}>ผู้สอน/วิทยากร</th>
                <th style={{ padding: '12px' }}>สถานะ</th>
                <th style={{ padding: '12px' }}>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={course.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px' }}>{index + 1}</td>
                  <td className="course-icon" style={{ padding: '12px', fontSize: '24px' }}>{course.icon}</td>
                  <td style={{ padding: '12px' }}><strong>{course.name}</strong></td>
                  <td style={{ padding: '12px' }}>{course.category}</td>
                  <td style={{ padding: '12px' }}>{course.time}</td>
                  <td style={{ padding: '12px' }}>{course.tutor}</td>
                  <td style={{ padding: '12px' }}>
                    <span className={`status-pill ${getStatusClass(course.statusType)}`}>
                      <span className={`dot ${getDotClass(course.statusType)}`}></span>
                      {course.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <Link to={`/edit-course/${course.id}`} className="btn-edit-action" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>
                        <i className="fas fa-edit"></i> แก้ไข
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Footer News Section */}
        <div className="activity-section" style={{marginTop: '20px', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h4 style={{ marginTop: 0 }}><i className="fas fa-globe"></i> กิจกรรมล่าสุด & ข่าวสาร</h4>
            <ul className="activity-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}><span>• เพิ่มคอร์สใหม่: เคมี ม.ต้น (โดยแอดมินคุณกมล)</span> <small style={{ color: '#64748b' }}>เมื่อ 5 นาที</small></li>
              <li style={{ padding: '10px 0', display: 'flex', justifyContent: 'space-between' }}><span>• อัปเดตข้อมูลคอร์ส: ภาษาไทย ม.6</span> <small style={{ color: '#64748b' }}>เมื่อ 2 ชั่วโมง</small></li>
            </ul>
        </div>
      </main>
    </div>
  );
}

export default Course;