import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Addcourse.css'; 
import Sidebar from '../../components/Sidebar';

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
    startDate: '',       
    totalHours: '',      
    price: '',           
    capacity: '',        
    description: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Course Data:", formData);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/course');
    }, 1000);
  };

  return (
   <div className="container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      
      <Sidebar />
      
      {/* 🌟 จุดที่แก้ไข: ดันเนื้อหาหนี Sidebar 260px 🌟 */}
      <main className="main-content" style={{ flex: 1, marginLeft: '260px', padding: '30px' }}>
        <section className="content-header" style={{ marginBottom: '20px' }}>
          <h1 style={{ color: '#1e293b' }}><i className="fas fa-book-medical"></i> เพิ่มคอร์สเรียนใหม่</h1>
        </section>

        <section className="form-card" style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-layout" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              
              <div className="profile-upload-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px' }}>
                <div className="profile-placeholder" style={{ width: '150px', height: '150px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <span style={{ fontSize: '60px' }}>{formData.courseIcon}</span>
                </div>
                <label style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>ไอคอนคอร์ส</label>
                <select id="courseIcon" value={formData.courseIcon} onChange={handleInputChange} className="form-control" style={{ marginTop: '10px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option value="📚">📚 ทั่วไป</option>
                  <option value="🧮">🧮 คณิตศาสตร์</option>
                  <option value="🧪">🧪 วิทยาศาสตร์</option>
                  <option value="🇬🇧">🇬🇧 ภาษาอังกฤษ</option>
                  <option value="🎨">🎨 ศิลปะ</option>
                </select>
              </div>

              <div className="form-fields" style={{ flex: 1, minWidth: '300px' }}>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>ชื่อคอร์สเรียน <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" id="courseName" value={formData.courseName} onChange={handleInputChange} required placeholder="เช่น ฟิสิกส์ ม.4 เทอม 1" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>หมวดหมู่ <span style={{ color: 'red' }}>*</span></label>
                    <select id="category" value={formData.category} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                      <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                      <option value="ภาษาไทย">ภาษาไทย</option>
                      <option value="ภาษาต่างประเทศ">ภาษาต่างประเทศ</option>
                      <option value="ศิลปะ">ศิลปะ</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>ชื่อผู้สอน (Tutor) <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" id="tutorName" value={formData.tutorName} onChange={handleInputChange} required placeholder="ชื่ออาจารย์ผู้สอน" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>วัน-เวลาเรียน <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" id="courseTime" value={formData.courseTime} onChange={handleInputChange} required placeholder="เช่น เสาร์-อาทิตย์ 09:00-12:00" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>วันที่เริ่มเรียน <span style={{ color: 'red' }}>*</span></label>
                    <input type="date" id="startDate" value={formData.startDate} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>จำนวนชั่วโมงทั้งหมด <span style={{ color: 'red' }}>*</span></label>
                    <input type="number" id="totalHours" value={formData.totalHours} onChange={handleInputChange} required placeholder="เช่น 30" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>ราคาคอร์ส (บาท) <span style={{ color: 'red' }}>*</span></label>
                    <input type="number" id="price" value={formData.price} onChange={handleInputChange} required placeholder="เช่น 3500" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>จำนวนที่เปิดรับ (คน) <span style={{ color: 'red' }}>*</span></label>
                    <input type="number" id="capacity" value={formData.capacity} onChange={handleInputChange} required placeholder="เช่น 20" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>สถานะคอร์ส</label>
                    <select id="status" value={formData.status} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <option value="เปิดรับสมัคร">เปิดรับสมัคร</option>
                      <option value="กำลังสอน">กำลังสอน</option>
                      <option value="จบแล้ว">จบแล้ว</option>
                      <option value="ปิดปรับปรุง">ปิดปรับปรุง</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-full remarks-group" style={{ marginTop: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>รายละเอียดคอร์สเรียน (Description)</label>
                  <textarea id="description" value={formData.description} onChange={handleInputChange} rows="4" placeholder="ระบุรายละเอียดเนื้อหาการเรียน..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}></textarea>
                </div>

                <div className="form-actions" style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                  <button type="submit" className="btn-save" disabled={isLoading} style={{ background: '#10b981', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    <i className="fas fa-save"></i> {isLoading ? 'กำลังบันทึก...' : 'บันทึกคอร์สเรียน'}
                  </button>
                  <button type="button" className="btn-cancel" onClick={() => navigate('/course')} style={{ background: '#94a3b8', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
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