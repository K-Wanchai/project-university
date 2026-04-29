import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../../../services/apiService';
import './login.css';

function Login() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('กรุณากรอกชื่อผู้ใช้ / อีเมล และรหัสผ่าน');
      return;
    }

    try {
      setIsLoading(true);

      const user = await apiService.login({
        identifier: identifier.trim(),
        password,
      });

      alert(`เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับคุณ ${user?.username || identifier}`);

      navigate('/standard', { replace: true });
    } catch (error) {
      setErrorMessage(
        error?.message ||
          'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบชื่อผู้ใช้หรือรหัสผ่าน'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container login-container">
        <div className="left login-left">
          <div className="brand-box">
            <div className="brand-icon">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>

            <h1>
              ครูปุ๊ก
              <br />
              ติวเตอร์
            </h1>

            <p>ระบบเรียนออนไลน์และจัดการข้อมูลนักเรียน</p>
          </div>
        </div>

        <div className="right login-right">
          <div className="mobile-header">
            <h1>ครูปุ๊กติวเตอร์</h1>
          </div>

          <div className="form-box login-card">
            <div className="login-heading">
              <span className="login-kicker">Welcome Back</span>
              <h2>เข้าสู่ระบบ</h2>
              <p>กรอกข้อมูลเพื่อเข้าสู่ระบบของคุณ</p>
            </div>

            <form onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="login-alert">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="input-group">
                <i className="fa fa-user icon"></i>

                <input
                  type="text"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder="ชื่อผู้ใช้ / อีเมล"
                  autoComplete="username"
                  required
                />
              </div>

              <div className="input-group">
                <i className="fa fa-lock icon"></i>

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="รหัสผ่าน"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>

              <button
                type="submit"
                className="login-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    กำลังตรวจสอบ...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-right-to-bracket"></i>
                    เข้าสู่ระบบ
                  </>
                )}
              </button>

              <p className="link forgot">
                <Link to="/forgot-password">ลืมรหัสผ่าน?</Link>
              </p>

              <p className="link center">
                ยังไม่มีบัญชี?{' '}
                <Link to="/register">
                  สมัครสมาชิก
                </Link>
              </p>

              <p className="link center gray">
                เข้าสู่ระบบสำหรับ{' '}
                <Link to="/parent-login">
                  <b>ผู้ปกครอง</b>
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;