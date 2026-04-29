  function Header({ onMenuClick }) {
    return (
      <>
        <button
          type="button"
          className="admin-floating-menu-btn"
          onClick={onMenuClick}
          aria-label="เปิดเมนู"
          
        >
          ☰
        </button>

        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <div>
              <h1>ระบบจัดการข้อมูล</h1>
              <p>จัดการข้อมูลหลังบ้านอย่างเป็นระบบ</p>
            </div>
          </div>

          <div className="admin-topbar-actions">
            <button className="admin-icon-btn" aria-label="การแจ้งเตือน">
              <i className="fas fa-bell" />
              <span>3</span>
            </button>

            <div className="admin-profile">
              <div className="admin-profile-avatar">
                <i className="fas fa-user" />
              </div>

              <div className="admin-profile-text">
                <strong>ผู้ดูแลระบบ</strong>
                <span>Admin</span>
              </div>
            </div>
          </div>
        </header>
      </>
    );
  }

  export default Header;