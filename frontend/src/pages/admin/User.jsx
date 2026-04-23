import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar'; // นำเข้า Sidebar (ตรวจสอบ Path ให้ตรงกับโฟลเดอร์ของคุณ)
import './User.css'; 

const API_BASE_URL = "http://localhost:8080/api/admin/users";

function User() {
  // 1. State สำหรับตารางและการค้นหา (ลบ State ของ Modal ออกหมดแล้ว)
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

  // 4. ฟังก์ชันกรองข้อมูล
  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const username = (user.username || '').toLowerCase();
    
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || username.includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  return (
    // เพิ่ม display: flex เพื่อจัดเรียง Sidebar กับ Main Content ให้อยู่ซ้าย-ขวา
    <div className="container" style={{ display: 'flex' }}>
      
      {/* เรียกใช้งาน Sidebar Component บรรทัดเดียวจบ! */}
      <Sidebar />

      {/* เพิ่ม marginLeft: 260px เพื่อดันเนื้อหาหนี Sidebar ที่ fix ไว้ด้านซ้าย */}
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

            {/* ปุ่มเพิ่มผู้ใช้ ลิงก์ไปหน้า Newuser */}
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
                  
                  // 🌟 เพิ่มเงื่อนไขเช็ครูปตรงนี้ 🌟
                  // ถ้า user มีรูป (user.profileImage) ให้ไปดึงจาก Backend ถ้าไม่มีให้ใช้รูปสุ่มตัวอักษร
                  const imageUrl = user.profileImage 
                      ? `http://localhost:8080/uploads/profiles/${user.profileImage}` 
                      : `https://ui-avatars.com/api/?name=${user.firstName || 'U'}&background=random`;

                  return (
                    <tr key={user.id}>
                      <td>
                        {/* 🌟 นำตัวแปร imageUrl มาใส่ใน src 🌟 */}
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