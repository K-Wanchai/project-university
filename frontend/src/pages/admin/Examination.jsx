import React, { useMemo, useState } from 'react';
import './Examination.css';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../Layout/AdminLayout';

const institutions = [
  {
    id: 'INST0001',
    name: 'โรงเรียนสวนกุหลาบวิทยาลัย',
    type: 'โรงเรียนมัธยมศึกษา',
    province: 'กรุงเทพมหานคร',
    examType: 'TCAS',
    lastUpdated: '22 พ.ค. 2567 10:30 น.',
  },
  {
    id: 'INST0002',
    name: 'โรงเรียนมหิดลวิทยานุสรณ์',
    type: 'โรงเรียนวิทยาศาสตร์',
    province: 'นครปฐม',
    examType: 'Portfolio',
    lastUpdated: '21 พ.ค. 2567 15:45 น.',
  },
  {
    id: 'INST0003',
    name: 'วิทยาลัยอาชีวศึกษาธนบุรี',
    type: 'อาชีวศึกษา',
    province: 'กรุงเทพมหานคร',
    examType: 'โควตา',
    lastUpdated: '20 พ.ค. 2567 09:15 น.',
  },
  {
    id: 'INST0004',
    name: 'โรงเรียนเชียงใหม่วิทยาคม',
    type: 'โรงเรียนมัธยมศึกษา',
    province: 'เชียงใหม่',
    examType: 'TCAS',
    lastUpdated: '19 พ.ค. 2567 11:20 น.',
  },
  {
    id: 'INST0005',
    name: 'โรงเรียนหาดใหญ่วิทยาลัย',
    type: 'โรงเรียนมัธยมศึกษา',
    province: 'สงขลา',
    examType: 'Admission',
    lastUpdated: '18 พ.ค. 2567 14:05 น.',
  },
  {
    id: 'INST0006',
    name: 'วิทยาลัยเทคนิคชลบุรี',
    type: 'อาชีวศึกษา',
    province: 'ชลบุรี',
    examType: 'โควตา',
    lastUpdated: '17 พ.ค. 2567 16:40 น.',
  },
  {
    id: 'INST0007',
    name: 'โรงเรียนอุดรพิทยานุกูล',
    type: 'โรงเรียนมัธยมศึกษา',
    province: 'อุดรธานี',
    examType: 'TCAS',
    lastUpdated: '16 พ.ค. 2567 10:10 น.',
  },
  {
    id: 'INST0008',
    name: 'โรงเรียนเบญจมราชูทิศ',
    type: 'โรงเรียนมัธยมศึกษา',
    province: 'นนทบุรี',
    examType: 'Portfolio',
    lastUpdated: '15 พ.ค. 2567 13:25 น.',
  },
];

const statCards = [
  { label: 'สถาบันทั้งหมด', value: '1,248', icon: '🏫', tone: 'blue' },
  { label: 'ผู้สมัครศึกษาต่อ', value: '156,789', icon: '👥', tone: 'purple' },
];

const activities = [
  {
    title: 'เพิ่มสถาบันใหม่',
    desc: 'โรงเรียนราชวินิตบางแก้ว',
    time: '22 พ.ค. 2567 11:20 น.',
    icon: '🏫',
    tone: 'green',
  },
  {
    title: 'แก้ไขข้อมูลสถาบัน',
    desc: 'โรงเรียนสวนกุหลาบวิทยาลัย',
    time: '22 พ.ค. 2567 10:30 น.',
    icon: '✏️',
    tone: 'blue',
  },
  {
    title: 'รอการตรวจสอบ',
    desc: 'โรงเรียนหาดใหญ่วิทยาลัย',
    time: '18 พ.ค. 2567 14:05 น.',
    icon: '⏱️',
    tone: 'orange',
  },
  {
    title: 'อนุมัติสถาบัน',
    desc: 'วิทยาลัยเทคนิคระยอง',
    time: '17 พ.ค. 2567 09:15 น.',
    icon: '✅',
    tone: 'green',
  },
];

