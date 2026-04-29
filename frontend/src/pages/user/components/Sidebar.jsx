import React, { useLayoutEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const SIDEBAR_SCROLL_KEY = "user-sidebar-scroll-top";

function Sidebar({
  collapsed = false,
  newPaymentCount = 0,
  paymentNoticeCount = newPaymentCount,
  onMobileOpen,
  onMobileClose,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollableRef = useRef(null);

  const userName =
    localStorage.getItem("studentName") ||
    localStorage.getItem("username") ||
    "ผู้ใช้งาน";

  const role = localStorage.getItem("role") || "student";
  const paymentCount = Number(paymentNoticeCount) || 0;

  const menuGroups = [
    {
      label: "เมนูหลัก",
      items: [
        {
          to: "/Homepage",
          icon: "fas fa-house",
          label: "หน้าหลัก",
          end: true,
        },
        {
          to: "/student-history",
          icon: "far fa-circle-user",
          label: "ข้อมูลส่วนตัว",
        },
      ],
    },
    {
      label: "การเรียนของฉัน",
      items: [
        {
          to: "/my-courses",
          icon: "fas fa-book-open-reader",
          label: "คอร์สเรียนของฉัน",
        },
        {
          to: "/schedule",
          icon: "far fa-calendar-days",
          label: "ตารางเรียน",
        },
        {
          to: "/attendance-record",
          icon: "fas fa-user-check",
          label: "การเข้าเรียน",
        },
      ],
    },
    {
      label: "ลงทะเบียนและชำระเงิน",
      items: [
        {
          to: "/register-course",
          icon: "far fa-rectangle-list",
          label: "ลงทะเบียนเรียน",
        },
        {
          to: "/check-registration",
          icon: "fas fa-clipboard-check",
          label: "ตรวจสอบใบลงทะเบียน",
        },
        {
          to: "/payment-notice",
          icon: "fas fa-credit-card",
          label: "ใบแจ้งชำระเงิน",
          badge: paymentCount > 0 ? paymentCount : null,
        },
      ],
    },
    {
      label: "ผลการเรียน",
      items: [
        {
          to: "/test-result",
          icon: "fas fa-square-poll-vertical",
          label: "ผลทดสอบ",
        },
        {
          to: "/study-result",
          icon: "fas fa-graduation-cap",
          label: "ผลการศึกษา",
        },
        {
          to: "/teacher-evaluation",
          icon: "fas fa-star-half-stroke",
          label: "ประเมินผู้สอน",
        },
      ],
    },
  ];

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

  const handleLogout = () => {
    if (window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("studentId");
      localStorage.removeItem("studentName");

      navigate("/login");
    }
  };

  const closeMobileAfterClick = () => {
    if (window.innerWidth <= 900 && onMobileClose) {
      onMobileClose();
    }
  };

  const activeLabel =
    menuGroups
      .flatMap((group) => group.items)
      .find((item) => {
        if (item.end) return location.pathname === item.to;

        return (
          location.pathname === item.to ||
          location.pathname.startsWith(item.to)
        );
      })?.label || "หน้าหลัก";

  const renderBadge = (badge) => {
    if (!badge) return null;

    if (typeof badge === "number") {
      return <span className="menu-badge">{badge > 99 ? "99+" : badge}</span>;
    }

    return <span className="menu-badge">{badge}</span>;
  };

  return (
    <>
      <aside className="mobile-sidebar-rail">
        <button
          type="button"
          className="mobile-rail-menu-btn"
          onClick={onMobileOpen}
          aria-label="เปิดเมนู"
        >
          <span className="menu-emoji">☰</span>
          <span className="menu-emoji-text">เมนู</span>
        </button>
      </aside>

      <nav
        className={`sidebar-container ${collapsed ? "is-collapsed" : ""}`}
        aria-label="เมนูผู้ใช้"
      >
        <div className="sidebar-logo">
          <div className="logo-icon">
            <i className="fas fa-user-graduate" />
          </div>

          <div className="logo-text">
            <h2>{userName}</h2>
            <span>{role === "student" ? "STUDENT CONSOLE" : "USER CONSOLE"}</span>
          </div>

          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onMobileClose}
            aria-label="ปิดเมนู"
          >
            <i className="fas fa-xmark" />
          </button>
        </div>

        <div className="sidebar-status-card">
          <div className="status-dot" />

          <div>
            <strong>เข้าสู่ระบบแล้ว</strong>
            <span>หน้าปัจจุบัน: {activeLabel}</span>
          </div>
        </div>

        <div className="sidebar-scrollable" ref={scrollableRef}>
          <ul className="sidebar-menu">
            {menuGroups.map((group) => (
              <React.Fragment key={group.label}>
                <li className="menu-header">{group.label}</li>

                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={closeMobileAfterClick}
                      className={({ isActive }) =>
                        isActive ? "menu-item active" : "menu-item"
                      }
                      title={item.label}
                    >
                      <i className={item.icon} />
                      <span className="menu-label">{item.label}</span>
                      {renderBadge(item.badge)}
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
            onClick={closeMobileAfterClick}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <i className="fas fa-key" />
            <span className="menu-label">เปลี่ยนรหัสผ่าน</span>
          </NavLink>
        </div>

        <div className="sidebar-logout-layer">
          <button
            type="button"
            className="logout-layer-btn"
            onClick={handleLogout}
          >
            <i className="fas fa-right-from-bracket" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default Sidebar;