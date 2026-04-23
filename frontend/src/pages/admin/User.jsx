import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar'; 
import './User.css'; 

// กำหนด IP ของ Backend ไว้ที่เดียวเพื่อให้จัดการง่าย
const API_IP = "172.24.177.40";
const API_BASE_URL = `http://${API_IP}:8080/api/admin/users`;

function User() {
  // 1. State สำหรับตารางและการค้นหา
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // 2. ดึงข้อมูลตอนโหลดหน้า
  useEffect(() => {
    loadUsersTable();
  }, []);

  const loadUsersTable = async () => {
    try {
      const res = await fetch(API_BASE_URL);
      if (!res.ok) throw new Error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // 3. ฟังก์ชันลบข้อมูล
  const deleteUser = async (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งานนี้?")) {
      try {
        await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
        alert("ลบผู้ใช้งานเรียบร้อยแล้ว");
        loadUsersTable();
      } catch (err) {
        alert("เกิดข้อผิดพลาดในการลบผู้ใช้งาน");
      }
    }
  };

  // 🌟 4. เพิ่ม Logic การกรองข้อมูล (เพื่อแก้ปัญหา filteredUsers is not defined)
  const filteredUsers = users.filter(user => {
    // กรองด้วยชื่อ-นามสกุล หรือชื่อผู้ใช้ (แปลงเป็นตัวเล็กเพื่อให้ค้นหาง่าย)
    const matchesSearch = 
      (user.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.username?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // กรองด้วยบทบาท
    const matchesRole = roleFilter === '' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="container" style={{ display: 'flex' }}>
      
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <main className="main-content" style={{ flex: 1, marginLeft: '260px', padding: '20px' }}>
        <header className="content-header">
          <h1>การจัดการข้อมูลผู้ใช้งาน</h1>
          <hr />
        </header>

        <section className="table-container">
          <div className="table-controls">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="ค้นหาผู้ใช้..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
            
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">ตัวกรองบทบาททั้งหมด</option>
              <option value="ติวเตอร์">ติวเตอร์</option>
              <option value="ผู้ดูแลระบบ">ผู้ดูแลระบบ</option>
              <option value="นักเรียน">นักเรียน</option>
            </select>

            <Link to="/newuser" className="btn-add">
                <i className="fas fa-plus"></i> เพิ่มผู้ใช้งานใหม่
            </Link>
          </div>
          
          <table className="user-table">
            <thead>
              <tr>
                <th>รูปโปรไฟล์</th>
                <th>ชื่อ-นามสกุล</th>
                <th>ชื่อผู้ใช้</th>
                <th>อีเมล</th>
                <th>บทบาท</th>
                <th>สถานะ</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>ไม่พบข้อมูลผู้ใช้งาน</td></tr>
              ) : (
                filteredUsers.map(user => {
                  let statusText = user.status || 'รอตรวจสอบ';
                  const statusClass = statusText === 'ระงับการใช้งาน' ? 'status-suspended' : 'status-active';
                  
                  // ปรับ URL รูปภาพให้ใช้ IP เดียวกับ API
                  const imageUrl = user.profileImage 
                      ? `http://${API_IP}:8080/uploads/profiles/${user.profileImage}` 
                      : `https://ui-avatars.com/api/?name=${user.firstName || 'U'}&background=random`;

                  return (
                    <tr key={user.id}>
                      <td>
                        <img 
                          src={imageUrl} 
                          alt="avatar"
                          className="avatar-img" 
                          style={{ borderRadius: "50%", width: "40px", height: "40px", objectFit: "cover" }} 
                        />
                      </td>
                      <td>{user.firstName || ''} {user.lastName || ''}</td>
                      <td>{user.username || '-'}</td>
                      <td>{user.email || '-'}</td>
                      <td>{user.role || '-'}</td>
                      <td>
                        <span className={`status-badge ${statusClass}`}>
                          {statusText}
                        </span>
                      </td>
                      <td>
                        <Link 
                          to={`/newuser?id=${user.id}`} 
                          style={{ cursor: "pointer", textDecoration: "none", color: "#3b82f6", marginRight: "10px", fontWeight: "bold" }}
                        >
                          <i className="fas fa-edit"></i> แก้ไข
                        </Link>
                        
                        <button 
                          onClick={() => deleteUser(user.id)} 
                          style={{ cursor: "pointer", border: "none", background: "none", color: "#ef4444", fontWeight: "bold" }}
                        >
                          <i className="fas fa-trash"></i> ลบ
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default User;