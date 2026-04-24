import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const menuGroups = [
  {
    label: 'ภาพรวม',
    items: [
      { to: '/', icon: 'fas fa-house', label: 'หน้าหลัก', end: true },
    ],
  },
  {
    label: 'การจัดการผู้ใช้',
    items: [
      { to: '/user', icon: 'fas fa-users', label: 'ข้อมูลผู้ใช้งาน', badge: 'ใหม่' },
      { to: '/money', icon: 'fas fa-credit-card', label: 'ข้อมูลการชำระเงิน' },
    ],
  },
  {
    label: 'การจัดการสถาบัน',
    items: [
      { to: '/school-info', icon: 'fas fa-school', label: 'ข้อมูลโรงเรียนกวดวิชา' },
      { to: '/examination', icon: 'fas fa-building-columns', label: 'ข้อมูลสถาบันที่จัดสอบ' },
    ],
  },
  {
    label: 'การจัดการเนื้อหา',
    items: [
      { to: '/course', icon: 'fas fa-book-open', label: 'ข้อมูลคอร์สเรียน' },
    ],
  },
];

function Sidebar({ collapsed = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const activeLabel = menuGroups
    .flatMap((group) => group.items)
    .find((item) => {
      if (item.end) return location.pathname === item.to;
      return location.pathname.startsWith(item.to);
    })?.label || 'หน้าหลัก';

  return (
    <nav className={`sidebar-container ${collapsed ? 'is-collapsed' : ''}`} aria-label="เมนูหลัก">
      <div className="sidebar-logo">
        <div className="logo-icon"><i className="fas fa-brain" /></div>
        <div className="logo-text">
          <h2>ครูปุ๊ก ติวเตอร์</h2>
          <span>Admin Console</span>
        </div>
      </div>

      <div className="sidebar-status-card">
        <div className="status-dot" />
        <div>
          <strong>ระบบพร้อมใช้งาน</strong>
          <span>หน้าปัจจุบัน: {activeLabel}</span>
        </div>
      </div>

      <div className="sidebar-scrollable">
        <ul className="sidebar-menu">
          {menuGroups.map((group) => (
            <React.Fragment key={group.label}>
              <li className="menu-header">{group.label}</li>
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
                    title={item.label}
                  >
                    <i className={item.icon} />
                    <span className="menu-label">{item.label}</span>
                    {item.badge && <span className="menu-badge">{item.badge}</span>}
                  </NavLink>
                </li>
              ))}
            </React.Fragment>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
  <NavLink
    to="/change-password"
    className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
  >
    <i className="fas fa-key" />
    <span className="menu-label">เปลี่ยนรหัสผ่าน</span>
  </NavLink>
</div>

<div className="sidebar-logout-layer">
  <button type="button" className="logout-layer-btn" onClick={handleLogout}>
    <i className="fas fa-right-from-bracket" />
    <span>ออกจากระบบ</span>
  </button>
</div>
    </nav>
  );
}

export default Sidebar;
