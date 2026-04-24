import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar'; 
import './User.css'; 
import Header from '../../components/Header';

// 🌟 1. Import apiService และ SERVER_URL จากศูนย์กลาง
import apiService from '../../services/apiService';
import { SERVER_URL } from '../../config';

function User() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    loadUsersTable();
  }, []);

  const loadUsersTable = async () => {
    try {
      // 🌟 2. ใช้ apiService ดึงข้อมูลแทนการใช้ fetch ตรงๆ
      const data = await apiService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งานนี้?")) {
      try {
        // 🌟 3. ใช้ apiService ลบข้อมูล
        const res = await apiService.deleteUser(id);
        if (!res.ok) throw new Error("ลบไม่สำเร็จ");
        
        alert("ลบผู้ใช้งานเรียบร้อยแล้ว");
        loadUsersTable();
      } catch (err) {
        alert("เกิดข้อผิดพลาดในการลบผู้ใช้งาน");
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.username?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === '' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="container" style={{ display: 'flex' }}>
      <Sidebar />

      <main className="main-content" style={{ flex: 1, marginLeft: '260px', padding: '20px' }}>
        <Header title="ข้อมูลผู้ใช้งาน" /> 

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
                  
                  // 🌟 4. ปรับ URL รูปภาพให้ดึง SERVER_URL มาจาก config.js
                  const imageUrl = user.profileImage 
                      ? `${SERVER_URL}/uploads/profiles/${user.profileImage}` 
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