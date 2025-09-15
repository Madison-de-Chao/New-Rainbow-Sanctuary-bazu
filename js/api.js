// 使用安全的全域變數宣告避免重複宣告錯誤
window.API_BASE = window.API_BASE || "https://rainbow-sanctuary-bazu-production.up.railway.app";

// 呼叫後端 API，取得敘事報告
async function fetchReport(pillars, tone = "default") {
  const res = await fetch(`${API_BASE}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pillars, tone })
  });

  if (!res.ok) throw new Error("API 回應失敗");
  return await res.json();
}

// 新增：從資料庫計算八字 - 使用正確的API端點
async function calculateBaziFromDatabase(birthData) {
  // 轉換為後端API期望的格式
  const apiData = {
    datetime_local: `${birthData.year}-${String(birthData.month).padStart(2, '0')}-${String(birthData.day).padStart(2, '0')}T${String(birthData.hour).padStart(2, '0')}:00:00`,
    timezone: "Asia/Taipei",
    longitude: 120.0,
    use_true_solar_time: false
  };

  const res = await fetch(`${API_BASE}/api/bazi/compute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(apiData)
  });

  if (!res.ok) throw new Error("八字計算失敗");
  return await res.json();
}

// 新增：從資料庫獲取完整八字分析
async function getFullBaziAnalysis(birthData, tone = "default") {
  try {
    const baziResult = await calculateBaziFromDatabase(birthData);
    
    // 轉換後端數據格式為前端期望的格式
    const analysisData = convertBackendToFrontend(baziResult.data, tone);
    return analysisData;
  } catch (error) {
    console.warn("資料庫API暫時無法使用，使用演示數據：", error);
    return getDemoAnalysis(birthData, tone);
  }
}

// 轉換後端API數據格式為前端期望的格式
function convertBackendToFrontend(backendData, tone = "default") {
  const toneStyles = {
    "military": { prefix: "將軍", suffix: "，準備迎接人生戰場的挑戰！", style: "軍事化" },
    "healing": { prefix: "療癒師", suffix: "，用溫柔的力量撫慰世界。", style: "溫柔療癒" },
    "poetic": { prefix: "詩人", suffix: "，如詩如畫般綻放生命之美。", style: "詩意美學" },
    "mythic": { prefix: "神話使者", suffix: "，承載著古老的神秘力量。", style: "神話傳說" },
    "default": { prefix: "守護者", suffix: "，在人生道路上勇敢前行。", style: "平衡" }
  };

  const currentTone = toneStyles[tone] || toneStyles.default;
  
  // 轉換四柱數據
  const pillars = {
    年: {
      pillar: backendData.four_pillars.year.stem + backendData.four_pillars.year.branch,
      gan: backendData.four_pillars.year.stem,
      zhi: backendData.four_pillars.year.branch
    },
    月: {
      pillar: backendData.four_pillars.month.stem + backendData.four_pillars.month.branch,
      gan: backendData.four_pillars.month.stem,
      zhi: backendData.four_pillars.month.branch
    },
    日: {
      pillar: backendData.four_pillars.day.stem + backendData.four_pillars.day.branch,
      gan: backendData.four_pillars.day.stem,
      zhi: backendData.four_pillars.day.branch
    },
    時: {
      pillar: backendData.four_pillars.hour.stem + backendData.four_pillars.hour.branch,
      gan: backendData.four_pillars.hour.stem,
      zhi: backendData.four_pillars.hour.branch
    }
  };

  // 轉換五行統計
  const fiveElements = backendData.five_elements_stats.elements_count;

  return {
    chart: {
      pillars: pillars,
      fiveElements: fiveElements,
      yinYang: {
        陰: Math.round(Object.values(fiveElements).reduce((a, b) => a + b, 0) * 0.4),
        陽: Math.round(Object.values(fiveElements).reduce((a, b) => a + b, 0) * 0.6)
      }
    },
    narrative: {
      年: {
        commander: `${pillars.年.gan}${pillars.年.zhi}${currentTone.prefix}`,
        strategist: backendData.ten_gods.year_stem || "智慧軍師",
        naYin: "路旁土", // 可以後續從後端獲取
        story: `年柱${pillars.年.pillar}代表你的根基與出身，${currentTone.prefix}的特質在你身上展現${currentTone.suffix}`
      },
      月: {
        commander: `${pillars.月.gan}${pillars.月.zhi}${currentTone.prefix}`,
        strategist: backendData.ten_gods.month_stem || "青春導師",
        naYin: "白鑞金",
        story: `月柱${pillars.月.pillar}展現你青年時期的特質，${currentTone.prefix}的智慧指引你前行${currentTone.suffix}`
      },
      日: {
        commander: `${pillars.日.gan}${pillars.日.zhi}${currentTone.prefix}`,
        strategist: backendData.ten_gods.day_stem || "核心本質",
        naYin: "海中金",
        story: `日柱${pillars.日.pillar}是你的核心本質，${currentTone.prefix}的力量從內心散發${currentTone.suffix}`
      },
      時: {
        commander: `${pillars.時.gan}${pillars.時.zhi}${currentTone.prefix}`,
        strategist: backendData.ten_gods.hour_stem || "未來戰士",
        naYin: "天河水",
        story: `時柱${pillars.時.pillar}預示你的未來發展，${currentTone.prefix}的潛能將在晚年綻放${currentTone.suffix}`
      }
    },
    spirits: backendData.spirits || [],
    calculation_log: backendData.calculation_log,
    data_provenance: backendData.data_provenance
  };
}

// 演示數據生成器
function getDemoAnalysis(birthData, tone = "default") {
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
  
  // 使用sample.json中的數據作為演示
  return {
    chart: {
      pillars: {
        年: {
          pillar: "庚午",
          gan: "庚",
          zhi: "午"
        },
        月: {
          pillar: "辛巳",
          gan: "辛",
          zhi: "巳"
        },
        日: {
          pillar: "甲子",
          gan: "甲",
          zhi: "子"
        },
        時: {
          pillar: "丙午",
          gan: "丙",
          zhi: "午"
        }
      },
      fiveElements: {
        金: 2,
        木: 1,
        水: 1,
        火: 3,
        土: 1
      },
      yinYang: {
        陰: 3,
        陽: 5
      }
    },
    narrative: {
      年: {
        commander: `金馬${currentTone.prefix}`,
        strategist: "堅韌軍師",
        naYin: "路旁土",
        story: `🛡️【年柱軍團｜庚午】

你正在召喚你的年柱軍團，他們源自「路旁土」之地，象徵你在家族脈絡與社會舞台的主題挑戰與能量場。

主將「鋼鐵騎士」由庚領軍，展現你的核心性格與行動力，在此柱中扮演領導者角色，承載著家族的力量與傳承，如鋼鐵般堅韌不拔。

軍師「烈馬騎兵」來自午，擅長策略與支援，引導軍團方向，象徵你在家族領域的智慧與應變能力，具備快速行動的特質。

副將群包括藏干力量，分別掌管不同能量面向，形成多元支援系統，象徵你的潛在資源與內在動力。

此柱的十神為「比肩」，自我推進、競爭力強，在社會舞台中以此特質為核心優勢。

🔑 一句兵法建議：社會舞台中，善用鋼鐵騎士與烈馬騎兵的特質，發揮家族資源底盤的優勢。`
      },
      月: {
        commander: `金蛇${currentTone.prefix}`,
        strategist: "智慧導師", 
        naYin: "白鑞金",
        story: `🛡️【月柱軍團｜辛巳】

你正在召喚你的月柱軍團，他們源自「白鑞金」之地，象徵你在成長歷程與關係資源的主題挑戰與能量場。

主將「珠寶商人」由辛領軍，展現你的核心性格與行動力，在此柱中扮演領導者角色，承載著精緻與品味的特質，如珠寶般珍貴而有價值。

軍師「火蛇術士」來自巳，擅長策略與支援，引導軍團方向，象徵你在關係領域的智慧與應變能力，具備敏銳洞察的特質。

副將群包括藏干力量，分別掌管不同能量面向，形成多元支援系統，象徵你的潛在資源與內在動力。

此柱的十神為「正官」，紀律責任、制度資源，在關係資源中以此特質為核心優勢。

🔑 一句兵法建議：關係資源中，善用珠寶商人與火蛇術士的特質，發揮成長軍團的策略優勢。`
      },
      日: {
        commander: `木鼠${currentTone.prefix}`,
        strategist: "機智先鋒",
        naYin: "海中金", 
        story: `🛡️【日柱軍團｜甲子】

你正在召喚你的日柱軍團，他們源自「海中金」之地，象徵你的核心本質與自我認知的主題挑戰與能量場。

主將「森林將軍」由甲領軍，展現你的核心性格與行動力，在此柱中扮演領導者角色，你就是主將，性格引擎、決策邏輯與戰場感知都在這裡。

軍師「夜行刺客」來自子，擅長策略與支援，引導軍團方向，象徵你在自我核心的智慧與應變能力，具備敏銳直覺的特質。

副將群包括藏干力量，分別掌管不同能量面向，形成多元支援系統，象徵你的潛在資源與內在動力。

此柱的十神為「日主」，自我核心、主導能力，在核心軍團中以此特質為絕對優勢。

🔑 一句兵法建議：自我核心中，善用森林將軍與夜行刺客的特質，發揮核心軍團的主導優勢。`
      },
      時: {
        commander: `火馬${currentTone.prefix}`,
        strategist: "熱情戰士",
        naYin: "天河水",
        story: `🛡️【時柱軍團｜丙午】

你正在召喚你的時柱軍團，他們源自「天河水」之地，象徵你在未來願景與成果呈現的主題挑戰與能量場。

主將「烈日戰神」由丙領軍，展現你的核心性格與行動力，在此柱中扮演領導者角色，承載著熱情與創造的特質，如烈日般光芒四射。

軍師「烈馬騎兵」來自午，擅長策略與支援，引導軍團方向，象徵你在未來領域的智慧與應變能力，具備快速行動的特質。

副將群包括藏干力量，分別掌管不同能量面向，形成多元支援系統，象徵你的潛在資源與內在動力。

此柱的十神為「食神」，創造表達、福氣延展，在未來軍團中以此特質為核心優勢。

🔑 一句兵法建議：未來願景中，善用烈日戰神與烈馬騎兵的特質，發揮未來軍團的創造優勢。`
      }
    }
  };
}

