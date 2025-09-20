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

// C. 防止重複渲染的狀態管理 - 使用全域變數避免重複宣告
window.rendering = window.rendering || false;

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

// Enhanced App - Initialization Function
window.initializeEnhancedApp = function() {
  console.log("Initializing Enhanced App...");
  
  // Main initialization logic here
  processStoredData();
};

// Process stored data and initialize UI
async function processStoredData() {
  console.log("Enhanced app loaded");

  // 綁定表單提交事件
  const form = document.getElementById('bazi-form');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      console.log('Form submitted');

      // 收集表單數據
      const formData = new FormData(form);
      const data = {
        userName: formData.get('user-name') || '',
        gender: formData.get('gender') || '',
        year: parseInt(formData.get('yyyy')),
        month: parseInt(formData.get('mm')),
        day: parseInt(formData.get('dd')),
        hour: parseInt(formData.get('hh')),
        zMode: formData.get('zMode') || 'none'
      };

      console.log('Form data:', data);

      // 顯示載入動畫
      showLoadingAnimation();

      try {
        // 調用後端API
        const result = await getFullBaziAnalysis(data);
        console.log('API result:', result);

        // 顯示結果區域
        const resultSection = document.getElementById('result');
        if (resultSection) {
          resultSection.style.display = 'block';
        }

        // 渲染結果
        await renderEnhancedResultsOnce(result);

        // 保存數據
        storage.setItem('baziAnalysis', JSON.stringify(result));
        storage.setItem('birthData', JSON.stringify(data));

      } catch (error) {
        console.error('Error:', error);
        if (window.showFriendlyError) {
          window.showFriendlyError('計算過程遇到問題，請稍後再試 🔮');
        } else {
          alert('計算失敗，請稍後再試');
        }
      }

      hideLoadingAnimation();
    });
  }

  // 載入保存的數據到表單
  const savedData = storage.getItem('birthData');
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      const userNameInput = document.querySelector('input[name="user-name"]');
      const genderSelect = document.querySelector('select[name="gender"]');
      const yearInput = document.querySelector('input[name="yyyy"]');
      const monthInput = document.querySelector('input[name="mm"]');
      const dayInput = document.querySelector('input[name="dd"]');
      const hourInput = document.querySelector('input[name="hh"]');

      if (userNameInput && data.userName) userNameInput.value = data.userName;
      if (genderSelect && data.gender) genderSelect.value = data.gender;
      if (yearInput && data.year) yearInput.value = data.year;
      if (monthInput && data.month) monthInput.value = data.month;
      if (dayInput && data.day) dayInput.value = data.day;
      if (hourInput && data.hour) hourInput.value = data.hour;
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }

  // Load existing analysis data from storage
  const baziAnalysis = storage.getItem("baziAnalysis");
  const birthData = storage.getItem("birthData");
  
  if (baziAnalysis) {
    try {
      const data = JSON.parse(baziAnalysis);
      console.log("Found cached data:", data);

      if (data.chart && data.narrative) {
        // Hide loading and show results
        hideLoadingScreen();
        showResultSection();
        await renderEnhancedResultsOnce(data);
      } else {
        console.log("Incomplete data, will generate when user submits");
        await processStoredBirthData();
      }
    } catch (error) {
      console.error("Error parsing cached data:", error);
      await processStoredBirthData();
    }
  } else if (birthData) {
    console.log("No cached analysis data, but found birth data. Processing...");
    await processStoredBirthData();
  } else {
    console.log("No cached data, waiting for user input...");
    hideLoadingScreen();
  }

  // Process stored birth data if available
  async function processStoredBirthData() {
    const storedBirthData = storage.getItem("birthData");
    const tone = storage.getItem("tone") || "default";
    
    if (storedBirthData) {
      try {
        const birthDataObj = JSON.parse(storedBirthData);
        console.log("Processing birth data:", birthDataObj);
        
        // Get fresh analysis
        const analysisData = await getFullBaziAnalysis(birthDataObj, tone);
        
        // Store the analysis
        storage.setItem("baziAnalysis", JSON.stringify(analysisData));
        
        // Hide loading and show results
        hideLoadingScreen();
        showResultSection();
        
        // Render results
        await renderEnhancedResultsOnce(analysisData);
        
      } catch (error) {
        console.error("Error processing birth data:", error);
        // Show error and allow user to try again
        hideLoadingScreen();
        if (window.showFriendlyError) {
          window.showFriendlyError("計算失敗，請返回重新輸入 🔄");
        } else {
          showErrorMessage("計算失敗，請返回重新輸入");
        }
      }
    } else {
      hideLoadingScreen();
    }
  }

  // Helper functions for UI state management
  function hideLoadingScreen() {
    const loadingElement = document.getElementById("loading");
    if (loadingElement) {
      loadingElement.style.display = "none";
    }
  }

  function showResultSection() {
    const resultElement = document.getElementById("result");
    if (resultElement) {
      resultElement.style.display = "block";
    }
  }

  function showErrorMessage(message) {
    const loadingElement = document.getElementById("loading");
    if (loadingElement) {
      loadingElement.innerHTML = `
        <h2 style="color: #ff6ec4;">${message}</h2>
        <button id="goBackBtn" class="error-back-btn">返回重新輸入</button>
      `;
      // Attach event listener
      const btn = loadingElement.querySelector("#goBackBtn");
      if (btn) {
        btn.addEventListener("click", function() {
          if (typeof goBack === "function") {
            goBack();
          } else {
            console.warn("goBack function is not defined");
          }
        });
      }
      // Inject CSS for the button if not already present
      if (!document.getElementById("error-back-btn-style")) {
        const style = document.createElement("style");
        style.id = "error-back-btn-style";
        style.textContent = `
          .error-back-btn {
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background: #ff6ec4;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }
};

// 生成豐富故事內容的演示數據
function getRichDemoAnalysis(birthData, tone = "default") {
  const toneStyles = {
    "military": {
      prefix: "將軍",
      suffix: "，準備迎接人生戰場的挑戰！",
      style: "軍事化"
    },
    "healing": {
      prefix: "療癒師",
      suffix: "，用溫柔的力量撫慰世界。",
      style: "溫柔療癒"
    },
    "poetic": {
      prefix: "詩人",
      suffix: "，如詩如畫般綻放生命之美。",
      style: "詩意美學"
    },
    "mythic": {
      prefix: "神話使者",
      suffix: "，承載著古老的神秘力量。",
      style: "神話傳說"
    },
    "default": {
      prefix: "守護者",
      suffix: "，在人生道路上勇敢前行。",
      style: "平衡"
    }
  };

  const currentTone = toneStyles[tone] || toneStyles.default;

  return {
    chart: {
      pillars: {
        年: { pillar: "庚午", gan: "庚", zhi: "午" },
        月: { pillar: "辛巳", gan: "辛", zhi: "巳" },
        日: { pillar: "甲子", gan: "甲", zhi: "子" },
        時: { pillar: "丙午", gan: "丙", zhi: "午" }
      },
      fiveElements: { 金: 2, 木: 1, 水: 1, 火: 3, 土: 1 },
      yinYang: { 陰: 3, 陽: 5 }
    },
    narrative: {
      年: {
        commander: `金馬${currentTone.prefix}`,
        strategist: "堅韌軍師",
        naYin: "路旁土",
        story: `出生於${birthData.year}年的你，如金馬奔騰般充滿勇氣與決心。年柱金馬${currentTone.prefix}代表你的根基扎實穩固，無論面對什麼人生挑戰都能勇敢前行。你的性格中蘊含著金屬般的堅韌不拔，如同戰馬般勇往直前，永不退縮。這份天生的領導氣質將伴隨你一生，成為你最珍貴的財富${currentTone.suffix}`
      },
      月: {
        commander: `金蛇${currentTone.prefix}`,
        strategist: "智慧導師",
        naYin: "白鑞金",
        story: `青春時期的金蛇${currentTone.prefix}賦予你敏銳的洞察力和超凡的智慧。你善於在複雜的情況中找到最佳的解決方案，智慧如蛇般靈活多變。這個階段的你學會了如何在人際關係中游刃有餘，既能保持自己的原則，又能適應環境的變化。你的思維敏捷，總能在關鍵時刻做出正確的判斷${currentTone.suffix}`
      },
      日: {
        commander: `木鼠${currentTone.prefix}`,
        strategist: "機智先鋒",
        naYin: "海中金",
        story: `你的核心本質如機智的木鼠，外表溫和謙遜但內心充滿無限活力。日柱木鼠${currentTone.prefix}象徵你的適應能力極強，能在任何環境中茁壯成長。你擁有敏銳的商業嗅覺和創新思維，總能發現別人忽略的機會。這份天賦讓你在人生的各個階段都能找到屬於自己的道路，創造出獨特的價值${currentTone.suffix}`
      },
      時: {
        commander: `火馬${currentTone.prefix}`,
        strategist: "熱情戰士",
        naYin: "天河水",
        story: `晚年的火馬${currentTone.prefix}讓你永遠保持青春的熱情和活力，對生活充滿好奇心和冒險精神。你是天生的領導者，能夠激勵身邊的人追求更高的目標。即使歲月流逝，你的內心依然燃燒著不滅的火焰，這份熱情將成為你人生最後階段的最大財富。你的智慧和經驗將如天河之水般源源不絕，滋養著後代${currentTone.suffix}`
      }
    }
  };
}

// 生成新的八字數據
async function generateFreshData() {
  // Get stored birth data instead of using hardcoded values
  const storedBirthData = storage.getItem("birthData");
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

    // Store data for legion page
    localStorage.setItem('baziAnalysisData', JSON.stringify(data));

    // 渲染增強版四柱卡片
    await renderEnhancedPillars(data.chart.pillars);

    // 渲染十神分析
    renderTenGodsDisplay(data.chart.pillars);

    // 渲染納音五行
    renderNayinDisplay(data.chart.pillars);

    // 計算並顯示神煞信息
    if (window.calculateAllShensha && data.chart && data.chart.pillars) {
      const pillars = {
        年: { gan: data.chart.pillars.年.gan, zhi: data.chart.pillars.年.zhi },
        月: { gan: data.chart.pillars.月.gan, zhi: data.chart.pillars.月.zhi },
        日: { gan: data.chart.pillars.日.gan, zhi: data.chart.pillars.日.zhi },
        時: { gan: data.chart.pillars.時.gan, zhi: data.chart.pillars.時.zhi }
      };

      const shenshaList = window.calculateAllShensha(pillars);
      const formattedShensha = window.formatShenshaForDisplay(shenshaList);
      renderEnhancedShenshaInfo(formattedShensha, pillars);
    }

    // 渲染五行圖表 - 使用安全的Chart.js渲染
    await renderSafeFiveElementsChart(data.chart.fiveElements);

    // 渲染陰陽統計
    renderEnhancedYinYang(data.chart.yinYang);

    // 渲染敘事內容 - 添加打字機效果
    await renderAnimatedNarrative(data.narrative);

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
    const data = narrative[pillarName];
    if (!data) continue;

    const card = document.createElement("div");
    card.className = "narrative-card";
    card.style.cssText = `
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
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
        ${pillarName}柱 · ${data.commander || data.title || '守護者'}
      </h3>
      <div style="display: flex; gap: 2rem; margin-bottom: 1rem;">
        <div style="color: ${colors[i]}; font-weight: bold;">軍師：${data.strategist || data.relation || '未知'}</div>
        <div style="color: ${colors[i]}; font-weight: bold;">納音：${data.naYin || data.nayin || '未知'}</div>
      </div>
      <p style="color: #ccc; line-height: 1.6; font-size: 1rem;">
        ${data.story || data.description || '暫無描述'}
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

  // 處理不同的數據結構
  let yinCount = 0, yangCount = 0;

  if (yinYang && typeof yinYang === 'object') {
    yinCount = yinYang.yin || yinYang.陰 || 0;
    yangCount = yinYang.yang || yinYang.陽 || 0;
  }

  // 如果沒有數據，使用默認值
  if (yinCount === 0 && yangCount === 0) {
    yinCount = 3;
    yangCount = 4;
  }

  yinYangElement.innerHTML = `
    <div style="display: flex; justify-content: center; gap: 2rem; align-items: center;">
      <div style="text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">☯</div>
        <div style="color: #ff6ec4; font-size: 1.2rem; font-weight: bold;">陰：${yinCount}</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">☯</div>
        <div style="color: #7873f5; font-size: 1.2rem; font-weight: bold;">陽：${yangCount}</div>
      </div>
    </div>
  `;
}

// 安全的神煞信息渲染
function renderSpirits(spirits) {
  const shenshaElement = ensureElement("#shensha-info", "shensha-info");

  if (!spirits || spirits.length === 0) {
    shenshaElement.innerHTML = '<div style="color: #888;">暫無神煞信息</div>';
    return;
  }

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

  // 處理神煞數據，確保正確顯示
  let spiritsContent = '';
  if (Array.isArray(spirits)) {
    spiritsContent = spirits.map(spirit => {
      if (typeof spirit === 'string') {
        return `<div style="margin-bottom: 0.5rem;">• ${spirit}</div>`;
      } else if (spirit && spirit.name) {
        return `<div style="margin-bottom: 0.5rem;">• ${spirit.name}${spirit.description ? ': ' + spirit.description : ''}</div>`;
      } else {
        return `<div style="margin-bottom: 0.5rem;">• ${JSON.stringify(spirit)}</div>`;
      }
    }).join('');
  } else {
    spiritsContent = `<div style="margin-bottom: 0.5rem;">• ${spirits}</div>`;
  }

  spiritsCard.innerHTML = `
    <h3 style="color: #ffd700; margin-bottom: 1rem; font-size: 1.5rem;">神煞信息</h3>
    <div style="color: #ccc; line-height: 1.6;">
      ${spiritsContent}
    </div>
  `;

  shenshaElement.innerHTML = '';
  shenshaElement.appendChild(spiritsCard);
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

// Go back to the main form
function goBack() {
  // Clear stored data
  storage.removeItem("baziAnalysis");
  storage.removeItem("birthData");
  
  // Redirect to main page
  window.location.href = "index.html";
}



// 渲染神煞信息
function renderShenshaInfo(shenshaList) {
  const narrativeElement = ensureElement("#narrative", "narrative");

  const shenshaCard = document.createElement("div");
  shenshaCard.className = "shensha-card";
  shenshaCard.style.cssText = `
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 16px;
    padding: 2rem;
    margin-top: 2rem;
    backdrop-filter: blur(10px);
    transform: translateY(30px);
    opacity: 0;
    transition: all 0.6s ease;
  `;

  const shenshaContent = shenshaList.map(shensha => {
    const categoryColor = {
      '吉神': '#4ade80',
      '桃花': '#f472b6',
      '動星': '#60a5fa',
      '凶煞': '#f87171',
      '中性': '#a3a3a3'
    }[shensha.category] || '#ffd700';

    const pillarText = shensha.pillars.length > 0 ?
      ` <span style="color: ${categoryColor}; font-size: 0.9rem;">(${shensha.pillars.join('、')}柱)</span>` : '';

    return `
      <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 8px; border-left: 4px solid ${categoryColor};">
        <div style="color: ${categoryColor}; font-weight: bold; margin-bottom: 0.5rem;">
          ${shensha.name}${pillarText}
        </div>
        <div style="color: #fff; font-size: 0.95rem; margin-bottom: 0.3rem;">
          ${shensha.effect}
        </div>
        <div style="color: #ccc; font-size: 0.85rem; line-height: 1.4;">
          ${shensha.description}
        </div>
      </div>
    `;
  }).join('');

  shenshaCard.innerHTML = `
    <h3 style="color: #ffd700; margin-bottom: 1.5rem; font-size: 1.5rem; text-align: center;">
      🔮 神煞信息
    </h3>
    <div style="line-height: 1.6;">
      ${shenshaContent}
    </div>
  `;

  narrativeElement.appendChild(shenshaCard);

  // 延遲動畫
  setTimeout(() => {
    shenshaCard.style.transform = "translateY(0)";
    shenshaCard.style.opacity = "1";
  }, 100);
}

// Enhanced Four Pillars Rendering
async function renderEnhancedPillars(pillars) {
  const pillarsElement = ensureElement("#pillars", "pillars");
  pillarsElement.innerHTML = "";

  const pillarNames = ["年", "月", "日", "時"];
  const colors = ["#ff6ec4", "#7873f5", "#00d4ff", "#ff9500"];
  const classes = ["year-pillar", "month-pillar", "day-pillar", "hour-pillar"];

  for (let i = 0; i < pillarNames.length; i++) {
    const pillarName = pillarNames[i];
    const pillar = pillars[pillarName];
    if (!pillar) continue;

    const card = document.createElement("div");
    card.className = `pillar-card ${classes[i]}`;
    card.style.cssText = `
      transform: translateY(50px) scale(0.8);
      opacity: 0;
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    const nayin = getNayinForPillar(pillar.gan, pillar.zhi);
    const tenGod = getTenGodForPillar(pillarName, pillar);

    card.innerHTML = `
      <div class="pillar-title" style="color: ${colors[i]};">
        ${pillarName}柱軍團
      </div>
      <div class="pillar-main">
        ${pillar.pillar || pillar.gan + pillar.zhi}
      </div>
      <div class="pillar-details">
        <div class="detail-item">
          <div class="detail-label">天干</div>
          <div class="detail-value">${pillar.gan}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">地支</div>
          <div class="detail-value">${pillar.zhi}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">納音</div>
          <div class="detail-value">${nayin}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">十神</div>
          <div class="detail-value">${tenGod}</div>
        </div>
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

// Ten Gods Display
function renderTenGodsDisplay(pillars) {
  const container = ensureElement("#ten-gods-display", "ten-gods-display");
  container.innerHTML = "";

  const pillarNames = ["年", "月", "日", "時"];
  
  pillarNames.forEach(pillarName => {
    const pillar = pillars[pillarName];
    if (!pillar) return;

    const tenGod = getTenGodForPillar(pillarName, pillar);
    const meaning = getTenGodMeaning(tenGod);

    const item = document.createElement("div");
    item.className = "ten-god-item";
    item.innerHTML = `
      <div class="ten-god-name">${tenGod}</div>
      <div class="ten-god-pillar">${pillarName}柱 - ${pillar.gan}${pillar.zhi}</div>
      <div class="ten-god-meaning">${meaning}</div>
    `;
    
    container.appendChild(item);
  });
}

// Nayin Display
function renderNayinDisplay(pillars) {
  const container = ensureElement("#nayin-display", "nayin-display");
  container.innerHTML = "";

  const pillarNames = ["年", "月", "日", "時"];
  
  pillarNames.forEach(pillarName => {
    const pillar = pillars[pillarName];
    if (!pillar) return;

    const nayin = getNayinForPillar(pillar.gan, pillar.zhi);
    const meaning = getNayinMeaning(nayin);

    const item = document.createElement("div");
    item.className = "nayin-item";
    item.innerHTML = `
      <div class="nayin-pillar">${pillarName}柱 - ${pillar.gan}${pillar.zhi}</div>
      <div class="nayin-name">${nayin}</div>
      <div class="nayin-meaning">${meaning}</div>
    `;
    
    container.appendChild(item);
  });
}

// Enhanced Shensha Info
function renderEnhancedShenshaInfo(shenshaData, pillars) {
  const container = ensureElement("#shensha-info", "shensha-info");
  container.innerHTML = "";

  if (!shenshaData || shenshaData.length === 0) {
    container.innerHTML = '<div style="text-align: center; color: #ccc;">暫無神煞信息</div>';
    return;
  }

  shenshaData.forEach(shensha => {
    const item = document.createElement("div");
    item.className = "shensha-item";
    
    const effect = window.SHENSHA_EFFECTS?.[shensha.name] || '特殊神煞，影響命運走向';
    
    item.innerHTML = `
      <div class="shensha-name">${shensha.name}</div>
      <div class="shensha-pillar">${shensha.pillar || '多柱'}出現</div>
      <div class="shensha-effect">${effect}</div>
    `;
    
    container.appendChild(item);
  });
}

// Enhanced Yin Yang Display
function renderEnhancedYinYang(yinYang) {
  const container = ensureElement("#yinyang", "yinyang");
  
  // 處理不同的數據結構
  let yinCount = 0, yangCount = 0;

  if (yinYang && typeof yinYang === 'object') {
    yinCount = yinYang.yin || yinYang.陰 || 0;
    yangCount = yinYang.yang || yinYang.陽 || 0;
  }

  // 如果沒有數據，使用默認值
  if (yinCount === 0 && yangCount === 0) {
    yinCount = 3;
    yangCount = 5;
  }

  container.innerHTML = `
    <div class="yin-yang-item">
      <div class="yin-yang-label">陰</div>
      <div class="yin-yang-value">${yinCount}</div>
    </div>
    <div class="yin-yang-item">
      <div class="yin-yang-label">陽</div>
      <div class="yin-yang-value">${yangCount}</div>
    </div>
  `;
}

// Helper functions
function getNayinForPillar(gan, zhi) {
  const nayinTable = {
    '甲子': '海中金', '乙丑': '海中金', '丙寅': '爐中火', '丁卯': '爐中火',
    '戊辰': '大林木', '己巳': '大林木', '庚午': '路旁土', '辛未': '路旁土',
    '壬申': '劍鋒金', '癸酉': '劍鋒金', '甲戌': '山頭火', '乙亥': '山頭火',
    '丙子': '澗下水', '丁丑': '澗下水', '戊寅': '城牆土', '己卯': '城牆土',
    '庚辰': '白臘金', '辛巳': '白臘金', '壬午': '楊柳木', '癸未': '楊柳木',
    '甲申': '泉中水', '乙酉': '泉中水', '丙戌': '屋上土', '丁亥': '屋上土',
    '戊子': '霹靂火', '己丑': '霹靂火', '庚寅': '松柏木', '辛卯': '松柏木',
    '壬辰': '長流水', '癸巳': '長流水', '甲午': '砂石金', '乙未': '砂石金',
    '丙申': '山下火', '丁酉': '山下火', '戊戌': '平地木', '己亥': '平地木',
    '庚子': '壁上土', '辛丑': '壁上土', '壬寅': '金箔金', '癸卯': '金箔金',
    '甲辰': '覆燈火', '乙巳': '覆燈火', '丙午': '天河水', '丁未': '天河水',
    '戊申': '大驛土', '己酉': '大驛土', '庚戌': '釵釧金', '辛亥': '釵釧金',
    '壬子': '桑柘木', '癸丑': '桑柘木', '甲寅': '大溪水', '乙卯': '大溪水',
    '丙辰': '砂中土', '丁巳': '砂中土', '戊午': '天上火', '己未': '天上火',
    '庚申': '石榴木', '辛酉': '石榴木', '壬戌': '大海水', '癸亥': '大海水'
  };
  return nayinTable[gan + zhi] || '未知納音';
}

function getTenGodForPillar(pillarName, pillar) {
  // 簡化的十神判斷，實際應該根據日柱天干來計算
  const ganRelations = {
    '甲': '劫財', '乙': '比肩', '丙': '食神', '丁': '傷官',
    '戊': '偏財', '己': '正財', '庚': '七殺', '辛': '正官',
    '壬': '偏印', '癸': '正印'
  };
  return ganRelations[pillar.gan] || '待分析';
}

function getTenGodMeaning(god) {
  const meanings = {
    '比肩': '競爭意識、獨立自主',
    '劫財': '爭奪資源、冒險精神', 
    '食神': '創造表達、享受生活',
    '傷官': '創新變革、不守成規',
    '偏財': '商業頭腦、投機取巧',
    '正財': '穩健理財、勤勞致富',
    '七殺': '威嚴權威、競爭壓力',
    '正官': '責任法制、正直品格',
    '偏印': '學習能力、直覺靈感',
    '正印': '保護支持、學術文化'
  };
  return meanings[god] || '特殊命理特質';
}

function getNayinMeaning(nayin) {
  const meanings = {
    '海中金': '深藏不露的珍貴才華',
    '爐中火': '熱情洋溢的創造力',
    '大林木': '茂盛成長的生命力',
    '路旁土': '默默承載的責任感',
    '劍鋒金': '銳利果決的行動力',
    '山頭火': '光明照耀的領導力',
    '澗下水': '清澈純淨的智慧',
    '城牆土': '堅固可靠的防護力',
    '白臘金': '溫潤優雅的品格',
    '楊柳木': '柔韌適應的能力',
    '泉中水': '源源不絕的創意',
    '屋上土': '穩固支撐的力量',
    '霹靂火': '瞬間爆發的能量',
    '松柏木': '堅韌不拔的意志',
    '長流水': '持續不斷的動力',
    '砂石金': '堅實可靠的品質',
    '山下火': '溫暖照明的特質',
    '平地木': '廣闊包容的胸懷',
    '壁上土': '保護守護的精神',
    '金箔金': '華美精緻的品味',
    '覆燈火': '照亮他人的使命',
    '天河水': '浩瀚廣大的格局',
    '大驛土': '承載萬物的能力',
    '釵釧金': '精美雅緻的魅力',
    '桑柘木': '默默付出的奉獻',
    '大溪水': '奔流不息的活力',
    '砂中土': '滋養生命的力量',
    '天上火': '光明普照的能量',
    '石榴木': '豐碩成果的象徵',
    '大海水': '包容一切的氣度'
  };
  return meanings[nayin] || '獨特的命格特質';
}

// Add navigation to detailed stories
function viewDetailedStories() {
  window.location.href = 'legion.html';
}

