import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditSchoolInfo.css'; // แนะนำให้แยกไฟล์ CSS หรือใช้ SchoolInfo.css ที่ปรับปรุงแล้ว
import Sidebar from '../../components/Sidebar'; 

function EditSchoolInfo() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "ชื่อโรงเรียนกวดวิชาของคุณ",
    address: "123/45 ถนนมิตรภาพ ตำบลในเมือง อำเภอเมือง จังหวัดขอนแก่น 40000",
    phone: "081-234-5678",
    email: "contact@school.com",
    vision: "มุ่งมั่นสร้างสรรค์ความเป็นเลิศทางวิชาการ และพัฒนาศักยภาพผู้เรียนสู่สากล",
    bankName: "ธนาคารกสิกรไทย",
    accountNumber: "xxx-x-xxxxx-x",
    accountName: "บจก. โรงเรียนกวดวิชาใจดี",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("ข้อมูลที่ถูกบันทึก:", formData);
    alert("บันทึกข้อมูลเรียบร้อยแล้ว");
    navigate('/school-info'); 
  };

  return (
    <div className="container" style={{ display: 'flex' }}>
      <Sidebar />
      {/* เพิ่ม marginLeft: '260px' เพื่อไม่ให้ Sidebar บังเนื้อหา */}
      <main className="main-content" style={{ marginLeft: '260px', width: '100%', minHeight: '100vh' }}>
        <header className="content-header">
          <h2><i className="fas fa-edit"></i> แก้ไขข้อมูลโรงเรียน</h2>
          <div className="header-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/school-info')}>
              ยกเลิก
            </button>
            <button type="submit" className="btn-save-school" onClick={handleSubmit}>
              <i className="fas fa-save"></i> บันทึกข้อมูล
            </button>
          </div>
        </header>

        <form className="info-grid" onSubmit={handleSubmit}>
          
          {/* Card 1: ข้อมูลทั่วไปสถาบัน */}
          <div className="info-card about-section">
            <h4><i className="fas fa-info-circle"></i> ข้อมูลทั่วไป</h4>
            <div className="content-detail">
              <div className="form-group">
                <label>ชื่อสถาบัน:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>ที่อยู่:</label>
                <textarea name="address" rows="3" value={formData.address} onChange={handleChange}></textarea>
              </div>
              <div className="form-group-row">
                <div className="form-group">
                  <label>เบอร์โทรศัพท์:</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>อีเมล:</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>วิสัยทัศน์:</label>
                <textarea name="vision" rows="2" value={formData.vision} onChange={handleChange}></textarea>
              </div>
            </div>
          </div>

          {/* Card 2: ข้อมูลการชำระเงิน */}
          <div className="info-card payment-section">
            <h4><i className="fas fa-credit-card"></i> ช่องทางการชำระเงิน</h4>
            <div className="content-detail">
              <div className="form-group">
                <label>ธนาคาร:</label>
                <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>เลขบัญชี:</label>
                <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>ชื่อบัญชี:</label>
                <input type="text" name="accountName" value={formData.accountName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>อัปโหลด QR Code (รูปภาพ):</label>
                <input type="file" accept="image/*" className="input-file" />
              </div>
            </div>
          </div>

          {/* ปุ่มบันทึกสำหรับมือถือ */}
          <div className="form-actions-mobile">
             <button type="submit" className="btn-save-full">บันทึกข้อมูลทั้งหมด</button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditSchoolInfo;