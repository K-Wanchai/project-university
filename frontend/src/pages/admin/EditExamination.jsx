import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './EditExamination.css';
import { 
  FaArrowLeft, 
  FaSave, 
  FaUndo, 
  FaCamera, 
  FaChevronDown 
} from 'react-icons/fa';

const EditExamination = () => {
  const navigate = useNavigate();
  
  // State สำหรับเก็บข้อมูลฟอร์ม (จำลองข้อมูลเริ่มต้นจากรูปภาพ)
  const [formData, setFormData] = useState({
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="edit-exam-container" style={{ display: 'flex' }}>
      <Sidebar />
      
      <main className="main-content" style={{ marginLeft: '260px', width: '100%', padding: '20px' }}>
        <header className="content-header">
          <h1>แก้ไขข้อมูลสถาบันสอบ (มหาวิทยาลัยขอนแก่น)</h1>
        </header>

        <section className="form-card">
          <div className="action-buttons">
            <button className="btn-save"><FaSave /> บันทึกการแก้ไข</button>
            <button className="btn-cancel" onClick={() => navigate('/examination')}><FaUndo /> ยกเลิก</button>
          </div>

          <div className="form-grid-top">
            {/* ส่วนโลโก้ */}
            <div className="logo-section">
              <div className="logo-placeholder">
                <img src="https://upload.wikimedia.org/wikipedia/th/thumb/1/11/Khon_Kaen_University_Logo.svg/1200px-Khon_Kaen_University_Logo.svg.png" alt="KKU Logo" />
              </div>
              <button className="btn-upload"><FaCamera /> อัปโหลดโลโก้ใหม่</button>
            </div>

            {/* ข้อมูลพื้นฐาน */}
            <div className="input-group-top">
              <div className="input-row">
                <div className="input-field">
                  <label>ชื่อสถาบันสอบ (ภาษาไทย)</label>
                  <input type="text" name="nameTh" value={formData.nameTh} onChange={handleChange} />
                </div>
                <div className="input-field">
                  <label>ชื่อสถาบันสอบ (ภาษาอังกฤษ/ย่อ)</label>
                  <input type="text" name="nameEn" value={formData.nameEn} onChange={handleChange} />
                </div>
              </div>

              <div className="input-row">
                <div className="input-field">
                  <label>รหัสสถาบัน</label>
                  <input type="text" className="input" value={formData.code} onChange={handleChange} />
                </div>
                <div className="input-field">
                  <label>&nbsp;</label>
                  
                </div>
              </div>

              <div className="input-row">
                <div className="input-field">
                  <label>ประเภทสถาบัน</label>
                  <div className="select-wrapper">
                    <select name="type" value={formData.type} onChange={handleChange}>
                      <option value="มหาวิทยาลัย">มหาวิทยาลัย</option>
                      <option value="โรงเรียน">โรงเรียน</option>
                    </select>
                    <FaChevronDown className="select-icon" />
                  </div>
                </div>
                <div className="input-field">
                  <label>สถานะ</label>
                  <div className={`status-select-wrapper ${formData.status === 'กำลังเปิดรับสมัครสอบ' ? 'active-status' : ''}`}>
                    <select name="status" value={formData.status} onChange={handleChange}>
                      <option value="กำลังเปิดรับสมัครสอบ">กำลังเปิดรับสมัครสอบ</option>
                      <option value="ปิดรับสมัคร">ปิดรับสมัคร</option>
                    </select>
                    <FaChevronDown className="select-icon" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-grid-bottom">
            {/* ส่วนที่อยู่ */}
            <div className="sub-card address-card">
              <h3>ที่อยู่</h3>
              <div className="sub-input-row">
                <label>ถนน</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} />
              </div>
              <div className="sub-input-row">
                <label>ตำบล</label>
                <input type="text" name="district" value={formData.district} onChange={handleChange} />
              </div>
              <div className="sub-input-row">
                <label>อำเภอ</label>
                <select name="amphoe"><option>อำเภอ</option></select>
              </div>
              <div className="sub-input-row">
                <label>จังหวัด</label>
                <select name="province"><option>จังหวัด</option></select>
              </div>
              <div className="sub-input-row">
                <label>รหัสไปรษณีย์</label>
                <input type="text" name="zipcode" value={formData.zipcode} onChange={handleChange} />
              </div>
            </div>

            {/* ส่วนผู้ติดต่อ & ที่นั่ง */}
            <div className="right-column">
              <div className="sub-card">
                <h3>ผู้ติดต่อ</h3>
                <div className="sub-input-row">
                  <label>ชื่อผู้ติดต่อ</label>
                  <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} />
                </div>
                <div className="sub-input-row">
                  <label>วันที่ลงทะเบียน</label>
                  <div className="date-input-wrapper">
                    <input type="date" name="regDate" value={formData.regDate} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="sub-card mt-20">
                <h3>ที่นั่งสอบ</h3>
                <div className="sub-input-row">
                  <label>จำนวนที่นั่งรวม</label>
                  <input type="number" name="totalSeats" value={formData.totalSeats} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EditExamination;