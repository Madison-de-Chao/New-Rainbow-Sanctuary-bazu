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
        <strong>五行分析：</strong>${gan}屬${getGanElement(gan)}，${zhi}屬${getZhiElement(zhi)}，此柱五行配置體現了${getElementInteraction(gan, zhi)}的特質。<br><br>
        
        <strong>納音解讀：</strong>${nayin}代表${getNayinMeaning(nayin)}，在${pillarKey}柱的位置上，象徵著${getNayinInPosition(nayin, pillarKey)}。<br><br>
        
        <strong>生活影響：</strong>此柱在實際生活中主要影響${getPillarLifeAspect(pillarKey)}，建議在這些方面要${getPillarAdvice(pillarKey, pillar)}。<br><br>
        
        <strong>發展建議：</strong>充分發揮${gan}的${getGanStrength(gan)}特質，同時運用${zhi}的${getZhiStrength(zhi)}能力，可以在${pillarKey === '年' ? '家庭關係' : pillarKey === '月' ? '事業發展' : pillarKey === '日' ? '個人成長' : '未來規劃'}方面取得突破。
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