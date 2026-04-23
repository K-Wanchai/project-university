import React, { useState } from 'react';
import './SchoolInfo.css'; 
import Sidebar from '../../components/Sidebar'; 
// SchoolInfo.jsx (เพิ่มบรรทัดนี้ที่ด้านบน)
import { Link } from 'react-router-dom';

function SchoolInfo() {
  const [schoolData, setSchoolData] = useState({
    name: "ชื่อโรงเรียนกวดวิชาของคุณ",
    address: "123/45 ถนนมิตรภาพ ตำบลในเมือง อำเภอเมือง จังหวัดขอนแก่น 40000",
    phone: "081-234-5678",
    email: "contact@school.com",
    vision: "มุ่งมั่นสร้างสรรค์ความเป็นเลิศทางวิชาการ และพัฒนาศักยภาพผู้เรียนสู่สากล",
    bankName: "ธนาคารกสิกรไทย",
    accountNumber: "xxx-x-xxxxx-x",
    accountName: "บจก. โรงเรียนกวดวิชาใจดี",
  });

 return (
  <div className="container" style={{ display: 'flex' }}>
    <Sidebar />
    
    {/* เพิ่ม style หรือ class เพื่อดันเนื้อหาออกไป 260px */}
    <main className="main-content" style={{ marginLeft: '260px', width: '100%' }}>
      <header className="content-header">
          <h2><i className="fas fa-school"></i> ข้อมูลโรงเรียนกวดวิชา</h2>
          <Link to="/edit-school-info" className="btn-edit-school">
            <i className="fas fa-edit"></i> แก้ไขข้อมูล
          </Link>
        </header>

        <div className="info-grid">
          
          {/* Card 1: เกี่ยวกับสถาบัน */}
          <div className="info-card about-section">
            <h4><i className="fas fa-info-circle"></i> เกี่ยวกับสถาบัน</h4>
            <div className="content-detail">
              <p><strong><i className="fas fa-map-marker-alt"></i> ที่อยู่:</strong> {schoolData.address}</p>
              <p><strong><i className="fas fa-phone"></i> ช่องทางการติดต่อ:</strong> {schoolData.phone} | {schoolData.email}</p>
              <div className="vision-box">
                <strong><i className="fas fa-lightbulb"></i> วิสัยทัศน์:</strong>
                <p className="vision-text">"{schoolData.vision}"</p>
              </div>
            </div>
          </div>

          {/* Card 2: ช่องทางการชำระเงิน */}
          <div className="info-card payment-section">
            <h4><i className="fas fa-credit-card"></i> ช่องทางการชำระเงิน</h4>
            <div className="payment-container">
              <div className="bank-info">
                <p><strong>ธนาคาร:</strong> {schoolData.bankName}</p>
                <p><strong>เลขบัญชี:</strong> <span className="acc-num">{schoolData.accountNumber}</span></p>
                <p><strong>ชื่อบัญชี:</strong> {schoolData.accountName}</p>
              </div>
              <div className="qr-code-section">
                <div className="qr-placeholder">
                  <i className="fas fa-qrcode"></i>
                  <span>QR Code</span>
                </div>
                <p className="qr-label">สแกนเพื่อชำระเงิน</p>
              </div>
            </div>
          </div>

          {/* แผนที่ (แสดงด้านล่าง) */}
          <div className="info-card map-section full-width">
            <h4><i className="fas fa-map"></i> ตำแหน่งที่ตั้งสถาบัน</h4>
            <div className="map-placeholder">
               <p>Google Maps Preview</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default SchoolInfo;