const SelectField = ({ label, value, options, onChange }) => (
  <label className="filter-field">
    <span>{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

export default function AdminInstitutionDashboard() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    academicYear: '2567',
    province: 'ทั้งหมด',
    type: 'ทั้งหมด',
    examType: 'ทั้งหมด',
    keyword: '',
  });

  const filteredInstitutions = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();

    return institutions.filter((item) => {
      const matchesKeyword =
        !keyword ||
        item.id.toLowerCase().includes(keyword) ||
        item.name.toLowerCase().includes(keyword);

      const matchesProvince =
        filters.province === 'ทั้งหมด' || item.province === filters.province;

      const matchesType =
        filters.type === 'ทั้งหมด' || item.type === filters.type;

      const matchesExamType =
        filters.examType === 'ทั้งหมด' || item.examType === filters.examType;

      return matchesKeyword && matchesProvince && matchesType && matchesExamType;
    });
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      academicYear: '2567',
      province: 'ทั้งหมด',
      type: 'ทั้งหมด',
      examType: 'ทั้งหมด',
      keyword: '',
    });
  };

  return (
    <AdminLayout>
      <section className="content-grid">
        <div className="primary-column">
          <div className="page-heading">
            <div>
              <h1>แดชบอร์ดจัดการข้อมูลสถาบันที่จัดสอบ</h1>
              <p>ระบบเตรียมพร้อมสำหรับการรองรับข้อมูลจากฐานข้อมูลในอนาคต</p>
            </div>

            <div className="heading-actions">
              <button
                type="button"
                className="primary-button"
                onClick={() => navigate('/add-examination')}
              >
                + เพิ่มสถาบัน
              </button>
            </div>
          </div>

          <div className="stats-grid">
            {statCards.map((card) => (
              <article className="stat-card" key={card.label}>
                <div className={`stat-icon ${card.tone}`}>{card.icon}</div>
                <div className="stat-content">
                  <p>{card.label}</p>
                  <h2>{card.value}</h2>
                  <a href="#details">ดูรายละเอียด ›</a>
                </div>
              </article>
            ))}
          </div>

          <section className="filter-panel" aria-label="ตัวกรองข้อมูลสถาบัน">
            <div className="filter-grid">
              <SelectField
                label="ปีการศึกษา"
                value={filters.academicYear}
                options={['2567', '2566', '2565']}
                onChange={(value) => updateFilter('academicYear', value)}
              />

              <SelectField
                label="จังหวัด"
                value={filters.province}
                options={[
                  'ทั้งหมด',
                  'กรุงเทพมหานคร',
                  'เชียงใหม่',
                  'นครปฐม',
                  'สงขลา',
                  'ชลบุรี',
                  'อุดรธานี',
                  'นนทบุรี',
                ]}
                onChange={(value) => updateFilter('province', value)}
              />

              <SelectField
                label="ประเภทสถาบัน"
                value={filters.type}
                options={[
                  'ทั้งหมด',
                  'โรงเรียนมัธยมศึกษา',
                  'โรงเรียนวิทยาศาสตร์',
                  'อาชีวศึกษา',
                ]}
                onChange={(value) => updateFilter('type', value)}
              />

              <SelectField
                label="รูปแบบการสอบ"
                value={filters.examType}
                options={['ทั้งหมด', 'TCAS', 'Portfolio', 'Admission', 'โควตา']}
                onChange={(value) => updateFilter('examType', value)}
              />
            </div>

            <div className="search-row">
              <div className="search-input">
                <span>⌕</span>
                <input
                  value={filters.keyword}
                  onChange={(event) => updateFilter('keyword', event.target.value)}
                  placeholder="ค้นหาชื่อสถาบัน / รหัสสถาบัน"
                />
              </div>

              <button type="button" className="primary-button">
                ค้นหา
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={resetFilters}
              >
                รีเซ็ต
              </button>
            </div>
          </section>

          <section className="table-card">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>รหัสสถาบัน</th>
                    <th>ชื่อสถาบัน</th>
                    <th>ประเภท</th>
                    <th>จังหวัด</th>
                    <th>รูปแบบการสอบ</th>
                    <th>อัปเดตล่าสุด</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredInstitutions.map((institution) => (
                    <tr key={institution.id}>
                      <td className="mono">{institution.id}</td>
                      <td className="name-cell">{institution.name}</td>
                      <td>{institution.type}</td>
                      <td>{institution.province}</td>
                      <td>{institution.examType}</td>
                      <td>{institution.lastUpdated}</td>
                      <td>
                        <div className="table-actions">
                          <button type="button" title="ดูข้อมูล">
                            👁
                          </button>
                          <button type="button" title="แก้ไข">
                            ✎
                          </button>
                          <button type="button" title="ลบ" className="danger">
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <span>
                แสดง {filteredInstitutions.length ? 1 : 0} ถึง{' '}
                {filteredInstitutions.length} จาก 1,248 รายการ
              </span>

              <div className="pagination">
                <select aria-label="จำนวนรายการต่อหน้า">
                  <option>10 / หน้า</option>
                  <option>25 / หน้า</option>
                  <option>50 / หน้า</option>
                </select>

                <button type="button">‹</button>
                <button type="button" className="current">
                  1
                </button>
                <button type="button">2</button>
                <button type="button">3</button>
                <button type="button">›</button>
              </div>
            </div>
          </section>
        </div>

        <aside className="insight-column">
          <section className="chart-card">
            <h3>สถิติจำแนกตามประเภทสถาบัน</h3>

            <div
              className="donut-chart"
              aria-label="แผนภูมิวงกลมจำแนกตามประเภทสถาบัน"
            >
              <div className="donut-center">
                <span>รวมทั้งสิ้น</span>
                <strong>1,248</strong>
                <span>สถาบัน</span>
              </div>
            </div>

            <ul className="legend-list">
              <li>
                <span className="dot blue" />
                โรงเรียนมัธยมศึกษา <strong>856</strong>
              </li>
              <li>
                <span className="dot green" />
                อาชีวศึกษา <strong>248</strong>
              </li>
              <li>
                <span className="dot orange" />
                โรงเรียนวิทยาศาสตร์ <strong>72</strong>
              </li>
              <li>
                <span className="dot purple" />
                อื่น ๆ <strong>72</strong>
              </li>
            </ul>
          </section>

          <section className="activity-card">
            <div className="card-title-row">
              <h3>การอัปเดตล่าสุด</h3>
              <a href="#all">ดูทั้งหมด</a>
            </div>

            <div className="activity-list">
              {activities.map((activity) => (
                <article
                  className="activity-item"
                  key={`${activity.title}-${activity.time}`}
                >
                  <div className={`activity-icon ${activity.tone}`}>
                    {activity.icon}
                  </div>

                  <div>
                    <strong>{activity.title}</strong>
                    <p>{activity.desc}</p>
                    <span>{activity.time}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </AdminLayout>
  );
}