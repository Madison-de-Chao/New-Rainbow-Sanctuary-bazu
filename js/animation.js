document.addEventListener("DOMContentLoaded", () => {
  // 打字機動畫
  new Typed("#typed-slogan", {
    strings: [
      "Art, Bravery, Creation & Truth",
      "Always Bring Care & Truth",
      "靈魂的骨架 × 情感的光譜",
      "從這裡開始，成為自己生命劇本的主角"
    ],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 1500,
    loop: false
  })

  // logo 漸現
  const logos = document.querySelectorAll(".logo")
  logos.forEach((logo, i) => {
    setTimeout(() => {
      logo.style.opacity = 1
    }, i * 500)
  })

  // 語音開場（可選）
  const audio = document.getElementById("welcome-audio")
  if (audio) audio.play()
})

function enterSite() {
  const tone = document.getElementById("tone").value
  const userName = document.getElementById("user-name").value
  const gender = document.getElementById("gender").value
  const year = document.getElementById("birth-year").value
  const month = document.getElementById("birth-month").value
  const day = document.getElementById("birth-day").value
  const hour = document.getElementById("birth-hour").value

  // 檢查是否所有必要資料都已填寫
  if (!year || !month || !day || !hour) {
    alert("請完整填寫出生資料")
    return
  }

  // 保存所有資料到 localStorage
  localStorage.setItem("tone", tone)
  localStorage.setItem("userName", userName || "")
  localStorage.setItem("birthData", JSON.stringify({
    userName: userName || "",
    gender: gender || "",
    year: parseInt(year),
    month: parseInt(month),
    day: parseInt(day),
    hour: parseInt(hour)
  }))

  window.location.href = "bazi.html"
}
