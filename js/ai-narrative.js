// AI 故事生成模組
// 使用 OpenAI API 生成個性化的八字軍團故事

// 角色映射表
const GAN_ROLE = {
  "甲":"森林將軍","乙":"花草軍師","丙":"烈日戰神","丁":"燭光法師","戊":"山嶽守護",
  "己":"大地母親","庚":"鋼鐵騎士","辛":"珠寶商人","壬":"江河船長","癸":"甘露天使"
};

const ZHI_ROLE = {
  "子":"夜行刺客","丑":"忠犬守衛","寅":"森林獵人","卯":"春兔使者","辰":"龍族法師","巳":"火蛇術士",
  "午":"烈馬騎兵","未":"溫羊牧者","申":"靈猴戰士","酉":"金雞衛士","戌":"戰犬統領","亥":"海豚智者"
};

// 十神敘事
const TEN_GOD_NARRATIVE = {
  "比肩":"自我推進、競爭力強","劫財":"資源分享、合作亦競合","食神":"創造表達、福氣延展","傷官":"突破框架、表現慾強",
  "偏印":"靈感學習、支援多","正印":"庇蔭資源、學習成長","偏財":"機會財、外部資源","正財":"穩健財、務實經營",
  "七殺":"行動果決、承壓挑戰","正官":"紀律責任、制度資源"
};

// 神煞效果 - 使用來自 shensha-calculator.js 的全域定義

// 生成AI故事的提示詞模板
function generateStoryPrompt(pillarKey, pillarData, userData = {}) {
  const { stem, branch, naYin, tenGod, shensha = [] } = pillarData;
  const { userName = "", gender = "", tone = "default" } = userData;
  
  const commanderTitle = GAN_ROLE[stem] || stem;
  const strategistTitle = ZHI_ROLE[branch] || branch;
  const tenGodDesc = TEN_GOD_NARRATIVE[tenGod] || tenGod;
  const shenshaDesc = shensha.map(s => (window.SHENSHA_EFFECTS && window.SHENSHA_EFFECTS[s]) || s).join('、');
  
  const pillarDomains = {
    "年": "家族脈絡與社會舞台",
    "月": "成長歷程與關係資源", 
    "日": "核心本質與自我認知",
    "時": "未來願景與成果呈現"
  };
  
  const toneStyles = {
    "military": "軍事風格，使用戰術、戰略、軍團等詞彙",
    "healing": "療癒風格，溫暖關懷，充滿正能量",
    "poetic": "詩意風格，優美文字，富有意境",
    "mythic": "神話風格，神秘莊嚴，充滿傳奇色彩",
    "default": "平衡風格，專業而親切"
  };
  
  return `請為八字命盤中的${pillarKey}柱生成一個150字的個性化軍團故事。

背景資訊：
- 用戶：${userName || "這位朋友"}${gender ? `(${gender === 'male' ? '男性' : '女性'})` : ""}
- 柱位：${pillarKey}柱 (${pillarDomains[pillarKey]})
- 干支：${stem}${branch}
- 納音：${naYin}
- 十神：${tenGod} (${tenGodDesc})
- 神煞：${shensha.join('、') || "無特殊神煞"}
- 主將：${commanderTitle} (${stem})
- 軍師：${strategistTitle} (${branch})
- 語調：${toneStyles[tone] || toneStyles.default}

要求：
1. 嚴格控制在150字左右
2. 使用軍團、主將、軍師的概念
3. 融入納音、十神、神煞的特質
4. 體現${pillarDomains[pillarKey]}的主題
5. 語調符合${tone}風格
6. 結構：開場→主將介紹→軍師特質→神煞加持→十神優勢→兵法建議

格式範例：
🛡️【${pillarKey.toUpperCase()}柱軍團｜${stem}${branch}】

[150字故事內容，包含上述所有元素]

🔑 一句兵法建議：[針對性建議]`;
}

// 調用 OpenAI API 生成故事
async function generateAIStory(pillarKey, pillarData, userData = {}) {
  try {
    const prompt = generateStoryPrompt(pillarKey, pillarData, userData);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.OPENAI_API_KEY || 'your-api-key-here'}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '你是虹靈御所的專業八字軍團敘事師，擅長將傳統八字轉化為生動的RPG軍團故事。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || generateFallbackStory(pillarKey, pillarData);
    
  } catch (error) {
    console.error('AI故事生成失敗:', error);
    return generateFallbackStory(pillarKey, pillarData);
  }
}

// 備用故事生成（當AI不可用時）
function generateFallbackStory(pillarKey, pillarData) {
  const { stem, branch, naYin, tenGod, shensha = [] } = pillarData;
  const commanderTitle = GAN_ROLE[stem] || stem;
  const strategistTitle = ZHI_ROLE[branch] || branch;
  const tenGodDesc = TEN_GOD_NARRATIVE[tenGod] || tenGod;
  
  return `🛡️【${pillarKey.toUpperCase()}柱軍團｜${stem}${branch}】

你正在召喚你的${pillarKey}柱軍團，他們源自「${naYin}」之地，象徵你在此生命領域的主題挑戰與能量場。

主將「${commanderTitle}」由${stem}領軍，展現你的核心性格與行動力，在此柱中扮演領導者角色。

軍師「${strategistTitle}」來自${branch}，擅長策略與支援，引導軍團方向，象徵你在此領域的智慧與應變。

${shensha.length > 0 ? `神煞兵符「${shensha.join('、')}」賦予你特殊能力，在此柱中展現獨特優勢。` : ''}

此柱的十神為「${tenGod}」，${tenGodDesc}，為你提供核心優勢。

🔑 一句兵法建議：善用${commanderTitle}與${strategistTitle}的特質，發揮此柱的戰略優勢。`;
}

// 批量生成四柱故事
async function generateAllPillarStories(chartData, userData = {}) {
  const stories = {};
  const pillars = ['年', '月', '日', '時'];
  
  for (const pillar of pillars) {
    if (chartData[pillar]) {
      console.log(`正在生成${pillar}柱故事...`);
      stories[pillar] = await generateAIStory(pillar, chartData[pillar], userData);
      // 添加延遲避免API限制
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return stories;
}

// 導出函數
window.generateAIStory = generateAIStory;
window.generateAllPillarStories = generateAllPillarStories;
window.generateFallbackStory = generateFallbackStory;

