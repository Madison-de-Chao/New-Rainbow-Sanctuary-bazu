// AI故事生成器 - 增強版（前端安全版，無金鑰）
// 注意：任何雲端模型請走後端代理，前端不存放 API Key。
class AIStoryGenerator {
  constructor() {
    // 支持多種AI服務
    this.aiServices = {
      openai: {
        apiKey: null,
        baseUrl: "https://api.openai.com/v1/chat/completions",
        model: "gpt-3.5-turbo"
      },
      claude: {
        apiKey: null,
        baseUrl: "https://api.anthropic.com/v1/messages",
        model: "claude-3-haiku-20240307"
      },
      local: {
        enabled: true, // 本地生成始終可用
        advanced: true
      }
    };
    this.currentService = "local"; // 默認使用本地生成
    this.apiKey = null;
  }

  // 設置AI服務
  setAIService(service, apiKey) {
    if (this.aiServices[service]) {
      this.aiServices[service].apiKey = apiKey || null;
      this.currentService = service;
    }
  }

  // 設置API密鑰（如需本地暫存token；不建議前端使用）
  setApiKey(apiKey) {
    this.apiKey = apiKey || null;
  }

  // 生成150字豐富故事 - 主入口
  async generateRichStory(pillarData, tone = "default") {
    const { position, gan, zhi, naYin } = pillarData;
    if (!position || !gan || !zhi || !naYin) {
      throw new Error("pillarData 缺少必要欄位：position, gan, zhi, naYin");
    }

    try {
      if (
        this.currentService !== "local" &&
        this.aiServices[this.currentService].apiKey
      ) {
        const aiStory = await this.generateAIStory(pillarData, tone);
        if (aiStory && aiStory.length > 100) return aiStory;
      }
    } catch (error) {
      console.warn("AI故事生成失敗，使用本地生成:", error);
    }

    return this.generateAdvancedLocalStory(pillarData, tone);
  }

  // AI服務故事生成
  async generateAIStory(pillarData, tone) {
    const service = this.aiServices[this.currentService];
    const prompt = this.buildAIPrompt(pillarData, tone);

    if (this.currentService === "openai") {
      return await this.callOpenAI(service, prompt);
    } else if (this.currentService === "claude") {
      return await this.callClaude(service, prompt);
    }
    return null;
  }

