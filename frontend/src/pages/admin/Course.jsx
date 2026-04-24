import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Course.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

// 🌟 Import จากศูนย์กลาง
import apiService from '../../services/apiService';
import { SERVER_URL } from '../../config';

function Course() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // 🌟 ใช้ apiService แทน fetch ตรงๆ
      const data = await apiService.getCourses();
      setCourses(data); 
    } catch (err) {
      console.error("Fetch error:", err);
      setError("ไม่สามารถดึงข้อมูลคอร์สเรียนได้");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบคอร์สนี้?")) {
      try {
        // 🌟 ใช้ apiService ลบข้อมูล
        await apiService.deleteCourse(id);
        setCourses(courses.filter(course => course.id !== id));
        alert("ลบคอร์สเรียนสำเร็จ");
      } catch (err) {
        console.error(err);
        alert("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    }
  };

  const getStatusClass = (statusText) => {
    if (statusText === 'เปิดรับสมัคร') return 'status-open';
    if (statusText === 'กำลังสอน') return 'status-ongoing';
    return 'status-closed'; 
  };

  const getDotClass = (statusText) => {
    if (statusText === 'เปิดรับสมัคร') return 'dot-green';
    if (statusText === 'กำลังสอน') return 'dot-yellow';
    return 'dot-gray';
  };

  const filteredCourses = courses.filter(course => {
    const matchSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === '' || course.subject === filterCategory;
    const matchStatus = filterStatus === '' || course.status === filterStatus;
    
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      
      <Sidebar />
      
      <main className="main-content" style={{ flex: 1, marginLeft: '260px', padding: '30px', overflowX: 'hidden' }}>
        
        <Header title="การจัดการคอร์สเรียน" /><br />
        <div className="info-bar" style={{ marginBottom: '20px', color: '#64748b' }}>
          ข้อมูลสถาบัน : : สาขา ขอนแก่น KKC
        </div>

        <div className="course-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, color: '#1e293b' }}></h1>
          <Link to="/add-course" className="btn-add-course" style={{ background: '#1e1e4b', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none' }}>
            <i className="fas fa-plus"></i> เพิ่มคอร์สใหม่
          </Link>
        </div>

        <div className="filter-section" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <input 
            type="text" 
            className="search-input" 
            placeholder="ค้นหาชื่อคอร์สเรียน..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', flex: 1 }} 
          />
          <select 
            className="filter-select" 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          >
            <option value="">ทุกหมวดหมู่</option>
            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
            <option value="ภาษาไทย">ภาษาไทย</option>
            <option value="ภาษาต่างประเทศ">ภาษาต่างประเทศ</option>
            <option value="ศิลปะ">ศิลปะ</option>
          </select>
          <select 
            className="filter-select" 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          >
            <option value="">ทุกสถานะ</option>
            <option value="เปิดรับสมัคร">เปิดรับสมัคร</option>
            <option value="กำลังสอน">กำลังสอน</option>
            <option value="จบแล้ว">จบแล้ว</option>
            <option value="ปิดปรับปรุง">ปิดปรับปรุง</option>
          </select>
        </div>

        <section className="course-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>รายการคอร์สเรียนทั้งหมด</h3>
          
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>กำลังโหลดข้อมูล...</div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</div>
          ) : (
            <table className="course-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px' }}>#</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>โลโก้คอร์ส</th>
                  <th style={{ padding: '12px' }}>ชื่อคอร์ส</th>
                  <th style={{ padding: '12px' }}>วิชา/หมวดหมู่</th>
                  <th style={{ padding: '12px' }}>เวลาที่สอน</th>
                  <th style={{ padding: '12px' }}>ผู้สอน/วิทยากร</th>
                  <th style={{ padding: '12px' }}>สถานะ</th>
                  <th style={{ padding: '12px' }}>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>ไม่พบข้อมูลคอร์สเรียนที่ค้นหา</td>
                  </tr>
                ) : (
                  filteredCourses.map((course, index) => (
                    <tr key={course.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px' }}>{index + 1}</td>
                      <td className="course-icon" style={{ padding: '12px', textAlign: 'center' }}>
                        {course.imageUrl && course.imageUrl.trim() !== '' ? (
                           <img 
                             src={`${SERVER_URL}/uploads/courses/${course.imageUrl}`} // 🌟 ใช้ SERVER_URL
                             alt="Course" 
                             style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} 
                           />
                        ) : (
                           <span style={{ fontSize: '24px' }}>📚</span>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}><strong>{course.courseName}</strong></td>
                      <td style={{ padding: '12px' }}>{course.subject}</td>
                      <td style={{ padding: '12px' }}>{course.learningChannel}</td>
                      <td style={{ padding: '12px' }}>{course.instructor}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`status-pill ${getStatusClass(course.status)}`}>
                          <span className={`dot ${getDotClass(course.status)}`}></span>
                          {course.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', display: 'flex', gap: '10px' }}>
                        <Link to={`/edit-course/${course.id}`} className="btn-edit-action" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>
                            <i className="fas fa-edit"></i> แก้ไข
                        </Link>
                        <button onClick={() => handleDelete(course.id)} style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                          <i className="fas fa-trash"></i> ลบ
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </section>

      </main>
    </div>
  );
}

export default Course;