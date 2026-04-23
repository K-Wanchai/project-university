import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './Editcourse.css'; // ใช้ CSS ที่ล้อตาม Newuser.css

function Editcourse() {
  const navigate = useNavigate();
  const { id } = useParams(); // รับ ID คอร์สจาก URL

  const [formData, setFormData] = useState({
    courseName: '',
    category: '',
    time: '',
    tutor: '',
    status: 'เปิดรับสมัคร',
    statusType: 'open',
    price: '',
    startDate: '', // เพิ่มใหม่: วันที่เริ่มสอน
    totalHours: '', // เพิ่มใหม่: ชั่วโมงเรียนทั้งหมด
    description: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  // จำลองการดึงข้อมูลเดิมมาแสดง
  useEffect(() => {
    if (id) {
      // ในสถานการณ์จริง ข้อมูลเหล่านี้จะมาจาก API
      setFormData({
        courseName: 'คณิตศาสตร์ ม.ปลาย',
        category: 'วิทยาศาสตร์',
        time: 'จ.-ศ. 18:00-20:00',
        tutor: 'ครูปุ๊ก',
        status: 'เปิดรับสมัคร',
        statusType: 'open',
        price: '3500',
        startDate: '2026-05-24', // ตัวอย่าง Format YYYY-MM-DD สำหรับ input type="date"
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
    
    // Logic การส่งข้อมูลไปยัง API
    console.log("บันทึกข้อมูลคอร์ส:", formData);
    
    setTimeout(() => {
      setIsLoading(false);
      alert('บันทึกข้อมูลเรียบร้อยแล้ว');
      navigate('/course'); // กลับไปหน้าคอร์สเรียน
    }, 1000);
  };

  return (
    <div className="editcourse-container">
      <main className="main-content">
        <header className="content-header">
          <h1><i className="fas fa-edit"></i> แก้ไขข้อมูลคอร์สเรียน (ID: {id})</h1>
        </header>

        <section className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-layout">
              {/* ส่วนรูปไอคอนคอร์ส */}
              <div className="profile-upload-section">
                <div className="profile-placeholder">
                  <i className="fas fa-book-open" style={{fontSize: '50px', color: '#cbd5e1'}}></i>
                </div>
                <button type="button" className="btn-upload">เปลี่ยนรูปคอร์ส</button>
              </div>

              <div className="form-fields">
                <div className="form-grid">
                  <div className="form-group">
                    <label>ชื่อคอร์สเรียน <span>*</span></label>
                    <input type="text" id="courseName" value={formData.courseName} onChange={handleInputChange} required />
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
                    <label>วัน-เวลาเรียน <span>*</span></label>
                    <input type="text" id="time" value={formData.time} onChange={handleInputChange} placeholder="เช่น จ.-ศ. 18:00-20:00" />
                  </div>

                  <div className="form-group">
                    <label>อาจารย์ผู้สอน <span>*</span></label>
                    <input type="text" id="tutor" value={formData.tutor} onChange={handleInputChange} />
                  </div>

                  <div className="form-group">
                    <label>ราคา (บาท)</label>
                    <input type="number" id="price" value={formData.price} onChange={handleInputChange} />
                  </div>

                  {/* เพิ่มใหม่: วันที่เริ่มสอน */}
                  <div className="form-group">
                    <label>วันที่เริ่มสอน</label>
                    <input type="date" id="startDate" value={formData.startDate} onChange={handleInputChange} />
                  </div>

                  {/* เพิ่มใหม่: ชั่วโมงเรียนทั้งหมด */}
                  <div className="form-group">
                    <label>ชั่วโมงเรียนทั้งหมด</label>
                    <input type="number" id="totalHours" value={formData.totalHours} onChange={handleInputChange} placeholder="เช่น 20" />
                  </div>

                  <div className="form-group">
                    <label>สถานะคอร์ส</label>
                    <select id="status" value={formData.status} onChange={handleInputChange}>
                      <option value="เปิดรับสมัคร">เปิดรับสมัคร</option>
                      <option value="กำลังสอน">กำลังสอน</option>
                      <option value="จบแล้ว">จบแล้ว</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-full remarks-group">
                  <label>รายละเอียดคอร์สเพิ่มเติม</label>
                  <textarea id="description" value={formData.description} onChange={handleInputChange} rows="4"></textarea>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save" disabled={isLoading}>
                    <i className="fas fa-save"></i> {isLoading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
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

export default Editcourse;