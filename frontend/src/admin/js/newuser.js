const API_URL = "http://172.24.177.13:8080/api/admin/users";

document.addEventListener("DOMContentLoaded", () => {
    // ตรวจสอบว่ามี Query String ?id=... หรือไม่
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (userId) {
        prepareEditPage(userId);
    }
});

// ฟังก์ชันโหลดข้อมูลเดิมมาใส่ในฟอร์มกรณี Edit
function prepareEditPage(id) {
    document.getElementById("pageTitle").innerText = "แก้ไขข้อมูลผู้ใช้งาน";
    
    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(user => {
            document.getElementById("firstName").value = user.firstName;
            document.getElementById("lastName").value = user.lastName;
            document.getElementById("username").value = user.username;
            document.getElementById("email").value = user.email;
            document.getElementById("role").value = user.role;
            document.getElementById("status").value = user.status || "ปกติ";
        })
        .catch(err => alert("ไม่สามารถดึงข้อมูลผู้ใช้ได้"));
}

// จัดการการบันทึกข้อมูล
document.getElementById("userForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    const userData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        role: document.getElementById("role").value,
        status: document.getElementById("status").value
    };

    const method = userId ? "PUT" : "POST";
    const finalUrl = userId ? `${API_URL}/${userId}` : API_URL;

    fetch(finalUrl, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    })
    .then(res => {
        if (!res.ok) throw new Error("เกิดข้อผิดพลาดในการบันทึก");
        alert("บันทึกข้อมูลสำเร็จ!");
        window.location.href = "newuser.html"; // บันทึกเสร็จแล้วกลับไปหน้าตาราง
    })
    .catch(err => alert(err.message));
});