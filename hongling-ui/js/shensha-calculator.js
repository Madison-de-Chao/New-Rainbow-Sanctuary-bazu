// 神煞計算模組
// 完整的八字神煞計算和效果描述

// 神煞效果描述資料庫
const SHENSHA_EFFECTS = {
  // 吉神
  "天乙貴人": {
    effect: "逢兇化吉、得貴相助",
    description: "命中有貴人相助，遇到困難時容易得到他人幫助，化險為夷。",
    category: "吉神"
  },
  "文昌": {
    effect: "學習能力、文采出眾", 
    description: "聰明好學，文思敏捷，在學業和文字工作方面有特殊天賦。",
    category: "吉神"
  },
  "華蓋": {
    effect: "藝術天賦、獨特品味",
    description: "具有藝術天分和獨特審美，喜歡宗教、哲學等精神層面的事物。",
    category: "吉神"
  },
  "金輿": {
    effect: "財富運勢、物質豐富",
    description: "物質生活豐富，容易獲得財富和地位，享受優質的生活品質。",
    category: "吉神"
  },
  "祿神": {
    effect: "福祿雙全、事業順利",
    description: "事業運佳，容易獲得穩定的收入和社會地位。",
    category: "吉神"
  },
  "德秀": {
    effect: "品德高尚、才華出眾",
    description: "品格高尚，才華橫溢，容易受到他人尊敬和愛戴。",
    category: "吉神"
  },
  
  // 桃花類
  "桃花": {
    effect: "人緣魅力、社交順利",
    description: "人際關係良好，異性緣佳，社交能力強，容易受到他人喜愛。",
    category: "桃花"
  },
  "紅鸞": {
    effect: "姻緣美滿、感情順利",
    description: "感情運佳，容易遇到理想的伴侶，婚姻美滿。",
    category: "桃花"
  },
  "天喜": {
    effect: "喜事連連、心情愉悅",
    description: "生活中喜事較多，心情愉快，容易遇到值得慶祝的事情。",
    category: "桃花"
  },
  
  // 動星類
  "驛馬": {
    effect: "奔波變動、機動力強",
    description: "生活變動較多，喜歡旅行和變化，適合需要流動性的工作。",
    category: "動星"
  },
  "將星": {
    effect: "領導才能、統御能力",
    description: "具有領導天賦，能夠統領他人，適合管理和指揮工作。",
    category: "動星"
  },
  
  // 凶煞
  "空亡": {
    effect: "變化無常、需要適應",
    description: "人生變化較大，需要學會適應變化，有時會感到空虛迷茫。",
    category: "凶煞"
  },
  "羊刃": {
    effect: "行動力強、需要節制",
    description: "性格剛烈，行動力強，但需要學會控制情緒，避免衝動。",
    category: "凶煞"
  },
  "沖煞": {
    effect: "衝突挑戰、突破機會",
    description: "生活中會遇到衝突和挑戰，但也是突破和成長的機會。",
    category: "凶煞"
  },
  "劫煞": {
    effect: "破財風險、需要謹慎",
    description: "容易有破財的風險，需要謹慎理財，避免投機冒險。",
    category: "凶煞"
  },
  "災煞": {
    effect: "意外風險、需要小心",
    description: "容易遇到意外事件，需要特別注意安全，謹慎行事。",
    category: "凶煞"
  }
};

// 天乙貴人計算
function calculateTianyiGuiren(dayGan, pillars) {
  const map = {
    "甲": ["丑", "未"], "戊": ["丑", "未"], "庚": ["丑", "未"],
    "乙": ["子", "申"], "己": ["子", "申"],
    "丙": ["亥", "酉"], "丁": ["亥", "酉"],
    "壬": ["卯", "巳"], "癸": ["卯", "巳"]
  };
  
  const targetZhi = map[dayGan] || [];
  const foundPillars = [];
  
  Object.entries(pillars).forEach(([pillarName, pillar]) => {
    if (targetZhi.includes(pillar.zhi)) {
      foundPillars.push(pillarName);
    }
  });
  
  return foundPillars.length > 0 ? {
    name: "天乙貴人",
    pillars: foundPillars,
    ...SHENSHA_EFFECTS["天乙貴人"]
  } : null;
}

