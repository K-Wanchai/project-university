import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      // ล้างข้อมูลการล็อกอิน (ถ้ามี)
      localStorage.removeItem('token');
      // นำทางไปยังหน้า Login
      navigate('/login');
    }
  };

  return (
    <nav className="sidebar-container">
      <div className="sidebar-logo">
        <div className="logo-icon"><i className="fas fa-brain"></i></div>
        <h2>ครูปุ๊ก ติวเตอร์</h2>
      </div>

      <div className="sidebar-scrollable">
        <ul className="sidebar-menu">
<li>
            <NavLink to="/" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"} end>
              {/* ขยายขนาดรูปบ้านเป็น 22px */}
              <i className="fas fa-home" style={{ fontSize: '22px' }}></i> 
              
              {/* ขยายขนาดตัวหนังสือเป็น 18px และทำตัวหนา (bold) */}
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>🏠หน้าหลัก</span>
            </NavLink>
          </li>

          <li className="menu-header">การจัดการผู้ใช้</li>
          <li>
            <NavLink to="/user" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
              <i className="fas fa-users"></i> <span>ข้อมูลผู้ใช้งาน</span>
            </NavLink>
          </li>

          <li className="menu-header">การจัดการสถาบัน</li>
          <li>
            <NavLink to="/schoolinfo" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
              <i className="fas fa-schoolinfo"></i> <span>ข้อมูลโรงเรียนกวดวิชา</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/exam-center" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
              <i className="fas fa-map-marker-alt"></i> <span>ข้อมูลสถาบันที่จัดสอบ</span>
            </NavLink>
          </li>

          <li className="menu-header">การจัดการเนื้อหา</li>
          <li>
            <NavLink to="/course" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
              <i className="fas fa-book"></i> <span>ข้อมูลคอร์สเรียน</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="sidebar-footer">
        <NavLink to="/change-password" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
          <i className="fas fa-key"></i> <span>เปลี่ยนรหัสผ่าน</span>
        </NavLink>
        <div className="menu-item logout-btn" onClick={handleLogout} style={{ cursor: 'pointer', color: '#ef4444' }}>
          <i className="fas fa-sign-out-alt"></i> <span>ออกจากระบบ</span>
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;