// อ้างอิง IP และ Endpoint จาก standard.js
const API_BASE_URL = "http://172.24.177.13:8080/api/admin/users";

let users = [];
let currentEditId = null;

// ดึงข้อมูลเมื่อโหลดหน้า
document.addEventListener("DOMContentLoaded", () => {
    loadUsersTable();
});

function loadUsersTable() {
    fetch(API_BASE_URL)
        .then(res => res.json())
        .then(data => {
            users = data;
            renderTable(users);
        })
        .catch(err => console.error("Error:", err));
}

function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    data.forEach(user => {
        const tr = document.createElement('tr');
        const statusClass = user.status === 'ปกติ' ? 'status-active' : 'status-inactive';
        
        tr.innerHTML = `
            <td><img src="https://ui-avatars.com/api/?name=${user.firstName}&background=random" class="avatar-img"></td>
            <td>${user.firstName} ${user.lastName || ''}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><span class="status-badge ${statusClass}">${user.status || 'ปกติ'}</span></td>
            <td>10 ม.ค. 2567</td>
            <td>
                <button onclick="openModal('edit', ${user.id})"><i class="fas fa-edit"></i> แก้ไข</button>
                <button onclick="deleteUser(${user.id})" style="color:red"><i class="fas fa-trash"></i> ลบ</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ฟังก์ชันเปิด Modal (Copy logic มาจาก standard.js เพื่อความต่อเนื่อง)
function openModal(mode, id = null) {
    const modal = document.getElementById('userModal');
    if (mode === 'add') {
        document.getElementById('userForm').reset();
        currentEditId = null;
    } else {
        currentEditId = id;
        const user = users.find(u => u.id === id);
        if(user) {
            document.getElementById('fullname').value = `${user.firstName} ${user.lastName}`;
            document.getElementById('username').value = user.username;
            document.getElementById('email').value = user.email;
            document.getElementById('role').value = user.role;
        }
    }
    modal.classList.add('show');
}

function closeModal() {
    document.getElementById('userModal').classList.remove('show');
}

// ฟังก์ชันบันทึกข้อมูล (POST/PUT)
function saveData() {
    const fullName = document.getElementById('fullname').value.split(' ');
    const userData = {
        firstName: fullName[0],
        lastName: fullName[1] || '',
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        role: document.getElementById('role').value,
        status: document.getElementById('status').value
    };

    const method = currentEditId ? 'PUT' : 'POST';
    const url = currentEditId ? `${API_BASE_URL}/${currentEditId}` : API_BASE_URL;

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    }).then(() => {
        alert("บันทึกสำเร็จ");
        closeModal();
        loadUsersTable();
    });
}