// 桃花計算
function calculateTaohua(yearZhi, pillars) {
  const map = {
    "申": "酉", "子": "酉", "辰": "酉",
    "寅": "卯", "午": "卯", "戌": "卯", 
    "巳": "午", "酉": "午", "丑": "午",
    "亥": "子", "卯": "子", "未": "子"
  };
  
  const taohuaZhi = map[yearZhi];
  if (!taohuaZhi) return null;
  
  const foundPillars = [];
  Object.entries(pillars).forEach(([pillarName, pillar]) => {
    if (pillar.zhi === taohuaZhi) {
      foundPillars.push(pillarName);
    }
  });
  
  return foundPillars.length > 0 ? {
    name: "桃花",
    pillars: foundPillars,
    ...SHENSHA_EFFECTS["桃花"]
  } : null;
}

// 驛馬計算
function calculateYima(yearZhi, pillars) {
  const map = {
    "申": "寅", "子": "寅", "辰": "寅",
    "寅": "申", "午": "申", "戌": "申",
    "巳": "亥", "酉": "亥", "丑": "亥",
    "亥": "巳", "卯": "巳", "未": "巳"
  };
  
  const yimaZhi = map[yearZhi];
  if (!yimaZhi) return null;
  
  const foundPillars = [];
  Object.entries(pillars).forEach(([pillarName, pillar]) => {
    if (pillar.zhi === yimaZhi) {
      foundPillars.push(pillarName);
    }
  });
  
  return foundPillars.length > 0 ? {
    name: "驛馬",
    pillars: foundPillars,
    ...SHENSHA_EFFECTS["驛馬"]
  } : null;
}

// 文昌計算
function calculateWenchang(yearGan, pillars) {
  const map = {
    "甲": "巳", "乙": "午", "丙": "申", "丁": "酉", "戊": "申",
    "己": "酉", "庚": "亥", "辛": "子", "壬": "寅", "癸": "卯"
  };
  
  const wenchangZhi = map[yearGan];
  if (!wenchangZhi) return null;
  
  const foundPillars = [];
  Object.entries(pillars).forEach(([pillarName, pillar]) => {
    if (pillar.zhi === wenchangZhi) {
      foundPillars.push(pillarName);
    }
  });
  
  return foundPillars.length > 0 ? {
    name: "文昌",
    pillars: foundPillars,
    ...SHENSHA_EFFECTS["文昌"]
  } : null;
}

// 華蓋計算
function calculateHuagai(yearZhi, pillars) {
  const map = {
    "寅": "戌", "午": "戌", "戌": "戌",
    "申": "辰", "子": "辰", "辰": "辰",
    "巳": "丑", "酉": "丑", "丑": "丑",
    "亥": "未", "卯": "未", "未": "未"
  };
  
  const huagaiZhi = map[yearZhi];
  if (!huagaiZhi) return null;
  
  const foundPillars = [];
  Object.entries(pillars).forEach(([pillarName, pillar]) => {
    if (pillar.zhi === huagaiZhi) {
      foundPillars.push(pillarName);
    }
  });
  
  return foundPillars.length > 0 ? {
    name: "華蓋",
    pillars: foundPillars,
    ...SHENSHA_EFFECTS["華蓋"]
  } : null;
}

