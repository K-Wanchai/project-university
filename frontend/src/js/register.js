document.getElementById("submitBtn").addEventListener("click", function () {
  const accept = document.getElementById("accept");

  if (!accept.checked) {
    alert("กรุณายอมรับเงื่อนไขก่อนสมัคร");
    return;
  }

  alert("สมัครสมาชิกสำเร็จ (mock)");
});