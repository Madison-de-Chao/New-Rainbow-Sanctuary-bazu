// Legion Stories Page JavaScript
// 四時軍團詳細故事頁面

document.addEventListener('DOMContentLoaded', function() {
    initializeLegionPage();
});

function initializeLegionPage() {
    console.log('Initializing Legion Stories Page...');
    
    // 從 localStorage 獲取八字數據
    const baziData = getBaziDataFromStorage();
    
    if (baziData) {
        renderLegionStories(baziData);
        renderLegends(baziData);
    } else {
        showError('無法找到八字數據，請返回重新生成。');
    }
}

function getBaziDataFromStorage() {
    try {
        const storedData = localStorage.getItem('baziAnalysisData');
        return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
        console.error('Error parsing stored bazi data:', error);
        return null;
    }
}

async function renderLegionStories(data) {
    const storiesContainer = document.getElementById('legion-stories');
    if (!storiesContainer) return;

    const pillars = data.chart?.pillars || {};
    const pillarKeys = ['年', '月', '日', '時'];
    const pillarColors = ['#ff6ec4', '#7873f5', '#00d4ff', '#ff9500'];
    const pillarClasses = ['pillar-year', 'pillar-month', 'pillar-day', 'pillar-hour'];
    
    storiesContainer.innerHTML = '';

    for (let i = 0; i < pillarKeys.length; i++) {
        const pillarKey = pillarKeys[i];
        const pillar = pillars[pillarKey];
        
        if (!pillar) continue;

        const storyElement = await createLegionStoryElement(
            pillarKey, 
            pillar, 
            pillarColors[i], 
            pillarClasses[i],
            data,
            i
        );
        
        storiesContainer.appendChild(storyElement);
        
        // 延遲動畫
        setTimeout(() => {
            storyElement.style.animationDelay = `${i * 0.2}s`;
        }, 100);
    }
}

async function createLegionStoryElement(pillarKey, pillar, color, className, data, index) {
    const storyDiv = document.createElement('div');
    storyDiv.className = 'legion-story';
    storyDiv.style.animationDelay = `${index * 0.3}s`;

    // 獲取軍團信息
    const legionInfo = getLegionInfo(pillarKey, pillar);
    
    // 獲取AI生成的故事
    const story = await generateLegionStory(pillarKey, pillar, data);
    
    // 獲取深度分析
    const analysis = getDepthAnalysis(pillarKey, pillar, data);

    storyDiv.innerHTML = `
        <div class="story-header">
            <div class="pillar-badge ${className}">
                ${pillarKey}柱
            </div>
            <h3 class="story-title">${legionInfo.title}</h3>
        </div>
        
        <div class="story-metadata">
            <div class="metadata-item">
                <span class="metadata-label">干支</span>
                <span class="metadata-value">${pillar.pillar || pillar.gan + pillar.zhi}</span>
            </div>
            <div class="metadata-item">
                <span class="metadata-label">天干</span>
                <span class="metadata-value">${pillar.gan} (${getGanDescription(pillar.gan)})</span>
            </div>
            <div class="metadata-item">
                <span class="metadata-label">地支</span>
                <span class="metadata-value">${pillar.zhi} (${getZhiDescription(pillar.zhi)})</span>
            </div>
            <div class="metadata-item">
                <span class="metadata-label">納音</span>
                <span class="metadata-value">${getNayin(pillar.gan, pillar.zhi)}</span>
            </div>
            <div class="metadata-item">
                <span class="metadata-label">十神</span>
                <span class="metadata-value">${getTenGod(pillarKey, pillar, data)}</span>
            </div>
            <div class="metadata-item">
                <span class="metadata-label">神煞</span>
                <span class="metadata-value">${getShensha(pillarKey, pillar, data)}</span>
            </div>
        </div>
        
        <div class="story-content ${story.isAI ? 'ai-generated' : ''}">
            ${story.content}
        </div>
        
        <div class="story-analysis">
            <div class="analysis-title">🔍 深度分析與註釋</div>
            <div class="analysis-content">
                ${analysis}
            </div>
        </div>
    `;

    return storyDiv;
}

function getLegionInfo(pillarKey, pillar) {
    const legionTitles = {
        '年': '祖源軍團',
        '月': '關係軍團', 
        '日': '核心軍團',
        '時': '未來軍團'
    };

    return {
        title: legionTitles[pillarKey] || '未知軍團',
        domain: getPillarDomain(pillarKey)
    };
}

