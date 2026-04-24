import React, { useState, useEffect } from 'react';
import './Standard.css'; 
import { useNavigate } from 'react-router-dom'; 
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

// 🌟 Import apiService ที่เราทำเป็นศูนย์กลางไว้
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
      // 1. ดึงสถิติตัวเลขต่างๆ ด้านบน
      const usersData = await apiService.getUsersCount().catch(() => ({ totalUsers: 0 }));
      setTotalUsersCount(usersData.totalUsers.toLocaleString());

      const [coursesData, institutesData] = await Promise.all([
        apiService.getCourses().catch(() => []), 
        apiService.getInstitutes().catch(() => []) 
      ]);

      setTotalCoursesCount(coursesData.length.toLocaleString());
      setTotalInstitutesCount(institutesData.length.toLocaleString());

      // 2. ดึงข้อมูลผู้ใช้ทั้งหมดเพื่อมาทำกิจกรรม
      const users = await apiService.getAllUsers().catch(() => []);

      const activities = [];

      // 🌟 3. แปลงข้อมูลผู้ใช้งานให้อยู่ในฟอร์แมตกิจกรรม
      users.forEach(u => {
        activities.push({
          id: `user-${u.id}`,
          icon: 'fas fa-user-plus',
          color: '#3b82f6',
          text: `มีผู้ใช้งานใหม่: ${u.firstName || u.username} (${u.role || 'นักเรียน'})`,
          // ใช้เวลา createdAt มาเทียบ ถ้าไม่มีให้ใช้ id ชั่วคราว
          sortValue: u.createdAt ? new Date(u.createdAt).getTime() : u.id, 
          time: 'ล่าสุด'
        });
      });

      // 🌟 4. แปลงข้อมูลคอร์สเรียนให้อยู่ในฟอร์แมตกิจกรรม
      coursesData.forEach(c => {
        activities.push({
          id: `course-${c.id}`,
          icon: 'fas fa-book-medical',
          color: '#10b981',
          text: `เปิดคอร์สใหม่: ${c.courseName}`,
          // ใช้เวลา createdAt มาเทียบ ถ้าไม่มีให้ใช้ id ชั่วคราว
          sortValue: c.createdAt ? new Date(c.createdAt).getTime() : c.id,
          time: 'ล่าสุด'
        });
      });

      // 🌟 5. จับมารวมกัน แล้วเรียงลำดับจาก "ค่ามากที่สุดไปน้อยที่สุด" (ล่าสุดขึ้นบน)
      activities.sort((a, b) => b.sortValue - a.sortValue);

      // 6. ตัดเอามาโชว์แค่ 5 รายการแรกที่ใหม่ที่สุด
      setRecentActivities(activities.slice(0, 5));

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, 10000); // Polling ทุก 10 วินาที
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar />
      <main className="main-content" style={{ flex: 1, marginLeft: '260px' }}>
        
        <Header title="หน้าหลัก Dashboard" />

        <div style={{ padding: '30px' }}>
          <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
            
            <section style={{ flex: 7 }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                สรุปการจัดการ 
                <small style={{ color: '#10b981', fontSize: '12px', fontWeight: 'normal' }}>
                  • ข้อมูลอัปเดตแบบเรียลไทม์
                </small>
              </h3>
              
              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div className="stat-card" onClick={() => navigate('/user')} style={{ cursor: 'pointer', background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                  <i className="fas fa-users-cog icon" style={{ fontSize: '30px', color: '#3b82f6', marginBottom: '15px', display: 'block' }}></i>
                  <div className="stat-info">
                    <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>ผู้ใช้งานทั้งหมด</p>
                    <span className="number" style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b' }}>{totalUsersCount}</span>
                  </div>
                </div>

                <div className="stat-card" onClick={() => navigate('/course')} style={{ cursor: 'pointer', background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                  <i className="fas fa-book-open icon" style={{ fontSize: '30px', color: '#10b981', marginBottom: '15px', display: 'block' }}></i>
                  <div className="stat-info">
                    <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>คอร์สเรียนทั้งหมด</p>
                    <span className="number" style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b' }}>{totalCoursesCount}</span>
                  </div>
                </div>
                
                <div className="stat-card" onClick={() => navigate('/institute')} style={{ cursor: 'pointer', background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                  <i className="fas fa-star icon" style={{ fontSize: '30px', color: '#f59e0b', marginBottom: '15px', display: 'block' }}></i>
                  <div className="stat-info">
                    <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>สถาบันสอบทั้งหมด</p>
                    <span className="number" style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b' }}>{totalInstitutesCount}</span>
                  </div>
                </div>
              </div>
            </section>

            <aside style={{ flex: 3, background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <h4 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-bell" style={{ color: '#f43f5e' }}></i> กิจกรรมล่าสุด
              </h4>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {isLoadingActivities ? (
                  <li style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>กำลังโหลดกิจกรรม...</li>
                ) : recentActivities.length === 0 ? (
                  <li style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>ยังไม่มีกิจกรรมล่าสุด</li>
                ) : (
                  recentActivities.map((activity) => (
                    <li key={activity.id} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
                      <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: `${activity.color}20`, color: activity.color, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                        <i className={activity.icon}></i>
                      </div>
                      <div>
                        <span style={{ display: 'block', color: '#334155', fontSize: '14px', lineHeight: '1.5' }}>{activity.text}</span>
                        <small style={{ color: '#94a3b8', fontSize: '12px' }}>{activity.time}</small>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Standard;