// 點擊「開始召喚你的軍團」時執行 - 保留作為備用方法
function enterSiteOld() {
  const tone = document.getElementById("tone").value;

  // 暫時使用固定四柱資料（你之後可以改成使用者輸入）
  const pillars = {
    year: { gan: "甲", zhi: "子", pillar: "甲子" },
    month: { gan: "丙", zhi: "寅", pillar: "丙寅" },
    day: { gan: "戊", zhi: "午", pillar: "戊午" },
    hour: { gan: "庚", zhi: "申", pillar: "庚申" }
  };

  // 顯示 loading 或遮罩（可選）
  document.querySelector(".enter-btn").innerText = "召喚中...";

  fetchReport(pillars, tone)
    .then(data => {
      console.log("敘事結果：", data);

      // 你可以在這裡跳轉頁面或顯示結果
      alert("召喚成功！請查看控制台結果");
      document.querySelector(".enter-btn").innerText = "開始召喚你的軍團";
    })
    .catch(err => {
      console.error("API 錯誤", err);
      alert("召喚失敗，請稍後再試");
      document.querySelector(".enter-btn").innerText = "開始召喚你的軍團";
    });
}
// 動態生成年份選單
window.addEventListener("DOMContentLoaded", () => {
  const yearSelect = document.getElementById("birth-year");
  if (yearSelect) {
    for (let y = 1900; y <= new Date().getFullYear(); y++) {
      const opt = document.createElement("option");
      opt.value = y;
      opt.textContent = y + "年";
      yearSelect.appendChild(opt);
    }
  }

  const monthSelect = document.getElementById("birth-month");
  if (monthSelect) {
    for (let m = 1; m <= 12; m++) {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m + "月";
      monthSelect.appendChild(opt);
    }
  }

  const daySelect = document.getElementById("birth-day");
  if (daySelect) {
    for (let d = 1; d <= 31; d++) {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d + "日";
      daySelect.appendChild(opt);
    }
  }
});

// 主召喚函式 - 使用資料庫計算
async function enterSite() {
  const toneElement = document.getElementById("tone");
  const yearElement = document.getElementById("birth-year");
  const monthElement = document.getElementById("birth-month");
  const dayElement = document.getElementById("birth-day");
  const hourElement = document.getElementById("birth-hour");

  // Check if elements exist (for compatibility with different pages)
  if (!toneElement || !yearElement || !monthElement || !dayElement || !hourElement) {
    console.warn("Birth form elements not found, skipping enterSite function");
    return;
  }

  const tone = toneElement.value;
  const y = parseInt(yearElement.value);
  const m = parseInt(monthElement.value);
  const d = parseInt(dayElement.value);
  const h = parseInt(hourElement.value);

  if (!y || !m || !d || isNaN(h)) {
    alert("請完整輸入出生年月日時");
    return;
  }

  // 準備出生資料
  const birthData = {
    year: y,
    month: m,
    day: d,
    hour: h,
    tone: tone
  };

  document.querySelector(".enter-btn").innerText = "召喚中...";
  document.querySelector(".enter-btn").disabled = true;

  try {
    // 從資料庫獲取完整八字分析
    const analysisData = await getFullBaziAnalysis(birthData, tone);
    
    console.log("八字分析結果：", analysisData);
    
    // 保存數據到 localStorage 以便其他頁面使用
    localStorage.setItem("baziAnalysis", JSON.stringify(analysisData));
    localStorage.setItem("tone", tone);
    
    // 跳轉到結果頁面
    window.location.href = "bazi.html";
    
  } catch (err) {
    console.error("API 錯誤", err);
    alert("召喚失敗，請稍後再試: " + err.message);
    document.querySelector(".enter-btn").innerText = "開始召喚你的軍團";
    document.querySelector(".enter-btn").disabled = false;
  }
}
