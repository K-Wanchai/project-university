import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import './User.css';

import apiService from '../../services/apiService';
import { SERVER_URL } from '../../config';

const ROLE_OPTIONS = ['ติวเตอร์', 'ผู้ดูแลระบบ', 'นักเรียน'];
const STATUS_OPTIONS = ['ใช้งานอยู่', 'ระงับการใช้งาน', 'รอตรวจสอบ'];

function User() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadUsersTable();
  }, []);

  const loadUsersTable = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await apiService.getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading users:', err);
      setErrorMessage('ไม่สามารถโหลดข้อมูลผู้ใช้งานได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งานนี้?')) return;

    try {
      const res = await apiService.deleteUser(id);
      if (res?.ok === false) throw new Error('ลบไม่สำเร็จ');

      alert('ลบผู้ใช้งานเรียบร้อยแล้ว');
      loadUsersTable();
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('เกิดข้อผิดพลาดในการลบผู้ใช้งาน');
    }
  };

  const getStatusText = (status) => status || 'รอตรวจสอบ';

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
      const searchableText = [fullName, user.username, user.email, user.phoneNumber]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesRole = !roleFilter || user.role === roleFilter;
      const matchesStatus = !statusFilter || getStatusText(user.status) === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const summary = useMemo(() => {
    const active = users.filter((user) => getStatusText(user.status) === 'ใช้งานอยู่').length;
    const suspended = users.filter((user) => getStatusText(user.status) === 'ระงับการใช้งาน').length;
    const students = users.filter((user) => user.role === 'นักเรียน').length;

    return {
      total: users.length,
      active,
      suspended,
      students
    };
  }, [users]);

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setStatusFilter('');
  };

  const renderAvatar = (user) => {
    const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'User';
    const imageUrl = user.profileImage
      ? `${SERVER_URL}/uploads/profiles/${user.profileImage}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0ea5e9&color=fff`;

    return <img src={imageUrl} alt={displayName} className="avatar-img" />;
  };

  return (
    <div className="user-page-container">
      <Sidebar />

      <main className="user-main-content">
        <Header title="ข้อมูลผู้ใช้งาน" />

        <section className="user-hero-card">
          <div>
            <p className="eyebrow">User Management</p>
            <h2>จัดการบัญชีผู้ใช้งานทั้งหมด</h2>
            <p>ค้นหา กรองบทบาท ตรวจสอบสถานะ และเพิ่มผู้ใช้งานใหม่ได้จากหน้านี้</p>
          </div>
          <Link to="/newuser" className="btn-add user-hero-action">
            <i className="fas fa-plus"></i>
            เพิ่มผู้ใช้งานใหม่
          </Link>
        </section>

        <section className="user-summary-grid" aria-label="สรุปข้อมูลผู้ใช้งาน">
          <div className="summary-card">
            <span className="summary-icon summary-total"><i className="fas fa-users"></i></span>
            <div>
              <p>ผู้ใช้ทั้งหมด</p>
              <strong>{summary.total}</strong>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-icon summary-active"><i className="fas fa-user-check"></i></span>
            <div>
              <p>ใช้งานอยู่</p>
              <strong>{summary.active}</strong>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-icon summary-student"><i className="fas fa-user-graduate"></i></span>
            <div>
              <p>นักเรียน</p>
              <strong>{summary.students}</strong>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-icon summary-suspended"><i className="fas fa-user-slash"></i></span>
            <div>
              <p>ถูกระงับ</p>
              <strong>{summary.suspended}</strong>
            </div>
          </div>
        </section>

        <section className="table-container">
          <div className="table-toolbar">
            <div>
              <h3>รายการผู้ใช้งาน</h3>
              <p>แสดง {filteredUsers.length} จาก {users.length} รายการ</p>
            </div>

            <button type="button" className="btn-refresh" onClick={loadUsersTable} disabled={isLoading}>
              <i className="fas fa-sync-alt"></i>
              รีเฟรช
            </button>
          </div>

          <div className="table-controls">
            <label className="search-box" aria-label="ค้นหาผู้ใช้งาน">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="ค้นหาชื่อ ผู้ใช้ อีเมล หรือเบอร์โทร..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>

            <select className="filter-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">บทบาททั้งหมด</option>
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">สถานะทั้งหมด</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            {(searchTerm || roleFilter || statusFilter) && (
              <button type="button" className="btn-clear" onClick={clearFilters}>
                ล้างตัวกรอง
              </button>
            )}
          </div>

          {errorMessage && (
            <div className="user-alert error-alert">
              <i className="fas fa-exclamation-circle"></i>
              {errorMessage}
            </div>
          )}

          <div className="table-scroll-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ผู้ใช้งาน</th>
                  <th>ชื่อผู้ใช้</th>
                  <th>อีเมล</th>
                  <th>เบอร์โทร</th>
                  <th>บทบาท</th>
                  <th>สถานะ</th>
                  <th className="text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      <i className="fas fa-spinner fa-spin"></i>
                      กำลังโหลดข้อมูล...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      <i className="fas fa-user-slash"></i>
                      ไม่พบข้อมูลผู้ใช้งานตามเงื่อนไขที่ค้นหา
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const statusText = getStatusText(user.status);
                    const statusClass = statusText === 'ระงับการใช้งาน'
                      ? 'status-suspended'
                      : statusText === 'รอตรวจสอบ'
                        ? 'status-pending'
                        : 'status-active';
                    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || '-';

                    return (
                      <tr key={user.id}>
                        <td>
                          <div className="user-profile-cell">
                            {renderAvatar(user)}
                            <div>
                              <strong>{fullName}</strong>
                              <span>{user.remarks || 'ไม่มีบันทึกเพิ่มเติม'}</span>
                            </div>
                          </div>
                        </td>
                        <td>{user.username || '-'}</td>
                        <td>{user.email || '-'}</td>
                        <td>{user.phoneNumber || '-'}</td>
                        <td><span className="role-pill">{user.role || '-'}</span></td>
                        <td>
                          <span className={`status-badge ${statusClass}`}>{statusText}</span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Link to={`/newuser?id=${user.id}`} className="btn-edit" title="แก้ไขข้อมูล">
                              <i className="fas fa-edit"></i>
                              แก้ไข
                            </Link>
                            <button type="button" onClick={() => deleteUser(user.id)} className="btn-delete" title="ลบผู้ใช้งาน">
                              <i className="fas fa-trash"></i>
                              ลบ
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default User;