function getPillarDomain(pillarKey) {
    const domains = {
        '年': '家族背景、祖輩影響、童年環境',
        '月': '父母關係、工作事業、社交能力',
        '日': '個人性格、核心自我、配偶關係',
        '時': '子女運勢、晚年生活、未來發展'
    };
    return domains[pillarKey] || '';
}

async function generateLegionStory(pillarKey, pillar, data) {
    // 嘗試使用AI生成150字故事
    try {
        if (window.AIStoryGenerator) {
            const aiGenerator = new window.AIStoryGenerator();
            const aiStory = await aiGenerator.generateRichStory({
                position: pillarKey,
                gan: pillar.gan,
                zhi: pillar.zhi,
                naYin: getNayin(pillar.gan, pillar.zhi)
            });
            
            if (aiStory && aiStory.length > 50) {
                return {
                    content: aiStory,
                    isAI: true
                };
            }
        }
    } catch (error) {
        console.warn('AI story generation failed, using fallback:', error);
    }

    // 使用本地生成的詳細故事
    return {
        content: generateDetailedFallbackStory(pillarKey, pillar),
        isAI: false
    };
}

function generateDetailedFallbackStory(pillarKey, pillar) {
    const gan = pillar.gan;
    const zhi = pillar.zhi;
    const nayin = getNayin(gan, zhi);
    
    const ganRoles = window.GAN_ROLE || {};
    const commander = ganRoles[gan]?.name || `${gan}將軍`;
    const commanderDesc = ganRoles[gan]?.description || '神秘的指揮官';
    
    const stories = {
        '年': `在你生命的源頭，${commander}統領著祖源軍團。這支來自${gan}${zhi}的古老部隊，承載著${nayin}的神秘力量。${commanderDesc}，他掌管著你的根基與傳承。地支${zhi}化身為軍師，以其深邃的智慧指引軍團前進。這個軍團象徵著你的出身背景與先天稟賦，他們的每一次行動都影響著你人生的根本方向。在家族的光輝與陰影中，這支軍團為你奠定了堅實的基礎，讓你能夠在人生戰場上勇敢前行。`,
        
        '月': `在人際關係的戰場上，${commander}率領著關係軍團征戰四方。這支精銳部隊由${gan}${zhi}組成，蘊含著${nayin}的和諧能量。${commanderDesc}，專精於外交與合作策略。地支${zhi}擔任外交官，負責處理各種人際關係。這個軍團代表著你的社交能力與事業發展，他們在父母關係、工作夥伴、朋友圈中發揮重要作用。透過巧妙的人際戰術，這支軍團幫助你建立強大的社會網絡，在事業道路上獲得貴人相助。`,
        
        '日': `在你內心的核心要塞中，${commander}統治著最重要的核心軍團。這支由${gan}${zhi}構成的王牌部隊，散發著${nayin}的純粹光芒。${commanderDesc}，是你真實自我的化身與代表。地支${zhi}作為貼身護衛，保護著你最珍貴的內在品質。這個軍團體現著你的核心性格與本質，也影響著你的愛情與婚姻。在人生的每個重要時刻，這支軍團都站在第一線，用最真實的力量面對各種挑戰，展現你獨特的個人魅力。`,
        
        '時': `在未來的地平線上，${commander}領導著前瞻軍團開疆拓土。這支充滿希望的隊伍由${gan}${zhi}組建，承載著${nayin}的創造力量。${commanderDesc}，具有預見未來的卓越能力。地支${zhi}擔任先遣隊長，探索未知的可能性。這個軍團象徵著你的子女運勢、創造能力與晚年發展。他們不斷為你規劃著美好的明天，在時間的長河中播下希望的種子，確保你的人生能夠持續綻放光彩，留下珍貴的傳承。`
    };
    
    return stories[pillarKey] || `${commander}統領著${pillarKey}柱軍團，展現著${nayin}的獨特魅力...`;
}

