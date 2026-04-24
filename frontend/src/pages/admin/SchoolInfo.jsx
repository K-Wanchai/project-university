import React, { useState } from 'react';
import './SchoolInfo.css';
import Sidebar from '../../components/Sidebar';
import { Link } from 'react-router-dom';
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
    {
      label: 'นักเรียนทั้งหมด',
      value: schoolData.studentCount,
      icon: <FaUsers />,
      tone: 'blue',
    },
    {
      label: 'หลักสูตร',
      value: schoolData.courseCount,
      icon: <FaBookOpen />,
      tone: 'green',
    },
    {
      label: 'อาจารย์ผู้สอน',
      value: schoolData.teacherCount,
      icon: <FaUserTie />,
      tone: 'purple',
    },
    {
      label: 'เปิดสอนตั้งแต่',
      value: schoolData.foundedYear,
      icon: <FaCalendarAlt />,
      tone: 'orange',
    },
  ];

  return (
    <div className="school-shell">
      <Sidebar />

      <main className="school-main">
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
                <div className="card-icon blue">
                  <FaBullseye />
                </div>
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
                    <span>ผู้อำนวยการ / ผู้ดูแลสถาบัน</span>
                    <strong>{schoolData.director}</strong>
                  </div>
                </div>

                <div className="detail-item">
                  <FaClock />
                  <div>
                    <span>วันและเวลาเปิดทำการ</span>
                    <strong>
                      {schoolData.openDays} เวลา {schoolData.openTime}
                    </strong>
                  </div>
                </div>
              </div>
            </article>

            <article className="info-card contact-card">
              <div className="card-header">
                <div className="card-icon green">
                  <FaPhoneAlt />
                </div>
                <div>
                  <h2>ช่องทางการติดต่อ</h2>
                  <p>ข้อมูลสำหรับนักเรียน ผู้ปกครอง และเจ้าหน้าที่</p>
                </div>
              </div>

              <div className="contact-grid">
                <div className="contact-item">
                  <FaPhoneAlt />
                  <span>เบอร์โทรศัพท์</span>
                  <strong>{schoolData.phone}</strong>
                </div>

                <div className="contact-item">
                  <FaEnvelope />
                  <span>อีเมล</span>
                  <strong>{schoolData.email}</strong>
                </div>

                <div className="contact-item">
                  <FaGlobe />
                  <span>เว็บไซต์</span>
                  <strong>{schoolData.website}</strong>
                </div>

                <div className="contact-item">
                  <FaUserTie />
                  <span>ผู้ประสานงาน</span>
                  <strong>{schoolData.coordinator}</strong>
                </div>

                <div className="contact-item">
                  <FaFacebook />
                  <span>Facebook</span>
                  <strong>{schoolData.facebook}</strong>
                </div>

                <div className="contact-item">
                  <FaLine />
                  <span>LINE Official</span>
                  <strong>{schoolData.lineId}</strong>
                </div>
              </div>
            </article>

            <article className="info-card map-card">
              <div className="card-header">
                <div className="card-icon orange">
                  <FaMapMarkedAlt />
                </div>
                <div>
                  <h2>ตำแหน่งที่ตั้งสถาบัน</h2>
                  <p>พื้นที่สำหรับแสดง Google Maps หรือพิกัดของโรงเรียน</p>
                </div>
              </div>

              <div className="map-placeholder">
                <FaMapMarkedAlt />
                <strong>Google Maps Preview</strong>
                <span>สามารถฝัง iframe หรือแสดงพิกัดโรงเรียนได้ในส่วนนี้</span>
              </div>
            </article>
          </div>

          <aside className="side-column">
            <article className="info-card payment-card">
              <div className="card-header small">
                <div className="card-icon purple">
                  <FaCreditCard />
                </div>
                <div>
                  <h2>ช่องทางการชำระเงิน</h2>
                  <p>ข้อมูลบัญชีสำหรับรับชำระค่าเรียน</p>
                </div>
              </div>

              <div className="bank-box">
                <span>ธนาคาร</span>
                <strong>{schoolData.bankName}</strong>
              </div>

              <div className="account-number">
                {schoolData.accountNumber}
              </div>

              <div className="bank-box">
                <span>ชื่อบัญชี</span>
                <strong>{schoolData.accountName}</strong>
              </div>

              <div className="qr-box">
                <div className="qr-placeholder">
                  <FaQrcode />
                </div>
                <p>สแกน QR Code เพื่อชำระเงิน</p>
              </div>
            </article>

            <article className="info-card checklist-card">
              <h2>ความครบถ้วนของข้อมูล</h2>

              <ul>
                <li>
                  <FaCheckCircle />
                  ข้อมูลโรงเรียน
                </li>
                <li>
                  <FaCheckCircle />
                  ข้อมูลติดต่อ
                </li>
                <li>
                  <FaCheckCircle />
                  ข้อมูลการชำระเงิน
                </li>
                <li>
                  <FaCheckCircle />
                  ตำแหน่งที่ตั้ง
                </li>
              </ul>

              <div className="complete-percent">
                <span>ความสมบูรณ์</span>
                <strong>100%</strong>
              </div>
            </article>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default SchoolInfo;