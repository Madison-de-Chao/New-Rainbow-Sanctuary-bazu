// 增強版八字應用 - 修正版：解決appendChild null和Chart.js重複建圖問題

// A. 防止 appendChild 對 null 的工具函數
function ensureElement(selector, fallbackId, fallbackTag = 'div') {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement(fallbackTag);
    el.id = fallbackId || 'enhanced-root';
    document.body.appendChild(el);
  }
  return el;
}

// B. Chart.js 安全渲染函數
function renderAnimatedChart(canvasId, config) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.warn(`Canvas with id "${canvasId}" not found`);
    return null;
  }

  // 若已存在同ID圖表，先銷毀
  if (window.Chart && Chart.getChart) {
    const prev = Chart.getChart(canvasId);
    if (prev) {
      console.log(`Destroying existing chart: ${canvasId}`);
      prev.destroy();
    }
  }

  const ctx = canvas.getContext('2d');
  return new Chart(ctx, config);
}

// C. 防止重複渲染的狀態管理
let rendering = false;

// D. 安全的localStorage包裝
const storage = (() => {
  try { 
    return window.localStorage; 
  } catch { 
    const mem = {};
    return {
      getItem: k => mem[k] ?? null,
      setItem: (k, v) => mem[k] = String(v),
      removeItem: k => delete mem[k]
    };
  }
})();

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Enhanced app loaded, checking localStorage...");
  
  const baziAnalysis = storage.getItem("baziAnalysis");
  const tone = storage.getItem("tone") || "default";
  
  // 檢查是否有保存的表單數據
  const savedFormData = storage.getItem("birthData");
  if (savedFormData) {
    try {
      const formData = JSON.parse(savedFormData);
      // 安全填入保存的表單數據
      const yearInput = document.querySelector('input[name="yyyy"]');
      const monthInput = document.querySelector('input[name="mm"]');
      const dayInput = document.querySelector('input[name="dd"]');
      const hourInput = document.querySelector('input[name="hh"]');
      
      if (yearInput) yearInput.value = formData.year;
      if (monthInput) monthInput.value = formData.month;
      if (dayInput) dayInput.value = formData.day;
      if (hourInput) hourInput.value = formData.hour;
    } catch (error) {
      console.error("Error loading saved form data:", error);
    }
  }
  
  if (baziAnalysis) {
    try {
      const data = JSON.parse(baziAnalysis);
      console.log("Found cached data:", data);
      
      if (data.chart && data.narrative) {
        await renderEnhancedResultsOnce(data);
      } else {
        console.log("Incomplete data, will generate when user submits");
      }
    } catch (error) {
      console.error("Error parsing cached data:", error);
    }
  } else {
    console.log("No cached data, waiting for user input...");
  }
});

// 生成新的八字數據
async function generateFreshData() {
  const birthData = {
    year: 1984,
    month: 10,
    day: 6,
    hour: 20
  };
  
  const tone = storage.getItem("tone") || "default";
  
  try {
    console.log("Calling API with data:", birthData);
    const result = await getFullBaziAnalysis(birthData, tone);
    console.log("API returned:", result);
    
    storage.setItem("baziAnalysis", JSON.stringify(result));
    await renderEnhancedResultsOnce(result);
  } catch (error) {
    console.error("API call failed:", error);
    const demoData = getDemoAnalysis(birthData, tone);
    await renderEnhancedResultsOnce(demoData);
  }
}

// C. 保證只渲染一次的主渲染函數
async function renderEnhancedResultsOnce(data) {
  if (rendering) {
    console.log("Already rendering, skipping...");
    return;
  }
  
  rendering = true;
  try {
    console.log("Rendering enhanced results...");
    
    // 渲染四柱卡片 - 添加飛入動畫
    await renderAnimatedPillars(data.chart.pillars);
    
    // 渲染五行圖表 - 使用安全的Chart.js渲染
    await renderSafeFiveElementsChart(data.chart.fiveElements);
    
    // 渲染敘事內容 - 添加打字機效果
    await renderAnimatedNarrative(data.narrative);
    
    // 渲染陰陽統計
    renderYinYang(data.chart.yinYang);
    
    // 添加神煞信息（如果有）
    if (data.spirits && data.spirits.length > 0) {
      renderSpirits(data.spirits);
    }
  } catch (error) {
    console.error("Error in renderEnhancedResultsOnce:", error);
  } finally {
    rendering = false;
  }
}

