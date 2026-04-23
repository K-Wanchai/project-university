import React, { useState, useEffect, useRef } from 'react'; // เพิ่ม useRef เข้ามา
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './Newuser.css';

const API_URL = "http://localhost:8080/api/admin/users";

function Newuser() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('id');

  // 1. สร้าง State สำหรับเก็บไฟล์รูปและ Preview รูป
  const [profileImage, setProfileImage] = useState(null); // เก็บตัวไฟล์จริงๆ เพื่อส่งให้ Backend
  const [previewImage, setPreviewImage] = useState(null); // เก็บ URL สำหรับโชว์รูปบนหน้าจอ
  const fileInputRef = useRef(null); // ตัวอ้างอิงไปที่ปุ่มเลือกไฟล์ที่ถูกซ่อนไว้

  const [formData, setFormData] = useState({
    fullName: '', username: '', password: '', confirmPassword: '',
    phone: '', email: '', role: 'ติวเตอร์', status: 'ใช้งานอยู่', remarks: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  useEffect(() => {
    if (userId) {
      fetch(`${API_URL}/${userId}`)
        .then(res => res.json())
        .then(u => {
          setFormData({
            fullName: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
            username: u.username || '',
            password: '', confirmPassword: '', 
            phone: u.phoneNumber || '',
            email: u.email || '',
            role: u.role || 'ติวเตอร์',
            status: u.status || 'ใช้งานอยู่',
            remarks: u.remarks || ''
          });
          
          // ถ้ามีรูปเดิมจากฐานข้อมูล ให้เอามาโชว์ (สมมติว่า backend ส่ง URL รูปมาในฟิลด์ profileImageUrl)
          if (u.profileImageUrl) {
            setPreviewImage(u.profileImageUrl);
          }
        })
        .catch(err => console.error("Error loading user:", err));
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // 2. ฟังก์ชันจัดการเมื่อผู้ใช้เลือกรูปภาพ
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file); // เก็บไฟล์ลง State
      setPreviewImage(URL.createObjectURL(file)); // สร้าง URL จำลองเพื่อแสดง Preview
    }
  };

  // 3. ฟังก์ชันสั่งให้ปุ่ม "อัปโหลดรูป" ไปกด <input type="file"> ที่ซ่อนอยู่
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
    
    // 4. เปลี่ยนจากการสร้าง JSON เป็นการใช้ FormData แทน
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
    
    // แนบไฟล์รูปไปด้วย (ถ้ามีการเลือกรูปใหม่)
    if (profileImage) {
      submitData.append('profileImage', profileImage); 
      // ชื่อ 'profileImage' ตรงนี้ ฝั่ง Backend ต้องตั้งชื่อรับให้ตรงกันนะครับ
    }

    setIsLoading(true);
    try {
      const res = await fetch(userId ? `${API_URL}/${userId}` : API_URL, {
        method: userId ? 'PUT' : 'POST',
        // ⚠️ ข้อควรระวัง: ห้ามใส่ headers: { 'Content-Type': 'application/json' } เด็ดขาด! 
        // เบราว์เซอร์จะจัดการตั้งค่า Content-Type เป็น multipart/form-data ให้เองอัตโนมัติเมื่อเราส่ง FormData
        body: submitData
      });
      
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
        </header>

        <section className="newuser-form-card">
          <form onSubmit={handleSubmit}>
            <div className="newuser-form-layout">
              
              {/* --- 5. ส่วนแสดงผลการอัปโหลดรูปภาพ --- */}
              <div className="newuser-profile-section">
                <div className="newuser-avatar-box" style={{ overflow: 'hidden' }}>
                  {/* ถ้ามีรูป Preview ให้โชว์รูป ถ้าไม่มีโชว์ไอคอนสีเทา */}
                  {previewImage ? (
                    <img src={previewImage} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <i className="fas fa-user"></i>
                  )}
                </div>
                
                {/* ปุ่มหลอก สำหรับกดเพื่อทริกเกอร์ input จริง */}
                <button type="button" className="newuser-btn-upload" onClick={handleUploadClick}>
                  อัปโหลดรูปโปรไฟล์
                </button>

                {/* Input เลือกไฟล์ของจริง (ซ่อนไว้ไม่ให้มองเห็น เพราะมันไม่สวย) */}
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/jpg" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  style={{ display: 'none' }} 
                />
              </div>

              {/* ... (ส่วนฟอร์มกรอกข้อมูลที่เหลือเหมือนเดิมเป๊ะครับ) ... */}
              <div className="newuser-fields-section">
                <div className="newuser-form-group full-width">
                  <label>บทบาท <span>*</span></label>
                  <select id="role" value={formData.role} onChange={handleInputChange}>
                    <option value="ติวเตอร์">ติวเตอร์</option>
                    <option value="ผู้ดูแลระบบ">ผู้ดูแลระบบ</option>
                  </select>
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

                  {userId && (
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