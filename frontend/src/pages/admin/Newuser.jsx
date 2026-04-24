import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './Newuser.css';

// 🌟 1. Import จากศูนย์กลาง
import apiService from '../../services/apiService';
import { SERVER_URL } from '../../config';

function Newuser() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('id');

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

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
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // 🌟 2. โหลดข้อมูลโดยใช้ apiService
  useEffect(() => {
    if (userId) {
      apiService.getUserById(userId)
        .then(u => {
          setFormData({
            fullName: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
            username: u.username || '',
            password: '',
            confirmPassword: '',
            phone: u.phoneNumber || '',
            email: u.email || '',
            role: u.role ? u.role.trim() : 'ติวเตอร์',
            status: u.status || 'ใช้งานอยู่',
            remarks: u.remarks || ''
          });

          if (u.profileImage) {
            setPreviewImage(`${SERVER_URL}/uploads/profiles/${u.profileImage}`);
          }
        })
        .catch(err => console.error("Error loading user:", err));
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        return alert("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      }
    }

    const [fName, ...lName] = formData.fullName.trim().split(' ');

    const submitData = new FormData();
    submitData.append('firstName', fName || '');
    submitData.append('lastName', lName.join(' ') || '');
    submitData.append('username', formData.username);
    submitData.append('phoneNumber', formData.phone);
    submitData.append('email', formData.email);
    submitData.append('role', formData.role);
    submitData.append('status', userId ? formData.status : 'ใช้งานอยู่');
    submitData.append('remarks', formData.remarks);

    if (formData.password) submitData.append('password', formData.password);
    if (profileImage) submitData.append('profileImage', profileImage);

    setIsLoading(true);
    try {
      // 🌟 3. บันทึกข้อมูลผ่าน apiService
      let res;
      if (userId) {
        res = await apiService.updateUser(userId, submitData);
      } else {
        res = await apiService.createUser(submitData);
      }

      if (!res.ok) throw new Error("บันทึกไม่สำเร็จ");
      alert(userId ? "อัปเดตข้อมูลสำเร็จ!" : "สร้างผู้ใช้งานใหม่สำเร็จ!");
      navigate('/user');
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="newuser-page-container">
      <Sidebar />
      <main className="newuser-main-content">
        
        <header className="newuser-header" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            type="button" 
            onClick={() => navigate('/user')} 
            className="btn-back-header"
            title="ย้อนกลับไปหน้าผู้ใช้งาน"
          >
            <i className="fas fa-arrow-left"></i>
            <span>ย้อนกลับ</span>
          </button>
          <h1 style={{ margin: 0 }}>{userId ? "แก้ไขข้อมูลผู้ใช้งาน" : "เพิ่มผู้ใช้งานใหม่"}</h1>
        </header>

        <section className="newuser-form-card">
          <form onSubmit={handleSubmit}>
            <div className="newuser-form-layout">
              <div className="newuser-profile-section">
                <div className="newuser-avatar-box" style={{ overflow: 'hidden' }}>
                  {previewImage ? (
                    <img src={previewImage} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <i className="fas fa-user"></i>
                  )}
                </div>
                <button type="button" className="newuser-btn-upload" onClick={handleUploadClick}>
                  อัปโหลดรูปโปรไฟล์
                </button>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>

              <div className="newuser-fields-section">
                
                <div className="newuser-form-group full-width">
                  <label>บทบาท <span>*</span></label>
                  
                  {formData.role === 'นักเรียน' ? (
                    <div style={{
                      padding: '12px 14px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      color: '#475569',
                      fontSize: '15px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <i className="fas fa-user-graduate" style={{ color: '#3b82f6' }}></i> นักเรียน
                    </div>
                  ) : (
                    <select 
                      id="role" 
                      value={formData.role} 
                      onChange={handleInputChange}
                    >
                      <option value="ติวเตอร์">ติวเตอร์</option>
                      <option value="ผู้ดูแลระบบ">ผู้ดูแลระบบ</option>
                    </select>
                  )}

                  {userId && formData.role === 'นักเรียน' && (
                    <small style={{ color: '#64748b', marginTop: '5px', display: 'block' }}>
                      * บัญชีนี้เป็นนักเรียน ไม่สามารถแก้ไขบทบาทได้
                    </small>
                  )}
                </div>

                <div className="newuser-input-grid">
                  <div className="newuser-form-group">
                    <label>ชื่อ-นามสกุล <span>*</span></label>
                    <input type="text" id="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="นายปิติ สุขสมบูรณ์" />
                  </div>

                  <div className="newuser-form-group">
                    <label>ชื่อผู้ใช้ <span>*</span></label>
                    <input type="text" id="username" value={formData.username} onChange={handleInputChange} required disabled={!!userId} className={userId ? "input-disabled" : ""} />
                  </div>

                  <div className="newuser-form-group password-wrap">
                    <label>{userId ? "รหัสผ่านใหม่ (เว้นว่างได้)" : "รหัสผ่าน *"} </label>
                    <input type={showPwd ? "text" : "password"} id="password" value={formData.password} onChange={handleInputChange} required={!userId} />
                    <i className={`fas ${showPwd ? 'fa-eye-slash' : 'fa-eye'}`} onClick={() => setShowPwd(!showPwd)}></i>
                  </div>

                  <div className="newuser-form-group password-wrap">
                    <label>{userId ? "ยืนยันรหัสผ่านใหม่" : "ยืนยันรหัสผ่าน *"}</label>
                    <input type={showConfirmPwd ? "text" : "password"} id="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required={!userId} />
                    <i className={`fas ${showConfirmPwd ? 'fa-eye-slash' : 'fa-eye'}`} onClick={() => setShowConfirmPwd(!showConfirmPwd)}></i>
                  </div>

                  <div className="newuser-form-group">
                    <label>เบอร์โทรศัพท์ <span>*</span></label>
                    <input type="text" id="phone" value={formData.phone} onChange={handleInputChange} required placeholder="08x-xxxxxxx" />
                  </div>

                  <div className="newuser-form-group">
                    <label>อีเมล <span>*</span></label>
                    <input type="email" id="email" value={formData.email} onChange={handleInputChange} required placeholder="example@krupuk.com" />
                  </div>

                  {userId && formData.role !== 'นักเรียน' && (
                    <div className="newuser-form-group">
                      <label>สถานะ</label>
                      <select id="status" value={formData.status} onChange={handleInputChange}>
                        <option value="ใช้งานอยู่">ใช้งานอยู่</option>
                        <option value="ระงับการใช้งาน">ระงับการใช้งาน</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="newuser-form-group full-width remarks-area">
                  <label>บันทึกเพิ่มเติม (Remarks)</label>
                  <textarea id="remarks" value={formData.remarks} onChange={handleInputChange} rows="3" placeholder="พิมพ์ข้อความเพิ่มเติม (ถ้ามี)"></textarea>
                </div>

                <div className="newuser-form-actions">
                  <button type="submit" className="btn-save" disabled={isLoading}>
                    <i className="fas fa-check"></i> {isLoading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                  </button>
                  <button type="button" className="btn-cancel" onClick={() => navigate('/user')}>
                    ยกเลิก
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