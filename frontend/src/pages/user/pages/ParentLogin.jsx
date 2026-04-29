import React, { useState } from "react";
import "./ParentLogin.css";
import apiService from "../../../services/apiService";

function ParentLogin() {
  const [citizenId, setCitizenId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCitizenIdChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 13) {
      setCitizenId(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!citizenId) {
      alert("กรุณากรอกเลขบัตรประชาชนของผู้เรียน");
      return;
    }

    if (citizenId.length !== 13) {
      alert("กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก");
      return;
    }

    try {
      setLoading(true);

      await apiService.parentLogin({ citizenId });

      alert("เข้าสู่ระบบสำเร็จ");

      window.location.href = "/parent-dashboard";
    } catch (error) {
      alert(error.message || "ไม่พบข้อมูลนักเรียน");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="parent-login-page">
      <div className="parent-login-container">
        <div className="parent-login-left">
          <h1>
            ครูปุ๊ก
            <br />
            ติวเตอร์
          </h1>
        </div>

        <div className="parent-login-right">
          <div className="parent-mobile-header">
            <h1>ครูปุ๊กติวเตอร์</h1>
          </div>

          <div className="parent-form-box">
            <div className="parent-form-header">
              <div className="parent-icon-circle">
                <span>👨‍👩‍👧</span>
              </div>

              <h2>ผู้ปกครองเข้าสู่ระบบ</h2>
              <p>กรอกเลขบัตรประชาชนของผู้เรียนเพื่อตรวจสอบข้อมูล</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="parent-input-group">
                <span className="parent-input-icon">🪪</span>

                <input
                  type="text"
                  id="citizenId"
                  placeholder="กรอกเลขบัตรประชาชนของผู้เรียน"
                  maxLength="13"
                  value={citizenId}
                  onChange={handleCitizenIdChange}
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
              </button>

              <p className="parent-link center">
                <a href="/login">กลับไปหน้าเข้าสู่ระบบหลัก</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParentLogin;