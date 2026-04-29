import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Course.css';
import AdminLayout from '../../Layout/AdminLayout';

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
      const data = await apiService.getCourses();
      setCourses(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('ไม่สามารถดึงข้อมูลคอร์สเรียนได้');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบคอร์สนี้?')) {
      try {
        await apiService.deleteCourse(id);
        setCourses(courses.filter((course) => course.id !== id));
        alert('ลบคอร์สเรียนสำเร็จ');
      } catch (err) {
        console.error(err);
        alert('เกิดข้อผิดพลาดในการลบข้อมูล');
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

  const filteredCourses = courses.filter((course) => {
    const courseName = course.courseName || '';
    const matchSearch = courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === '' || course.subject === filterCategory;
    const matchStatus = filterStatus === '' || course.status === filterStatus;

    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="course-content">
        <div className="info-bar">ข้อมูลสถาบัน : สาขา ขอนแก่น KKC</div>

        <div className="course-header-row">
          <div>
            <h1>รายการคอร์สเรียน</h1>
            <p>จัดการข้อมูลคอร์สเรียนทั้งหมดในระบบ</p>
          </div>

          <Link to="/add-course" className="btn-add-course">
            <i className="fas fa-plus" />
            <span>เพิ่มคอร์สใหม่</span>
          </Link>
        </div>

        <div className="filter-section">
          <input
            type="text"
            className="search-input"
            placeholder="ค้นหาชื่อคอร์สเรียน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
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
          >
            <option value="">ทุกสถานะ</option>
            <option value="เปิดรับสมัคร">เปิดรับสมัคร</option>
            <option value="กำลังสอน">กำลังสอน</option>
            <option value="จบแล้ว">จบแล้ว</option>
            <option value="ปิดปรับปรุง">ปิดปรับปรุง</option>
          </select>
        </div>

        <section className="course-card">
          <h3>รายการคอร์สเรียนทั้งหมด</h3>

          {isLoading ? (
            <div className="state-message">กำลังโหลดข้อมูล...</div>
          ) : error ? (
            <div className="state-message error">{error}</div>
          ) : (
            <div className="table-responsive">
              <table className="course-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>โลโก้คอร์ส</th>
                    <th>ชื่อคอร์ส</th>
                    <th>วิชา/หมวดหมู่</th>
                    <th>เวลาที่สอน</th>
                    <th>ผู้สอน/วิทยากร</th>
                    <th>สถานะ</th>
                    <th>การจัดการ</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCourses.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="empty-cell">
                        ไม่พบข้อมูลคอร์สเรียนที่ค้นหา
                      </td>
                    </tr>
                  ) : (
                    filteredCourses.map((course, index) => (
                      <tr key={course.id}>
                        <td>{index + 1}</td>

                        <td className="course-icon">
                          {course.imageUrl && course.imageUrl.trim() !== '' ? (
                            <img
                              src={`${SERVER_URL}/uploads/courses/${course.imageUrl}`}
                              alt={course.courseName || 'Course'}
                            />
                          ) : (
                            <span>📚</span>
                          )}
                        </td>

                        <td>
                          <strong>{course.courseName}</strong>
                        </td>

                        <td>{course.subject}</td>
                        <td>{course.learningChannel}</td>
                        <td>{course.instructor}</td>

                        <td>
                          <span className={`status-pill ${getStatusClass(course.status)}`}>
                            <span className={`dot ${getDotClass(course.status)}`} />
                            {course.status}
                          </span>
                        </td>

                        <td>
                          <div className="action-group">
                            <Link to={`/edit-course/${course.id}`} className="btn-edit-action">
                              <i className="fas fa-edit" />
                              แก้ไข
                            </Link>

                            <button
                              type="button"
                              className="btn-delete-action"
                              onClick={() => handleDelete(course.id)}
                            >
                              <i className="fas fa-trash" />
                              ลบ
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}

export default Course;