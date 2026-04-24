import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditSchoolInfo.css';
import Sidebar from '../../components/Sidebar';
import {
  FaArrowLeft,
  FaSave,
  FaTimes,
  FaSchool,
  FaImage,
  FaTrashAlt,
  FaInfoCircle,
  FaPhoneAlt,
  FaClock,
  FaCreditCard,
  FaMapMarkedAlt,
  FaChartBar,
  FaClipboardCheck,
  FaQrcode,
} from 'react-icons/fa';

function EditSchoolInfo() {
  const navigate = useNavigate();

  const [logoPreview, setLogoPreview] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: 'โรงเรียนกวดวิชาใจดี',
    subtitle: 'สถาบันเตรียมสอบและพัฒนาศักยภาพผู้เรียน',
    status: 'เปิดให้บริการ',
    licenseNo: 'EDU-2567-0001',
    address: '123/45 ถนนมิตรภาพ ตำบลในเมือง อำเภอเมือง จังหวัดขอนแก่น 40000',
    province: 'ขอนแก่น',
    mapUrl: '',
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
    note: '',
    logo: null,
    qrCode: null,
  });

  const completionPercent = useMemo(() => {
    const requiredFields = [
      'name',
      'status',
      'licenseNo',
      'address',
      'phone',
      'email',
      'director',
      'coordinator',
      'bankName',
      'accountNumber',
      'accountName',
    ];

    const completed = requiredFields.filter((field) => {
      return String(formData[field] || '').trim() !== '';
    }).length;

    return Math.round((completed / requiredFields.length) * 100);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageChange = (e, fieldName, setPreview) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('ไฟล์รูปภาพต้องมีขนาดไม่เกิน 2MB');
      return;
    }

    setFormData((current) => ({
      ...current,
      [fieldName]: file,
    }));

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const clearImage = (fieldName, setPreview) => {
    setFormData((current) => ({
      ...current,
      [fieldName]: null,
    }));
    setPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('ข้อมูลที่ถูกบันทึก:', formData);
    alert('บันทึกข้อมูลโรงเรียนเรียบร้อยแล้ว');
    navigate('/school-info');
  };

  return (
    <div className="edit-school-shell">
      <Sidebar />

      <main className="edit-school-main">
        <header className="edit-school-topbar">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate('/school-info')}
          >
            <FaArrowLeft />
            กลับหน้าข้อมูลโรงเรียน
          </button>

          <div className="topbar-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/school-info')}
            >
              <FaTimes />
              ยกเลิก
            </button>

            <button
              type="submit"
              form="edit-school-form"
              className="save-button"
            >
              <FaSave />
              บันทึกข้อมูล
            </button>
          </div>
        </header>

        <section className="edit-school-hero">
          <div className="hero-title">
            <div className="hero-icon">
              <FaSchool />
            </div>

            <div>
              <div className="breadcrumb">
                ข้อมูลระบบ / <span>แก้ไขข้อมูลโรงเรียน</span>
              </div>
              <h1>แก้ไขข้อมูลโรงเรียนกวดวิชา</h1>
              <p>
                ปรับปรุงข้อมูลโปรไฟล์โรงเรียน ช่องทางติดต่อ เวลาเปิดทำการ
                ข้อมูลการชำระเงิน และข้อมูลที่ใช้แสดงในหน้า SchoolInfo
              </p>
            </div>
          </div>

          <div className="completion-card">
            <span>ความครบถ้วนของข้อมูล</span>
            <strong>{completionPercent}%</strong>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <small>ระบบจะนำข้อมูลเหล่านี้ไปแสดงในหน้าข้อมูลโรงเรียน</small>
          </div>
        </section>

        <form id="edit-school-form" className="edit-school-layout" onSubmit={handleSubmit}>
          <div className="form-column">
            <section className="form-card">
              <div className="card-header">
                <div className="card-icon blue">
                  <FaInfoCircle />
                </div>
                <div>
                  <h2>ข้อมูลทั่วไปของโรงเรียน</h2>
                  <p>ข้อมูลหลักที่ใช้แสดงบนหน้าโปรไฟล์โรงเรียน</p>
                </div>
              </div>

              <div className="image-upload-box">
                <div className="image-preview">
                  {logoPreview ? (
                    <img src={logoPreview} alt="School logo preview" />
                  ) : (
                    <div className="image-empty">
                      <FaImage />
                      <span>โลโก้โรงเรียน</span>
                    </div>
                  )}
                </div>

                <div className="image-actions">
                  <label htmlFor="logoUpload" className="upload-button">
                    อัปโหลดโลโก้
                  </label>
                  <input
                    id="logoUpload"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleImageChange(e, 'logo', setLogoPreview)}
                  />

                  {logoPreview && (
                    <button
                      type="button"
                      className="remove-image-button"
                      onClick={() => clearImage('logo', setLogoPreview)}
                    >
                      <FaTrashAlt />
                      ลบรูป
                    </button>
                  )}

                  <p>แนะนำไฟล์ PNG หรือ JPG ขนาดไม่เกิน 2MB</p>
                </div>
              </div>

              <div className="form-grid">
                <label className="form-group">
                  <span>ชื่อโรงเรียน *</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="form-group">
                  <span>คำอธิบายสั้น</span>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                  />
                </label>

                <label className="form-group">
                  <span>สถานะโรงเรียน</span>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="เปิดให้บริการ">เปิดให้บริการ</option>
                    <option value="ปิดชั่วคราว">ปิดชั่วคราว</option>
                    <option value="รอตรวจสอบ">รอตรวจสอบ</option>
                    <option value="ปิดให้บริการ">ปิดให้บริการ</option>
                  </select>
                </label>

                <label className="form-group">
                  <span>เลขที่ใบอนุญาต *</span>
                  <input
                    type="text"
                    name="licenseNo"
                    value={formData.licenseNo}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="form-group full-width">
                  <span>วิสัยทัศน์</span>
                  <textarea
                    name="vision"
                    rows="4"
                    value={formData.vision}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </section>

            <section className="form-card">
              <div className="card-header">
                <div className="card-icon green">
                  <FaPhoneAlt />
                </div>
                <div>
                  <h2>ช่องทางติดต่อและผู้รับผิดชอบ</h2>
                  <p>ข้อมูลสำหรับนักเรียน ผู้ปกครอง และเจ้าหน้าที่ติดต่อกลับ</p>
                </div>
              </div>

              <div className="form-grid">
                <label className="form-group">
                  <span>เบอร์โทรศัพท์ *</span>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="form-group">
                  <span>อีเมล *</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="form-group">
                  <span>เว็บไซต์</span>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </label>

                <label className="form-group">
                  <span>Facebook</span>
                  <input
                    type="text"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                  />
                </label>

                <label className="form-group">
                  <span>LINE Official</span>
                  <input
                    type="text"
                    name="lineId"
                    value={formData.lineId}
                    onChange={handleChange}
                  />
                </label>

                <label className="form-group">
                  <span>ผู้อำนวยการ / ผู้ดูแลสถาบัน</span>
                  <input
                    type="text"
                    name="director"
                    value={formData.director}
                    onChange={handleChange}
                  />
                </label>

                <label className="form-group full-width">
                  <span>ผู้ประสานงาน</span>
                  <input
                    type="text"
                    name="coordinator"
                    value={formData.coordinator}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </section>

            <section className="form-card">
              <div className="card-header">
                <div className="card-icon orange">
                  <FaClock />
                </div>
                <div>
                  <h2>เวลาเปิดทำการและที่ตั้ง</h2>
                  <p>ข้อมูลนี้ช่วยให้ผู้เรียนและผู้ปกครองเดินทางมาติดต่อได้สะดวก</p>
                </div>
              </div>

              <div className="form-grid">
                <label className="form-group">
                  <span>วันเปิดทำการ</span>
                  <input
                    type="text"
                    name="openDays"
                    value={formData.openDays}
                    onChange={handleChange}
                  />
                </label>

                <label className="form-group">
                  <span>เวลาเปิดทำการ</span>
                  <input
                    type="text"
                    name="openTime"
                    value={formData.openTime}
                    onChange={handleChange}
                  />
                </label>

                <label className="form-group full-width">
                  <span>ที่อยู่ *</span>
                  <textarea
                    name="address"
                    rows="4"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="form-group">
                  <span>จังหวัด</span>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                  />
                </label>

                <label className="form-group">
                  <span>ลิงก์ Google Maps</span>
                  <input
                    type="text"
                    name="mapUrl"
                    value={formData.mapUrl}
                    onChange={handleChange}
                    placeholder="https://maps.google.com/..."
                  />
                </label>
              </div>
            </section>

            <section className="form-card">
              <div className="card-header">
                <div className="card-icon purple">
                  <FaCreditCard />
                </div>
                <div>
                  <h2>ช่องทางการชำระเงิน</h2>
                  <p>ข้อมูลบัญชีและ QR Code สำหรับรับชำระค่าเรียน</p>
                </div>
              </div>

              <div className="payment-edit-grid">
                <div className="form-grid">
                  <label className="form-group">
                    <span>ธนาคาร *</span>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label className="form-group">
                    <span>เลขบัญชี *</span>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label className="form-group full-width">
                    <span>ชื่อบัญชี *</span>
                    <input
                      type="text"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>

                <div className="qr-upload-card">
                  <div className="qr-preview">
                    {qrPreview ? (
                      <img src={qrPreview} alt="QR Code preview" />
                    ) : (
                      <div className="qr-empty">
                        <FaQrcode />
                        <span>QR Code</span>
                      </div>
                    )}
                  </div>

                  <label htmlFor="qrUpload" className="upload-button">
                    อัปโหลด QR Code
                  </label>
                  <input
                    id="qrUpload"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleImageChange(e, 'qrCode', setQrPreview)}
                  />

                  {qrPreview && (
                    <button
                      type="button"
                      className="remove-image-button"
                      onClick={() => clearImage('qrCode', setQrPreview)}
                    >
                      <FaTrashAlt />
                      ลบ QR Code
                    </button>
                  )}
                </div>
              </div>
            </section>
          </div>

          <aside className="summary-column">
            <section className="summary-card">
              <div className="summary-header">
                <FaClipboardCheck />
                <div>
                  <h2>ตัวอย่างข้อมูล</h2>
                  <p>ข้อมูลที่จะถูกนำไปแสดงในหน้า SchoolInfo</p>
                </div>
              </div>

              <div className="summary-list">
                <div>
                  <span>ชื่อโรงเรียน</span>
                  <strong>{formData.name || '-'}</strong>
                </div>
                <div>
                  <span>สถานะ</span>
                  <strong className="status-pill">{formData.status}</strong>
                </div>
                <div>
                  <span>เลขที่ใบอนุญาต</span>
                  <strong>{formData.licenseNo || '-'}</strong>
                </div>
                <div>
                  <span>ผู้ประสานงาน</span>
                  <strong>{formData.coordinator || '-'}</strong>
                </div>
                <div>
                  <span>เวลาเปิดทำการ</span>
                  <strong>{formData.openDays} {formData.openTime}</strong>
                </div>
                <div>
                  <span>ธนาคาร</span>
                  <strong>{formData.bankName || '-'}</strong>
                </div>
              </div>
            </section>

            <section className="summary-card">
              <div className="summary-header">
                <FaChartBar />
                <div>
                  <h2>ข้อมูลสถิติ</h2>
                  <p>ใช้แสดงในการ์ดสรุปหน้าโรงเรียน</p>
                </div>
              </div>

              <div className="form-grid single">
                <label className="form-group">
                  <span>จำนวนนักเรียนทั้งหมด</span>
                  <input
                    type="text"
                    name="studentCount"
                    value={formData.studentCount}
                    onChange={handleChange}
                  />
                </label>

                <label className="form-group">
                  <span>จำนวนหลักสูตร</span>
                  <input
                    type="text"
                    name="courseCount"
                    value={formData.courseCount}
                    onChange={handleChange}
                  />
                </label>

                <label className="form-group">
                  <span>จำนวนอาจารย์ผู้สอน</span>
                  <input
                    type="text"
                    name="teacherCount"
                    value={formData.teacherCount}
                    onChange={handleChange}
                  />
                </label>

                <label className="form-group">
                  <span>ปีที่เริ่มเปิดสอน</span>
                  <input
                    type="text"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </section>

            <section className="summary-card">
              <div className="summary-header">
                <FaMapMarkedAlt />
                <div>
                  <h2>หมายเหตุเพิ่มเติม</h2>
                  <p>บันทึกข้อมูลภายในหรือข้อควรระวัง</p>
                </div>
              </div>

              <textarea
                className="note-textarea"
                name="note"
                rows="6"
                value={formData.note}
                onChange={handleChange}
                placeholder="เช่น จุดจอดรถ, ช่องทางเข้าตึก, เอกสารที่ต้องเตรียม หรือหมายเหตุภายใน"
              />
            </section>
          </aside>

          <div className="mobile-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/school-info')}
            >
              <FaTimes />
              ยกเลิก
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
}

export default EditSchoolInfo;