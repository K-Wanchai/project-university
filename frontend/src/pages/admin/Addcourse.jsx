import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Addcourse.css';
import apiService from '../../services/apiService';

const INITIAL_FORM = {
  courseName: '',
  category: 'วิทยาศาสตร์',
  courseTime: '',
  tutorName: '',
  status: 'เปิดรับสมัคร',
  startDate: '',
  totalHours: '',
  price: '',
  capacity: '',
  description: '',
};

function Addcourse() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [courseImage, setCourseImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('ขนาดไฟล์รูปคอร์สต้องไม่เกิน 2MB');
      e.target.value = '';
      return;
    }

    setCourseImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const submitData = new FormData();
    submitData.append('courseName', formData.courseName);
    submitData.append('subject', formData.category);
    submitData.append('instructor', formData.tutorName);
    submitData.append('learningChannel', formData.courseTime);
    submitData.append('startDate', formData.startDate);
    submitData.append('hours', formData.totalHours);
    submitData.append('price', formData.price);
    submitData.append('capacity', formData.capacity);
    submitData.append('status', formData.status);
    submitData.append('description', formData.description);

    if (courseImage) {
      submitData.append('courseImage', courseImage);
    }

    try {
      await apiService.createCourse(submitData);
      alert('เพิ่มคอร์สเรียนใหม่สำเร็จ!');
      navigate('/course');
    } catch (error) {
      setErrorMessage(error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-course-page-container">
      <main className="add-course-main-content">
        <header className="add-course-header">
          <button
            type="button"
            onClick={() => navigate('/course')}
            className="btn-back-header"
          >
            ◀️ย้อนกลับ
          </button>

          <div>
            <p className="add-course-eyebrow">COURSE FORM</p>
            <h1>เพิ่มคอร์สเรียนใหม่</h1>
            <p>สร้างคอร์สใหม่พร้อมกำหนดหมวดหมู่ ผู้สอน เวลาเรียน และรายละเอียดราคา</p>
          </div>
        </header>

        {errorMessage && (
          <div className="add-course-alert error-alert">
            {errorMessage}
          </div>
        )}

        <section className="add-course-form-card">
          <form onSubmit={handleSubmit}>
            <div className="add-course-form-layout">
              <aside className="add-course-image-section">
                <div className="add-course-image-box">
                  {previewImage ? (
                    <img src={previewImage} alt="Course preview" />
                  ) : (
                    <i className="fas fa-book-open" />
                  )}
                </div>

                <button
                  type="button"
                  className="add-course-btn-upload"
                  onClick={() => fileInputRef.current?.click()}
                >
                  อัปโหลดรูปคอร์ส
                </button>

                <p className="upload-hint">รองรับ JPG/PNG ขนาดไม่เกิน 2MB</p>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden-file-input"
                />

                <div className="form-tip-card">
                  <p>
                    ตรวจสอบชื่อคอร์ส ผู้สอน ราคา และวันเวลาเรียนก่อนบันทึก
                    เพื่อป้องกันข้อมูลผิดพลาด
                  </p>
                </div>
              </aside>

              <div className="add-course-fields-section">
                <div className="form-section-title">
                  <span>
                    <i className="fas fa-book" />
                  </span>
                  <div>
                    <h2>ข้อมูลคอร์สเรียน</h2>
                    <p>ข้อมูลหลักสำหรับแสดงในหน้ารายการคอร์สเรียน</p>
                  </div>
                </div>

                <div className="add-course-input-grid">
                  <div className="add-course-form-group">
                    <label htmlFor="courseName">ชื่อคอร์สเรียน <span>*</span></label>
                    <input
                      type="text"
                      id="courseName"
                      value={formData.courseName}
                      onChange={handleInputChange}
                      required
                      placeholder="เช่น ฟิสิกส์ ม.4 เทอม 1"
                    />
                  </div>

                  <div className="add-course-form-group">
                    <label htmlFor="category">หมวดหมู่ <span>*</span></label>
                    <select id="category" value={formData.category} onChange={handleInputChange}>
                      <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                      <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                      <option value="ภาษาไทย">ภาษาไทย</option>
                      <option value="ภาษาต่างประเทศ">ภาษาต่างประเทศ</option>
                      <option value="ศิลปะ">ศิลปะ</option>
                    </select>
                  </div>

                  <div className="add-course-form-group">
                    <label htmlFor="tutorName">ชื่อผู้สอน <span>*</span></label>
                    <input
                      type="text"
                      id="tutorName"
                      value={formData.tutorName}
                      onChange={handleInputChange}
                      required
                      placeholder="ชื่ออาจารย์ผู้สอน"
                    />
                  </div>

                  <div className="add-course-form-group">
                    <label htmlFor="courseTime">วัน-เวลาเรียน <span>*</span></label>
                    <input
                      type="text"
                      id="courseTime"
                      value={formData.courseTime}
                      onChange={handleInputChange}
                      required
                      placeholder="เช่น เสาร์-อาทิตย์ 09:00-12:00"
                    />
                  </div>

                  <div className="add-course-form-group">
                    <label htmlFor="startDate">วันที่เริ่มเรียน <span>*</span></label>
                    <input
                      type="date"
                      id="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="add-course-form-group">
                    <label htmlFor="totalHours">จำนวนชั่วโมงทั้งหมด <span>*</span></label>
                    <input
                      type="number"
                      id="totalHours"
                      value={formData.totalHours}
                      onChange={handleInputChange}
                      required
                      placeholder="เช่น 30"
                    />
                  </div>

                  <div className="add-course-form-group">
                    <label htmlFor="price">ราคาคอร์ส <span>*</span></label>
                    <input
                      type="number"
                      id="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      placeholder="เช่น 3500"
                    />
                  </div>

                  <div className="add-course-form-group">
                    <label htmlFor="capacity">จำนวนที่เปิดรับ <span>*</span></label>
                    <input
                      type="number"
                      id="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      required
                      placeholder="เช่น 20"
                    />
                  </div>

                  <div className="add-course-form-group full-width">
                    <label htmlFor="description">รายละเอียดคอร์สเรียน</label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="ระบุรายละเอียดเนื้อหา จุดเด่น หรือสิ่งที่ผู้เรียนจะได้รับ"
                    />
                  </div>
                </div>

                <div className="add-course-form-actions">
                  <button type="submit" className="btn-save" disabled={isLoading}>
                    {isLoading ? 'กำลังบันทึก...' : 'บันทึกคอร์สเรียน'}
                  </button>

                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => navigate('/course')}
                    disabled={isLoading}
                  >
                    ยกเลิก
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

export default Addcourse;