function getDepthAnalysis(pillarKey, pillar, data) {
    const gan = pillar.gan;
    const zhi = pillar.zhi;
    const nayin = getNayin(gan, zhi);
    
    return `
        <strong>🔍 命理核心分析：</strong>${gan}屬${getGanElement(gan)}，${zhi}屬${getZhiElement(zhi)}，此柱五行配置體現了${getElementInteraction(gan, zhi)}的特質。干支相配展現${getGanZhiHarmony(gan, zhi)}的能量場。<br><br>
        
        <strong>🎵 納音深度解讀：</strong>${nayin}在命理學中代表${getNayinMeaning(nayin)}。在${pillarKey}柱的位置上，象徵著${getNayinInPosition(nayin, pillarKey)}。此納音與生俱來的特質將在${getLifePhase(pillarKey)}階段發揮重要作用。<br><br>
        
        <strong>🏛️ 生活層面影響：</strong>此柱在現實生活中主要影響${getPillarLifeAspect(pillarKey)}。${gan}天干的${getGanNature(gan)}特質，結合${zhi}地支的${getZhiNature(zhi)}能量，在這些方面要${getPillarAdvice(pillarKey, pillar)}。<br><br>
        
        <strong>⚔️ 十神關係分析：</strong>作為${getTenGod(pillarKey, pillar)}，此柱體現了${getTenGodDetailedMeaning(getTenGod(pillarKey, pillar))}的特質。在人生格局中扮演${getTenGodRole(getTenGod(pillarKey, pillar))}的角色。<br><br>
        
        <strong>🔮 神煞加持效應：</strong>${getShensha(pillarKey, pillar, data)}等神煞的出現，為此柱增添了${getShenshaInfluence(pillarKey)}的特殊能量。<br><br>
        
        <strong>🌟 發展策略建議：</strong>充分發揮${gan}的${getGanStrength(gan)}特質，同時運用${zhi}的${getZhiStrength(zhi)}能力，結合${nayin}的${getNayinPower(nayin)}優勢，可以在${pillarKey === '年' ? '家庭關係與個人根基' : pillarKey === '月' ? '事業發展與人際網絡' : pillarKey === '日' ? '個人成長與感情生活' : '創新創造與未來規劃'}方面取得重大突破。<br><br>
        
        <strong>📈 運勢週期提醒：</strong>此柱的能量在${getOptimalTiming(pillarKey, pillar)}時期最為活躍，建議在這些時間段內重點把握機會，積極行動。
    `;
}

function renderLegends(data) {
    renderShenshaLegends(data);
    renderTenGodLegends(data);
    renderNayinLegends(data);
}

function renderShenshaLegends(data) {
    const container = document.getElementById('shensha-legends');
    if (!container) return;

    const allShensha = getAllShenshaFromData(data);
    
    container.innerHTML = allShensha.map(shensha => `
        <div class="legend-item">
            <div class="legend-symbol">煞</div>
            <div class="legend-text">
                <strong>${shensha}</strong><br>
                <small>${window.SHENSHA_EFFECTS?.[shensha] || '特殊神煞，影響命運走向'}</small>
            </div>
        </div>
    `).join('');
}

function renderTenGodLegends(data) {
    const container = document.getElementById('tengod-legends');
    if (!container) return;

    const tenGods = ['比肩', '劫財', '食神', '傷官', '偏財', '正財', '七殺', '正官', '偏印', '正印'];
    
    container.innerHTML = tenGods.map(god => `
        <div class="legend-item">
            <div class="legend-symbol">神</div>
            <div class="legend-text">
                <strong>${god}</strong><br>
                <small>${getTenGodMeaning(god)}</small>
            </div>
        </div>
    `).join('');
}

function renderNayinLegends(data) {
    const container = document.getElementById('nayin-legends');
    if (!container) return;

    const pillars = data.chart?.pillars || {};
    const nayinList = Object.values(pillars).map(p => getNayin(p.gan, p.zhi)).filter(Boolean);
    const uniqueNayin = [...new Set(nayinList)];
    
    container.innerHTML = uniqueNayin.map(nayin => `
        <div class="legend-item">
            <div class="legend-symbol">音</div>
            <div class="legend-text">
                <strong>${nayin}</strong><br>
                <small>${getNayinMeaning(nayin)}</small>
            </div>
        </div>
    `).join('');
}

// 輔助函數
function getGanDescription(gan) {
    const descriptions = {
        '甲': '陽木，參天大樹', '乙': '陰木,花草藤蔓',
        '丙': '陽火，烈日驕陽', '丁': '陰火，燭光爝火', 
        '戊': '陽土，高山大地', '己': '陰土，田園沃壤',
        '庚': '陽金，堅鋼利劍', '辛': '陰金，珠寶飾品',
        '壬': '陽水，江河大海', '癸': '陰水，雨露甘霖'
    };
    return descriptions[gan] || gan;
}

