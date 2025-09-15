// Traditional Bazi Renderer - 八字傳統渲染器
// 避免與其他文件衝突，使用獨立命名空間

const TraditionalBaziRenderer = {
  // 渲染傳統八字盤
  renderTraditionalChart: function(pillars, containerId = 'pillars') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Container ${containerId} not found`);
      return;
    }

    const pillarNames = ['年', '月', '日', '時'];
    const colors = ['#ff6ec4', '#7873f5', '#00d4ff', '#ff9500'];
    
    container.innerHTML = ''; // 清空容器
    
    pillarNames.forEach((name, index) => {
      const pillarData = pillars[name];
      if (!pillarData) return;
      
      const pillarElement = document.createElement('div');
      pillarElement.className = 'traditional-pillar';
      pillarElement.style.cssText = `
        display: inline-block;
        margin: 0.5rem;
        padding: 1.5rem;
        border: 2px solid ${colors[index]};
        border-radius: 8px;
        text-align: center;
        background: linear-gradient(135deg, ${colors[index]}20, ${colors[index]}10);
        min-width: 120px;
      `;
      
      pillarElement.innerHTML = `
        <div style="color: ${colors[index]}; font-weight: bold; margin-bottom: 0.5rem;">
          ${name}柱
        </div>
        <div style="font-size: 1.5rem; font-weight: bold; color: white; margin: 0.5rem 0;">
          ${pillarData.pillar || pillarData.gan + pillarData.zhi}
        </div>
        <div style="font-size: 0.9rem; color: #ccc;">
          ${pillarData.gan} | ${pillarData.zhi}
        </div>
      `;
      
      container.appendChild(pillarElement);
    });
  },

  // 渲染五行統計
  renderFiveElements: function(elements, containerId = 'five-elements') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const elementNames = ['金', '木', '水', '火', '土'];
    const elementColors = ['#FFD700', '#32CD32', '#1E90FF', '#FF4500', '#8B4513'];
    
    container.innerHTML = '<h3>五行統計</h3>';
    
    elementNames.forEach((name, index) => {
      const count = elements[name] || 0;
      const bar = document.createElement('div');
      bar.style.cssText = `
        display: flex;
        align-items: center;
        margin: 0.5rem 0;
        color: white;
      `;
      
      bar.innerHTML = `
        <span style="width: 20px; color: ${elementColors[index]};">${name}</span>
        <div style="flex: 1; background: #333; height: 20px; margin: 0 10px; border-radius: 10px; overflow: hidden;">
          <div style="background: ${elementColors[index]}; height: 100%; width: ${count * 20}px; transition: width 0.5s;"></div>
        </div>
        <span style="width: 20px; text-align: right;">${count}</span>
      `;
      
      container.appendChild(bar);
    });
  }
};

// 防止重複宣告錯誤，僅在未定義時才定義
if (typeof window !== 'undefined' && !window.TraditionalBaziRenderer) {
  window.TraditionalBaziRenderer = TraditionalBaziRenderer;
}