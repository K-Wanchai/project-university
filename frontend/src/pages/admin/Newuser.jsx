import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import './Newuser.css';

const API_URL = "http://localhost:8080/api/admin/users";

function Newuser() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('id');

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    email: '',
    role: 'ติวเตอร์',
    status: 'ใช้งานอยู่',
    remarks: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (userId) {
      fetch(`${API_URL}/${userId}`)
        .then(res => res.json())
        .then(user => {
          setFormData({
            fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            username: user.username || '',
            password: '',
            confirmPassword: '',
            phone: user.phoneNumber || '',
            email: user.email || '',
            role: user.role || 'ติวเตอร์',
            status: user.status || 'ใช้งานอยู่',
            remarks: user.remarks || ''
          });
        })
        .catch(err => {
          console.error(err);
          alert("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
        });
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    const nameParts = formData.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const payload = {
      firstName,
      lastName,
      username: formData.username,
      password: formData.password,
      phoneNumber: formData.phone,
      email: formData.email,
      role: formData.role,
      status: formData.status,
      remarks: formData.remarks
    };

    setIsLoading(true);
    const method = userId ? "PUT" : "POST";
    const finalUrl = userId ? `${API_URL}/${userId}` : API_URL;

    fetch(finalUrl, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (!res.ok) throw new Error("เกิดข้อผิดพลาดในการบันทึก");
      alert(userId ? "แก้ไขข้อมูลสำเร็จ!" : "สร้างผู้ใช้งานใหม่สำเร็จ!");
      navigate('/user'); 
    })
    .catch(err => alert(err.message))
    .finally(() => setIsLoading(false));
  };

  return (
    <div className="newuser-container">
      <nav className="sidebar">
        <div className="logo-section">
          <div className="logo-icon"><i className="fas fa-brain"></i></div>
          <h2>ครูปุ๊ก ติวเตอร์</h2>
        </div>
        <ul className="nav-menu">
          <li><Link to="/"><i className="fas fa-home"></i> หน้าหลัก</Link></li>
          <li className="menu-header">การจัดการผู้ใช้</li>
          <li className="active"><Link to="/user"><i className="fas fa-users"></i> ข้อมูลผู้ใช้งาน</Link></li>
          <li className="menu-header">การจัดการสถาบัน</li>
          <li><a href="#"><i className="fas fa-school"></i> ข้อมูลโรงเรียนกวดวิชา</a></li>
          <li><a href="#"><i className="fas fa-map-marker-alt"></i> ข้อมูลสถาบันที่จัดสอบ</a></li>
          <li className="menu-header">การจัดการเนื้อหา</li>
          <li><a href="#"><i className="fas fa-book"></i> ข้อมูลคอร์สเรียน</a></li>
        </ul>
      </nav>

      <main className="main-content">
        <header className="content-header">
          <h1>{userId ? "แก้ไขข้อมูลผู้ใช้งาน" : "เพิ่มผู้ใช้งานใหม่"}</h1>
        </header>

        <section className="form-card">
          <form id="userForm" onSubmit={handleSubmit}>
            <div className="form-layout">
              {/* ส่วนรูปโปรไฟล์ */}
              <div className="profile-upload-section">
                <div className="profile-placeholder">
                  <i className="fas fa-user"></i>
                </div>
                <button type="button" className="btn-upload">
                  อัปโหลดรูปโปรไฟล์
                </button>
              </div>

              {/* ส่วนข้อมูลฟอร์ม */}
              <div className="form-fields-section">
                <div className="form-group-full">
                  <label>บทบาท <span>*</span></label>
                  <select id="role" value={formData.role} onChange={handleInputChange}>
                    <option value="ติวเตอร์">ติวเตอร์</option>
                    <option value="ผู้ดูแลระบบ">ผู้ดูแลระบบ</option>
                  </select>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>ชื่อ-นามสกุล <span>*</span></label>
                    <input type="text" id="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="นายปิติ สุขสมบูรณ์" />
                  </div>

                  <div className="form-group">
                    <label>อีเมล <span>*</span></label>
                    <input type="email" id="email" value={formData.email} onChange={handleInputChange} required placeholder="piti.s@krupuk.com" />
                  </div>
                  
                  <div className="form-group">
                    <label>ชื่อผู้ใช้ <span>*</span></label>
                    <input type="text" id="username" value={formData.username} onChange={handleInputChange} required placeholder="piti_s" />
                  </div>

                  <div className="form-group password-field">
                    <label>รหัสผ่าน <span>*</span></label>
                    <input type={showPassword ? "text" : "password"} id="password" value={formData.password} onChange={handleInputChange} required={!userId} placeholder="รหัสผ่าน" />
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} onClick={() => setShowPassword(!showPassword)}></i>
                  </div>

                  <div className="form-group password-field">
                    <label>ยืนยันรหัสผ่าน <span>*</span></label>
                    <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required={!userId} placeholder="ยืนยันรหัสผ่าน" />
                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`} onClick={() => setShowConfirmPassword(!showConfirmPassword)}></i>
                  </div>

                  <div className="form-group">
                    <label>เบอร์โทรศัพท์ <span>*</span></label>
                    <input type="text" id="phone" value={formData.phone} onChange={handleInputChange} required placeholder="082-987-6543" />
                  </div>

                </div>

                <div className="form-group-full remarks-group">
                  <label>บันทึกเพิ่มเติม (Remarks)</label>
                  <textarea id="remarks" value={formData.remarks} onChange={handleInputChange} rows="3" placeholder="พิมพ์ข้อความเพิ่มเติม (optional)"></textarea>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save" disabled={isLoading}>
                    <i className="fas fa-check"></i> {isLoading ? 'กำลังบันทึก...' : 'สร้างผู้ใช้งาน'}
                  </button>
                  <button type="button" className="btn-cancel" onClick={() => navigate('/user')}>
                    <i className="fas fa-times"></i> ยกเลิก
                  </button>
                </div>
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Newuser;