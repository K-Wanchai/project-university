// ข้อมูลจำลอง (Mock Data) สำหรับแสดงในตาราง
let users = [
    { id: 1, name: "นายปิติ สุขสมบูรณ์", username: "piti_s", email: "piti.s@krupuk.com", phone: "082-987-6543", role: "ครู", status: "ใช้งานอยู่" },
    { id: 2, name: "นางสาวสมหญิง ใจดี", username: "somying_j", email: "somying@krupuk.com", phone: "081-234-5678", role: "แอดมิน", status: "ใช้งานอยู่" },
    { id: 3, name: "นายสมชาย รักเรียน", username: "somchai_r", email: "somchai@krupuk.com", phone: "089-876-5432", role: "เจ้าหน้าที่", status: "ปิดใช้งาน" }
];

let currentEditId = null;

// ฟังก์ชันสำหรับเรนเดอร์ข้อมูลลงในตาราง
function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    users.forEach(user => {
        const statusClass = user.status === 'ใช้งานอยู่' ? 'status-active' : 'status-inactive';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><div style="width: 40px; height: 40px; border-radius: 50%; background: #e5e7eb; display:flex; justify-content:center; align-items:center;">${user.name.charAt(0)}</div></td>
            <td>
                <div><strong>${user.name}</strong></div>
                <div style="font-size: 12px; color: #6b7280;">${user.username}</div>
            </td>
            <td>${user.email}</td>
            <td><span class="role-badge">${user.role}</span></td>
            <td><span class="status-badge ${statusClass}">${user.status}</span></td>
            <td>
                <button class="edit-btn" onclick="openModal('edit', ${user.id})">แก้ไข</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ฟังก์ชันเปิด Modal (ใช้ร่วมกันทั้ง เพิ่ม และ แก้ไข)
function openModal(mode, id = null) {
    const modal = document.getElementById('userModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('userForm');
    
    form.reset(); // ล้างข้อมูลเก่าในฟอร์ม

    if (mode === 'add') {
        title.innerText = 'เพิ่มผู้ใช้งานใหม่';
        currentEditId = null;
    } else if (mode === 'edit') {
        title.innerText = 'แก้ไขข้อมูลผู้ใช้งาน';
        currentEditId = id;
        
        // ดึงข้อมูลเดิมมาแสดงในช่องกรอก
        const user = users.find(u => u.id === id);
        if (user) {
            document.getElementById('fullname').value = user.name;
            document.getElementById('username').value = user.username;
            document.getElementById('email').value = user.email;
            document.getElementById('phone').value = user.phone;
            document.getElementById('role').value = user.role;
            document.getElementById('status').value = user.status;
        }
    }
    
    modal.classList.add('show');
}

// ฟังก์ชันปิด Modal
function closeModal() {
    const modal = document.getElementById('userModal');
    modal.classList.remove('show');
}

// ฟังก์ชันบันทึกข้อมูล (จำลองการเซฟลง Array)
function saveData() {
    const name = document.getElementById('fullname').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const role = document.getElementById('role').value;
    const status = document.getElementById('status').value;

    if(!name || !username || !email) {
        alert("กรุณากรอกข้อมูลที่จำเป็น (*) ให้ครบถ้วน");
        return;
    }

    if (currentEditId) {
        // กรณีแก้ไข
        const index = users.findIndex(u => u.id === currentEditId);
        if(index !== -1) {
            users[index] = { ...users[index], name, username, email, phone, role, status };
        }
    } else {
        // กรณีเพิ่มใหม่
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        users.push({ id: newId, name, username, email, phone, role, status });
    }

    renderTable();
    closeModal();
}

// โหลดข้อมูลตารางเมื่อเปิดหน้าเว็บ
window.onload = renderTable;