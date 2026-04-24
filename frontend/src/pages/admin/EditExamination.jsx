import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './EditExamination.css';
import { 
  FaSave, 
  FaUndo, 
  FaCamera, 
  FaChevronDown 
} from 'react-icons/fa';

const EditExamination = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState("https://upload.wikimedia.org/wikipedia/th/thumb/1/11/Khon_Kaen_University_Logo.svg/1200px-Khon_Kaen_University_Logo.svg.png");
  
  // State สำหรับเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    nameTh: 'มหาวิทยาลัยขอนแก่น',
    nameEn: 'KKU',
    code: 'EXAM-001',
    type: 'มหาวิทยาลัย',
    status: 'กำลังเปิดรับสมัครสอบ',
    address: '123 ถนนมิตรภาพ',
    district: 'ในเมือง',
    amphoe: 'เมือง',
    province: 'ขอนแก่น',
    zipcode: '40002',
    contactName: 'สมชาย ใจดี',
    regDate: '2023-10-01',
    totalSeats: 500,
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="edit-exam-container" style={{ display: 'flex' }}>
      <Sidebar />
      
      <main className="main-content" style={{ marginLeft: '260px', width: '100%', padding: '20px' }}>
        <header className="content-header">
          <h1>แก้ไขข้อมูลสถาบันสอบ ({formData.nameTh})</h1>
        </header>

        <section className="form-card">
          <div className="action-buttons">
            <button className="btn-save"><FaSave /> บันทึกการแก้ไข</button>
            <button className="btn-cancel" onClick={() => navigate('/examination')}><FaUndo /> ยกเลิก</button>
          </div>

          <div className="form-grid-top">
            {/* ส่วนอัปโหลดรูปภาพ (แบบเดียวกับ AddExamination) */}
            <div className="image-upload-section">
              <div className="image-preview-container">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                ) : (
                  <div className="image-placeholder">
                    <FaCamera size={30} />
                    <span>รูปภาพสถาบัน</span>
                  </div>
                )}
              </div>
              <div className="image-upload-controls">
                <label htmlFor="image-input" className="btn-upload-label">
                  <FaCamera /> อัปโหลดโลโก้ใหม่
                </label>
                <input 
                  id="image-input"
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <p className="upload-hint">รองรับไฟล์ JPG, PNG (ไม่เกิน 2MB)</p>
              </div>
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
                  <input type="text" name="code" value={formData.code} onChange={handleChange} />
                </div>
                <div className="input-field">
                   <label>&nbsp;</label>
                </div>
              </div>

              <div className="input-row">
                <div className="input-field">
                  <label>ประเภทสถาบัน</label>
                  <div className="select">
                    <select name="type" value={formData.type} onChange={handleChange}>
                      <option value="มหาวิทยาลัย">มหาวิทยาลัย</option>
                      <option value="โรงเรียน">โรงเรียน</option>
                    </select>
                    <FaChevronDown className="select-icon" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-grid-bottom">
            <div className="sub-card">
              <h3>ที่อยู่</h3>
              <div className="input-row">
                <div className="input-field">
                  <label>ถนน / ที่ตั้ง</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} />
                </div>
                <div className="input-field">
                  <label>ตำบล / แขวง</label>
                  <div className="select">
                    <select name="district" value={formData.district} onChange={handleChange}>
                      <option value="ในเมือง">ในเมือง</option>
                    </select>
                    <FaChevronDown className="select-icon" />
                  </div>
                </div>
              </div>
              <div className="input-row">
                <div className="input-field">
                  <label>อำเภอ / เขต</label>
                  <div className="select">
                    <select name="amphoe" value={formData.amphoe} onChange={handleChange}>
                      <option value="เมือง">เมือง</option>
                    </select>
                    <FaChevronDown className="select-icon" />
                  </div>
                </div>
                <div className="input-field">
                  <label>จังหวัด</label>
                  <div className="select">
                    <select name="province" value={formData.province} onChange={handleChange}>
                      <option value="ขอนแก่น">ขอนแก่น</option>
                    </select>
                    <FaChevronDown className="select-icon" />
                  </div>
                </div>
              </div>
              <div className="input-row">
                <div className="input-field">
                  <label>รหัสไปรษณีย์</label>
                  <input type="text" name="zipcode" value={formData.zipcode} onChange={handleChange} />
                </div>
                <div className="input-field"></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EditExamination;