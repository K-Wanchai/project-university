import React, { useLayoutEffect, useMemo, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const SIDEBAR_SCROLL_KEY = "user-sidebar-scroll-top";

const menuGroups = [
  {
    label: "เมนูหลัก",
    items: [
      {
        to: "/homepage",
        icon: "fas fa-house",
        label: "หน้าหลัก",
        end: true,
      },
      {
        to: "/student-history",
        icon: "fas fa-id-card",
        label: "ข้อมูลส่วนตัว",
        relatedPaths: ["/student-profile/edit"],
      },
    ],
  },
  {
    label: "การเรียนของฉัน",
    items: [
      {
        to: "/my-courses",
        icon: "fas fa-book-open",
        label: "คอร์สเรียนของฉัน",
      },
      {
        to: "/schedule",
        icon: "fas fa-calendar-days",
        label: "ตารางเรียน",
      },
      {
        to: "/attendance",
        icon: "fas fa-chalkboard-user",
        label: "การเข้าเรียน",
      },
    ],
  },
  {
    label: "ลงทะเบียนและชำระเงิน",
    items: [
      {
        to: "/enrollment",
        icon: "fas fa-file-signature",
        label: "ลงทะเบียนเรียน",
      },
      {
        to: "/enrollment-check",
        icon: "fas fa-magnifying-glass",
        label: "ตรวจสอบใบลงทะเบียน",
      },
      {
        to: "/invoice",
        icon: "fas fa-receipt",
        label: "ใบแจ้งชำระเงิน",
      },
    ],
  },
];

const extraPageLabels = {
  "/student-profile/edit": "แก้ไขโปรไฟล์นักเรียน",
  "/change-password": "เปลี่ยนรหัสผ่าน",
};

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
      sessionStorage.setItem(
        SIDEBAR_SCROLL_KEY,
        String(scrollElement.scrollTop)
      );
    };

    scrollElement.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      sessionStorage.setItem(
        SIDEBAR_SCROLL_KEY,
        String(scrollElement.scrollTop)
      );
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const flatItems = useMemo(
    () => menuGroups.flatMap((group) => group.items),
    []
  );

  const isItemActive = (item) => {
    const pathname = location.pathname.toLowerCase();
    const itemPath = item.to.toLowerCase();

    if (item.end) {
      return pathname === itemPath;
    }

    if (pathname === itemPath || pathname.startsWith(`${itemPath}/`)) {
      return true;
    }

    return item.relatedPaths?.some((path) => {
      const relatedPath = path.toLowerCase();
      return pathname === relatedPath || pathname.startsWith(`${relatedPath}/`);
    });
  };

  const activeMenuItem = flatItems.find(isItemActive);

  const activeLabel =
    extraPageLabels[location.pathname] ||
    activeMenuItem?.label ||
    "หน้าหลัก";

  const handleMenuClick = () => {
    onClose?.();
  };

  const handleLogout = () => {
    if (window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("studentId");
      localStorage.removeItem("studentName");

      onClose?.();
      navigate("/login");
    }
  };

  return (
    <>
      <button
        type="button"
        className={`user-sidebar-backdrop ${isOpen ? "is-visible" : ""}`}
        aria-label="ปิดเมนู"
        onClick={onClose}
      />

      <aside className={`user-sidebar ${isOpen ? "is-open" : ""}`}>
        <div className="user-sidebar-top">
          <div className="user-sidebar-brand">
            <div className="user-sidebar-brand-icon" />

            <div className="user-sidebar-brand-text">
              <h2>ผู้ใช้งาน</h2>
              <span>STUDENT CONSOLE</span>
            </div>
          </div>
        </div>

        <div className="user-sidebar-status-card">
          <div className="user-sidebar-status-dot" />

          <div className="user-sidebar-status-text">
            <strong>เข้าสู่ระบบแล้ว</strong>
            <span>หน้าปัจจุบัน: {activeLabel}</span>
          </div>
        </div>

        <div className="user-sidebar-scroll" ref={scrollableRef}>
          <ul className="user-sidebar-menu">
            {menuGroups.map((group) => (
              <React.Fragment key={group.label}>
                <li className="user-sidebar-menu-group">{group.label}</li>

                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={handleMenuClick}
                      className={() =>
                        isItemActive(item)
                          ? "user-sidebar-link active"
                          : "user-sidebar-link"
                      }
                    >
                      <i className={item.icon} />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
        </div>

        <div className="user-sidebar-footer">
          <NavLink
            to="/change-password"
            onClick={handleMenuClick}
            className={({ isActive }) =>
              isActive ? "user-sidebar-link active" : "user-sidebar-link"
            }
          >
            <i className="fas fa-key" />
            <span>เปลี่ยนรหัสผ่าน</span>
          </NavLink>

          <button
            type="button"
            className="user-sidebar-logout-btn"
            onClick={handleLogout}
          >
            <i className="fas fa-right-from-bracket" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;