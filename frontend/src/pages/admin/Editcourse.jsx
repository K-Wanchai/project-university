import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Editcourse.css'; 
import Sidebar from '../../components/Sidebar'; 
import Header from '../../components/Header';

const API_URL = "http://localhost:8080/api/admin/courses";

function Editcourse() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [courseImage, setCourseImage] = useState(null); // ไฟล์รูปใหม่ที่เลือก
  const [previewImage, setPreviewImage] = useState(null); // URL รูปสำหรับโชว์

  const [formData, setFormData] = useState({
    courseName: '',
    category: 'วิทยาศาสตร์',
    courseTime: '',
    tutorName: '',
    status: 'เปิดรับสมัคร',
    price: '',
    startDate: '', 
    totalHours: '', 
    description: ''
  });

  // 🌟 ดึงข้อมูลคอร์สเดิมจากฐานข้อมูลมาแสดง 🌟
  useEffect(() => {
    if (id) {
      fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            courseName: data.courseName || '',
            category: data.subject || 'วิทยาศาสตร์',
            courseTime: data.learningChannel || '',
            tutorName: data.instructor || '',
            status: data.status || 'เปิดรับสมัคร',
            price: data.price || '',
            startDate: data.startDate ? data.startDate.split('T')[0] : '', // ตัดเวลาออกให้เหลือแต่วันที่
            totalHours: data.hours || '',
            description: data.description || ''
          });

          // ถ้ามีรูปเดิม ให้ดึงมาแสดงพรีวิว
          if (data.imageUrl && data.imageUrl.trim() !== '') {
            setPreviewImage(`http://localhost:8080/uploads/courses/${data.imageUrl}`);
          }
        })
        .catch(err => console.error("Error fetching course:", err));
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseImage(file);
      setPreviewImage(URL.createObjectURL(file)); // โชว์รูปใหม่ทันทีที่เลือก
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 🌟 ใช้ FormData เพื่อให้แนบไฟล์รูปไปได้ 🌟
    const submitData = new FormData();
    submitData.append('courseName', formData.courseName);
    submitData.append('subject', formData.category);
    submitData.append('instructor', formData.tutorName);
    submitData.append('learningChannel', formData.courseTime);
    if(formData.startDate) submitData.append('startDate', formData.startDate);
    submitData.append('hours', formData.totalHours);
    submitData.append('price', formData.price);
    submitData.append('status', formData.status);
    submitData.append('description', formData.description);

    // ส่งรูปไปเฉพาะตอนที่มีการเลือกรูปใหม่เท่านั้น
    if (courseImage) {
      submitData.append('courseImage', courseImage);
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        body: submitData 
      });

      if (!response.ok) throw new Error("แก้ไขข้อมูลไม่สำเร็จ");

      alert('อัปเดตข้อมูลคอร์สเรียนเรียบร้อยแล้ว!');
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
          <h1 style={{ color: '#1e293b' }}><i className="fas fa-edit"></i> แก้ไขข้อมูลคอร์สเรียน (ID: {id})</h1>
        </header>

        <section className="form-card" style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-layout" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              
              <div className="profile-upload-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px' }}>
                <div className="profile-placeholder" style={{ width: '150px', height: '150px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                  {previewImage ? (
                    <img src={previewImage} alt="Course Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <i className="fas fa-book-open" style={{fontSize: '50px', color: '#cbd5e1'}}></i>
                  )}
                </div>
                <button type="button" onClick={() => fileInputRef.current.click()} className="btn-upload" style={{ marginTop: '15px', width: '100%', padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontWeight: 'bold', color: '#475569', cursor: 'pointer' }}>
                  เปลี่ยนรูปคอร์ส
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  style={{ display: 'none' }} 
                  accept="image/*"
                />
              </div>

              <div className="form-fields" style={{ flex: 1, minWidth: '300px' }}>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>ชื่อคอร์สเรียน <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" id="courseName" value={formData.courseName} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
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
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>วัน-เวลาเรียน <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" id="courseTime" value={formData.courseTime} onChange={handleInputChange} placeholder="เช่น จ.-ศ. 18:00-20:00" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>อาจารย์ผู้สอน <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" id="tutorName" value={formData.tutorName} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>ราคา (บาท)</label>
                    <input type="number" id="price" value={formData.price} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>วันที่เริ่มสอน</label>
                    <input type="date" id="startDate" value={formData.startDate} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>ชั่วโมงเรียนทั้งหมด</label>
                    <input type="number" id="totalHours" value={formData.totalHours} onChange={handleInputChange} required placeholder="เช่น 20" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
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
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>รายละเอียดคอร์สเพิ่มเติม</label>
                  <textarea id="description" value={formData.description} onChange={handleInputChange} rows="4" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}></textarea>
                </div>

                <div className="form-actions" style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                  <button type="submit" className="btn-save" disabled={isLoading} style={{ background: '#10b981', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    <i className="fas fa-save"></i> {isLoading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
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

export default Editcourse;