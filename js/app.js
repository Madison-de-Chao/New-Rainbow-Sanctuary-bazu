// 頁面載入時從 localStorage 讀取數據並渲染
document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded, checking localStorage...");
  const baziAnalysis = localStorage.getItem("baziAnalysis");
  console.log("Retrieved data:", baziAnalysis);
  
  if (baziAnalysis) {
    try {
      const data = JSON.parse(baziAnalysis);
      console.log("Parsed data:", data);
      
      if (data.chart && data.narrative) {
        console.log("Rendering chart and narrative...");
        renderChart(data.chart);
        renderNarrative(data.narrative);
      } else {
        console.log("Chart or narrative data missing");
      }
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
    }
  } else {
    console.log("No baziAnalysis found in localStorage");
  }
});

// 原有的表單提交處理保留作為備用
document.getElementById("bazi-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const input = {
    year: parseInt(form.get("yyyy")),
    month: parseInt(form.get("mm")),
    day: parseInt(form.get("dd")),
    hour: parseInt(form.get("hh")),
    minute: 0,
    zMode: form.get("zMode")
  }
  const tone = localStorage.getItem("tone") || "default"

  try {
    // 使用新的資料庫API
    const analysisData = await getFullBaziAnalysis({
      year: input.year,
      month: input.month,
      day: input.day,
      hour: input.hour
    }, tone);

    localStorage.setItem("baziAnalysis", JSON.stringify(analysisData));
    
    if (analysisData.chart && analysisData.narrative) {
      renderChart(analysisData.chart);
      renderNarrative(analysisData.narrative);
    }
  } catch (error) {
    console.error("計算失敗：", error);
    alert("計算失敗：" + error.message);
  }
})

function renderChart(chart) {
  console.log("Rendering chart with data:", chart);
  
  const pillars = chart.pillars
  const html = Object.entries(pillars).map(([key, val]) => {
    return `<div><strong>${key}柱：</strong> ${val.pillar}（${val.gan}${val.zhi}）</div>`
  }).join("")
  
  const pillarsElement = document.getElementById("pillars");
  if (pillarsElement) {
    pillarsElement.innerHTML = html;
    console.log("Pillars rendered successfully");
  }

  // Check if Chart.js is available before creating chart
  if (typeof Chart !== 'undefined') {
    const canvas = document.getElementById("fiveChart");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      try {
        new Chart(ctx, {
          type: "radar",
          data: {
            labels: Object.keys(chart.fiveElements),
            datasets: [{
              label: "五行分佈",
              data: Object.values(chart.fiveElements),
              backgroundColor: "rgba(255,99,132,0.2)",
              borderColor: "#ff6ec4"
            }]
          }
        });
        console.log("Chart rendered successfully");
      } catch (error) {
        console.error("Error creating chart:", error);
      }
    }
  } else {
    console.warn("Chart.js not loaded");
  }

  const yinYangElement = document.getElementById("yinYang");
  if (yinYangElement) {
    yinYangElement.innerHTML = `陰：${chart.yinYang.陰}　陽：${chart.yinYang.陽}`;
    console.log("Yin Yang rendered successfully");
  }
}

function renderNarrative(narrative) {
  console.log("Rendering narrative with data:", narrative);
  
  const html = Object.entries(narrative).map(([pillar, data]) => {
    return `
      <div class="card">
        <h3>${pillar}柱軍團</h3>
        <p>主將：${data.commander}</p>
        <p>軍師：${data.strategist}</p>
        <p>納音：${data.naYin}</p>
        <div id="typed-${pillar}">${data.story}</div>
      </div>
    `
  }).join("")
  
  const narrativeElement = document.getElementById("narrative");
  if (narrativeElement) {
    narrativeElement.innerHTML = html;
    console.log("Narrative HTML rendered successfully");
  }

  // Only use Typed.js if it's available
  if (typeof Typed !== 'undefined') {
    Object.entries(narrative).forEach(([pillar, data]) => {
      try {
        new Typed(`#typed-${pillar}`, {
          strings: [data.story],
          typeSpeed: 40,
          showCursor: false
        });
      } catch (error) {
        console.error(`Error creating typed effect for ${pillar}:`, error);
      }
    });
    console.log("Typed effects initialized");
  } else {
    console.warn("Typed.js not loaded, showing static text");
  }
}

function exportReport() {
  window.location.href = "report.html"
}
