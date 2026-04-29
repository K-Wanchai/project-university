import React, { useState } from 'react';
import './SchoolInfo.css';
import { Link } from 'react-router-dom';
import AdminLayout from '../../Layout/AdminLayout';

import {
  FaSchool,
  FaEdit,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaClock,
  FaUserTie,
  FaCreditCard,
  FaQrcode,
  FaBullseye,
  FaCheckCircle,
  FaUsers,
  FaBookOpen,
  FaMapMarkedAlt,
  FaFacebook,
  FaLine,
  FaCalendarAlt,
} from 'react-icons/fa';

function SchoolInfo() {
  const [schoolData] = useState({
    name: 'โรงเรียนกวดวิชาใจดี',
    subtitle: 'สถาบันเตรียมสอบและพัฒนาศักยภาพผู้เรียน',
    status: 'เปิดให้บริการ',
    licenseNo: 'EDU-2567-0001',
    address: '123/45 ถนนมิตรภาพ ตำบลในเมือง อำเภอเมือง จังหวัดขอนแก่น 40000',
    phone: '081-234-5678',
    email: 'contact@school.com',
    website: 'www.jaidee-school.com',
    facebook: 'Jaidee Tutorial School',
    lineId: '@jaideeschool',
    vision: 'มุ่งมั่นสร้างสรรค์ความเป็นเลิศทางวิชาการ และพัฒนาศักยภาพผู้เรียนสู่สากล',
    director: 'อาจารย์สมชาย ใจดี',
    coordinator: 'คุณกมลชนก แก้วใส',
    openDays: 'จันทร์ - เสาร์',
    openTime: '08:30 - 18:00 น.',
    bankName: 'ธนาคารกสิกรไทย',
    accountNumber: '123-4-56789-0',
    accountName: 'บจก. โรงเรียนกวดวิชาใจดี',
    studentCount: '1,248',
    courseCount: '36',
    teacherCount: '24',
    foundedYear: '2562',
  });

  const stats = [
    { label: 'นักเรียนทั้งหมด', value: schoolData.studentCount, icon: <FaUsers />, tone: 'blue' },
    { label: 'หลักสูตร', value: schoolData.courseCount, icon: <FaBookOpen />, tone: 'green' },
    { label: 'อาจารย์ผู้สอน', value: schoolData.teacherCount, icon: <FaUserTie />, tone: 'purple' },
    { label: 'เปิดสอนตั้งแต่', value: schoolData.foundedYear, icon: <FaCalendarAlt />, tone: 'orange' },
  ];

  return (
    <AdminLayout>

      <section className="school-hero">
        <div className="hero-content">
          <div className="school-logo">
            <FaSchool />
          </div>

          <div>
            <div className="hero-breadcrumb">
              ข้อมูลระบบ / <span>ข้อมูลโรงเรียนกวดวิชา</span>
            </div>

            <h1>{schoolData.name}</h1>
            <p>{schoolData.subtitle}</p>

            <div className="hero-tags">
              <span className="status-badge">
                <FaCheckCircle />
                {schoolData.status}
              </span>
              <span>เลขที่ใบอนุญาต: {schoolData.licenseNo}</span>
            </div>
          </div>
        </div>

        <Link to="/edit-school-info" className="btn-edit-school">
          <FaEdit />
          แก้ไขข้อมูล
        </Link>
      </section>

      <section className="stats-grid">
        {stats.map((item) => (
          <article className="stat-card" key={item.label}>
            <div className={`stat-icon ${item.tone}`}>{item.icon}</div>
            <div>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className="school-layout">
        <div className="main-column">

          <article className="info-card about-card">
            <div className="card-header">
              <div className="card-icon blue"><FaBullseye /></div>
              <div>
                <h2>เกี่ยวกับสถาบัน</h2>
                <p>ข้อมูลพื้นฐานและเป้าหมายของโรงเรียน</p>
              </div>
            </div>

            <div className="vision-box">
              <span>วิสัยทัศน์</span>
              <p>“{schoolData.vision}”</p>
            </div>

            <div className="detail-list">
              <div className="detail-item">
                <FaMapMarkerAlt />
                <div>
                  <span>ที่อยู่</span>
                  <strong>{schoolData.address}</strong>
                </div>
              </div>

              <div className="detail-item">
                <FaUserTie />
                <div>
                  <span>ผู้อำนวยการ</span>
                  <strong>{schoolData.director}</strong>
                </div>
              </div>

              <div className="detail-item">
                <FaClock />
                <div>
                  <span>เวลาเปิด</span>
                  <strong>{schoolData.openDays} {schoolData.openTime}</strong>
                </div>
              </div>
            </div>
          </article>

        </div>

        <aside className="side-column">
          <article className="info-card payment-card">
            <div className="card-header small">
              <div className="card-icon purple"><FaCreditCard /></div>
              <div>
                <h2>ช่องทางการชำระเงิน</h2>
              </div>
            </div>

            <div className="bank-box">
              <span>ธนาคาร</span>
              <strong>{schoolData.bankName}</strong>
            </div>

            <div className="account-number">{schoolData.accountNumber}</div>

            <div className="bank-box">
              <span>ชื่อบัญชี</span>
              <strong>{schoolData.accountName}</strong>
            </div>

            <div className="qr-box">
              <div className="qr-placeholder">
                <FaQrcode />
              </div>
              <p>QR Payment</p>
            </div>
          </article>
        </aside>
      </section>

    </AdminLayout>
  );
}

export default SchoolInfo;