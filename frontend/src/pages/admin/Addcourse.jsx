import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Addcourse.css'; 
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

// 🌟 URL สำหรับยิงข้อมูลไปหา Spring Boot
const API_URL = "http://localhost:8080/api/admin/courses";

function Addcourse() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [courseImage, setCourseImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    courseName: '',
    category: 'วิทยาศาสตร์',
    courseTime: '',
    tutorName: '',
    status: 'เปิดรับสมัคร',
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const submitData = new FormData();
    submitData.append('courseName', formData.courseName);
    submitData.append('subject', formData.category);
    submitData.append('instructor', formData.tutorName);
    submitData.append('learningChannel', formData.courseTime);
    submitData.append('startDate', formData.startDate);
    submitData.append('hours', formData.totalHours);
    submitData.append('price', formData.price);
    submitData.append('status', formData.status);
    submitData.append('description', formData.description);

    if (courseImage) {
      submitData.append('courseImage', courseImage);
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: submitData 
      });

      if (!response.ok) throw new Error("ไม่สามารถบันทึกคอร์สเรียนได้");

      alert('เพิ่มคอร์สเรียนใหม่สำเร็จ!');
      navigate('/course');
    } catch (error) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
   <div className="container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar />
      <main className="main-content" style={{ flex: 1, marginLeft: '260px', padding: '30px' }}>
        <header className="content-header" style={{ marginBottom: '20px' }}>
          <h1 style={{ color: '#1e293b' }}><i className="fas fa-book-medical"></i> เพิ่มคอร์สเรียนใหม่</h1>
        </header>

        <section className="form-card" style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-layout" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              
              {/* ส่วนอัปโหลดรูปภาพ */}
              <div className="profile-upload-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px' }}>
                <div className="profile-placeholder" style={{ width: '150px', height: '150px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <i className="fas fa-book-open" style={{ fontSize: '50px', color: '#cbd5e1' }}></i>
                  )}
                </div>
                <button 
                  type="button" 
                  className="btn-upload" 
                  onClick={() => fileInputRef.current.click()}
                  style={{ marginTop: '15px', padding: '8px 15px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#475569', width: '100%' }}
                >
                  เลือกรูปภาพคอร์ส
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  style={{ display: 'none' }} 
                  accept="image/*"
                />
              </div>

              {/* ส่วนกรอกข้อมูล */}
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