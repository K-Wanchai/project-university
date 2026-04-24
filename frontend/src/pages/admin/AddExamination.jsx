import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import apiService from "../../services/apiService";
import {
  FaArrowLeft,
  FaSave,
  FaCamera,
  FaUniversity,
  FaMapMarkerAlt,
  FaUserTie,
  FaClipboardList,
  FaTimes,
  FaTrashAlt,
} from 'react-icons/fa';
import './AddExamination.css';

const initialFormData = {
  nameTh: '',
  nameEn: '',
  code: '',
  type: 'มหาวิทยาลัย',
  examType: 'TCAS',
  status: 'กำลังเปิดรับสมัคร',
  capacity: '',
  roomCount: '',
  road: '',
  subDistrict: '',
  district: '',
  province: '',
  zipcode: '',
  mapUrl: '',
  contactName: '',
  position: '',
  phone: '',
  email: '',
  website: '',
  note: '',
  image: null,
};

const AddExamination = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const completedFields = useMemo(() => {
    const requiredKeys = ['nameTh', 'code', 'province', 'contactName', 'phone'];
    const completed = requiredKeys.filter((key) => String(formData[key]).trim() !== '').length;
    return Math.round((completed / requiredKeys.length) * 100);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('ไฟล์รูปภาพต้องมีขนาดไม่เกิน 2MB');
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: null }));
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setImagePreview(null);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const sendData = new FormData();

    sendData.append(
      "data",
      JSON.stringify({
        nameTh: formData.nameTh,
        nameEn: formData.nameEn,
        code: formData.code,
        type: formData.type,
        status: formData.status,

        address: formData.road,
        district: formData.subDistrict,
        amphoe: formData.district,
        province: formData.province,
        zipcode: formData.zipcode,

        contactName: formData.contactName,
        regDate: new Date().toISOString().split("T")[0],
        totalSeats: formData.capacity ? Number(formData.capacity) : 0,
      })
    );

    if (formData.image) {
      sendData.append("image", formData.image);
    }

    const res = await apiService.createExamination(sendData);

    if (!res.ok) {
      throw new Error("บันทึกไม่สำเร็จ");
    }

    alert("เพิ่มข้อมูลสถาบันสอบสำเร็จ");
    navigate("/examination");
  } catch (err) {
    console.error(err);
    alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
  }
};
  return (
    <div className="add-exam-shell">
      <Sidebar />

      <main className="add-exam-main">
        <header className="add-topbar">
          <button className="back-button" type="button" onClick={() => navigate('/examination')}>
            <FaArrowLeft />
            กลับหน้ารายการ
          </button>

          <div className="breadcrumb">
            <span>จัดการข้อมูลสถาบัน</span>
            <strong>/ เพิ่มสถาบันที่จัดสอบ</strong>
          </div>
        </header>

        <section className="add-hero">
          <div>
            <span className="page-badge">Institution Management</span>
            <h1>เพิ่มสถาบันที่จัดสอบใหม่</h1>
            <p>
              กรอกข้อมูลสถาบัน สถานที่จัดสอบ ข้อมูลผู้ประสานงาน และรายละเอียดที่จำเป็น
              เพื่อใช้ในระบบรับสมัครและจัดสอบ
            </p>
          </div>

          <div className="completion-card">
            <span>ความครบถ้วนของข้อมูล</span>
            <strong>{completedFields}%</strong>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${completedFields}%` }} />
            </div>
            <small>ช่องสำคัญ: ชื่อสถาบัน, รหัส, จังหวัด, ผู้ติดต่อ, เบอร์โทร</small>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="add-exam-form">
          <div className="form-layout">
            <div className="form-column">
              <section className="form-card">
                <div className="card-heading">
                  <div className="card-icon blue">
                    <FaUniversity />
                  </div>
                  <div>
                    <h2>ข้อมูลสถาบัน</h2>
                    <p>ข้อมูลหลักสำหรับระบุสถาบันที่ใช้เป็นสนามสอบ</p>
                  </div>
                </div>

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
                    <label htmlFor="image-input" className="upload-button">
                      เลือกรูปภาพสถาบัน
                    </label>

                    <input
                      id="image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      hidden
                    />

                    {imagePreview && (
                      <button type="button" className="remove-image-button" onClick={removeImage}>
                        <FaTrashAlt />
                        ลบรูปภาพ
                      </button>
                    )}

                    <p>รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 2MB</p>
                  </div>
                </div>

                <div className="form-grid">
                  <label className="form-group">
                    <span>ชื่อสถาบันที่จัดสอบ ภาษาไทย *</span>
                    <input
                      type="text"
                      name="nameTh"
                      value={formData.nameTh}
                      onChange={handleChange}
                      placeholder="เช่น โรงเรียนสวนกุหลาบวิทยาลัย"
                      required
                    />
                  </label>

                  <label className="form-group">
                    <span>ชื่อสถาบันที่จัดสอบ ภาษาอังกฤษ</span>
                    <input
                      type="text"
                      name="nameEn"
                      value={formData.nameEn}
                      onChange={handleChange}
                      placeholder="เช่น Suankularb Wittayalai School"
                    />
                  </label>

                  <label className="form-group">
                    <span>รหัสสถาบัน *</span>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      placeholder="เช่น INST0009"
                      required
                    />
                  </label>

                  <label className="form-group">
                    <span>ประเภทสถาบัน</span>
                    <select name="type" value={formData.type} onChange={handleChange}>
                      <option value="มหาวิทยาลัย">มหาวิทยาลัย</option>
                      <option value="โรงเรียนมัธยมศึกษา">โรงเรียนมัธยมศึกษา</option>
                      <option value="โรงเรียนวิทยาศาสตร์">โรงเรียนวิทยาศาสตร์</option>
                      <option value="อาชีวศึกษา">อาชีวศึกษา</option>
                      <option value="อื่น ๆ">อื่น ๆ</option>
                    </select>
                  </label>

                  <label className="form-group">
                    <span>รูปแบบการสอบ</span>
                    <select name="examType" value={formData.examType} onChange={handleChange}>
                      <option value="TCAS">TCAS</option>
                      <option value="Portfolio">Portfolio</option>
                      <option value="Admission">Admission</option>
                      <option value="โควตา">โควตา</option>
                      <option value="อื่น ๆ">อื่น ๆ</option>
                    </select>
                  </label>

                  <label className="form-group">
                    <span>สถานะ</span>
                    <select name="status" value={formData.status} onChange={handleChange}>
                      <option value="กำลังเปิดรับสมัคร">กำลังเปิดรับสมัคร</option>
                      <option value="พร้อมใช้งาน">พร้อมใช้งาน</option>
                      <option value="รอตรวจสอบ">รอตรวจสอบ</option>
                      <option value="ปิดใช้งาน">ปิดใช้งาน</option>
                    </select>
                  </label>

                  <label className="form-group">
                    <span>จำนวนผู้เข้าสอบที่รองรับ</span>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      placeholder="เช่น 500"
                      min="0"
                    />
                  </label>

                  <label className="form-group">
                    <span>จำนวนห้องสอบ</span>
                    <input
                      type="number"
                      name="roomCount"
                      value={formData.roomCount}
                      onChange={handleChange}
                      placeholder="เช่น 20"
                      min="0"
                    />
                  </label>
                </div>
              </section>

              <section className="form-card">
                <div className="card-heading">
                  <div className="card-icon green">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h2>ข้อมูลสถานที่</h2>
                    <p>ระบุที่อยู่และลิงก์แผนที่เพื่อช่วยในการค้นหาสนามสอบ</p>
                  </div>
                </div>

                <div className="form-grid">
                  <label className="form-group full-width">
                    <span>ถนน / รายละเอียดที่ตั้ง</span>
                    <input
                      type="text"
                      name="road"
                      value={formData.road}
                      onChange={handleChange}
                      placeholder="เช่น 88 ถนนตรีเพชร"
                    />
                  </label>

                  <label className="form-group">
                    <span>ตำบล / แขวง</span>
                    <input
                      type="text"
                      name="subDistrict"
                      value={formData.subDistrict}
                      onChange={handleChange}
                      placeholder="เช่น วังบูรพาภิรมย์"
                    />
                  </label>

                  <label className="form-group">
                    <span>อำเภอ / เขต</span>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="เช่น พระนคร"
                    />
                  </label>

                  <label className="form-group">
                    <span>จังหวัด *</span>
                    <input
                      type="text"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      placeholder="เช่น กรุงเทพมหานคร"
                      required
                    />
                  </label>

                  <label className="form-group">
                    <span>รหัสไปรษณีย์</span>
                    <input
                      type="text"
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={handleChange}
                      placeholder="เช่น 10200"
                      maxLength="5"
                    />
                  </label>

                  <label className="form-group full-width">
                    <span>ลิงก์ Google Maps</span>
                    <input
                      type="url"
                      name="mapUrl"
                      value={formData.mapUrl}
                      onChange={handleChange}
                      placeholder="https://maps.google.com/..."
                    />
                  </label>
                </div>
              </section>

              <section className="form-card">
                <div className="card-heading">
                  <div className="card-icon orange">
                    <FaUserTie />
                  </div>
                  <div>
                    <h2>ข้อมูลผู้ประสานงาน</h2>
                    <p>ใช้ติดต่อเมื่อต้องยืนยันข้อมูลสนามสอบหรือแก้ไขรายละเอียด</p>
                  </div>
                </div>

                <div className="form-grid">
                  <label className="form-group">
                    <span>ชื่อ-นามสกุล *</span>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      placeholder="เช่น นายสมชาย ใจดี"
                      required
                    />
                  </label>

                  <label className="form-group">
                    <span>ตำแหน่ง</span>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      placeholder="เช่น เจ้าหน้าที่ประสานงาน"
                    />
                  </label>

                  <label className="form-group">
                    <span>เบอร์โทร *</span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="เช่น 0812345678"
                      required
                    />
                  </label>

                  <label className="form-group">
                    <span>อีเมล</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                    />
                  </label>

                  <label className="form-group full-width">
                    <span>เว็บไซต์สถาบัน</span>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://www.example.ac.th"
                    />
                  </label>
                </div>
              </section>
            </div>

            <aside className="summary-column">
              <section className="summary-card">
                <div className="card-heading compact">
                  <div className="card-icon purple">
                    <FaClipboardList />
                  </div>
                  <div>
                    <h2>สรุปข้อมูล</h2>
                    <p>ตรวจสอบก่อนบันทึก</p>
                  </div>
                </div>

                <div className="summary-list">
                  <div>
                    <span>ชื่อสถาบัน</span>
                    <strong>{formData.nameTh || '-'}</strong>
                  </div>
                  <div>
                    <span>รหัสสถาบัน</span>
                    <strong>{formData.code || '-'}</strong>
                  </div>
                  <div>
                    <span>ประเภท</span>
                    <strong>{formData.type}</strong>
                  </div>
                  <div>
                    <span>รูปแบบการสอบ</span>
                    <strong>{formData.examType}</strong>
                  </div>
                  <div>
                    <span>สถานะ</span>
                    <strong className="status-pill">{formData.status}</strong>
                  </div>
                  <div>
                    <span>จังหวัด</span>
                    <strong>{formData.province || '-'}</strong>
                  </div>
                </div>
              </section>

              <section className="summary-card">
                <h3>หมายเหตุเพิ่มเติม</h3>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows="6"
                  placeholder="เช่น ทางเข้าอาคารสอบ, จุดจอดรถ, เอกสารที่ต้องเตรียม หรือข้อควรระวัง"
                />
              </section>

              <section className="tip-card">
                <strong>คำแนะนำ</strong>
                <p>
                  ควรกรอกข้อมูลผู้ประสานงานและลิงก์แผนที่ให้ครบ
                  เพื่อช่วยลดปัญหาการติดต่อและการเดินทางของผู้เข้าสอบ
                </p>
              </section>
            </aside>
          </div>

          <div className="sticky-actions">
            <button type="button" className="cancel-button" onClick={() => navigate('/examination')}>
              <FaTimes />
              ยกเลิก
            </button>

            <button type="button" className="reset-button" onClick={handleReset}>
              ล้างฟอร์ม
            </button>

            <button type="submit" className="save-button">
              <FaSave />
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddExamination;