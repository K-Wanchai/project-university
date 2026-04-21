document.getElementById("parentLoginForm").addEventListener("submit", function(e){

    e.preventDefault();

    const citizenId = document.getElementById("citizenId").value;

    const data = {
        citizenId: citizenId
    };

    const btn = e.target.querySelector("button");
    const oldText = btn.innerText;

    btn.innerText = "กำลังตรวจสอบ...";
    btn.disabled = true;

    fetch("http://172.20.10.2:8080/api/auth/parent-login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    .then(res => {
        if(!res.ok){
            return res.json().then(err => { throw err });
        }
        return res.json();
    })

    .then(result => {

        alert("เข้าสู่ระบบสำเร็จ");

        // ไปหน้าผู้ปกครอง
        window.location.href = "parent-dashboard.html";

    })

    .catch(err => {

        if(err.message){
            alert("ไม่พบข้อมูลนักเรียน");
        }else{
            alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
        }

    })

    .finally(() => {
        btn.innerText = oldText;
        btn.disabled = false;
    });

});