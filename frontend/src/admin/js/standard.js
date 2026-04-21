// ตัวแปรสำหรับเก็บข้อมูลที่ดึงมาจาก Backend
let users = [];
let currentEditId = null;

// ==========================================
// 1. ฟังก์ชันดึงจำนวนผู้ใช้งานทั้งหมด (โชว์ที่ Dashboard)
// ==========================================
function loadUserCount() {
    fetch("http://localhost:8080/api/admin/users/count")
        .then(response => {
            if (!response.ok) throw new Error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
            return response.json();
        })
        .then(data => {
            // อัปเดตตัวเลขในกล่องที่มี id="totalUsersCount" (ถ้ามี)
            const countElement = document.getElementById("totalUsersCount");
            if (countElement) countElement.innerText = data.totalUsers.toLocaleString();
        })
        .catch(error => console.error("Error loading user count:", error));
}

// ==========================================
// 2. ฟังก์ชันดึงข้อมูลตารางผู้ใช้ทั้งหมด (Read)
// ==========================================
function loadUsersTable() {
    fetch("http://localhost:8080/api/admin/users")
        .then(response => {
            if (!response.ok) throw new Error("ไม่สามารถดึงข้อมูลตารางผู้ใช้ได้");
            return response.json();
        })
        .then(data => {
            users = data; // เก็บข้อมูลลงตัวแปร Array
            renderTable(); // สั่งให้วาดตาราง
        })
        .catch(error => console.error("Error loading users table:", error));
}

// ฟังก์ชันสำหรับเรนเดอร์ข้อมูลลงใน HTML
function renderTable() {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return; // ถ้าหน้านี้ไม่มีตาราง ให้ข้ามไป
    tbody.innerHTML = '';

    users.forEach(user => {
        // จัดการเรื่องสถานะการแสดงผล
        let statusText = user.status || 'รอตรวจสอบ';
        let statusClass = statusText === 'ใช้งานอยู่' ? 'status-active' : 'status-inactive';
        let userRole = user.role || 'ไม่มีสิทธิ์';
        let firstLetter = user.firstName ? user.firstName.charAt(0) : '?';
        let fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'ไม่มีชื่อ';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><div style="width: 40px; height: 40px; border-radius: 50%; background: #e5e7eb; display:flex; justify-content:center; align-items:center;">${firstLetter}</div></td>
            <td>
                <div><strong>${fullName}</strong></div>
                <div style="font-size: 12px; color: #6b7280;">${user.username || 'ไม่มี username'}</div>
            </td>
            <td>${user.email || '-'}</td>
            <td><span class="role-badge">${userRole}</span></td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>
                <button class="edit-btn" onclick="openModal('edit', ${user.id})">แก้ไข</button>
                <button class="delete-btn" style="background-color: #ef4444; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer; border: none; margin-left: 5px;" onclick="deleteUser(${user.id})">ลบ</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ==========================================
// 3. ฟังก์ชันเปิด/ปิด Modal และดึงข้อมูล (Read One)
// ==========================================
function openModal(mode, id = null) {
    const modal = document.getElementById('userModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('userForm');
    
    if(!modal || !title || !form) return;

    form.reset();

    if (mode === 'add') {
        title.innerText = 'เพิ่มผู้ใช้งานใหม่';
        currentEditId = null;
        modal.classList.add('show');
    } else if (mode === 'edit') {
        title.innerText = 'กำลังโหลดข้อมูล...';
        currentEditId = id;
        
        // ไปดึงข้อมูลสดๆ จาก Backend
        fetch(`http://localhost:8080/api/admin/users/${id}`)
            .then(res => res.json())
            .then(user => {
                title.innerText = 'แก้ไขข้อมูลผู้ใช้งาน';
                document.getElementById('fullname').value = `${user.firstName || ''} ${user.lastName || ''}`.trim();
                document.getElementById('username').value = user.username || '';
                document.getElementById('email').value = user.email || '';
                document.getElementById('phone').value = user.phoneNumber || '';
                document.getElementById('role').value = user.role || '';
                document.getElementById('status').value = user.status || '';
                modal.classList.add('show');
            })
            .catch(error => {
                console.error("Error loading user data:", error);
                alert("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
            });
    }
}

function closeModal() {
    const modal = document.getElementById('userModal');
    if(modal) modal.classList.remove('show');
}

// ==========================================
// 4. ฟังก์ชันบันทึกข้อมูล (Create & Update)
// ==========================================
function saveData() {
    // ดึงค่าและแยกชื่อ-นามสกุล
    const fullNameInput = document.getElementById('fullname').value.trim();
    const nameParts = fullNameInput.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const userData = {
        firstName: firstName,
        lastName: lastName,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phone').value,
        role: document.getElementById('role').value,
        status: document.getElementById('status').value
    };

    if(!userData.firstName || !userData.username || !userData.email) {
        alert("กรุณากรอกข้อมูลที่จำเป็น (*) ให้ครบถ้วน");
        return;
    }

    const url = currentEditId 
        ? `http://localhost:8080/api/admin/users/${currentEditId}` // แก้ไข (PUT)
        : `http://localhost:8080/api/admin/users`; // เพิ่มใหม่ (POST)
    
    const method = currentEditId ? "PUT" : "POST";

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.message || "บันทึกไม่สำเร็จ"); });
        }
        return response.json();
    })
    .then(data => {
        alert(currentEditId ? "แก้ไขข้อมูลสำเร็จ!" : "เพิ่มผู้ใช้สำเร็จ!");
        closeModal();
        loadUsersTable(); // รีเฟรชตาราง
        loadUserCount();  // รีเฟรชตัวเลข Dashboard
    })
    .catch(error => {
        console.error("Error saving data:", error);
        alert(error.message);
    });
}

// ==========================================
// 5. ฟังก์ชันลบผู้ใช้ (Delete)
// ==========================================
function deleteUser(id) {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งานนี้?")) {
        fetch(`http://localhost:8080/api/admin/users/${id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) throw new Error("ไม่สามารถลบผู้ใช้ได้");
            alert("ลบผู้ใช้เรียบร้อยแล้ว");
            loadUsersTable(); // รีเฟรชตาราง
            loadUserCount();  // รีเฟรชตัวเลข Dashboard
        })
        .catch(error => {
            console.error("Error deleting user:", error);
            alert(error.message);
        });
    }
}

// ==========================================
// 6. โหลดข้อมูลเมื่อเปิดหน้าเว็บ
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    loadUserCount();   // ลองดึงตัวเลข Dashboard เผื่อหน้านี้มีโชว์
    loadUsersTable();  // โหลดตาราง
});