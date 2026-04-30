// src/pages/.../EditExamination.jsx

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ThaiAddressSelect } from 'thai-address-select';
import AdminLayout from '../../Layout/AdminLayout';
import apiService from '../../services/apiService';
import './EditExamination.css';
import {
  FaSave,
  FaUndo,
  FaCamera,
  FaChevronDown
} from 'react-icons/fa';

const defaultImage =
  'https://upload.wikimedia.org/wikipedia/th/thumb/1/11/Khon_Kaen_University_Logo.svg/1200px-Khon_Kaen_University_Logo.svg.png';

const EditExamination = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const provinceRef = useRef(null);
  const districtRef = useRef(null);
  const subDistrictRef = useRef(null);
  const zipcodeRef = useRef(null);

  const [imagePreview, setImagePreview] = useState(defaultImage);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    nameTh: '',
    nameEn: '',
    code: '',
    type: '',
    status: '',
    road: '',
    subDistrict: '',
    district: '',
    province: '',
    zipcode: '',
    contactName: '',
    regDate: '',
    totalSeats: '',
    image: null
  });

  const mapExaminationToForm = (data) => ({
    nameTh: data.nameTh || data.name || '',
    nameEn: data.nameEn || '',
    code: data.code || '',
    type: data.type || '',
    status: data.status || '',
    road: data.address || data.road || '',

    subDistrict: data.subDistrict || data.district || '',
    district: data.districtName || data.amphoe || '',
    province: data.province || '',
    zipcode: data.zipcode || data.postcode || '',

    contactName: data.contactName || '',
    regDate: data.regDate ? String(data.regDate).slice(0, 10) : '',
    totalSeats: data.totalSeats || data.capacity || '',
    image: null
  });

  const updateAddressFormData = () => {
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        province: provinceRef.current?.value || '',
        district: districtRef.current?.value || '',
        subDistrict: subDistrictRef.current?.value || '',
        zipcode: zipcodeRef.current?.value || '',
      }));
    }, 0);
  };

  const syncAddressRefs = (nextFormData) => {
    setTimeout(() => {
      if (provinceRef.current) {
        provinceRef.current.value = nextFormData.province || '';
        provinceRef.current.dispatchEvent(new Event('change', { bubbles: true }));
      }

      setTimeout(() => {
        if (districtRef.current) {
          districtRef.current.value = nextFormData.district || '';
          districtRef.current.dispatchEvent(new Event('change', { bubbles: true }));
        }

        setTimeout(() => {
          if (subDistrictRef.current) {
            subDistrictRef.current.value = nextFormData.subDistrict || '';
            subDistrictRef.current.dispatchEvent(new Event('change', { bubbles: true }));
          }

          setTimeout(() => {
            const thaiAddressZipcode = zipcodeRef.current?.value || '';

            if (!thaiAddressZipcode && zipcodeRef.current) {
              zipcodeRef.current.value = nextFormData.zipcode || '';
            }

            updateAddressFormData();
          }, 100);
        }, 200);
      }, 200);
    }, 200);
  };

  const fetchExaminationDetail = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const response = await apiService.getExaminationById(id);

      const examination =
        response?.data ||
        response?.examination ||
        response?.item ||
        response;

      if (!examination) {
        setErrorMessage('ไม่พบข้อมูลสถาบันสอบ');
        return;
      }

      const mappedFormData = mapExaminationToForm(examination);

      setFormData(mappedFormData);

      if (examination.imageUrl || examination.image) {
        setImagePreview(examination.imageUrl || examination.image);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('เกิดข้อผิดพลาดในการโหลดข้อมูลสถาบันสอบจากฐานข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchExaminationDetail();
    }
  }, [id]);

  useEffect(() => {
    if (loading) return;

    if (
      !provinceRef.current ||
      !districtRef.current ||
      !subDistrictRef.current ||
      !zipcodeRef.current
    ) {
      return;
    }

    const thaiAddress = new ThaiAddressSelect({
      provinceEl: provinceRef.current,
      districtEl: districtRef.current,
      subDistrictEl: subDistrictRef.current,
      zipCodeEl: zipcodeRef.current,
      placeholder: {
        province: 'เลือกจังหวัด',
        district: 'เลือกอำเภอ / เขต',
        subDistrict: 'เลือกตำบล / แขวง',
      },
    });

    const handleAddressChange = () => {
      updateAddressFormData();
    };

    provinceRef.current.addEventListener('change', handleAddressChange);
    districtRef.current.addEventListener('change', handleAddressChange);
    subDistrictRef.current.addEventListener('change', handleAddressChange);

    syncAddressRefs(formData);

    return () => {
      provinceRef.current?.removeEventListener('change', handleAddressChange);
      districtRef.current?.removeEventListener('change', handleAddressChange);
      subDistrictRef.current?.removeEventListener('change', handleAddressChange);

      if (thaiAddress?.destroy) {
        thaiAddress.destroy();
      }
    };
  }, [loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
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

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setErrorMessage('');

      const latestProvince = provinceRef.current?.value || formData.province;
      const latestDistrict = districtRef.current?.value || formData.district;
      const latestSubDistrict = subDistrictRef.current?.value || formData.subDistrict;
      const latestZipcode = zipcodeRef.current?.value || formData.zipcode;

      const sendData = new FormData();

      sendData.append(
        'data',
        JSON.stringify({
          nameTh: formData.nameTh,
          nameEn: formData.nameEn,
          code: formData.code,
          type: formData.type,
          status: formData.status,

          address: formData.road,
          district: latestSubDistrict,
          amphoe: latestDistrict,
          province: latestProvince,
          zipcode: latestZipcode,

          contactName: formData.contactName,
          regDate: formData.regDate,
          totalSeats: formData.totalSeats ? Number(formData.totalSeats) : 0,
        })
      );

      if (formData.image) {
        sendData.append('image', formData.image);
      }

      const res = await apiService.updateExamination(id, sendData);

      if (!res.ok) {
        throw new Error('แก้ไขข้อมูลไม่สำเร็จ');
      }

      alert('แก้ไขข้อมูลสถาบันสอบสำเร็จ');
      navigate('/examination');
    } catch (error) {
      console.error(error);
      setErrorMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <section className="edit-exam-page">
          <div className="edit-loading-state">
            กำลังโหลดข้อมูล...
          </div>
        </section>
      </AdminLayout>
    );
  }

  if (errorMessage && !saving) {
    return (
      <AdminLayout>
        <section className="edit-exam-page">
          <div className="edit-error-state">
            {errorMessage}
          </div>

          <div className="edit-error-actions">
            <button
              className="btn-cancel"
              type="button"
              onClick={() => navigate('/examination')}
            >
              <FaUndo /> กลับ
            </button>
          </div>
        </section>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <section className="edit-exam-page">
        <header className="content-header">
          <h1>แก้ไขข้อมูลสถาบันสอบ ({formData.nameTh || '-'})</h1>
        </header>

        <section className="form-card">
          {errorMessage && (
            <div className="form-error-message">
              {errorMessage}
            </div>
          )}

          <div className="action-buttons">
            <button
              className="btn-save"
              type="button"
              onClick={handleSubmit}
              disabled={saving}
            >
              <FaSave /> {saving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
            </button>

            <button
              className="btn-cancel"
              type="button"
              onClick={() => navigate('/examination')}
              disabled={saving}
            >
              <FaUndo /> ยกเลิก
            </button>
          </div>

          <div className="form-grid-top">
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

            <div className="input-group-top">
              <div className="input-row">
                <div className="input-field">
                  <label>ชื่อสถาบันสอบ (ภาษาไทย)</label>
                  <input
                    type="text"
                    name="nameTh"
                    value={formData.nameTh}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-field">
                  <label>ชื่อสถาบันสอบ (ภาษาอังกฤษ/ย่อ)</label>
                  <input
                    type="text"
                    name="nameEn"
                    value={formData.nameEn}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-field">
                  <label>รหัสสถาบัน</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-field">
                  <label>สถานะ</label>
                  <div className="select">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="">เลือกสถานะ</option>
                      <option value="กำลังเปิดรับสมัคร">กำลังเปิดรับสมัคร</option>
                      <option value="เปิดใช้งาน">เปิดใช้งาน</option>
                      <option value="ปิดใช้งาน">ปิดใช้งาน</option>
                      <option value="รอตรวจสอบ">รอตรวจสอบ</option>
                    </select>

                    <FaChevronDown className="select-icon" />
                  </div>
                </div>
              </div>

              <div className="input-row">
                <div className="input-field">
                  <label>ประเภทสถาบัน</label>
                  <div className="select">
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option value="">เลือกประเภทสถาบัน</option>
                      <option value="มหาวิทยาลัย">มหาวิทยาลัย</option>
                      <option value="โรงเรียนมัธยมศึกษา">โรงเรียนมัธยมศึกษา</option>
                      <option value="อาชีวศึกษา">อาชีวศึกษา</option>
                      <option value="โรงเรียน">โรงเรียน</option>
                      <option value="วิทยาลัย">วิทยาลัย</option>
                      <option value="ศูนย์สอบ">ศูนย์สอบ</option>
                    </select>

                    <FaChevronDown className="select-icon" />
                  </div>
                </div>

                <div className="input-field">
                  <label>จำนวนที่นั่ง</label>
                  <input
                    type="number"
                    name="totalSeats"
                    value={formData.totalSeats}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-field">
                  <label>ผู้ประสานงาน</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-field">
                  <label>วันที่ลงทะเบียน</label>
                  <input
                    type="date"
                    name="regDate"
                    value={formData.regDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-grid-bottom">
            <div className="sub-card">
              <h3>ที่อยู่</h3>

              <div className="input-row">
                <div className="input-field">
                  <label>ถนน / รายละเอียดที่ตั้ง</label>
                  <input
                    type="text"
                    name="road"
                    value={formData.road}
                    onChange={handleChange}
                    placeholder="ถนน, ซอย, อาคาร"
                  />
                </div>

                <div className="input-field">
                  <label>จังหวัด</label>
                  <div className="select">
                    <select ref={provinceRef} name="province">
                      <option value="">เลือกจังหวัด</option>
                    </select>

                    <FaChevronDown className="select-icon" />
                  </div>
                </div>
              </div>

              <div className="input-row">
                <div className="input-field">
                  <label>อำเภอ / เขต</label>
                  <div className="select">
                    <select ref={districtRef} name="district">
                      <option value="">เลือกอำเภอ / เขต</option>
                    </select>

                    <FaChevronDown className="select-icon" />
                  </div>
                </div>

                <div className="input-field">
                  <label>ตำบล / แขวง</label>
                  <div className="select">
                    <select ref={subDistrictRef} name="subDistrict">
                      <option value="">เลือกตำบล / แขวง</option>
                    </select>

                    <FaChevronDown className="select-icon" />
                  </div>
                </div>
              </div>

              <div className="input-row">
                <div className="input-field">
                  <label>รหัสไปรษณีย์</label>
                  <input
                    ref={zipcodeRef}
                    type="text"
                    name="zipcode"
                    defaultValue={formData.zipcode}
                    placeholder="เช่น 10200"
                    maxLength="5"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </AdminLayout>
  );
};

export default EditExamination;