  // 構建AI提示詞
  buildAIPrompt(pillarData, tone) {
  const { position, gan, zhi, naYin } = pillarData;

  const tonePrompts = {
    default: "以神話傳說的語調，充滿想像力和詩意",
    military: "以軍事戰略的語調，展現戰術智慧和領導力",
    healing: "以溫暖療癒的語調，帶來安慰和希望",
    poetic: "以詩意優雅的語調，富有文學美感",
    mythic: "以神秘玄幻的語調，充滿超自然色彩"
  };

  const pillarDomains = {
    "年": "家族傳承與童年根基",
    "月": "社會關係與事業發展",
    "日": "核心自我與婚姻愛情",
    "時": "未來展望與子女運勢"
  };

  const lines = [
    "請為八字命理中的" + position + "柱創作一個恰好150字的個性化軍團故事。",
    "",
    "背景資訊：",
    "- 柱位：" + position + "柱（主管" + pillarDomains[position] + "）",
    "- 干支：" + gan + zhi,
    "- 納音：" + naYin,
    "- 五行屬性：" + this.getElementInfo(gan, zhi),
    "",
    "創作要求：",
    "1. 字數恰好150字（中文字符）",
    "2. " + (tonePrompts[tone] || tonePrompts.default),
    "3. 以軍團、將軍、軍師的概念來描述",
    "4. 融入" + gan + "天干和" + zhi + "地支的特質",
    "5. 體現" + naYin + "納音的意義",
    "6. 反映" + position + "柱在人生中的作用",
    "7. 具有啟發性和指導意義",
    "",
    "請直接返回150字的故事內容，不要任何額外說明。"
  ];

  return lines.join("\n");
}
  // OpenAI API調用（保守版）
async callOpenAI(service, prompt) {
  const payload = {
    model: service.model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300,
    temperature: 0.8
  }; // ← 這個分號必須存在

  const response = await fetch(service.baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${service.apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`OpenAI API錯誤: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim();
}

   

  // Claude API調用（前端示意；建議改為呼叫後端代理 /api/ai-proxy）
  async callClaude(service, prompt) {
    const payload = {
      model: service.model,
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }]
    };

    const response = await fetch(service.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": service.apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`Claude API錯誤: ${response.status}`);

    const data = await response.json();
    return data?.content?.[0]?.text?.trim();
  }

  // 增強版本地故事生成
  generateAdvancedLocalStory(pillarData, tone = "default") {
    const { position, gan, zhi, naYin } = pillarData;
    const ganInfo = this.getGanDetails(gan);
    const zhiInfo = this.getZhiDetails(zhi);
    const nayinInfo = this.getNayinDetails(naYin);
    const toneStyle = this.getToneStyle(tone);
    const storyTemplate = this.getStoryTemplate(position);

    return this.buildPersonalizedStory({
      position,
      gan,
      zhi,
      naYin,
      ganInfo,
      zhiInfo,
      nayinInfo,
      toneStyle,
      storyTemplate
    });
  }

  // 天干詳細
  getGanDetails(gan) {
    const ganDetails = {
      甲: { name: "甲木將軍", element: "木", nature: "陽", desc: "如參天大樹般屹立不搖", trait: "領導統馭", power: "生長創新" },
      乙: { name: "乙木謀士", element: "木", nature: "陰", desc: "如柔韌花草般適應環境", trait: "柔韌智慧", power: "靈活變通" },
      丙: { name: "丙火戰神", element: "火", nature: "陽", desc: "如烈日般光芒萬丈", trait: "熱情積極", power: "照亮前路" },
      丁: { name: "丁火法師", element: "火", nature: "陰", desc: "如燭光般溫暖人心", trait: "細膩溫和", power: "啟發智慧" },
      戊: { name: "戊土守衛", element: "土", nature: "陽", desc: "如高山般穩固可靠", trait: "包容穩重", power: "承載萬物" },
      己: { name: "己土後勤", element: "土", nature: "陰", desc: "如沃土般滋養生命", trait: "細心謹慎", power: "培育成長" },
      庚: { name: "庚金騎士", element: "金", nature: "陽", desc: "如利劍般銳利果決", trait: "剛毅決斷", power: "破除障礙" },
      辛: { name: "辛金刺客", element: "金", nature: "陰", desc: "如珠寶般精緻優雅", trait: "精準靈巧", power: "精工細作" },
      壬: { name: "壬水水師", element: "水", nature: "陽", desc: "如江河般奔流不息", trait: "智慧流動", power: "滋潤萬物" },
      癸: { name: "癸水間諜", element: "水", nature: "陰", desc: "如甘露般細膩滋潤", trait: "純淨透徹", power: "默默滋養" }
    };
    return ganDetails[gan] || ganDetails.甲;
  }

  // 地支詳細
  getZhiDetails(zhi) {
    const zhiDetails = {
      子: { name: "子鼠軍師", season: "冬", time: "夜半", trait: "機智靈活", wisdom: "善於謀劃" },
      丑: { name: "丑牛參謀", season: "冬", time: "丑時", trait: "踏實穩重", wisdom: "默默耕耘" },
      寅: { name: "寅虎先鋒", season: "春", time: "破曉", trait: "勇猛威武", wisdom: "敢於開拓" },
      卯: { name: "卯兔斥候", season: "春", time: "日出", trait: "溫和敏捷", wisdom: "靈敏察覺" },
      辰: { name: "辰龍法師", season: "春", time: "上午", trait: "變化多端", wisdom: "神秘莫測" },
      巳: { name: "巳蛇謀士", season: "夏", time: "上午", trait: "智慧深沉", wisdom: "洞察先機" },
      午: { name: "午馬騎兵", season: "夏", time: "正午", trait: "熱情奔放", wisdom: "奮勇向前" },
      未: { name: "未羊後勤", season: "夏", time: "下午", trait: "溫柔善良", wisdom: "細心照料" },
      申: { name: "申猴特使", season: "秋", time: "下午", trait: "聰明活潑", wisdom: "靈活應變" },
      酉: { name: "酉雞號令", season: "秋", time: "黃昏", trait: "清廉正直", wisdom: "準時守信" },
      戌: { name: "戌狗護衛", season: "秋", time: "戌時", trait: "忠誠可靠", wisdom: "守護至上" },
      亥: { name: "亥豬補給", season: "冬", time: "夜晚", trait: "厚道純真", wisdom: "包容寬厚" }
    };
    return zhiDetails[zhi] || zhiDetails.子;
  }

  // 納音詳細
  getNayinDetails(nayin) {
    const nayinMeanings = {
      海中金: { power: "深藏不露", quality: "珍貴才華", nature: "內斂深沉", effect: "厚積薄發" },
      爐中火: { power: "熱情創造", quality: "變革之火", nature: "積極進取", effect: "照亮他人" },
      大林木: { power: "茂盛成長", quality: "蓬勃生機", nature: "包容廣大", effect: "庇蔭眾生" },
      路旁土: { power: "默默承載", quality: "責任重大", nature: "樸實無華", effect: "支撐根基" },
      劍鋒金: { power: "銳利決斷", quality: "果決行動", nature: "剛毅不屈", effect: "破除迷障" },
      山頭火: { power: "光明照耀", quality: "領導風範", nature: "高瞻遠矚", effect: "指引方向" },
      澗下水: { power: "清澈純淨", quality: "智慧如水", nature: "靈活變通", effect: "滋養心靈" },
      城牆土: { power: "堅固防護", quality: "保護力量", nature: "穩如磐石", effect: "守護家園" },
      白臘金: { power: "溫潤優雅", quality: "精緻品格", nature: "內外兼修", effect: "提升品味" },
      楊柳木: { power: "柔韌適應", quality: "生命力強", nature: "隨遇而安", effect: "春風化雨" }
    };

    if (!nayinMeanings[nayin]) {
      const elements = ["金", "木", "水", "火", "土"];
      const element = elements.find((e) => nayin.includes(e)) || "元";
      return {
        power: "獨特能量",
        quality: `${element}之精華`,
        nature: "神秘莫測",
        effect: "命運加持"
      };
    }
    return nayinMeanings[nayin];
  }

  // 語調風格
  getToneStyle(tone) {
    const toneStyles = {
      default: { prefix: "在命運的星空下", style: "神話傳說", ending: "譜寫著屬於你的傳奇" },
      military: { prefix: "在人生的戰場上", style: "軍事策略", ending: "制定著勝利的戰略" },
      healing: { prefix: "在溫暖的光芒中", style: "療癒溫暖", ending: "帶來內心的平靜" },
      poetic: { prefix: "在詩意的時光裡", style: "優雅詩意", ending: "吟唱著生命的詩篇" },
      mythic: { prefix: "在古老的傳說中", style: "神秘玄幻", ending: "守護著永恆的秘密" }
    };
    return toneStyles[tone] || toneStyles.default;
  }

  // 故事模板
  getStoryTemplate(position) {
    const templates = {
      年: { domain: "生命根源", role: "祖源守護", mission: "奠定根基", influence: "家族傳承與童年印記" },
      月: { domain: "社會關係", role: "外交統領", mission: "建立聯盟", influence: "事業發展與人際網絡" },
      日: { domain: "核心本質", role: "主帥統帥", mission: "領導全局", influence: "個人特質與愛情婚姻" },
      時: { domain: "未來展望", role: "前瞻先鋒", mission: "開創未來", influence: "創造力與子女運勢" }
    };
    return templates[position] || templates.日;
  }

  // 組裝個性化故事（約150字，本地不強制精確字數）
  buildPersonalizedStory(params) {
    const { position, gan, zhi, naYin, ganInfo, zhiInfo, nayinInfo, toneStyle, storyTemplate } = params;
    const domainWord =
      position === "年"
        ? "根基建立"
        : position === "月"
        ? "社會發展"
        : position === "日"
        ? "自我實現"
        : "未來創造";

    const story = `${toneStyle.prefix}，${ganInfo.name}統領著${position}柱${storyTemplate.domain}軍團。這支由${gan}${zhi}組建的精英部隊，承載著${naYin}的${nayinInfo.power}能量。${ganInfo.desc}的主將，以其${ganInfo.trait}特質${storyTemplate.mission}，${zhiInfo.name}擔任${storyTemplate.role}，運用${zhiInfo.wisdom}的智慧指導戰略。${nayinInfo.nature}的軍團氣質體現著${nayinInfo.quality}，在${storyTemplate.influence}領域發揮關鍵作用。透過${ganInfo.power}與${zhiInfo.trait}的結合，這支軍團${nayinInfo.effect}，為你的人生${toneStyle.ending}，引領你在${domainWord}的道路上前行。`;
    return story;
  }

  // 五行資訊
  getElementInfo(gan, zhi) {
    const ganElements = {
      甲: "陽木",
      乙: "陰木",
      丙: "陽火",
      丁: "陰火",
      戊: "陽土",
      己: "陰土",
      庚: "陽金",
      辛: "陰金",
      壬: "陽水",
      癸: "陰水"
    };

    const zhiElements = {
      子: "陽水",
      丑: "陰土",
      寅: "陽木",
      卯: "陰木",
      辰: "陽土",
      巳: "陰火",
      午: "陽火",
      未: "陰土",
      申: "陽金",
      酉: "陰金",
      戌: "陽土",
      亥: "陰水"
    };

    return `天干${ganElements[gan]}，地支${zhiElements[zhi]}`;
  }

  // 人生階段
  getLifeStage(position) {
    const stages = {
      年: "童年成長與家族根基",
      月: "青年發展與社會關係",
      日: "成年核心與自我實現",
      時: "未來展望與傳承延續"
    };
    return stages[position] || "人生重要階段";
  }

  // 備用故事模板
  getDefaultRichStory(pillarData, tone) {
    const stories = {
      年: `在你的生命源頭，${pillarData.gan}${pillarData.zhi}守護者如古老的神殿般庇護著家族的根基。作為祖源軍團的統帥，他承載著世代傳承的智慧與力量。${pillarData.naYin}的光輝從他身上散發，象徵著你與生俱來的潛能和家族的榮耀。這位守護者見證了你的第一聲啼哭，記錄著童年的每一個成長足跡。他的存在讓你明白，無論走到哪裡，都有著深厚的根基支撐。`,
      月: `在社會的舞台上，${pillarData.gan}${pillarData.zhi}守護者如智慧的外交官般穿梭於人際關係中。作為關係軍團的領袖，他精通社交與合作之道。${pillarData.naYin}的能量賦予他獨特魅力，讓你在事業發展中如魚得水。透過他的指引，你學會平衡個人目標與團隊利益。`,
      日: `在你的核心本質中，${pillarData.gan}${pillarData.zhi}守護者如永恆之燈照亮內在。作為核心軍團主帥，他代表你最真實的自我與智慧。${pillarData.naYin}之光象徵你獨特的個性與價值。這位守護者支持你的每個抉擇，幫助你在關係中建立誠實與理解。`,
      時: `在未來地平線上，${pillarData.gan}${pillarData.zhi}守護者如先知預見明日。作為未來軍團先鋒，他具創造力與前瞻眼光。${pillarData.naYin}的力量讓夢想化為現實，為你開闢新路；更引導你將智慧與愛傳遞，讓美好延續。`
    };
    return stories[pillarData.position] || stories.日;
  }
}

// 全局實例
window.aiStoryGenerator = new AIStoryGenerator();

// 前端不要放 API Key；預設使用本地生成
window.aiStoryGenerator.setAIService("local", null);