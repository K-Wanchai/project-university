import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Course.css';

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
    <div className="course-container">

      {/* Main Content */}
      <main className="main-content">
        <div className="info-bar">
          ข้อมูลสถาบัน : : สาขาหลัก กรุงเทพฯ (BKK001)
        </div>

        <div className="course-header-row">
          <h1>การจัดการคอร์สเรียน</h1>
          <Link to="/add-course" className="btn-add-course">
  <i className="fas fa-plus"></i> เพิ่มคอร์สใหม่
</Link>
        </div>

        <div className="filter-section">
          <input type="text" className="search-input" placeholder="ค้นหาคอร์ส..." />
          <select className="filter-select">
            <option>ตัวกรองประเภทคอร์ส</option>
          </select>
          <select className="filter-select">
            <option>ตัวกรองสถานะคอร์ส</option>
          </select>
        </div>

        <section className="course-card">
          <h3>รายการคอร์สเรียนทั้งหมด</h3>
          <table className="course-table">
            <thead>
              <tr>
                <th>#</th>
                <th>โลโก้คอร์ส</th>
                <th>ชื่อคอร์ส</th>
                <th>วิชา/หมวดหมู่</th>
                <th>เวลาที่สอน</th>
                <th>ผู้สอน/วิทยากร</th>
                <th>สถานะ</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={course.id}>
                  <td>{index + 1}</td>
                  <td className="course-icon">{course.icon}</td>
                  <td><strong>{course.name}</strong></td>
                  <td>{course.category}</td>
                  <td>{course.time}</td>
                  <td>{course.tutor}</td>
                  <td>
                    <span className={`status-pill ${getStatusClass(course.statusType)}`}>
                      <span className={`dot ${getDotClass(course.statusType)}`}></span>
                      {course.status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/edit-course/${course.id}`} className="btn-edit-action">
  <i className="fas fa-edit"></i> แก้ไข
</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Footer News Section */}
        <div className="activity-section" style={{marginTop: '20px'}}>
            <h4><i className="fas fa-globe"></i> กิจกรรมล่าสุด & ข่าวสาร</h4>
            <ul className="activity-list">
              <li><span>• เพิ่มคอร์สใหม่: เคมี ม.ต้น (โดยแอดมินคุณกมล)</span> <small>เมื่อ 5 นาที</small></li>
              <li><span>• อัปเดตข้อมูลคอร์ส: ภาษาไทย ม.6</span> <small>เมื่อ 2 ชั่วโมง</small></li>
            </ul>
        </div>
      </main>
    </div>
  );
}

export default Course;