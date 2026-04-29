import React, { useState, useEffect } from 'react';
import './Standard.css';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../Layout/AdminLayout';

// ❌ ลบออกแล้ว
// import Sidebar from '../../components/Sidebar';
// import Header from '../../components/Header';

import apiService from '../../services/apiService';

function Standard() {
  const navigate = useNavigate();

  const [totalUsersCount, setTotalUsersCount] = useState('กำลังโหลด...');
  const [totalCoursesCount, setTotalCoursesCount] = useState('กำลังโหลด...');
  const [totalInstitutesCount, setTotalInstitutesCount] = useState('กำลังโหลด...');

  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const usersData = await apiService.getUsersCount().catch(() => ({ totalUsers: 0 }));
      setTotalUsersCount((usersData.totalUsers || 0).toLocaleString());

      const [coursesData, institutesData] = await Promise.all([
        apiService.getCourses().catch(() => []),
        apiService.getExaminations().catch(() => [])
      ]);

      setTotalCoursesCount(coursesData.length.toLocaleString());
      setTotalInstitutesCount(institutesData.length.toLocaleString());

      const users = await apiService.getAllUsers().catch(() => []);

      const activities = [];

      users.forEach(u => {
        activities.push({
          id: `user-${u.id}`,
          icon: 'fas fa-user-plus',
          color: '#3b82f6',
          text: `มีผู้ใช้งานใหม่: ${u.firstName || u.username} (${u.role || 'นักเรียน'})`,
          sortValue: u.createdAt ? new Date(u.createdAt).getTime() : u.id,
          time: 'ล่าสุด'
        });
      });

      coursesData.forEach(c => {
        activities.push({
          id: `course-${c.id}`,
          icon: 'fas fa-book-medical',
          color: '#10b981',
          text: `เปิดคอร์สใหม่: ${c.courseName}`,
          sortValue: c.createdAt ? new Date(c.createdAt).getTime() : c.id,
          time: 'ล่าสุด'
        });
      });

      activities.sort((a, b) => b.sortValue - a.sortValue);

      setRecentActivities(activities.slice(0, 5));

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <AdminLayout>
      <div style={{ padding: '30px' }}>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>

          {/* LEFT */}
          <section style={{ flex: 7 }}>
            <h3 style={{
              marginTop: 0,
              marginBottom: '20px',
              color: '#1e293b',
              display: 'flex',
              alignItems: 'baseline',
              gap: '10px'
            }}>
              สรุปการจัดการ
              <small style={{ color: '#10b981', fontSize: '12px' }}>
                • ข้อมูลอัปเดตแบบเรียลไทม์
              </small>
            </h3>

            <div className="stats-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>

              <div className="stat-card" onClick={() => navigate('/user')}>
                <i className="fas fa-users-cog icon"></i>
                <p>ผู้ใช้งานทั้งหมด</p>
                <strong>{totalUsersCount}</strong>
              </div>

              <div className="stat-card" onClick={() => navigate('/course')}>
                <i className="fas fa-book-open icon"></i>
                <p>คอร์สเรียนทั้งหมด</p>
                <strong>{totalCoursesCount}</strong>
              </div>

              <div className="stat-card" onClick={() => navigate('/institute')}>
                <i className="fas fa-star icon"></i>
                <p>สถาบันสอบทั้งหมด</p>
                <strong>{totalInstitutesCount}</strong>
              </div>

            </div>
          </section>

          {/* RIGHT */}
          <aside style={{
            flex: 3,
            background: 'white',
            padding: '25px',
            borderRadius: '12px'
          }}>
            <h4>
              <i className="fas fa-bell"></i> กิจกรรมล่าสุด
            </h4>

            <ul style={{ listStyle: 'none', padding: 0 }}>
              {isLoadingActivities ? (
                <li>กำลังโหลด...</li>
              ) : recentActivities.length === 0 ? (
                <li>ยังไม่มีกิจกรรม</li>
              ) : (
                recentActivities.map((a) => (
                  <li key={a.id}>
                    <i className={a.icon}></i> {a.text}
                  </li>
                ))
              )}
            </ul>
          </aside>

        </div>
      </div>
    </AdminLayout>
  );
}

export default Standard;