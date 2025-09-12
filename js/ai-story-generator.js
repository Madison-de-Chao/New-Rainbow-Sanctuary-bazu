// AI故事生成器
class AIStoryGenerator {
  constructor() {
    this.apiKey = null; // 需要設置API密鑰
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
  }

  // 生成150字豐富故事
  async generateRichStory(pillarData, tone = 'default') {
    const { position, gan, zhi, strategist, naYin } = pillarData;
    
    const tonePrompts = {
      default: '以神話傳說的語調',
      military: '以軍事戰略的語調',
      healing: '以溫暖療癒的語調',
      poetic: '以詩意優雅的語調',
      mystical: '以神秘玄幻的語調'
    };
    
    const prompt = `
請${tonePrompts[tone] || tonePrompts.default}，為八字${position}柱「${gan}${zhi}」創作一個150字的守護者故事。

背景設定：
- 柱位：${position}柱（代表${this.getLifeStage(position)}）
- 天干地支：${gan}${zhi}
- 軍師職位：${strategist}
- 納音：${naYin}

要求：
1. 故事長度恰好150字
2. 融入天干地支的五行特質
3. 體現${position}柱的人生階段特色
4. 包含軍師職位的智慧特質
5. 語調${tonePrompts[tone] || '神話傳說風格'}
6. 富有想像力和詩意

請直接返回故事內容，不要其他說明。
`;

    try {
      if (this.apiKey) {
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 300,
            temperature: 0.8
          })
        });
        
        const data = await response.json();
        return data.choices[0].message.content.trim();
      } else {
        // 使用預設的豐富故事模板
        return this.getDefaultRichStory(pillarData, tone);
      }
    } catch (error) {
      console.error('AI故事生成失敗:', error);
      return this.getDefaultRichStory(pillarData, tone);
    }
  }

  // 獲取人生階段描述
  getLifeStage(position) {
    const stages = {
      年: '童年與家族根源',
      月: '青年與事業發展',
      日: '核心本質與自我',
      時: '晚年與傳承智慧'
    };
    return stages[position] || '人生階段';
  }

  // 預設豐富故事模板
  getDefaultRichStory(pillarData, tone) {
    const { position, gan, zhi, strategist, naYin } = pillarData;
    
    const stories = {
      年: `在遙遠的天界，${gan}${zhi}守護者誕生於星辰交匯之時，承載著家族千年的榮耀與使命。作為${strategist}，他擁有洞察過去的神通，能夠從祖先的智慧中汲取力量。${naYin}的光芒環繞著他，象徵著根基的穩固與傳承的延續。童年時期的你，正是在這位守護者的庇護下，培養出堅韌不拔的性格和對家族的深厚情感。他的存在提醒你，無論走到哪裡，都要記住自己的根源，珍惜家族的傳統與價值。這份力量將伴隨你一生，成為你面對挑戰時最堅實的後盾。`,
      
      月: `青春歲月裡，${gan}${zhi}守護者如智慧的導師般出現，引領你走向人生的黃金時期。身為${strategist}，他精通謀略與智慧，能夠在複雜的人際關係中為你指引方向。${naYin}的能量在他身上閃閃發光，象徵著事業的蓬勃發展與社會地位的提升。在這個關鍵的人生階段，他教會你如何在競爭中保持優雅，在挑戰中展現智慧。他的存在讓你明白，真正的成功不僅來自於個人的努力，更需要懂得與他人合作，建立良好的人際網絡。這位守護者將陪伴你度過人生最精彩的時光。`,
      
      日: `在你的核心本質中，${gan}${zhi}守護者如永恆的明燈般照亮內心深處。作為${strategist}，他代表著你最真實的自我和內在的智慧。${naYin}的光輝從他身上散發，象徵著你獨特的個性和不可替代的價值。這位守護者了解你的每一個想法，支持你的每一個決定，是你最忠實的夥伴。他教會你如何在喧囂的世界中保持內心的平靜，如何在迷茫時找到前進的方向。無論外界如何變化，他都會提醒你堅持自己的原則和信念。這份來自內心的力量，將成為你人生路上最珍貴的財富，指引你走向真正的成功與幸福。`,
      
      時: `在人生的黃昏時分，${gan}${zhi}守護者如慈祥的長者般陪伴在你身側，見證著歲月的沉澱與智慧的昇華。身為${strategist}，他擁有豐富的人生閱歷和深邃的洞察力，能夠為後代提供寶貴的指導。${naYin}的溫暖光芒環繞著他，象徵著傳承與延續的力量。在這個人生階段，他幫助你整理過往的經驗，將一生的智慧化為珍貴的遺產。他教會你如何優雅地面對歲月的流逝，如何在平凡中發現生活的美好。這位守護者的存在，讓你明白真正的成功不在於擁有多少，而在於能夠傳承多少愛與智慧給下一代。`
    };
    
    return stories[position] || `${gan}${zhi}守護者以${strategist}的身份，在${naYin}的光輝中守護著你的人生旅程，為你帶來智慧與力量。`;
  }

  // 設置API密鑰
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }
}

// 全局實例
window.aiStoryGenerator = new AIStoryGenerator();

// 如果有OpenAI API密鑰，設置它
if (typeof OPENAI_API_KEY !== 'undefined') {
  window.aiStoryGenerator.setApiKey(OPENAI_API_KEY);
}