function getZhiDescription(zhi) {
    const descriptions = {
        '子': '水鼠，機智靈活', '丑': '土牛，穩重踏實', '寅': '木虎，勇猛威武',
        '卯': '木兔，溫和敏捷', '辰': '土龍，變化多端', '巳': '火蛇，智慧深沉',
        '午': '火馬，熱情奔放', '未': '土羊，溫柔善良', '申': '金猴，聰明活潑',
        '酉': '金雞，清廉正直', '戌': '土狗，忠誠可靠', '亥': '水豬，厚道純真'
    };
    return descriptions[zhi] || zhi;
}

function getNayin(gan, zhi) {
    // 納音對照表
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
        '楊柳木': '柔韌適應的能力'
    };
    return meanings[nayin] || '獨特的命格特質';
}

function getTenGod(pillarKey, pillar, data) {
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

function getShensha(pillarKey, pillar, data) {
    // 從數據中獲取神煞，簡化處理
    return '天乙貴人'; // 實際應該根據計算獲得
}

function getAllShenshaFromData(data) {
    // 從數據中提取所有神煞
    return ['天乙貴人', '太極貴人', '文昌貴人', '紅鸞', '天喜'];
}

function getGanElement(gan) {
    const elements = {
        '甲': '木', '乙': '木', '丙': '火', '丁': '火',
        '戊': '土', '己': '土', '庚': '金', '辛': '金',
        '壬': '水', '癸': '水'
    };
    return elements[gan] || '未知';
}

function getZhiElement(zhi) {
    const elements = {
        '子': '水', '丑': '土', '寅': '木', '卯': '木',
        '辰': '土', '巳': '火', '午': '火', '未': '土',
        '申': '金', '酉': '金', '戌': '土', '亥': '水'
    };
    return elements[zhi] || '未知';
}

function getElementInteraction(gan, zhi) {
    const ganElement = getGanElement(gan);
    const zhiElement = getZhiElement(zhi);
    
    if (ganElement === zhiElement) return '同氣相求';
    if ((ganElement === '木' && zhiElement === '火') || 
        (ganElement === '火' && zhiElement === '土') ||
        (ganElement === '土' && zhiElement === '金') ||
        (ganElement === '金' && zhiElement === '水') ||
        (ganElement === '水' && zhiElement === '木')) return '相生和諧';
    return '陰陽調和';
}

function getNayinInPosition(nayin, pillarKey) {
    const positions = {
        '年': '童年環境與家族傳承的體現',
        '月': '社會關係與事業發展的象徵', 
        '日': '個人特質與內在品格的展現',
        '時': '未來發展與子女運勢的指引'
    };
    return positions[pillarKey] || '特殊意義的展現';
}

function getPillarLifeAspect(pillarKey) {
    const aspects = {
        '年': '家庭背景、童年經歷、祖輩關係',
        '月': '父母關係、工作事業、人際社交',
        '日': '個人性格、婚姻感情、核心自我',
        '時': '子女教育、晚年生活、未來規劃'
    };
    return aspects[pillarKey] || '人生的重要層面';
}

function getPillarAdvice(pillarKey, pillar) {
    const advices = {
        '年': '重視家族傳統，保持與長輩的良好關係',
        '月': '積極建立人脈，把握事業發展機會',
        '日': '認識真實自我，經營好親密關係',
        '時': '提前規劃未來，注重自我實現'
    };
    return advices[pillarKey] || '順應天時，發揮優勢';
}

function getGanStrength(gan) {
    const strengths = {
        '甲': '領導統馭', '乙': '柔韌適應', '丙': '熱情創造', '丁': '細膩溫暖',
        '戊': '穩健可靠', '己': '包容滋養', '庚': '果決堅毅', '辛': '精緻優雅',
        '壬': '智慧流動', '癸': '純淨滋潤'
    };
    return strengths[gan] || '獨特天賦';
}

function getZhiStrength(zhi) {
    const strengths = {
        '子': '機智靈活', '丑': '踏實穩重', '寅': '勇猛進取', '卯': '溫和敏銳',
        '辰': '變通靈活', '巳': '深謀遠慮', '午': '熱情活力', '未': '溫順包容',
        '申': '聰明活潑', '酉': '精確務實', '戌': '忠誠守護', '亥': '純真厚道'
    };
    return strengths[zhi] || '特殊能力';
}

// 新增的增強分析函數
function getGanZhiHarmony(gan, zhi) {
    const ganElement = getGanElement(gan);
    const zhiElement = getZhiElement(zhi);
    
    if (ganElement === zhiElement) {
        return '干支同氣，力量集中';
    }
    
    // 相生關係
    const shengCycles = {
        '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
    };
    
    if (shengCycles[ganElement] === zhiElement) {
        return '干生支，主動給予';
    } else if (shengCycles[zhiElement] === ganElement) {
        return '支生干，被動接受';
    }
    
    // 相剋關係
    const keCycles = {
        '木': '土', '火': '金', '土': '水', '金': '木', '水': '火'
    };
    
    if (keCycles[ganElement] === zhiElement) {
        return '干克支，主導控制';
    } else if (keCycles[zhiElement] === ganElement) {
        return '支克干，承受壓力';
    }
    
    return '陰陽互補，平衡和諧';
}

function getGanNature(gan) {
    const natures = {
        '甲': '剛健進取，具有開創精神',
        '乙': '柔韌適應，富有包容力',
        '丙': '光明熱烈，充滿正能量',
        '丁': '細膩溫和，內斂而堅韌',
        '戊': '厚德載物，承載責任',
        '己': '謙遜務實，默默奉獻',
        '庚': '剛正不阿，果斷決絕',
        '辛': '精緻優雅，注重品質',
        '壬': '智慧流動，變化無窮',
        '癸': '純淨透澈，滋養萬物'
    };
    return natures[gan] || '獨特天性';
}

function getZhiNature(zhi) {
    const natures = {
        '子': '機敏活潑，善於變通',
        '丑': '忠厚老實，穩紮穩打',
        '寅': '勇敢無畏，開拓進取',
        '卯': '溫文儒雅，和諧共處',
        '辰': '靈活多變，富有想像',
        '巳': '深沉智慧，洞察先機',
        '午': '熱情奔放，積極向上',
        '未': '溫柔體貼，細心周到',
        '申': '聰明機智，反應敏捷',
        '酉': '嚴謹有序，精益求精',
        '戌': '忠誠可靠，守護至上',
        '亥': '寬厚包容，純真善良'
    };
    return natures[zhi] || '特殊品性';
}

function getTenGodDetailedMeaning(tenGod) {
    const detailedMeanings = {
        '比肩': '代表競爭與合作的雙重特質，具有獨立自主的性格，在團體中能夠發揮領導作用',
        '劫財': '象徵冒險與機遇並存，勇於挑戰現狀，具有突破傳統的創新精神',
        '食神': '體現創造與表達的天賦，享受生活的美好，能夠將內在才華轉化為實際成果',
        '傷官': '代表變革與創新的力量，不拘泥於傳統規範，具有獨特的見解和表達方式',
        '偏財': '象徵商業頭腦和投資眼光，善於把握機會，具有靈活的財務運作能力',
        '正財': '體現穩健的理財觀念，通過勤勞努力獲得財富，重視長期的積累和保值',
        '七殺': '代表權威與壓力的轉化，在挑戰中成長，具有克服困難的強大意志力',
        '正官': '象徵責任與法制觀念，正直廉潔，具有服務社會和維護正義的使命感',
        '偏印': '體現學習與直覺的天賦，善於吸收新知識，具有敏銳的洞察力和創新思維',
        '正印': '代表保護與支持的力量，重視學術文化，具有深厚的人文底蘊和教育情懷'
    };
    return detailedMeanings[tenGod] || '具有特殊的命理意義，需要深入分析其在整體格局中的作用';
}

function getTenGodRole(tenGod) {
    const roles = {
        '比肩': '平等競爭者與合作夥伴',
        '劫財': '資源爭奪者與機會創造者',
        '食神': '創意表達者與生活享受者',
        '傷官': '創新變革者與規則挑戰者',
        '偏財': '投機冒險者與機會捕捉者',
        '正財': '穩健經營者與財富積累者',
        '七殺': '權威挑戰者與困境克服者',
        '正官': '責任承擔者與秩序維護者',
        '偏印': '知識探索者與靈感啟發者',
        '正印': '智慧傳承者與文化守護者'
    };
    return roles[tenGod] || '特殊角色扮演者';
}

function getShenshaInfluence(pillarKey) {
    const influences = {
        '年': '家族運勢與祖德庇佑',
        '月': '事業發展與貴人助力',
        '日': '個人魅力與感情運勢',
        '時': '創造靈感與子女運勢'
    };
    return influences[pillarKey] || '特殊的命運影響';
}

function getNayinPower(nayin) {
    const powers = {
        '海中金': '深藏的珍貴潛能',
        '爐中火': '變革創新的驅動力',
        '大林木': '蓬勃成長的生命力',
        '路旁土': '默默承載的支撐力',
        '劍鋒金': '銳利突破的行動力',
        '山頭火': '光明照耀的領導力',
        '澗下水': '清澈純淨的智慧力',
        '城牆土': '堅固守護的保護力',
        '白臘金': '溫潤精緻的品格力',
        '楊柳木': '靈活適應的變通力',
        '泉中水': '源源不絕的創造力',
        '屋上土': '穩固支撐的基礎力',
        '霹靂火': '瞬間爆發的衝擊力',
        '松柏木': '堅韌不拔的持久力',
        '長流水': '持續不斷的推動力',
        '砂石金': '堅實可靠的執行力',
        '山下火': '溫暖照明的感化力',
        '平地木': '廣闊包容的涵養力',
        '壁上土': '保護守衛的防禦力',
        '金箔金': '華美精緻的表現力',
        '覆燈火': '照亮他人的奉獻力',
        '天河水': '浩瀚宏大的格局力',
        '大驛土': '承載萬物的包容力',
        '釵釧金': '精美雅緻的藝術力',
        '桑柘木': '默默付出的貢獻力',
        '大溪水': '奔流不息的活力',
        '砂中土': '滋養生命的培育力',
        '天上火': '光明普照的影響力',
        '石榴木': '豐碩成果的收穫力',
        '大海水': '包容一切的胸懷力'
    };
    return powers[nayin] || '獨特的能量優勢';
}

function getLifePhase(pillarKey) {
    const phases = {
        '年': '童年成長與青少年發展',
        '月': '青年奮鬥與中年事業',
        '日': '成年自我實現',
        '時': '晚年智慧與傳承延續'
    };
    return phases[pillarKey] || '人生重要階段';
}

function getOptimalTiming(pillarKey, pillar) {
    const gan = pillar.gan;
    const zhi = pillar.zhi;
    
    // 根據天干地支確定最佳時機
    const ganTiming = {
        '甲': '春季、寅卯月份',
        '乙': '春末夏初、辰巳月份',
        '丙': '夏季、午未月份',
        '丁': '夏末秋初、未申月份',
        '戊': '四季月、辰戌丑未月',
        '己': '四季土旺時、每季末月',
        '庚': '秋季、申酉月份',
        '辛': '秋末冬初、戌亥月份',
        '壬': '冬季、亥子月份',
        '癸': '冬末春初、子丑月份'
    };
    
    const zhiTiming = {
        '子': '夜間11點-1點，冬至前後',
        '丑': '凌晨1點-3點，十二月',
        '寅': '凌晨3點-5點，正月',
        '卯': '清晨5點-7點，二月',
        '辰': '上午7點-9點，三月',
        '巳': '上午9點-11點，四月',
        '午': '中午11點-1點，五月',
        '未': '下午1點-3點，六月',
        '申': '下午3點-5點，七月',
        '酉': '下午5點-7點，八月',
        '戌': '晚上7點-9點，九月',
        '亥': '晚上9點-11點，十月'
    };
    
    return `${ganTiming[gan] || '特定時期'}以及${zhiTiming[zhi] || '特殊時段'}`;
}

function showError(message) {
    const storiesContainer = document.getElementById('legion-stories');
    if (storiesContainer) {
        storiesContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #ff6ec4;">
                <h3>${message}</h3>
                <button onclick="goBack()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #ff6ec4; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    返回首頁
                </button>
            </div>
        `;
    }
}

// 導出報告
function exportLegionReport() {
    window.print();
}

// 分享故事
function shareStories() {
    if (navigator.share) {
        navigator.share({
            title: '我的四時軍團故事',
            text: '看看我的八字軍團故事！',
            url: window.location.href
        }).catch(console.error);
    } else {
        // 復制到剪貼板
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('連結已複製到剪貼板！');
        }).catch(() => {
            alert('請手動複製連結分享：' + url);
        });
    }
}

// 返回結果頁
function goBack() {
    window.history.back();
}