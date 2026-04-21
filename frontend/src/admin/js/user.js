// อ้างอิง IP และ Endpoint

const API_BASE_URL = "http://localhost:8080/api/admin/users";

let users = [];
let currentEditId = null;

// ดึงข้อมูลเมื่อโหลดหน้า
document.addEventListener("DOMContentLoaded", () => {
    loadUsersTable();

    // เพิ่ม Event Listener ให้ช่องค้นหาและตัวกรองทำงานแบบ Real-time
    document.getElementById("searchInput").addEventListener("input", filterTable);
    document.getElementById("roleFilter").addEventListener("change", filterTable);
});

// ฟังก์ชันโหลดข้อมูลผู้ใช้ทั้งหมด (Read)
function loadUsersTable() {
    fetch(API_BASE_URL)
        .then(res => {
            if (!res.ok) throw new Error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
            return res.json();
        })
        .then(data => {
            users = data; // เก็บข้อมูลลง Array
            renderTable(users); // สั่งวาดตาราง
        })
        .catch(err => {
            console.error("Error:", err);
            alert("ไม่สามารถดึงข้อมูลได้ โปรดตรวจสอบการเชื่อมต่อ Backend");
        });
}

// ฟังก์ชันวาดตาราง
function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    // ถ้าไม่มีข้อมูล
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">ไม่พบข้อมูลผู้ใช้งาน</td></tr>';
        return;
    }

    data.forEach(user => {
        const tr = document.createElement('tr');
        // จัดการสถานะให้สีตรงกับข้อความ
        let statusText = user.status || 'ปกติ';
        const statusClass = (statusText === 'ปกติ' || statusText === 'ใช้งานอยู่') ? 'status-active' : 'status-inactive';
        
        tr.innerHTML = `
            <td><img src="https://ui-avatars.com/api/?name=${user.firstName}&background=random" class="avatar-img" style="border-radius: 50%; width: 40px; height: 40px;"></td>
            <td>${user.firstName || ''} ${user.lastName || ''}</td>
            <td>${user.username || '-'}</td>
            <td>${user.email || '-'}</td>
            <td>${user.role || '-'}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>-</td> <td>
                <button onclick="openModal('edit', ${user.id})" style="cursor: pointer; border: none; background: none; color: #3b82f6;"><i class="fas fa-edit"></i> แก้ไข</button>
                <button onclick="deleteUser(${user.id})" style="cursor: pointer; border: none; background: none; color: #ef4444; margin-left: 10px;"><i class="fas fa-trash"></i> ลบ</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ฟังก์ชันค้นหาและกรองข้อมูล
function filterTable() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const roleFilter = document.getElementById("roleFilter").value;

    const filteredUsers = users.filter(user => {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
        const username = (user.username || '').toLowerCase();
        
        // เช็คว่าชื่อ หรือ username ตรงกับคำค้นหาไหม
        const matchesSearch = fullName.includes(searchTerm) || username.includes(searchTerm);
        // เช็คว่าบทบาทตรงกับตัวกรองไหม
        const matchesRole = roleFilter === "" || user.role === roleFilter;
        
        return matchesSearch && matchesRole;
    });

    // วาดตารางใหม่ด้วยข้อมูลที่ผ่านการกรองแล้ว
    renderTable(filteredUsers);
}

// ฟังก์ชันเปิด Modal
function openModal(mode, id = null) {
    const modal = document.getElementById('userModal');
    const title = document.getElementById('modalTitle');
    
    if (mode === 'add') {
        title.innerText = 'เพิ่มผู้ใช้งานใหม่';
        document.getElementById('userForm').reset();
        currentEditId = null;
    } else {
        title.innerText = 'แก้ไขข้อมูลผู้ใช้งาน';
        currentEditId = id;
        const user = users.find(u => u.id === id);
        if(user) {
            document.getElementById('fullname').value = `${user.firstName || ''} ${user.lastName || ''}`.trim();
            document.getElementById('username').value = user.username || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('phone').value = user.phoneNumber || ''; // ใส่เบอร์โทร
            document.getElementById('role').value = user.role || 'นักเรียน';
            document.getElementById('status').value = user.status || 'ปกติ';
        }
    }
    modal.classList.add('show');
}

// ฟังก์ชันปิด Modal
function closeModal() {
    document.getElementById('userModal').classList.remove('show');
}

// ฟังก์ชันบันทึกข้อมูล (POST/PUT)
function saveData() {
    const fullNameInput = document.getElementById('fullname').value.trim();
    const nameParts = fullNameInput.split(' ');
    
    const userData = {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phone').value, // รับเบอร์โทรไปบันทึกด้วย
        role: document.getElementById('role').value,
        status: document.getElementById('status').value
    };

    // เช็คค่าว่าง
    if(!userData.firstName || !userData.username || !userData.email) {
        alert("กรุณากรอกข้อมูลที่จำเป็น (ชื่อ, ชื่อผู้ใช้, อีเมล) ให้ครบถ้วน");
        return;
    }

    const method = currentEditId ? 'PUT' : 'POST';
    const url = currentEditId ? `${API_BASE_URL}/${currentEditId}` : API_BASE_URL;

    // เปลี่ยนข้อความปุ่มระหว่างโหลด
    const btnSave = document.querySelector('.btn-save');
    const originalText = btnSave.innerText;
    btnSave.innerText = 'กำลังบันทึก...';
    btnSave.disabled = true;

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => { throw new Error(err.message || "บันทึกไม่สำเร็จ") });
        }
        return res.json();
    })
    .then(() => {
        alert(currentEditId ? "แก้ไขข้อมูลสำเร็จ!" : "เพิ่มผู้ใช้ใหม่สำเร็จ!");
        closeModal();
        loadUsersTable(); // โหลดตารางใหม่
    })
    .catch(err => {
        console.error("Error:", err);
        alert("เกิดข้อผิดพลาด: " + err.message);
    })
    .finally(() => {
        // คืนค่าปุ่มกลับมา
        btnSave.innerText = originalText;
        btnSave.disabled = false;
    });
}

// ฟังก์ชันลบผู้ใช้ (DELETE)
function deleteUser(id) {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งานนี้? (ลบแล้วกู้คืนไม่ได้)")) {
        fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        })
        .then(res => {
            if (!res.ok) throw new Error("ลบไม่สำเร็จ");
            alert("ลบผู้ใช้งานเรียบร้อยแล้ว");
            loadUsersTable(); // โหลดตารางใหม่หลังลบ
        })
        .catch(err => {
            console.error("Error deleting:", err);
            alert("เกิดข้อผิดพลาดในการลบผู้ใช้งาน");
        });
    }
}