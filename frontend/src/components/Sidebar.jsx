import React, { useLayoutEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const SIDEBAR_SCROLL_KEY = 'admin-sidebar-scroll-top';

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

function Sidebar({ isOpen = false, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollableRef = useRef(null);

  useLayoutEffect(() => {
    const scrollElement = scrollableRef.current;
    if (!scrollElement) return;

    const savedScrollTop = sessionStorage.getItem(SIDEBAR_SCROLL_KEY);
    if (savedScrollTop !== null) {
      scrollElement.scrollTop = Number(savedScrollTop);
    }

    const handleScroll = () => {
      sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(scrollElement.scrollTop));
    };

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(scrollElement.scrollTop));
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
      localStorage.removeItem('token');
      onClose?.();
      navigate('/login');
    }
  };

  const activeLabel =
    menuGroups
      .flatMap((group) => group.items)
      .find((item) => {
        if (item.end) return location.pathname === item.to;
        return location.pathname.startsWith(item.to);
      })?.label || 'หน้าหลัก';

  const handleMenuClick = () => {
    onClose?.();
  };

  return (
    <>
      <button
        type="button"
        className={`admin-sidebar-backdrop ${isOpen ? 'is-visible' : ''}`}
        aria-label="ปิดเมนู"
        onClick={onClose}
      />

      <aside className={`admin-sidebar ${isOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar-logo">
          <div className="admin-logo-icon">
            <i className="fas fa-brain" />
          </div>

          <div className="admin-logo-text">
            <h2>ครูปุ๊ก ติวเตอร์</h2>
            <span>Admin Console</span>
          </div>
        </div>

        <div className="admin-status-card">
          <div className="admin-status-dot" />
          <div>
            <strong>ระบบพร้อมใช้งาน</strong>
            <span>หน้าปัจจุบัน: {activeLabel}</span>
          </div>
        </div>

        <div className="admin-sidebar-scroll" ref={scrollableRef}>
          <ul className="admin-menu">
            {menuGroups.map((group) => (
              <React.Fragment key={group.label}>
                <li className="admin-menu-header">{group.label}</li>

                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      title={item.label}
                      onClick={handleMenuClick}
                      className={({ isActive }) =>
                        isActive ? 'admin-menu-item active' : 'admin-menu-item'
                      }
                    >
                      <i className={item.icon} />
                      <span className="admin-menu-label">{item.label}</span>
                      {item.badge && <span className="admin-menu-badge">{item.badge}</span>}
                    </NavLink>
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
        </div>

        <div className="admin-sidebar-footer">
          <NavLink
            to="/change-password"
            onClick={handleMenuClick}
            className={({ isActive }) =>
              isActive ? 'admin-menu-item active' : 'admin-menu-item'
            }
          >
            <i className="fas fa-key" />
            <span className="admin-menu-label">เปลี่ยนรหัสผ่าน</span>
          </NavLink>

          <button type="button" className="admin-logout-btn" onClick={handleLogout}>
            <i className="fas fa-right-from-bracket" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;