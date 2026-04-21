const toggle = document.querySelector(".toggle");
const password = document.getElementById("password");

// ระบบโชว์/ซ่อนรหัสผ่าน (ของเดิม)
toggle.addEventListener("click", () => {
    if (password.type === "password") {
        password.type = "text";
        toggle.classList.replace("fa-eye","fa-eye-slash");
    } else {
        password.type = "password";
        toggle.classList.replace("fa-eye-slash","fa-eye");
    }
});

// ระบบส่งข้อมูลเข้าสู่ระบบ
document.getElementById("loginForm").addEventListener("submit", function(e){
    e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรชตอนกดปุ่ม

    // 1. ดึงข้อมูลจากช่องกรอก
    const identifierVal = document.getElementById("identifier").value;
    const passwordVal = document.getElementById("password").value;

    const loginData = {
        identifier: identifierVal,
        password: passwordVal
    };

    // 2. เปลี่ยนข้อความปุ่มเพื่อบอกผู้ใช้ว่ากำลังโหลด
    const submitBtn = e.target.querySelector("button[type='submit']");
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "กำลังตรวจสอบ...";
    submitBtn.disabled = true;

    // 3. ยิง Fetch API ไปเช็คกับ Backend 
    // (หมายเหตุ: ถ้าเปลี่ยน Wi-Fi อย่าลืมมาแก้เลข IP ตรงนี้นะครับ)
    fetch("http://172.20.10.2:8080/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        // หากเข้าสู่ระบบสำเร็จ (รหัสผ่านถูกต้อง)
        alert("เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับคุณ " + data.username);
        
        // ตรงนี้คุณสามารถสั่งให้เด้งไปหน้าแรกของเว็บได้ เช่น:
        // window.location.href = "home.html"; 
        
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    })
    .catch(error => {
        // หากเกิดข้อผิดพลาด เช่น รหัสผิด หรือไม่พบผู้ใช้
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;

        if (error && error.message) {
            alert("เข้าสู่ระบบไม่สำเร็จ: " + error.message); // จะโชว์ "Invalid password" หรือ "User not found"
        } else {
            alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ ลองเช็คเน็ตหรือรัน Backend ดูก่อนนะครับ");
        }
    });
});