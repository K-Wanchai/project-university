document.getElementById("submitBtn").addEventListener("click", function () {
    const accept = document.getElementById("accept");
  
    // 1. ตรวจสอบการยอมรับเงื่อนไข
    if (!accept.checked) {
      alert("กรุณายอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัวก่อนสมัคร");
      return;
    }
  
    // 2. ตรวจสอบรหัสผ่านว่าตรงกันหรือไม่
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    
    if (password !== confirmPassword) {
        alert("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
        return;
    }

    if (password.length === 0) {
        alert("กรุณากรอกรหัสผ่าน");
        return;
    }
  
    // 3. ดึงข้อมูลเพศ (Radio Button)
    let selectedGender = "";
    const genderRadios = document.getElementsByName("gender");
    for (let i = 0; i < genderRadios.length; i++) {
        if (genderRadios[i].checked) {
            selectedGender = genderRadios[i].value;
            break;
        }
    }

    // 4. ดึงข้อมูลสถานะ (Radio Button)
    let selectedRole = "";
    const roleRadios = document.getElementsByName("role");
    for (let i = 0; i < roleRadios.length; i++) {
        if (roleRadios[i].checked) {
            selectedRole = roleRadios[i].value;
            break;
        }
    }
  
    // 5. รวบรวมข้อมูลทั้งหมดให้ตรงกับ Model (User.java) ใน Backend
    const userData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        nationalId: document.getElementById("nationalId").value,
        dateOfBirth: document.getElementById("dateOfBirth").value || null, // ส่งเป็น null หากไม่ได้เลือกวันที่
        gender: selectedGender,
        role: selectedRole,
        gradeLevel: document.getElementById("gradeLevel").value,
        
        phoneNumber: document.getElementById("phoneNumber").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
        
        username: document.getElementById("username").value,
        password: password
    };
  
    // เช็คค่าว่างคร่าวๆ สำหรับฟิลด์บังคับ
    if (!userData.username || !userData.email) {
        alert("กรุณากรอกข้อมูล ชื่อผู้ใช้ และ อีเมล ให้ครบถ้วน");
        return;
    }
  
    // 6. เปลี่ยนปุ่มเพื่อแสดงว่ากำลังโหลด
    const submitBtn = document.getElementById("submitBtn");
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "กำลังดำเนินการ...";
    submitBtn.disabled = true;
  
    // 7. ส่งข้อมูลไปยัง Backend ด้วย Fetch API
    fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        // เช็ค Status Code ก่อนแปลง JSON
        if (!response.ok) {
            // โยน Error ไปให้บล็อก catch ด้านล่างจัดการ
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        // ทำงานเมื่อส่งข้อมูลสำเร็จ (Status 200)
        alert("สมัครสมาชิกสำเร็จ!");
        
        // พาผู้ใช้ไปหน้า Login ทันที
        // (ให้เปลี่ยนชื่อไฟล์เป็นชื่อหน้า Login ที่คุณมีอยู่จริง)
        window.location.href = "login.html"; 
    })
    .catch(error => {
        // คืนสภาพปุ่มกลับมาให้กดใหม่ได้
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
  
        // แสดงข้อความ Error ตามที่ Backend ส่งมา (เช่น Username is already taken!)
        if (error && error.message) {
            alert(error.message);
        } else {
            alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
        }
    });
  
  });