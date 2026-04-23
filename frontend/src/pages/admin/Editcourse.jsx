import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './Editcourse.css'; 
import Sidebar from '../../components/Sidebar'; 

function Editcourse() {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const [formData, setFormData] = useState({
    courseName: '',
    category: '',
    time: '',
    tutor: '',
    status: 'เปิดรับสมัคร',
    statusType: 'open',
    price: '',
    startDate: '', 
    totalHours: '', 
    description: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setFormData({
        courseName: 'คณิตศาสตร์ ม.ปลาย',
        category: 'วิทยาศาสตร์',
        time: 'จ.-ศ. 18:00-20:00',
        tutor: 'ครูปุ๊ก',
        status: 'เปิดรับสมัคร',
        statusType: 'open',
        price: '3500',
        startDate: '2026-05-24', 
        totalHours: '20',
        description: 'เน้นตะลุยโจทย์ PAT1 และวิชาสามัญ'
      });
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("บันทึกข้อมูลคอร์ส:", formData);
    
    setTimeout(() => {
      setIsLoading(false);
      alert('บันทึกข้อมูลเรียบร้อยแล้ว');
      navigate('/course'); 
    }, 1000);
  };

  return (
     <div className="container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      
      <Sidebar />

      {/* 🌟 จุดที่แก้ไข: ดันเนื้อหาหนี Sidebar 260px 🌟 */}
      <main className="main-content" style={{ flex: 1, marginLeft: '260px', padding: '30px' }}>
        <header className="content-header" style={{ marginBottom: '20px' }}>
          <h1 style={{ color: '#1e293b' }}><i className="fas fa-edit"></i> แก้ไขข้อมูลคอร์สเรียน (ID: {id})</h1>
        </header>

        <section className="form-card" style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-layout" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              
              <div className="profile-upload-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px' }}>
                <div className="profile-placeholder" style={{ width: '150px', height: '150px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <i className="fas fa-book-open" style={{fontSize: '50px', color: '#cbd5e1'}}></i>
                </div>
                <button type="button" className="btn-upload" style={{ marginTop: '15px', width: '100%', padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontWeight: 'bold', color: '#475569', cursor: 'pointer' }}>เปลี่ยนรูปคอร์ส</button>
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
                    <input type="text" id="time" value={formData.time} onChange={handleInputChange} placeholder="เช่น จ.-ศ. 18:00-20:00" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>อาจารย์ผู้สอน <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" id="tutor" value={formData.tutor} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>ราคา (บาท)</label>
                    <input type="number" id="price" value={formData.price} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>วันที่เริ่มสอน</label>
                    <input type="date" id="startDate" value={formData.startDate} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>ชั่วโมงเรียนทั้งหมด</label>
                    <input type="number" id="totalHours" value={formData.totalHours} onChange={handleInputChange} placeholder="เช่น 20" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>สถานะคอร์ส</label>
                    <select id="status" value={formData.status} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <option value="เปิดรับสมัคร">เปิดรับสมัคร</option>
                      <option value="กำลังสอน">กำลังสอน</option>
                      <option value="จบแล้ว">จบแล้ว</option>
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