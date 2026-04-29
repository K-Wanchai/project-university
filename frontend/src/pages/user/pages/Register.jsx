import React, { useState } from "react";
import "./register.css";
import apiService from "../../../services/apiService";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    dateOfBirth: "",
    gender: "",
    role: "นักเรียน",
    gradeLevel: "",
    phoneNumber: "",
    email: "",
    address: "",
    username: "",
    password: "",
    confirmPassword: "",
    accept: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, name, value, type, checked } = e.target;

    if (type === "radio") {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        [id]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.accept) {
      alert("กรุณายอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัวก่อนสมัคร");
      return;
    }

    if (formData.password.length === 0) {
      alert("กรุณากรอกรหัสผ่าน");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
      return;
    }

    if (!formData.username || !formData.email) {
      alert("กรุณากรอกข้อมูล ชื่อผู้ใช้ และ อีเมล ให้ครบถ้วน");
      return;
    }

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      nationalId: formData.nationalId,
      dateOfBirth: formData.dateOfBirth || null,
      gender: formData.gender,
      role: formData.role,
      gradeLevel: formData.gradeLevel,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      address: formData.address,
      username: formData.username,
      password: formData.password,
    };

try {
  setLoading(true);

  await apiService.register(userData);

  alert("สมัครสมาชิกสำเร็จ!");
  window.location.href = "/login";
} catch (error) {
  alert(error.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
} finally {
  setLoading(false);
}
  };

  return (
    <div className="register-page">
      <div className="container">
        <div className="sidebar">
          <h1>
            ครูปุ๊ก
            <br />
            ติวเตอร์
          </h1>
        </div>

        <div className="content">
          <h1>สมัครสมาชิกใหม่</h1>

          <form onSubmit={handleSubmit}>
            <div className="card">
              <h3>1. ข้อมูลส่วนตัว</h3>

              <div className="row">
                <input
                  type="text"
                  id="firstName"
                  placeholder="ชื่อ"
                  value={formData.firstName}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  id="lastName"
                  placeholder="นามสกุล"
                  value={formData.lastName}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  id="nationalId"
                  placeholder="เลขบัตรประชาชน"
                  value={formData.nationalId}
                  onChange={handleChange}
                />
              </div>

              <div className="row">
                <input
                  type="date"
                  id="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />

                <div className="radio-group">
                  เพศ:
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="ชาย"
                      checked={formData.gender === "ชาย"}
                      onChange={handleChange}
                    />
                    ชาย
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="หญิง"
                      checked={formData.gender === "หญิง"}
                      onChange={handleChange}
                    />
                    หญิง
                  </label>
                </div>

                <div className="radio-group hidden">
                  สถานะ:
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="นักเรียน"
                      checked={formData.role === "นักเรียน"}
                      onChange={handleChange}
                    />
                    นักเรียน
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="คุณครู"
                      checked={formData.role === "คุณครู"}
                      onChange={handleChange}
                    />
                    คุณครู
                  </label>
                </div>

                <select
                  id="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={handleChange}
                >
                  <option value="">เลือกระดับชั้น</option>
                  <option value="มัธยมศึกษาตอนต้น">มัธยมศึกษาตอนต้น</option>
                  <option value="มัธยมศึกษาตอนปลาย">มัธยมศึกษาตอนปลาย</option>
                  <option value="ระดับอุดมศึกษา">ระดับอุดมศึกษา</option>
                </select>
              </div>
            </div>

            <div className="card">
              <h3>2. ข้อมูลการติดต่อ</h3>

              <div className="row">
                <input
                  type="text"
                  id="phoneNumber"
                  placeholder="เบอร์โทรศัพท์"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />

                <input
                  type="email"
                  id="email"
                  placeholder="อีเมล"
                  value={formData.email}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  id="address"
                  placeholder="ที่อยู่"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="card">
              <h3>3. ข้อมูลบัญชีผู้ใช้</h3>

              <div className="row">
                <input
                  type="text"
                  id="username"
                  placeholder="ชื่อผู้ใช้"
                  value={formData.username}
                  onChange={handleChange}
                />

                <input
                  type="password"
                  id="password"
                  placeholder="รหัสผ่าน"
                  value={formData.password}
                  onChange={handleChange}
                />

                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="ยืนยันรหัสผ่าน"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="footer">
              <label>
                <input
                  type="checkbox"
                  id="accept"
                  checked={formData.accept}
                  onChange={handleChange}
                />
                ฉันยอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว
              </label>

              <button type="submit" disabled={loading}>
                {loading ? "กำลังดำเนินการ..." : "สมัครสมาชิก"}
              </button>

              <p>
                มีบัญชีแล้ว? <a href="/login">เข้าสู่ระบบ</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;