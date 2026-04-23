import React, { useState, useEffect } from 'react';
import './Standard.css'; 
import { Link, useNavigate } from 'react-router-dom'; 
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

function Standard() {
  const navigate = useNavigate();
  
  const [totalUsersCount, setTotalUsersCount] = useState('กำลังโหลด...');
  const [totalCoursesCount, setTotalCoursesCount] = useState('กำลังโหลด...');
  const [totalInstitutesCount, setTotalInstitutesCount] = useState('กำลังโหลด...');
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  // 🌟 ฟังก์ชันสำหรับดึงข้อมูลทั้งหมดจากฐานข้อมูล (รวมไว้ที่เดียวเพื่อให้เรียกซ้ำได้) 🌟
  const fetchDashboardData = async () => {
    try {
      // 1. ดึงจำนวนผู้ใช้งาน
      const usersRes = await fetch("http://localhost:8080/api/admin/users/count");
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setTotalUsersCount(usersData.totalUsers.toLocaleString());
      }

      // 2. ดึงจำนวนคอร์สเรียน และ สถาบันสอบ
      const [coursesRes, institutesRes] = await Promise.all([
        fetch("http://localhost:8080/api/admin/courses"),
        fetch("http://localhost:8080/api/admin/institutes").catch(() => null) // ดัก Error ไว้เผื่อ API สถาบันยังไม่เสร็จ
      ]);

      let courses = [];
      if (coursesRes.ok) {
        courses = await coursesRes.json();
        setTotalCoursesCount(courses.length.toLocaleString());
      }

      if (institutesRes && institutesRes.ok) {
        const institutes = await institutesRes.json();
        setTotalInstitutesCount(institutes.length.toLocaleString());
      } else {
        setTotalInstitutesCount('0');
      }

      // 3. ดึงกิจกรรมล่าสุด (Users ล่าสุด และ Courses ล่าสุด)
      const usersListRes = await fetch("http://localhost:8080/api/admin/users");
      let users = [];
      if (usersListRes.ok) {
        users = await usersListRes.json();
      }

      // จัดเรียงหาข้อมูลที่เพิ่งสร้างใหม่ล่าสุด (สมมติว่า ID มากสุดคือใหม่สุด)
      const latestUsers = users.sort((a, b) => b.id - a.id).slice(0, 3);
      const latestCourses = courses.sort((a, b) => b.id - a.id).slice(0, 3);

      const activities = [];

      // แปลงข้อมูลเป็นรูปแบบ Timeline
      latestUsers.forEach(u => {
        activities.push({
          id: `user-${u.id}`,
          icon: 'fas fa-user-plus',
          color: '#3b82f6',
          text: `มีผู้ใช้งานใหม่: ${u.firstName || u.username} (${u.role || 'นักเรียน'})`,
          time: 'ล่าสุด',
          sortId: u.id
        });
      });

      latestCourses.forEach(c => {
        activities.push({
          id: `course-${c.id}`,
          icon: 'fas fa-book-medical',
          color: '#10b981',
          text: `เปิดคอร์สใหม่: ${c.courseName}`,
          time: 'ล่าสุด',
          sortId: c.id
        });
      });

      // สลับข้อมูลรวมกัน และตัดเอาแค่ 5 รายการ
      setRecentActivities(activities.sort((a, b) => b.sortId - a.sortId).slice(0, 5));

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoadingActivities(false);
    }
  };

  useEffect(() => {
    // 🌟 ดึงข้อมูลครั้งแรกทันทีที่เปิดหน้าเว็บ
    fetchDashboardData();

    // 🌟 ตั้งเวลา (Interval) ให้แอบไปดึงข้อมูลใหม่ทุกๆ 10 วินาที (10,000 มิลลิวินาที)
    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 10000);

    // 🌟 ยกเลิกการตั้งเวลาเมื่อเรากดเปลี่ยนไปหน้าอื่น (ป้องกันแอปกินแรม)
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      
      <Sidebar />

      <main className="main-content" style={{ flex: 1, marginLeft: '260px', padding: '30px' }}>
       <Header title="หน้าหลัก Dashboard" />
        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
          
          <section style={{ flex: 7 }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b' }}>สรุปการจัดการ <small style={{ color: '#10b981', fontSize: '26px', fontWeight: 'normal' }}></small></h3>
            
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              
              <div className="stat-card" onClick={() => navigate('/user')} style={{ cursor: 'pointer', background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', transition: 'transform 0.2s' }} title="ไปหน้าผู้ใช้งาน">
                <i className="fas fa-users-cog icon" style={{ fontSize: '30px', color: '#3b82f6', marginBottom: '15px', display: 'block' }}></i>
                <div className="stat-info">
                  <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>ผู้ใช้งานทั้งหมด</p>
                  <span className="number" style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b' }}>{totalUsersCount}</span>
                </div>
              </div>

              <div className="stat-card" onClick={() => navigate('/course')} style={{ cursor: 'pointer', background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', transition: 'transform 0.2s' }} title="ไปหน้าคอร์สเรียน">
                <i className="fas fa-book-open icon" style={{ fontSize: '30px', color: '#10b981', marginBottom: '15px', display: 'block' }}></i>
                <div className="stat-info">
                  <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>คอร์สเรียนทั้งหมด</p>
                  <span className="number" style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b' }}>{totalCoursesCount}</span>
                </div>
              </div>
              
              <div className="stat-card" onClick={() => navigate('/institute')} style={{ cursor: 'pointer', background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', transition: 'transform 0.2s' }} title="ไปหน้าสถาบันสอบ">
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
      </main>
    </div>
  );
}

export default Standard;