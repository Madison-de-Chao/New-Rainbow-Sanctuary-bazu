document.addEventListener("DOMContentLoaded", () => {
  const tone = localStorage.getItem("tone") || "default"
  document.getElementById("tone-display").textContent = tone

  const chart = JSON.parse(localStorage.getItem("chart"))
  const narrative = JSON.parse(localStorage.getItem("narrative"))

  if (!chart || !narrative) {
    document.getElementById("report-body").innerHTML =
      "<p>⚠️ 尚未生成命盤，請先回到首頁輸入資料。</p>"
    return
  }

  renderNarrativeReport(tone, chart, narrative)
})

function downloadReport() {
  alert("💡 儲存功能尚未啟用，可使用『列印』另存 PDF。")
}

function shareReport() {
  alert("💡 分享功能尚未啟用，可截圖或複製內容分享。")
}
