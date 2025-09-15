// Enhanced App Entry Point - Single Module Entry
// Prevents duplicate loading and global variable conflicts

// Prevent duplicate loading
if (window.__APP_BOOTED__) {
  throw new Error("Application already booted - duplicate load detected");
}
window.__APP_BOOTED__ = true;

// Import constants and functions from individual modules
// Note: For now, we'll use a gradual approach with global variable protection

// A. Safe global variable declarations with protection
window.API_BASE = window.API_BASE || "https://rainbow-sanctuary-bazu-production.up.railway.app";

window.SHENSHA_EFFECTS = window.SHENSHA_EFFECTS || {
  "天乙貴人": "天賦異稟，貴人相助",
  "太極貴人": "聰明好學，易得成就",
  "德秀貴人": "品德高尚，才華出眾",
  "文昌貴人": "文思敏捷，學業有成",
  "學堂詞館": "智慧超群，博學多才",
  "紅鸞": "桃花運佳，感情豐富",
  "天喜": "喜事連連，心情愉悅",
  "咸池": "魅力十足，異性緣佳",
  "孤辰": "性格孤僻，獨立自主",
  "寡宿": "感情孤獨，但意志堅強",
  "華蓋": "藝術天分，獨特品味",
  "空亡": "虛無縹緲，需腳踏實地",
  "劫煞": "破財危機，需謹慎理財",
  "災煞": "意外災厄，需小心防範",
  "天德": "逢凶化吉，貴人扶持",
  "月德": "品行端正，福澤深厚"
};

window.GAN_ROLE = window.GAN_ROLE || {
  "甲": { name: "甲木將軍", role: "統帥", element: "木", description: "如參天大樹般的領導者" },
  "乙": { name: "乙木謀士", role: "智囊", element: "木", description: "如柔韌花草般的策略家" },
  "丙": { name: "丙火戰神", role: "先鋒", element: "火", description: "如烈日般的勇猛戰士" },
  "丁": { name: "丁火法師", role: "術士", element: "火", description: "如燭光般的神秘法師" },
  "戊": { name: "戊土守衛", role: "防禦", element: "土", description: "如高山般的堅實護衛" },
  "己": { name: "己土後勤", role: "支援", element: "土", description: "如沃土般的後勤專家" },
  "庚": { name: "庚金騎士", role: "騎兵", element: "金", description: "如利劍般的騎兵隊長" },
  "辛": { name: "辛金刺客", role: "暗殺", element: "金", description: "如珠寶般的優雅刺客" },
  "壬": { name: "壬水水師", role: "水軍", element: "水", description: "如大海般的水師統帥" },
  "癸": { name: "癸水間諜", role: "情報", element: "水", description: "如甘露般的神秘間諜" }
};

// B. Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Enhanced App Entry Point loaded");
  
  // Wait for all scripts to load
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Check if the enhanced-app main logic is available
  if (typeof window.initializeEnhancedApp === 'function') {
    window.initializeEnhancedApp();
  } else {
    console.log("Enhanced app main logic not yet available, will retry...");
    // Fallback initialization logic here if needed
  }
  
  // Ensure result-container exists
  const resultContainer = document.getElementById("result-container");
  if (!resultContainer) {
    console.warn("result-container not found, creating fallback...");
    const resultSection = document.getElementById("result");
    if (resultSection) {
      const container = document.createElement("div");
      container.id = "result-container";
      resultSection.appendChild(container);
    }
  }
});