// 安全的四柱卡片渲染
async function renderAnimatedPillars(pillars) {
  const pillarsElement = ensureElement("#pillars", "pillars");
  pillarsElement.innerHTML = "";
  
  const pillarNames = ["年", "月", "日", "時"];
  const colors = ["#ff6ec4", "#7873f5", "#00d4ff", "#ff9500"];
  
  for (let i = 0; i < pillarNames.length; i++) {
    const pillarName = pillarNames[i];
    const pillar = pillars[pillarName];
    if (!pillar) continue;
    
    const card = document.createElement("div");
    card.className = "pillar-card";
    card.style.cssText = `
      background: linear-gradient(135deg, ${colors[i]}20, ${colors[i]}10);
      border: 2px solid ${colors[i]}40;
      border-radius: 16px;
      padding: 1.5rem;
      text-align: center;
      transform: translateY(50px) scale(0.8);
      opacity: 0;
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 32px ${colors[i]}20;
      backdrop-filter: blur(10px);
      margin-bottom: 1rem;
    `;
    
    card.innerHTML = `
      <div style="font-size: 1.2rem; color: ${colors[i]}; font-weight: bold; margin-bottom: 0.5rem;">
        ${pillarName}柱軍團
      </div>
      <div style="font-size: 2rem; font-weight: bold; margin: 1rem 0; color: white;">
        ${pillar.pillar}
      </div>
      <div style="color: #ccc; font-size: 0.9rem;">
        天干：${pillar.gan} | 地支：${pillar.zhi}
      </div>
    `;
    
    pillarsElement.appendChild(card);
    
    // 延遲動畫以創建飛入效果
    setTimeout(() => {
      card.style.transform = "translateY(0) scale(1)";
      card.style.opacity = "1";
    }, i * 200);
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

// 安全的五行圖表渲染
async function renderSafeFiveElementsChart(fiveElements) {
  if (typeof Chart === 'undefined') {
    console.warn("Chart.js not loaded");
    return;
  }
  
  const config = {
    type: "radar",
    data: {
      labels: Object.keys(fiveElements),
      datasets: [{
        label: "五行能量分佈",
        data: Object.values(fiveElements),
        backgroundColor: "rgba(255, 110, 196, 0.2)",
        borderColor: "#ff6ec4",
        borderWidth: 3,
        pointBackgroundColor: "#ff6ec4",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "#fff"
          }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          grid: {
            color: "rgba(255, 255, 255, 0.1)"
          },
          angleLines: {
            color: "rgba(255, 255, 255, 0.1)"
          },
          pointLabels: {
            color: "#fff",
            font: {
              size: 14
            }
          },
          ticks: {
            color: "#fff",
            backdropColor: "transparent"
          }
        }
      },
      animation: {
        duration: 2000,
        easing: "easeInOutQuart"
      }
    }
  };
  
  // 使用安全的Chart.js渲染函數
  const chart = renderAnimatedChart("fiveChart", config);
  if (chart) {
    console.log("Five elements chart rendered successfully");
  }
}

// 安全的敘事內容渲染
async function renderAnimatedNarrative(narrative) {
  const narrativeElement = ensureElement("#narrative", "narrative");
  narrativeElement.innerHTML = "";
  
  const pillarNames = ["年", "月", "日", "時"];
  const colors = ["#ff6ec4", "#7873f5", "#00d4ff", "#ff9500"];
  
  for (let i = 0; i < pillarNames.length; i++) {
    const pillarName = pillarNames[i];
    const pillarNarrative = narrative[pillarName];
    if (!pillarNarrative) continue;
    
    const card = document.createElement("div");
    card.className = "narrative-card";
    card.style.cssText = `
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
      border: 1px solid ${colors[i]}40;
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
      backdrop-filter: blur(10px);
      transform: translateX(-50px);
      opacity: 0;
      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 32px ${colors[i]}10;
    `;
    
    card.innerHTML = `
      <h3 style="color: ${colors[i]}; margin-bottom: 1rem; font-size: 1.5rem;">
        ${pillarName}柱 · ${pillarNarrative.title}
      </h3>
      <div style="display: flex; gap: 2rem; margin-bottom: 1rem;">
        <div style="color: ${colors[i]}; font-weight: bold;">軍師：${pillarNarrative.relation}</div>
        <div style="color: ${colors[i]}; font-weight: bold;">納音：${pillarNarrative.nayin}</div>
      </div>
      <p style="color: #ccc; line-height: 1.6; font-size: 1rem;">
        ${pillarNarrative.description}
      </p>
    `;
    
    narrativeElement.appendChild(card);
    
    // 延遲動畫
    setTimeout(() => {
      card.style.transform = "translateX(0)";
      card.style.opacity = "1";
    }, i * 300);
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

// 安全的陰陽統計渲染
function renderYinYang(yinYang) {
  const yinYangElement = ensureElement("#yinyang", "yinyang");
  
  yinYangElement.innerHTML = `
    <div style="display: flex; justify-content: center; gap: 2rem; align-items: center;">
      <div style="text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">☯</div>
        <div style="color: #ff6ec4; font-size: 1.2rem; font-weight: bold;">陰：${yinYang.yin}</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">☯</div>
        <div style="color: #7873f5; font-size: 1.2rem; font-weight: bold;">陽：${yinYang.yang}</div>
      </div>
    </div>
  `;
}

// 安全的神煞信息渲染
function renderSpirits(spirits) {
  const narrativeElement = ensureElement("#narrative", "narrative");
  
  const spiritsCard = document.createElement("div");
  spiritsCard.className = "spirits-card";
  spiritsCard.style.cssText = `
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 16px;
    padding: 2rem;
    margin-top: 2rem;
    backdrop-filter: blur(10px);
  `;
  
  spiritsCard.innerHTML = `
    <h3 style="color: #ffd700; margin-bottom: 1rem; font-size: 1.5rem;">神煞信息</h3>
    <div style="color: #ccc; line-height: 1.6;">
      ${spirits.map(spirit => `<div style="margin-bottom: 0.5rem;">• ${spirit}</div>`).join('')}
    </div>
  `;
  
  narrativeElement.appendChild(spiritsCard);
}

// 載入動畫函數
function showLoadingAnimation() {
  // 避免重複創建載入動畫
  if (document.getElementById("loading-animation")) {
    return;
  }
  
  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loading-animation";
  loadingDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(15, 15, 26, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(10px);
  `;
  
  loadingDiv.innerHTML = `
    <div style="text-align: center;">
      <div style="width: 60px; height: 60px; border: 4px solid rgba(255, 110, 196, 0.3); border-top: 4px solid #ff6ec4; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
      <div style="color: #ff6ec4; font-size: 1.2rem;">召喚你的軍團中...</div>
    </div>
  `;
  
  document.body.appendChild(loadingDiv);
  
  // 添加旋轉動畫（避免重複添加）
  if (!document.getElementById("loading-animation-style")) {
    const style = document.createElement("style");
    style.id = "loading-animation-style";
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes glow {
        0% { text-shadow: 0 0 5px rgba(255, 110, 196, 0.5); }
        100% { text-shadow: 0 0 20px rgba(255, 110, 196, 0.8), 0 0 30px rgba(255, 110, 196, 0.6); }
      }
    `;
    document.head.appendChild(style);
  }
}

function hideLoadingAnimation() {
  const loadingDiv = document.getElementById("loading-animation");
  if (loadingDiv) {
    loadingDiv.style.opacity = "0";
    loadingDiv.style.transition = "opacity 0.5s ease";
    setTimeout(() => {
      loadingDiv.remove();
    }, 500);
  }
}

// 表單提交處理 - 使用安全的渲染函數
document.getElementById("bazi-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  showLoadingAnimation();
  
  const form = new FormData(e.target);
  const input = {
    year: parseInt(form.get("yyyy")),
    month: parseInt(form.get("mm")),
    day: parseInt(form.get("dd")),
    hour: parseInt(form.get("hh"))
  };
  
  // 保存表單數據到localStorage
  storage.setItem("birthData", JSON.stringify(input));
  
  const tone = storage.getItem("tone") || "default";
  
  try {
    const analysisData = await getFullBaziAnalysis(input, tone);
    storage.setItem("baziAnalysis", JSON.stringify(analysisData));
    await renderEnhancedResultsOnce(analysisData);
  } catch (error) {
    console.error("計算失敗：", error);
    const demoData = getDemoAnalysis(input, tone);
    await renderEnhancedResultsOnce(demoData);
  }
  
  hideLoadingAnimation();
});

function exportReport() {
  window.location.href = "report.html";
}

