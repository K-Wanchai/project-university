import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Layout.css";

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className={`user-layout ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <button
        type="button"
        className={`user-floating-menu-btn ${isSidebarOpen ? "is-open" : ""}`}
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? "ปิดเมนู" : "เปิดเมนู"}
      >
        <span className="user-menu-lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="user-main">
        <main className="user-content">{children}</main>
      </div>
    </div>
  );
}

export default Layout;