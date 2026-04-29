import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Newuser.css';

import apiService from '../../services/apiService';
import { SERVER_URL } from '../../config';

const INITIAL_FORM = {
  fullName: '',
  username: '',
  password: '',
  confirmPassword: '',
  phone: '',
  email: '',
  role: 'ติวเตอร์',
  status: 'ใช้งานอยู่',
  remarks: '',
};

function Newuser() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('id');
  const isEditMode = Boolean(userId);

  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    const loadUser = async () => {
      setIsFetching(true);
      setErrorMessage('');

      try {
        const user = await apiService.getUserById(userId);

        setFormData({
          fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          username: user.username || '',
          password: '',
          confirmPassword: '',
          phone: user.phoneNumber || '',
          email: user.email || '',
          role: user.role ? user.role.trim() : 'ติวเตอร์',
          status: user.status || 'ใช้งานอยู่',
          remarks: user.remarks || '',
        });

        if (user.profileImage) {
          setPreviewImage(`${SERVER_URL}/uploads/profiles/${user.profileImage}`);
        }
      } catch (err) {
        console.error('Error loading user:', err);
        setErrorMessage('ไม่สามารถโหลดข้อมูลผู้ใช้งานได้ กรุณาย้อนกลับแล้วลองใหม่อีกครั้ง');
      } finally {
        setIsFetching(false);
      }
    };

    loadUser();
  }, [isEditMode, userId]);

  const passwordStrength = useMemo(() => {
    const password = formData.password;

    if (!password) {
      return {
        label: isEditMode ? 'ไม่เปลี่ยนรหัสผ่าน' : 'ยังไม่ได้กรอก',
        className: 'strength-empty',
      };
    }

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score >= 3) return { label: 'รหัสผ่านค่อนข้างปลอดภัย', className: 'strength-strong' };
    if (score >= 2) return { label: 'รหัสผ่านระดับกลาง', className: 'strength-medium' };
    return { label: 'รหัสผ่านยังอ่อนเกินไป', className: 'strength-weak' };
  }, [formData.password, isEditMode]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValidType = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type);
    const isValidSize = file.size <= 2 * 1024 * 1024;

    if (!isValidType) {
      alert('รองรับเฉพาะไฟล์รูปภาพ .jpg, .jpeg และ .png เท่านั้น');
      e.target.value = '';
      return;
    }

    if (!isValidSize) {
      alert('ขนาดไฟล์รูปโปรไฟล์ต้องไม่เกิน 2MB');
      e.target.value = '';
      return;
    }

    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const fullName = formData.fullName.trim();
    const phoneRegex = /^[0-9+\-\s()]{8,20}$/;

    if (!fullName) return 'กรุณากรอกชื่อผู้ใช้งาน';
    if (!formData.username.trim()) return 'กรุณากรอกชื่อผู้ใช้';
    if (!phoneRegex.test(formData.phone.trim())) return 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง';

    if (!isEditMode && formData.password.length < 8) {
      return 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร';
    }

    if (formData.password || formData.confirmPassword) {
      if (formData.password.length < 8) return 'รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร';
      if (formData.password !== formData.confirmPassword) return 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationMessage = validateForm();
    if (validationMessage) {
      alert(validationMessage);
      return;
    }

    const [firstName, ...lastNameParts] = formData.fullName.trim().split(/\s+/);

    const submitData = new FormData();
    submitData.append('firstName', firstName || '');
    submitData.append('lastName', lastNameParts.join(' ') || '');
    submitData.append('username', formData.username.trim());
    submitData.append('phoneNumber', formData.phone.trim());
    submitData.append('email', formData.email.trim());
    submitData.append('role', formData.role);
    submitData.append('status', isEditMode ? formData.status : 'ใช้งานอยู่');
    submitData.append('remarks', formData.remarks.trim());

    if (formData.password) submitData.append('password', formData.password);
    if (profileImage) submitData.append('profileImage', profileImage);

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = isEditMode
        ? await apiService.updateUser(userId, submitData)
        : await apiService.createUser(submitData);

      if (res?.ok === false) throw new Error('บันทึกไม่สำเร็จ');

      alert(isEditMode ? 'อัปเดตข้อมูลสำเร็จ!' : 'สร้างผู้ใช้งานใหม่สำเร็จ!');
      navigate('/user');
    } catch (err) {
      console.error('Error saving user:', err);
      setErrorMessage('เกิดข้อผิดพลาดในการบันทึก กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleField = () => {
    if (formData.role === 'นักเรียน') {
      return (
        <div className="locked-role-box">
          <i className="fas fa-user-graduate" />
          <span>นักเรียน</span>
        </div>
      );
    }

    return (
      <select id="role" value={formData.role} onChange={handleInputChange}>
        <option value="ติวเตอร์">ติวเตอร์</option>
        <option value="ผู้ดูแลระบบ">ผู้ดูแลระบบ</option>
      </select>
    );
  };

  return (
    <div className="newuser-page-container">
      <main className="newuser-main-content">
        <header className="newuser-header">
          <button
            type="button"
            onClick={() => navigate('/user')}
            className="btn-back-header"
          >
            ◀️ย้อนกลับ
          </button>

          <div>
            <p className="newuser-eyebrow">USER FORM</p>
            <h1>{isEditMode ? 'แก้ไขข้อมูลผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่'}</h1>
            <p>
              {isEditMode
                ? 'อัปเดตข้อมูลบัญชี บทบาท สถานะ และรูปโปรไฟล์'
                : 'สร้างบัญชีใหม่พร้อมกำหนดบทบาทและข้อมูลติดต่อ'}
            </p>
          </div>
        </header>

        {errorMessage && (
          <div className="newuser-alert error-alert">
            <i className="fas fa-exclamation-circle" />
            {errorMessage}
          </div>
        )}

        <section className="newuser-form-card">
          {isFetching ? (
            <div className="newuser-loading-state">
              <i className="fas fa-spinner fa-spin" />
              กำลังโหลดข้อมูลผู้ใช้งาน...
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="newuser-form-layout">
                <aside className="newuser-profile-section">
                  <div className="newuser-avatar-box">
                    {previewImage ? (
                      <img src={previewImage} alt="Profile Preview" />
                    ) : (
                      <i className="fas fa-user" />
                    )}
                  </div>

                  <button
                    type="button"
                    className="newuser-btn-upload"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    อัปโหลดรูปโปรไฟล์
                  </button>

                  <p className="upload-hint">รองรับ JPG/PNG ขนาดไม่เกิน 2MB</p>

                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden-file-input"
                  />

                  <div className="form-tip-card">
                    <p>
                      ตรวจสอบอีเมล เบอร์โทร และบทบาทก่อนบันทึก
                      เพื่อป้องกันสิทธิ์การเข้าถึงผิดพลาด
                    </p>
                  </div>
                </aside>

                <div className="newuser-fields-section">
                  <div className="form-section-title">
                    <span>
                      <i className="fas fa-id-card" />
                    </span>

                    <div>
                      <h2>ข้อมูลบัญชี</h2>
                      <p>ข้อมูลพื้นฐานสำหรับเข้าสู่ระบบและติดต่อผู้ใช้งาน</p>
                    </div>
                  </div>

                  <div className="newuser-input-grid">
                    <div className="newuser-form-group full-width">
                      <label htmlFor="role">
                        บทบาท <span>*</span>
                      </label>
                      {renderRoleField()}
                      {isEditMode && formData.role === 'นักเรียน' && (
                        <small className="field-note">
                          บัญชีนี้เป็นนักเรียน จึงไม่สามารถแก้ไขบทบาทได้
                        </small>
                      )}
                    </div>

                    <div className="newuser-form-group">
                      <label htmlFor="fullName">
                        ชื่อ-นามสกุล <span>*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="นายปิติ สุขสมบูรณ์"
                      />
                    </div>

                    <div className="newuser-form-group">
                      <label htmlFor="username">
                        ชื่อผู้ใช้ <span>*</span>
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        disabled={isEditMode}
                        className={isEditMode ? 'input-disabled' : ''}
                        placeholder="username"
                      />
                    </div>

                    <div className="newuser-form-group">
                      <label htmlFor="phone">
                        เบอร์โทรศัพท์ <span>*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="08x-xxxxxxx"
                      />
                    </div>

                    <div className="newuser-form-group">
                      <label htmlFor="email">
                        อีเมล <span>*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="example@krupuk.com"
                      />
                    </div>
                  </div>

                  <div className="form-section-title section-spacer">
                    <span>
                      <i className="fas fa-key" />
                    </span>

                    <div>
                      <h2>ความปลอดภัยและสถานะ</h2>
                      <p>
                        {isEditMode
                          ? 'เว้นรหัสผ่านว่างไว้ หากไม่ต้องการเปลี่ยนรหัสผ่านเดิม'
                          : 'กำหนดรหัสผ่านเริ่มต้นสำหรับผู้ใช้งานใหม่'}
                      </p>
                    </div>
                  </div>

                  <div className="newuser-input-grid">
                    <div className="newuser-form-group password-wrap">
                      <label htmlFor="password">
                        {isEditMode ? 'รหัสผ่านใหม่' : 'รหัสผ่าน'} {!isEditMode && <span>*</span>}
                      </label>

                      <input
                        type={showPwd ? 'text' : 'password'}
                        id="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required={!isEditMode}
                        placeholder={isEditMode ? 'เว้นว่างหากไม่เปลี่ยน' : 'อย่างน้อย 8 ตัวอักษร'}
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPwd((prev) => !prev)}
                        aria-label="แสดงหรือซ่อนรหัสผ่าน"
                      >
                        <i className={`fas ${showPwd ? 'fa-eye-slash' : 'fa-eye'}`} />
                      </button>

                      <small className={`password-strength ${passwordStrength.className}`}>
                        {passwordStrength.label}
                      </small>
                    </div>

                    <div className="newuser-form-group password-wrap">
                      <label htmlFor="confirmPassword">
                        {isEditMode ? 'ยืนยันรหัสผ่านใหม่' : 'ยืนยันรหัสผ่าน'} {!isEditMode && <span>*</span>}
                      </label>

                      <input
                        type={showConfirmPwd ? 'text' : 'password'}
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required={!isEditMode}
                        placeholder="กรอกรหัสผ่านอีกครั้ง"
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPwd((prev) => !prev)}
                        aria-label="แสดงหรือซ่อนยืนยันรหัสผ่าน"
                      >
                        <i className={`fas ${showConfirmPwd ? 'fa-eye-slash' : 'fa-eye'}`} />
                      </button>
                    </div>

                    {isEditMode && formData.role !== 'นักเรียน' && (
                      <div className="newuser-form-group">
                        <label htmlFor="status">สถานะ</label>
                        <select id="status" value={formData.status} onChange={handleInputChange}>
                          <option value="ใช้งานอยู่">ใช้งานอยู่</option>
                          <option value="ระงับการใช้งาน">ระงับการใช้งาน</option>
                          <option value="รอตรวจสอบ">รอตรวจสอบ</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="newuser-form-group full-width remarks-area">
                    <label htmlFor="remarks">บันทึกเพิ่มเติม</label>
                    <textarea
                      id="remarks"
                      value={formData.remarks}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="เช่น หมายเหตุเกี่ยวกับสิทธิ์การใช้งาน ตารางสอน หรือข้อมูลที่ทีมแอดมินควรรู้"
                    />
                  </div>

                  <div className="newuser-form-actions">
                    <button type="submit" className="btn-save" disabled={isLoading}>
                      {isLoading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                    </button>

                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => navigate('/user')}
                      disabled={isLoading}
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}

export default Newuser;