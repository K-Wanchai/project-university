import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* เดี๋ยวเราจะมาเพิ่มหน้าต่างๆ ของ 14 Process ตรงนี้ครับ */}
        <Route path="/" element={<h1>ระบบจัดการโรงเรียนกวดวิชา</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;