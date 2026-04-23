import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Addcourse.css'; // สร้างไฟล์ CSS แยกหรือใช้ร่วมกับ Newuser.css

function Addcourse() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    courseName: '',
    category: 'วิทยาศาสตร์',
    courseTime: '',
    tutorName: '',
    status: 'เปิดรับสมัคร',
    courseIcon: '📚',
    startDate: '',       // เพิ่มใหม่: วันที่เริ่มเรียน
    totalHours: '',      // เพิ่มใหม่: จำนวนชั่วโมงทั้งหมด
    price: '',           // เพิ่มใหม่: ราคาคอร์ส
    capacity: '',        // เพิ่มใหม่: จำนวนที่รับ
    description: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // เพิ่ม Logic การยิง API ตรงนี้
    console.log("Course Data:", formData);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/course');
    }, 1000);
  };

  return (
    <div className="newuser-container">
      <main className="main-content">
        <section className="content-header">
          <h1><i className="fas fa-book-medical"></i> เพิ่มคอร์สเรียนใหม่</h1>
        </section>

        <section className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-layout">
              
              {/* ส่วนเลือก Icon หรือรูปภาพประกอบคอร์ส */}
              <div className="profile-upload-section">
                <div className="profile-placeholder">
                  <span style={{ fontSize: '60px' }}>{formData.courseIcon}</span>
                </div>
                <label style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>ไอคอนคอร์ส</label>
                <select id="courseIcon" value={formData.courseIcon} onChange={handleInputChange} className="form-control" style={{ marginTop: '10px' }}>
                  <option value="📚">📚 ทั่วไป</option>
                  <option value="🧮">🧮 คณิตศาสตร์</option>
                  <option value="🧪">🧪 วิทยาศาสตร์</option>
                  <option value="🇬🇧">🇬🇧 ภาษาอังกฤษ</option>
                  <option value="🎨">🎨 ศิลปะ</option>
                </select>
              </div>

              {/* ส่วนกรอกข้อมูลคอร์ส */}
              <div className="form-fields">
                <div className="form-grid">
                  <div className="form-group">
                    <label>ชื่อคอร์สเรียน <span>*</span></label>
                    <input type="text" id="courseName" value={formData.courseName} onChange={handleInputChange} required placeholder="เช่น ฟิสิกส์ ม.4 เทอม 1" />
                  </div>

                  <div className="form-group">
                    <label>หมวดหมู่ <span>*</span></label>
                    <select id="category" value={formData.category} onChange={handleInputChange}>
                      <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                      <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                      <option value="ภาษาไทย">ภาษาไทย</option>
                      <option value="ภาษาต่างประเทศ">ภาษาต่างประเทศ</option>
                      <option value="ศิลปะ">ศิลปะ</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>ชื่อผู้สอน (Tutor) <span>*</span></label>
                    <input type="text" id="tutorName" value={formData.tutorName} onChange={handleInputChange} required placeholder="ชื่ออาจารย์ผู้สอน" />
                  </div>

                  <div className="form-group">
                    <label>วัน-เวลาเรียน <span>*</span></label>
                    <input type="text" id="courseTime" value={formData.courseTime} onChange={handleInputChange} required placeholder="เช่น เสาร์-อาทิตย์ 09:00-12:00" />
                  </div>

                  {/* เพิ่มใหม่: วันที่เริ่มเรียน */}
                  <div className="form-group">
                    <label>วันที่เริ่มเรียน <span>*</span></label>
                    <input type="date" id="startDate" value={formData.startDate} onChange={handleInputChange} required />
                  </div>

                  {/* เพิ่มใหม่: จำนวนชั่วโมงทั้งหมด */}
                  <div className="form-group">
                    <label>จำนวนชั่วโมงทั้งหมด <span>*</span></label>
                    <input type="number" id="totalHours" value={formData.totalHours} onChange={handleInputChange} required placeholder="เช่น 30" />
                  </div>

                  {/* เพิ่มใหม่: ราคาคอร์ส */}
                  <div className="form-group">
                    <label>ราคาคอร์ส (บาท) <span>*</span></label>
                    <input type="number" id="price" value={formData.price} onChange={handleInputChange} required placeholder="เช่น 3500" />
                  </div>

                  {/* เพิ่มใหม่: จำนวนที่รับ */}
                  <div className="form-group">
                    <label>จำนวนที่เปิดรับ (คน) <span>*</span></label>
                    <input type="number" id="capacity" value={formData.capacity} onChange={handleInputChange} required placeholder="เช่น 20" />
                  </div>

                  <div className="form-group">
                    <label>สถานะคอร์ส</label>
                    <select id="status" value={formData.status} onChange={handleInputChange}>
                      <option value="เปิดรับสมัคร">เปิดรับสมัคร</option>
                      <option value="กำลังสอน">กำลังสอน</option>
                      <option value="จบแล้ว">จบแล้ว</option>
                      <option value="ปิดปรับปรุง">ปิดปรับปรุง</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-full remarks-group">
                  <label>รายละเอียดคอร์สเรียน (Description)</label>
                  <textarea id="description" value={formData.description} onChange={handleInputChange} rows="4" placeholder="ระบุรายละเอียดเนื้อหาการเรียน..."></textarea>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save" disabled={isLoading}>
                    <i className="fas fa-save"></i> {isLoading ? 'กำลังบันทึก...' : 'บันทึกคอร์สเรียน'}
                  </button>
                  <button type="button" className="btn-cancel" onClick={() => navigate('/course')}>
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

export default Addcourse;