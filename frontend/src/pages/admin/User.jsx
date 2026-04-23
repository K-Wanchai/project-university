import React, { useState, useEffect } from 'react';
import './User.css'; // 
import { Link } from 'react-router-dom';

const API_BASE_URL = "http://localhost:8080/api/admin/users";

function User() {
  // 1. สร้าง State สำหรับเก็บข้อมูลต่างๆ
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  // State สำหรับ Modal และฟอร์ม
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    phone: '',
    role: 'นักเรียน',
    status: 'ปกติ'
  });

  // 2. ใช้ useEffect เพื่อดึงข้อมูลตอนโหลดหน้าครั้งแรก (เหมือน DOMContentLoaded)
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
      alert("ไม่สามารถดึงข้อมูลได้ โปรดตรวจสอบการเชื่อมต่อ Backend");
    }
  };

  // 3. กรองข้อมูลแบบ Real-time (React จะคำนวณใหม่เมื่อ state เปลี่ยน)
  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const username = (user.username || '').toLowerCase();
    
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || username.includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // 4. จัดการฟอร์ม และ Modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (mode, id = null) => {
    if (mode === 'add') {
      setCurrentEditId(null);
      setFormData({
        fullname: '', username: '', email: '', phone: '', role: 'นักเรียน', status: 'ปกติ'
      });
    } else {
      setCurrentEditId(id);
      const user = users.find(u => u.id === id);
      if (user) {
        setFormData({
          fullname: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          username: user.username || '',
          email: user.email || '',
          phone: user.phoneNumber || '',
          role: user.role || 'นักเรียน',
          status: user.status || 'ปกติ'
        });
      }
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const saveData = async (e) => {
    e.preventDefault(); // ป้องกันหน้าเว็บรีเฟรชตอนกด submit form
    
    const nameParts = formData.fullname.trim().split(' ');
    const userData = {
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      username: formData.username,
      email: formData.email,
      phoneNumber: formData.phone,
      role: formData.role,
      status: formData.status
    };

    if (!userData.firstName || !userData.username || !userData.email) {
      alert("กรุณากรอกข้อมูลที่จำเป็น (ชื่อ, ชื่อผู้ใช้, อีเมล) ให้ครบถ้วน");
      return;
    }

    const method = currentEditId ? 'PUT' : 'POST';
    const url = currentEditId ? `${API_BASE_URL}/${currentEditId}` : API_BASE_URL;

    setIsSaving(true);

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "บันทึกไม่สำเร็จ");
      }

      alert(currentEditId ? "แก้ไขข้อมูลสำเร็จ!" : "เพิ่มผู้ใช้ใหม่สำเร็จ!");
      closeModal();
      loadUsersTable();
    } catch (err) {
      console.error("Error:", err);
      alert("เกิดข้อผิดพลาด: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งานนี้? (ลบแล้วกู้คืนไม่ได้)")) {
      try {
        const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("ลบไม่สำเร็จ");
        alert("ลบผู้ใช้งานเรียบร้อยแล้ว");
        loadUsersTable();
      } catch (err) {
        console.error("Error deleting:", err);
        alert("เกิดข้อผิดพลาดในการลบผู้ใช้งาน");
      }
    }
  };

  // 5. ส่วนแสดงผล (JSX)
  return (
    <div className="container">
      {/* Sidebar - สามารถแยกเป็น Component ต่างหากได้ในอนาคต */}
      <nav className="sidebar">
        <div className="logo-section">
          <div className="logo-icon"><i className="fas fa-brain"></i></div>
          <h2>ครูปุ๊ก ติวเตอร์</h2>
        </div>
        <ul className="nav-menu">
          <li>
          <Link to="/"><i className="fas fa-home"></i> หน้าหลัก</Link></li>

          <li className="menu-header">การจัดการผู้ใช้</li>
          <li className="active"><a href="/user"><i className="fas fa-users"></i> ข้อมูลผู้ใช้งาน</a></li>

          <li className="menu-header">การจัดการสถาบัน</li>
          <li><a href="#"><i className="fas fa-school"></i> ข้อมูลโรงเรียนกวดวิชา</a></li>
          <li><a href="#"><i className="fas fa-map-marker-alt"></i> ข้อมูลสถาบันที่จัดสอบ</a></li>

          <li className="menu-header">การจัดการเนื้อหา</li>
          <li><a href="#"><i className="fas fa-book"></i> ข้อมูลคอร์สเรียน</a></li>
          <li className="bottom-menu"><a href="#"><i className="fas fa-key"></i> เปลี่ยนรหัสผ่าน</a></li>
        </ul>
      </nav>

      <main className="main-content">
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
                <th>วันที่เข้าร่วม</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: "center" }}>ไม่พบข้อมูลผู้ใช้งาน</td></tr>
              ) : (
                filteredUsers.map(user => {
                  let statusText = user.status || 'ปกติ';
                  const isStatusActive = (statusText === 'ปกติ' || statusText === 'ใช้งานอยู่');
                  
                  return (
                    <tr key={user.id}>
                      <td>
                        <img 
                          src={`https://ui-avatars.com/api/?name=${user.firstName}&background=random`} 
                          alt="avatar"
                          className="avatar-img" 
                          style={{ borderRadius: "50%", width: "40px", height: "40px" }} 
                        />
                      </td>
                      <td>{user.firstName || ''} {user.lastName || ''}</td>
                      <td>{user.username || '-'}</td>
                      <td>{user.email || '-'}</td>
                      <td>{user.role || '-'}</td>
                      <td>
                        <span className={`status-badge ${isStatusActive ? 'status-active' : 'status-inactive'}`}>
                          {statusText}
                        </span>
                      </td>
                      <td>-</td>
                      <td>
                        <button onClick={() => openModal('edit', user.id)} style={{ cursor: "pointer", border: "none", background: "none", color: "#3b82f6" }}>
                          <i className="fas fa-edit"></i> แก้ไข
                        </button>
                        <button onClick={() => deleteUser(user.id)} style={{ cursor: "pointer", border: "none", background: "none", color: "#ef4444", marginLeft: "10px" }}>
                          <i className="fas fa-trash"></i> ลบ
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button className="page-btn">ก่อนหน้า</button>
            <button className="page-num active">1</button>
            <button className="page-num">2</button>
            <button className="page-num">3</button>
            <button className="page-btn">ถัดไป</button>
          </div>
        </section>
      </main>

      {/* --- ส่วนของ Modal เพิ่ม/แก้ไขผู้ใช้ (สร้างให้ใหม่ เพราะใน HTML เดิมไม่มี) --- */}
      {isModalOpen && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
          <div className="modal-content" style={{ background: '#fff', padding: '20px', borderRadius: '8px', maxWidth: '500px', margin: '10% auto' }}>
            <h2 id="modalTitle">{currentEditId ? 'แก้ไขข้อมูลผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่'}</h2>
            <form onSubmit={saveData} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
              
              <input type="text" name="fullname" placeholder="ชื่อ-นามสกุล" value={formData.fullname} onChange={handleInputChange} required />
              <input type="text" name="username" placeholder="ชื่อผู้ใช้" value={formData.username} onChange={handleInputChange} required />
              <input type="email" name="email" placeholder="อีเมล" value={formData.email} onChange={handleInputChange} required />
              <input type="text" name="phone" placeholder="เบอร์โทรศัพท์" value={formData.phone} onChange={handleInputChange} />
              
              <select name="role" value={formData.role} onChange={handleInputChange}>
                <option value="นักเรียน">นักเรียน</option>
                <option value="ผู้ดูแลระบบ">ผู้ดูแลระบบ</option>
              </select>

              <select name="status" value={formData.status} onChange={handleInputChange}>
                <option value="ปกติ">ปกติ</option>
                <option value="ระงับการใช้งาน">ระงับการใช้งาน</option>
              </select>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                <button type="button" onClick={closeModal} style={{ padding: '8px 16px' }}>ยกเลิก</button>
                <button type="submit" disabled={isSaving} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}>
                  {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default User;