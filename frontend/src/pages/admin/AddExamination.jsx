import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import './AddExamination.css';

const AddExamination = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nameTh: '',
    nameEn: '',
    code: '',
    type: 'มหาวิทยาลัย',
    status: 'กำลังเปิดรับสมัคร',
    road: '',
    district: '',
    province: '',
    zipcode: '',
    contactName: '',
    phone: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("บันทึกข้อมูล:", formData);
    alert("บันทึกข้อมูลสถาบันสอบเรียบร้อยแล้ว");
    navigate('/examination');
  };

  return (
    <div className="container" style={{ display: 'flex' }}>
      
      {/* เรียกใช้งาน Sidebar Component */}
      <Sidebar />

      {/* ดันเนื้อหาหลักออกไป 260px เพื่อไม่ให้ Sidebar ทับ */}
      
      <main className="main-content" style={{ marginLeft: '260px', width: '100%' }}>
        <header className="content-header-add">
          <button className="btn-back" onClick={() => navigate('/examination')}>
            <FaArrowLeft /> ย้อนกลับ
          </button>
          <h1>เพิ่มสถาบันที่จัดสอบใหม่</h1>
        </header>

        <form onSubmit={handleSubmit} className="add-exam-form">
          {/* Card 1: ข้อมูลสถาบัน */}
          <div className="form-card">
            <h2 className="card-title">1. ข้อมูลสถาบัน</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>ชื่อสถาบันที่จัดสอบ (ภาษาไทย)</label>
                <input type="text" name="nameTh" value={formData.nameTh} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>ชื่อสถาบันที่จัดสอบ (ภาษาอังกฤษ)</label>
                <input type="text" name="nameEn" value={formData.nameEn} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>รหัสสถาบัน</label>
                <input type="text" name="code" value={formData.code} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>ประเภทสถาบัน</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="มหาวิทยาลัย">มหาวิทยาลัย</option>
                  <option value="มัธยมศึกษา">มัธยมศึกษา</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>สถานะ</label>
                <div className="radio-group">
                  <label>
                    <input type="radio" name="status" value="กำลังเปิดรับสมัคร" checked={formData.status === "กำลังเปิดรับสมัคร"} onChange={handleChange} /> กำลังเปิดรับสมัคร
                  </label>
                  <label>
                    <input type="radio" name="status" value="ปิดการรับสมัคร" checked={formData.status === "ปิดการรับสมัคร"} onChange={handleChange} /> ปิดการรับสมัคร
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: ข้อมูลที่อยู่ */}
          <div className="form-card">
            <h2 className="card-title">2. ข้อมูลที่อยู่</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>ถนน</label>
                <input type="text" name="road" value={formData.road} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>อำเภอ</label>
                <input type="text" name="district" value={formData.district} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>จังหวัด</label>
                <input type="text" name="province" value={formData.province} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>รหัสไปรษณีย์</label>
                <input type="text" name="zipcode" value={formData.zipcode} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Card 3: ข้อมูลผู้ติดต่อ */}
          <div className="form-card">
            <h2 className="card-title">3. ข้อมูลผู้ติดต่อ</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>ชื่อ-นามสกุล</label>
                <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>เบอร์โทร</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="form-group full-width">
                <label>อีเมล</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit-save">
              <FaSave /> บันทึกข้อมูล
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddExamination;