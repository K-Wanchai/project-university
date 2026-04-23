import { BrowserRouter, Routes, Route } from 'react-router-dom';
import User from "./pages/admin/User.jsx";
import Standard from "./pages/admin/Standard.jsx"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Standard />} />
        <Route path="/user" element={<User />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;