// 增強版八字應用 - 改進的前後端整合和美化效果
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Enhanced app loaded, checking localStorage...");
  
  const baziAnalysis = localStorage.getItem("baziAnalysis");
  const tone = localStorage.getItem("tone") || "default";
  
  // 檢查是否有保存的表單數據
  const savedFormData = localStorage.getItem("birthData");
  if (savedFormData) {
    try {
      const formData = JSON.parse(savedFormData);
      // 填入保存的表單數據
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
        await renderEnhancedResults(data);
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
  // Get stored birth data instead of using hardcoded values
  const storedBirthData = localStorage.getItem("birthData");
  let birthData;
  
  if (storedBirthData) {
    try {
      birthData = JSON.parse(storedBirthData);
    } catch (error) {
      console.error("Error parsing stored birth data:", error);
      // Fallback to default values if parsing fails
      birthData = {
        year: 1984,
        month: 10,
        day: 6,
        hour: 20
      };
    }
  } else {
    // Fallback to default values if no stored data
    birthData = {
      year: 1984,
      month: 10,
      day: 6,
      hour: 20
    };
  }
  
  const tone = localStorage.getItem("tone") || "default";
  
  try {
    console.log("Calling API with data:", birthData);
    const result = await getFullBaziAnalysis(birthData, tone);
    console.log("API returned:", result);
    
    localStorage.setItem("baziAnalysis", JSON.stringify(result));
    await renderEnhancedResults(result);
  } catch (error) {
    console.error("API call failed:", error);
    // 使用演示數據作為後備
    const demoData = getDemoAnalysis(birthData, tone);
    console.log("Using demo data:", demoData);
    await renderEnhancedResults(demoData);
  }
}

// 增強版結果渲染 - 添加動畫效果
async function renderEnhancedResults(data) {
  console.log("Rendering enhanced results...");
  
  // 渲染四柱卡片 - 添加飛入動畫
  await renderAnimatedPillars(data.chart.pillars);
  
  // 渲染五行圖表 - 添加動態填充效果
  await renderAnimatedChart(data.chart.fiveElements);
  
  // 渲染敘事內容 - 添加打字機效果
  await renderAnimatedNarrative(data.narrative);
  
  // 渲染陰陽統計
  renderYinYang(data.chart.yinYang);
  
  // 添加神煞信息（如果有）
  if (data.spirits && data.spirits.length > 0) {
    renderSpirits(data.spirits);
  }
}

// 動畫四柱卡片
async function renderAnimatedPillars(pillars) {
  const pillarsElement = document.getElementById("pillars");
  if (!pillarsElement) return;
  
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

// 動畫圖表
async function renderAnimatedChart(fiveElements) {
  if (typeof Chart === 'undefined') {
    console.warn("Chart.js not loaded");
    return;
  }
  
  const canvas = document.getElementById("fiveChart");
  if (!canvas) return;
  
  const ctx = canvas.getContext("2d");
  
  // 創建動態填充的雷達圖
  new Chart(ctx, {
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
            color: "#ccc",
            backdropColor: "transparent"
          }
        }
      },
      animation: {
        duration: 2000,
        easing: 'easeInOutQuart'
      }
    }
  });
}

// 動畫敘事內容
async function renderAnimatedNarrative(narrative) {
  const narrativeElement = document.getElementById("narrative");
  if (!narrativeElement) return;
  
  narrativeElement.innerHTML = "";
  
  const pillarNames = ["年", "月", "日", "時"];
  const colors = ["#ff6ec4", "#7873f5", "#00d4ff", "#ff9500"];
  
  for (let i = 0; i < pillarNames.length; i++) {
    const pillarName = pillarNames[i];
    const data = narrative[pillarName];
    if (!data) continue;
    
    const card = document.createElement("div");
    card.className = "narrative-card";
    card.style.cssText = `
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
      border: 1px solid rgba(${colors[i].slice(1).match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.3);
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
      backdrop-filter: blur(15px);
      transform: translateX(-50px);
      opacity: 0;
      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;
    
    card.innerHTML = `
      <h3 style="color: ${colors[i]}; margin-bottom: 1.5rem; font-size: 1.6rem; text-align: center;">
        ${pillarName}柱 · ${data.commander}
      </h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
        <div style="color: #ddd;">
          <strong style="color: ${colors[i]};">軍師：</strong>${data.strategist}
        </div>
        <div style="color: #ddd;">
          <strong style="color: ${colors[i]};">納音：</strong>${data.naYin}
        </div>
      </div>
      <div id="story-${pillarName}" style="color: #ccc; line-height: 1.8; font-size: 1.1rem; min-height: 60px;">
        ${data.story}
      </div>
    `;
    
    narrativeElement.appendChild(card);
    
    // 延遲動畫
    setTimeout(() => {
      card.style.transform = "translateX(0)";
      card.style.opacity = "1";
    }, i * 300);
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  // 添加打字機效果（如果Typed.js可用）
  if (typeof Typed !== 'undefined') {
    pillarNames.forEach((pillarName, index) => {
      const data = narrative[pillarName];
      if (data) {
        setTimeout(() => {
          new Typed(`#story-${pillarName}`, {
            strings: [data.story],
            typeSpeed: 30,
            showCursor: false,
            onComplete: () => {
              // 添加閃爍效果
              const element = document.getElementById(`story-${pillarName}`);
              if (element) {
                element.style.animation = "glow 2s ease-in-out infinite alternate";
              }
            }
          });
        }, index * 1000);
      }
    });
  }
}

// 渲染陰陽統計
function renderYinYang(yinYang) {
  const yinYangElement = document.getElementById("yinYang");
  if (!yinYangElement) return;
  
  yinYangElement.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; gap: 3rem; padding: 2rem;">
      <div style="text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">☯</div>
        <div style="color: #ff6ec4; font-size: 1.5rem; font-weight: bold;">陰：${yinYang.陰}</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">☯</div>
        <div style="color: #7873f5; font-size: 1.5rem; font-weight: bold;">陽：${yinYang.陽}</div>
      </div>
    </div>
  `;
}

// 渲染神煞信息
function renderSpirits(spirits) {
  const narrativeElement = document.getElementById("narrative");
  if (!narrativeElement) return;
  
  const spiritsCard = document.createElement("div");
  spiritsCard.className = "spirits-card";
  spiritsCard.style.cssText = `
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 140, 0, 0.05));
    border: 2px solid rgba(255, 215, 0, 0.3);
    border-radius: 16px;
    padding: 2rem;
    margin-top: 2rem;
    backdrop-filter: blur(15px);
    box-shadow: 0 8px 32px rgba(255, 215, 0, 0.2);
  `;
  
  let spiritsHTML = `
    <h3 style="color: #ffd700; margin-bottom: 1.5rem; font-size: 1.6rem; text-align: center;">
      🌟 神煞兵符 🌟
    </h3>
    <div style="display: grid; gap: 1rem;">
  `;
  
  spirits.forEach(spirit => {
    spiritsHTML += `
      <div style="background: rgba(255, 215, 0, 0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid #ffd700;">
        <div style="color: #ffd700; font-weight: bold; margin-bottom: 0.5rem;">${spirit.name}</div>
        <div style="color: #ccc; font-size: 0.9rem; margin-bottom: 0.5rem;">類別: ${spirit.category}</div>
        <div style="color: #ddd; font-size: 0.9rem;">${spirit.why_matched}</div>
      </div>
    `;
  });
  
  spiritsHTML += `</div>`;
  spiritsCard.innerHTML = spiritsHTML;
  narrativeElement.appendChild(spiritsCard);
}

// 載入動畫
function showLoadingAnimation() {
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
  
  // 添加旋轉動畫
  const style = document.createElement("style");
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

// 原有的表單提交處理保留
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
  localStorage.setItem("birthData", JSON.stringify(input));
  
  const tone = localStorage.getItem("tone") || "default";
  
  try {
    const analysisData = await getFullBaziAnalysis(input, tone);
    localStorage.setItem("baziAnalysis", JSON.stringify(analysisData));
    await renderEnhancedResults(analysisData);
  } catch (error) {
    console.error("計算失敗：", error);
    const demoData = getDemoAnalysis(input, tone);
    await renderEnhancedResults(demoData);
  }
  
  hideLoadingAnimation();
});

function exportReport() {
  window.location.href = "report.html";
}
