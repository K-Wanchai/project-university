import React, { useEffect, useMemo, useState } from 'react';
import './Examination.css';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../Layout/AdminLayout';
import apiService from '../../services/apiService';

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

const formatThaiDate = (dateValue) => {
  if (!dateValue) return '-';

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const normalizeInstitution = (item) => ({
  id: item.code || item.id || item._id || '-',
  databaseId: item._id || item.id,
  name: item.nameTh || item.name || '-',
  type: item.type || '-',
  province: item.province || '-',
  examType: item.examType || '-',
  lastUpdated: formatThaiDate(item.updatedAt || item.createdAt || item.regDate),
});

export default function AdminInstitutionDashboard() {
  const navigate = useNavigate();

  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [filters, setFilters] = useState({
    academicYear: 'ทั้งหมด',
    province: 'ทั้งหมด',
    type: 'ทั้งหมด',
    examType: 'ทั้งหมด',
    keyword: '',
  });

const fetchInstitutions = async () => {
  try {
    setLoading(true);
    setErrorMessage('');

    const data = await apiService.getExaminations();

    const list = Array.isArray(data)
      ? data
      : data.data || data.examinations || data.items || [];

    setInstitutions(list.map(normalizeInstitution));
  } catch (error) {
    console.error(error);
    setErrorMessage('เกิดข้อผิดพลาดในการโหลดข้อมูลจากฐานข้อมูล');
    setInstitutions([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const provinceOptions = useMemo(() => {
    const provinces = institutions
      .map((item) => item.province)
      .filter((province) => province && province !== '-');

    return ['ทั้งหมด', ...new Set(provinces)];
  }, [institutions]);

  const typeOptions = useMemo(() => {
    const types = institutions
      .map((item) => item.type)
      .filter((type) => type && type !== '-');

    return ['ทั้งหมด', ...new Set(types)];
  }, [institutions]);

  const examTypeOptions = useMemo(() => {
    const examTypes = institutions
      .map((item) => item.examType)
      .filter((examType) => examType && examType !== '-');

    return ['ทั้งหมด', ...new Set(examTypes)];
  }, [institutions]);

  const filteredInstitutions = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();

    return institutions.filter((item) => {
      const matchesKeyword =
        !keyword ||
        String(item.id).toLowerCase().includes(keyword) ||
        String(item.name).toLowerCase().includes(keyword);

      const matchesProvince =
        filters.province === 'ทั้งหมด' || item.province === filters.province;

      const matchesType =
        filters.type === 'ทั้งหมด' || item.type === filters.type;

      const matchesExamType =
        filters.examType === 'ทั้งหมด' || item.examType === filters.examType;

      return matchesKeyword && matchesProvince && matchesType && matchesExamType;
    });
  }, [filters, institutions]);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      academicYear: 'ทั้งหมด',
      province: 'ทั้งหมด',
      type: 'ทั้งหมด',
      examType: 'ทั้งหมด',
      keyword: '',
    });
  };

  const totalInstitution = institutions.length;

  return (
    <AdminLayout>
      <section className="content-grid">
        <div className="primary-column">
          <div className="page-heading">
            <div>
              <h1>แดชบอร์ดจัดการข้อมูลสถาบันที่จัดสอบ</h1>
              <p>แสดงข้อมูลสถาบันที่จัดสอบจากฐานข้อมูลจริง</p>
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
            <article className="stat-card">
              <div className="stat-icon blue">🏫</div>
              <div className="stat-content">
                <p>สถาบันทั้งหมด</p>
                <h2>{totalInstitution.toLocaleString('th-TH')}</h2>
                <a href="#details">ดูรายละเอียด ›</a>
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-icon purple">👥</div>
              <div className="stat-content">
                <p>รายการที่แสดงผล</p>
                <h2>{filteredInstitutions.length.toLocaleString('th-TH')}</h2>
                <a href="#details">ดูรายละเอียด ›</a>
              </div>
            </article>
          </div>

          <section className="filter-panel" aria-label="ตัวกรองข้อมูลสถาบัน">
            <div className="filter-grid">
              <SelectField
                label="ปีการศึกษา"
                value={filters.academicYear}
                options={['ทั้งหมด', '2567', '2566', '2565']}
                onChange={(value) => updateFilter('academicYear', value)}
              />

              <SelectField
                label="จังหวัด"
                value={filters.province}
                options={provinceOptions}
                onChange={(value) => updateFilter('province', value)}
              />

              <SelectField
                label="ประเภทสถาบัน"
                value={filters.type}
                options={typeOptions}
                onChange={(value) => updateFilter('type', value)}
              />

              <SelectField
                label="รูปแบบการสอบ"
                value={filters.examType}
                options={examTypeOptions}
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

              <button type="button" className="primary-button" onClick={fetchInstitutions}>
                โหลดใหม่
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

          <section className="table-card" id="details">
            {loading ? (
              <div style={{ padding: '24px', textAlign: 'center' }}>
                กำลังโหลดข้อมูล...
              </div>
            ) : errorMessage ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#dc2626' }}>
                {errorMessage}
              </div>
            ) : (
              <>
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
                      {filteredInstitutions.length > 0 ? (
                        filteredInstitutions.map((institution) => (
                          <tr key={institution.databaseId || institution.id}>
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
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>
                            ไม่พบข้อมูลสถาบัน
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="table-footer">
                  <span>
                    แสดง {filteredInstitutions.length ? 1 : 0} ถึง{' '}
                    {filteredInstitutions.length} จาก {institutions.length} รายการ
                  </span>
                </div>
              </>
            )}
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
                <strong>{totalInstitution.toLocaleString('th-TH')}</strong>
                <span>สถาบัน</span>
              </div>
            </div>

            <ul className="legend-list">
              {typeOptions
                .filter((type) => type !== 'ทั้งหมด')
                .map((type, index) => {
                  const count = institutions.filter((item) => item.type === type).length;
                  const tones = ['blue', 'green', 'orange', 'purple'];

                  return (
                    <li key={type}>
                      <span className={`dot ${tones[index % tones.length]}`} />
                      {type} <strong>{count.toLocaleString('th-TH')}</strong>
                    </li>
                  );
                })}
            </ul>
          </section>

          <section className="activity-card">
            <div className="card-title-row">
              <h3>การอัปเดตล่าสุด</h3>
              <a href="#all">ดูทั้งหมด</a>
            </div>

            <div className="activity-list">
              {institutions.slice(0, 4).map((institution) => (
                <article
                  className="activity-item"
                  key={`activity-${institution.databaseId || institution.id}`}
                >
                  <div className="activity-icon green">🏫</div>

                  <div>
                    <strong>ข้อมูลสถาบัน</strong>
                    <p>{institution.name}</p>
                    <span>{institution.lastUpdated}</span>
                  </div>
                </article>
              ))}

              {!loading && institutions.length === 0 && (
                <p style={{ padding: '12px' }}>ยังไม่มีข้อมูลล่าสุด</p>
              )}
            </div>
          </section>
        </aside>
      </section>
    </AdminLayout>
  );
}