// 空亡計算
function calculateKongwang(dayPillar, pillars) {
  const kongwangMap = {
    "甲子": ["戌", "亥"], "甲戌": ["申", "酉"], "甲申": ["午", "未"], "甲午": ["辰", "巳"],
    "甲辰": ["寅", "卯"], "甲寅": ["子", "丑"], "乙丑": ["戌", "亥"], "乙亥": ["申", "酉"],
    "乙酉": ["午", "未"], "乙未": ["辰", "巳"], "乙巳": ["寅", "卯"], "乙卯": ["子", "丑"],
    "丙寅": ["戌", "亥"], "丙子": ["申", "酉"], "丙戌": ["午", "未"], "丙申": ["辰", "巳"],
    "丙午": ["寅", "卯"], "丙辰": ["子", "丑"], "丁卯": ["戌", "亥"], "丁丑": ["申", "酉"],
    "丁亥": ["午", "未"], "丁酉": ["辰", "巳"], "丁未": ["寅", "卯"], "丁巳": ["子", "丑"],
    "戊辰": ["戌", "亥"], "戊寅": ["申", "酉"], "戊子": ["午", "未"], "戊戌": ["辰", "巳"],
    "戊申": ["寅", "卯"], "戊午": ["子", "丑"], "己巳": ["戌", "亥"], "己卯": ["申", "酉"],
    "己丑": ["午", "未"], "己亥": ["辰", "巳"], "己酉": ["寅", "卯"], "己未": ["子", "丑"],
    "庚午": ["戌", "亥"], "庚辰": ["申", "酉"], "庚寅": ["午", "未"], "庚子": ["辰", "巳"],
    "庚戌": ["寅", "卯"], "庚申": ["子", "丑"], "辛未": ["戌", "亥"], "辛巳": ["申", "酉"],
    "辛卯": ["午", "未"], "辛丑": ["辰", "巳"], "辛亥": ["寅", "卯"], "辛酉": ["子", "丑"],
    "壬申": ["戌", "亥"], "壬午": ["申", "酉"], "壬辰": ["午", "未"], "壬寅": ["辰", "巳"],
    "壬子": ["寅", "卯"], "壬戌": ["子", "丑"], "癸酉": ["戌", "亥"], "癸未": ["申", "酉"],
    "癸巳": ["午", "未"], "癸卯": ["辰", "巳"], "癸丑": ["寅", "卯"], "癸亥": ["子", "丑"]
  };
  
  const kongwangZhi = kongwangMap[dayPillar];
  if (!kongwangZhi) return null;
  
  const foundPillars = [];
  Object.entries(pillars).forEach(([pillarName, pillar]) => {
    if (kongwangZhi.includes(pillar.zhi)) {
      foundPillars.push(pillarName);
    }
  });
  
  return foundPillars.length > 0 ? {
    name: "空亡",
    pillars: foundPillars,
    ...SHENSHA_EFFECTS["空亡"]
  } : null;
}

// 主要神煞計算函數
function calculateAllShensha(pillars) {
  const { year, month, day, hour } = pillars;
  const dayGan = day.gan;
  const dayPillar = day.gan + day.zhi;
  const yearZhi = year.zhi;
  const yearGan = year.gan;
  
  const shenshaList = [];
  
  // 計算各種神煞
  const tianyiGuiren = calculateTianyiGuiren(dayGan, pillars);
  if (tianyiGuiren) shenshaList.push(tianyiGuiren);
  
  const taohua = calculateTaohua(yearZhi, pillars);
  if (taohua) shenshaList.push(taohua);
  
  const yima = calculateYima(yearZhi, pillars);
  if (yima) shenshaList.push(yima);
  
  const wenchang = calculateWenchang(yearGan, pillars);
  if (wenchang) shenshaList.push(wenchang);
  
  const huagai = calculateHuagai(yearZhi, pillars);
  if (huagai) shenshaList.push(huagai);
  
  const kongwang = calculateKongwang(dayPillar, pillars);
  if (kongwang) shenshaList.push(kongwang);
  
  return shenshaList.length > 0 ? shenshaList : [{
    name: "（本盤暫無核心神煞）",
    effect: "平穩發展",
    description: "此命盤較為平穩，沒有特別突出的神煞影響。",
    category: "中性",
    pillars: []
  }];
}

// 格式化神煞信息用於顯示
function formatShenshaForDisplay(shenshaList) {
  return shenshaList.map(shensha => {
    const pillarText = shensha.pillars.length > 0 ? 
      ` (出現在${shensha.pillars.join('、')}柱)` : '';
    
    return {
      name: shensha.name,
      effect: shensha.effect,
      description: shensha.description,
      category: shensha.category,
      pillars: shensha.pillars,
      displayText: `${shensha.name}${pillarText}：${shensha.effect}`
    };
  });
}

// 導出函數
window.calculateAllShensha = calculateAllShensha;
window.formatShenshaForDisplay = formatShenshaForDisplay;
window.SHENSHA_EFFECTS = SHENSHA_EFFECTS;

