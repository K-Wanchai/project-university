import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import apiService from "../../../services/apiService";
import "./EditStudentProfile.css";

const DEFAULT_AVATAR =
  "https://api.dicebear.com/7.x/adventurer/svg?seed=student";

const MAX_IMAGE_SIZE_MB = 5;

const fallbackProfile = {
  fullName: "ด.ช. ตั้งใจ เรียนดี",
  displayName: "น้องตั้งใจ เรียนดี",
  nickname: "น้องตั้งใจ",
  studentCode: "s400123",
  currentLevel: "ไทยคณิต ระดับ ม.3",
  birthday: "15 มกราคม 2558",
  age: "15",
  status: "นักเรียนปัจจุบัน",
  phone: "081-234-5784",
  parentName: "คุณแม่",
  email: "tangjai.r@email.com",
  address: "123 ถ.มิตรภาพ อ.เมือง จ.ขอนแก่น",
  avatar: DEFAULT_AVATAR,
};

function normalizeProfile(raw) {
  const data = raw?.data || raw?.student || raw || {};

  return {
    fullName:
      data.fullName ||
      data.full_name ||
      data.studentName ||
      fallbackProfile.fullName,

    displayName:
      data.displayName ||
      data.display_name ||
      data.studentName ||
      fallbackProfile.displayName,

    nickname:
      data.nickname ||
      data.nickName ||
      data.nick_name ||
      fallbackProfile.nickname,

    studentCode:
      data.studentCode ||
      data.student_code ||
      data.studentId ||
      data.student_id ||
      data.code ||
      fallbackProfile.studentCode,

    currentLevel:
      data.currentLevel ||
      data.current_level ||
      data.classLevel ||
      data.class_level ||
      data.grade ||
      data.level ||
      fallbackProfile.currentLevel,

    birthday:
      data.birthday ||
      data.birthDate ||
      data.birth_date ||
      data.dateOfBirth ||
      fallbackProfile.birthday,

    age: String(data.age || fallbackProfile.age),

    status:
      data.status ||
      data.studentStatus ||
      data.student_status ||
      fallbackProfile.status,

    phone:
      data.phone ||
      data.parentPhone ||
      data.parent_phone ||
      data.tel ||
      fallbackProfile.phone,

    parentName:
      data.parentName ||
      data.parent_name ||
      data.guardianName ||
      data.guardian_name ||
      fallbackProfile.parentName,

    email: data.email || fallbackProfile.email,

    address: data.address || fallbackProfile.address,

    avatar:
      data.avatar ||
      data.profileImage ||
      data.profile_image ||
      data.image ||
      DEFAULT_AVATAR,
  };
}

function EditStudentProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(fallbackProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const studentId = useMemo(() => {
    return localStorage.getItem("studentId") || form.studentCode;
  }, [form.studentCode]);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await apiService.getStudentProfile();
        const profile = normalizeProfile(data);

        if (mounted) {
          setForm(profile);
        }
      } catch (error) {
        if (mounted) {
          setErrorMessage(
            error.message ||
              "โหลดข้อมูลจริงไม่สำเร็จ ระบบจะแสดงข้อมูลตัวอย่างชั่วคราว"
          );
          setForm(fallbackProfile);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setErrorMessage("");
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(
        "กรุณาเลือกรูปภาพไฟล์ .jpg, .jpeg, .png หรือ .webp เท่านั้น"
      );
      event.target.value = "";
      return;
    }

    const fileSizeMb = file.size / 1024 / 1024;

    if (fileSizeMb > MAX_IMAGE_SIZE_MB) {
      setErrorMessage(`ขนาดรูปภาพต้องไม่เกิน ${MAX_IMAGE_SIZE_MB}MB`);
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        avatar: reader.result,
      }));

      setMessage("");
      setErrorMessage("");
    };

    reader.onerror = () => {
      setErrorMessage("ไม่สามารถอ่านไฟล์รูปภาพได้ กรุณาลองใหม่อีกครั้ง");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      setMessage("");
      setErrorMessage("");

      const payload = {
        fullName: form.fullName,
        displayName: form.displayName,
        nickname: form.nickname,
        studentCode: form.studentCode,
        currentLevel: form.currentLevel,
        birthday: form.birthday,
        age: Number(form.age) || form.age,
        status: form.status,
        phone: form.phone,
        parentName: form.parentName,
        email: form.email,
        address: form.address,
        avatar: form.avatar,
      };

      await apiService.updateStudentProfile(studentId, payload);

      setMessage("บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว");

      setTimeout(() => {
        navigate("/student-history");
      }, 700);
    } catch (error) {
      setErrorMessage(error.message || "ไม่สามารถบันทึกข้อมูลได้");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/student-history");
  };

  if (isLoading) {
    return (
      <Layout>
        <section className="edit-profile-page">
          <div className="edit-profile-loading">
            <div className="edit-profile-loader" />
            <h2>กำลังโหลดข้อมูลโปรไฟล์...</h2>
            <p>ระบบกำลังดึงข้อมูลนักเรียนจากฐานข้อมูล</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="edit-profile-page">
        <div className="edit-profile-header">
          <div className="edit-profile-header-content">
            <p className="edit-profile-eyebrow">Edit Student Profile</p>
            <h1>แก้ไขโปรไฟล์นักเรียน</h1>
            <span>ปรับปรุงข้อมูลส่วนตัว ข้อมูลผู้ปกครอง และสถานะนักเรียน</span>
          </div>

          <div className="edit-profile-top-action">
            <button
              type="button"
              className="edit-profile-back-btn"
              onClick={handleCancel}
            >
              <span className="edit-profile-back-icon">↩️</span>
              <span className="edit-profile-back-text">ย้อนกลับ</span>
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="edit-profile-alert error">
            <strong>แจ้งเตือน</strong>
            <span>{errorMessage}</span>
          </div>
        )}

        {message && (
          <div className="edit-profile-alert success">
            <strong>สำเร็จ</strong>
            <span>{message}</span>
          </div>
        )}

        <form className="edit-profile-layout" onSubmit={handleSubmit}>
          <aside className="edit-profile-preview-card">
            <div className="edit-profile-avatar-wrap">
              <button
                type="button"
                className="edit-profile-avatar-upload"
                onClick={handleAvatarClick}
                aria-label="เปลี่ยนรูปโปรไฟล์"
                title="เปลี่ยนรูปโปรไฟล์"
              >
                <span className="edit-profile-avatar-ring">
                  <img src={form.avatar || DEFAULT_AVATAR} alt={form.fullName} />
                </span>

                <span className="edit-profile-avatar-edit-badge">
                  ✏️
                </span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="edit-profile-file-input"
                onChange={handleAvatarChange}
              />
            </div>

            <p className="edit-profile-avatar-hint">
              คลิกที่รูปเพื่อเปลี่ยนรูปโปรไฟล์
              <br />
              รองรับ JPG, PNG, WEBP ขนาดไม่เกิน {MAX_IMAGE_SIZE_MB}MB
            </p>

            <div className="edit-profile-preview-info">
              <span className="edit-profile-status-pill">
                <span />
                {form.status || "นักเรียนปัจจุบัน"}
              </span>

              <h2>{form.fullName || "ชื่อนักเรียน"}</h2>
              <p>{form.currentLevel || "ระดับชั้นปัจจุบัน"}</p>
            </div>

            <div className="edit-profile-preview-meta">
              <div>
                <small>ชื่อเล่น</small>
                <strong>{form.nickname || "-"}</strong>
              </div>

              <div>
                <small>รหัสนักเรียน</small>
                <strong>{form.studentCode || "-"}</strong>
              </div>

              <div>
                <small>ชื่อที่แสดง</small>
                <strong>{form.displayName || "-"}</strong>
              </div>
            </div>
          </aside>

          <div className="edit-profile-form-card">
            <div className="edit-profile-section-header">
              <span>👤</span>
              <div>
                <h2>ข้อมูลนักเรียน</h2>
                <p>ข้อมูลหลักที่ใช้แสดงในหน้าโปรไฟล์นักเรียน</p>
              </div>
            </div>

            <div className="edit-profile-grid">
              <label className="edit-profile-field wide">
                <span>ชื่อ - นามสกุล</span>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="ด.ช. ตั้งใจ เรียนดี"
                />
              </label>

              <label className="edit-profile-field">
                <span>ชื่อเล่น</span>
                <input
                  name="nickname"
                  value={form.nickname}
                  onChange={handleChange}
                  placeholder="น้องตั้งใจ"
                />
              </label>

              <label className="edit-profile-field">
                <span>รหัสนักเรียน</span>
                <input
                  name="studentCode"
                  value={form.studentCode}
                  onChange={handleChange}
                  placeholder="s400123"
                />
              </label>

              <label className="edit-profile-field">
                <span>ระดับชั้นปัจจุบัน</span>
                <input
                  name="currentLevel"
                  value={form.currentLevel}
                  onChange={handleChange}
                  placeholder="ไทยคณิต ระดับ ม.3"
                />
              </label>

              <label className="edit-profile-field">
                <span>ชื่อที่แสดง</span>
                <input
                  name="displayName"
                  value={form.displayName}
                  onChange={handleChange}
                  placeholder="น้องตั้งใจ เรียนดี"
                />
              </label>

              <label className="edit-profile-field">
                <span>วันเดือนปีเกิด</span>
                <input
                  name="birthday"
                  value={form.birthday}
                  onChange={handleChange}
                  placeholder="15 มกราคม 2558"
                />
              </label>

              <label className="edit-profile-field">
                <span>อายุ</span>
                <input
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="15"
                />
              </label>

              <label className="edit-profile-field">
                <span>สถานะนักเรียน</span>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="นักเรียนปัจจุบัน">นักเรียนปัจจุบัน</option>
                  <option value="พักการเรียน">พักการเรียน</option>
                  <option value="จบคอร์สแล้ว">จบคอร์สแล้ว</option>
                  <option value="ยกเลิกการเรียน">ยกเลิกการเรียน</option>
                </select>
              </label>
            </div>

            <div className="edit-profile-divider" />

            <div className="edit-profile-section-header">
              <span>📞</span>
              <div>
                <h2>ข้อมูลการติดต่อ</h2>
                <p>ข้อมูลติดต่อผู้ปกครองและที่อยู่ของนักเรียน</p>
              </div>
            </div>

            <div className="edit-profile-grid">
              <label className="edit-profile-field">
                <span>ชื่อผู้ปกครอง</span>
                <input
                  name="parentName"
                  value={form.parentName}
                  onChange={handleChange}
                  placeholder="คุณแม่"
                />
              </label>

              <label className="edit-profile-field">
                <span>เบอร์โทรผู้ปกครอง</span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="081-234-5784"
                />
              </label>

              <label className="edit-profile-field wide">
                <span>อีเมล</span>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tangjai.r@email.com"
                />
              </label>

              <label className="edit-profile-field wide">
                <span>ที่อยู่</span>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="123 ถ.มิตรภาพ อ.เมือง จ.ขอนแก่น"
                  rows="4"
                />
              </label>
            </div>

            <div className="edit-profile-actions">
              <button
                type="button"
                className="edit-profile-cancel-btn"
                onClick={handleCancel}
                disabled={isSaving}
              >
                ยกเลิก
              </button>

              <button
                type="submit"
                className="edit-profile-save-btn"
                disabled={isSaving}
              >
                {isSaving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </Layout>
  );
}

export default EditStudentProfile;