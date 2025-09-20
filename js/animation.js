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
  const year = parseInt(document.getElementById("birth-year").value)
  const month = parseInt(document.getElementById("birth-month").value)
  const day = parseInt(document.getElementById("birth-day").value)
  const hour = parseInt(document.getElementById("birth-hour").value)

  // 使用改進的驗證函數（如果可用）
  if (window.validateBirthInput && window.showFriendlyError) {
    const validationError = window.validateBirthInput(year, month, day, hour);
    if (validationError) {
      window.showFriendlyError(validationError);
      return;
    }
  } else {
    // 簡化的備用驗證
    if (!year || !month || !day || isNaN(hour)) {
      alert("請完整填寫出生資料 🗓️")
      return
    }
  }

  // 保存所有資料到 localStorage
  localStorage.setItem("tone", tone)
  localStorage.setItem("userName", userName || "")
  localStorage.setItem("birthData", JSON.stringify({
    userName: userName || "",
    gender: gender || "",
    year: year,
    month: month,
    day: day,
    hour: hour
  }))

  window.location.href = "bazi.html"
}
