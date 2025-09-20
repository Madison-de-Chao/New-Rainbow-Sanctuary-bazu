// 簡單的天干地支五行對應表
function getElementInfo(gan, zhi) {
  const ganElements = {
    "甲": "木", "乙": "木",
    "丙": "火", "丁": "火", 
    "戊": "土", "己": "土",
    "庚": "金", "辛": "金",
    "壬": "水", "癸": "水"
  };
  
  const zhiElements = {
    "子": "水", "丑": "土", "寅": "木", "卯": "木",
    "辰": "土", "巳": "火", "午": "火", "未": "土",
    "申": "金", "酉": "金", "戌": "土", "亥": "水"
  };
  
  const ganElement = ganElements[gan] || "未知";
  const zhiElement = zhiElements[zhi] || "未知";
  
  return `天干${gan}(${ganElement})，地支${zhi}(${zhiElement})`;
}

function buildAIPrompt(pillarData, tone) {
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
    "- 五行屬性：" + getElementInfo(gan, zhi),
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