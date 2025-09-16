# 虹靈御所 · Rainbow Sanctuary

在虹靈御所，我們相信： 認識自己，不是尋找答案，而是發現價值。 天賦是你與生俱來的旗幟， 擅長是你磨礪後的武器， 而價值，是你在世界留下的印記。

## 專案簡介

虹靈御所是一個融合現代網頁技術與傳統八字命理的互動式應用程式。透過優雅的使用者介面和多元的敘事風格，將古老的命理智慧轉化為現代人易於理解的個人洞察報告。

### 核心理念
- **藝術與真理並行** (Art, Bravery, Creation & Truth)
- **始終帶來關懷與真實** (Always Bring Care & Truth) 
- **靈魂的骨架 × 情感的光譜**

## 主要功能

### 🎭 多元敘事風格
- **軍事風格** - 以戰略軍團的角度解讀命盤
- **療癒風格** - 溫柔守護的語調提供心靈滋養
- **詩意風格** - 美學意境的詩性表達
- **神話風格** - 古老傳說的神秘敘述
- **毒舌風格** - 直接犀利的個性分析

### 🔮 互動體驗
- **粒子動畫背景** - 沉浸式的視覺體驗
- **打字機效果** - 動態文字展示增強代入感
- **響應式設計** - 適配各種裝置螢幕
- **音效支援** - 可選的語音開場和角色配音

### 📊 命盤分析
- **四柱八字計算** - 年月日時完整命盤
- **五行分佈圖表** - 視覺化五行能量分析  
- **十神關係解讀** - 深度個性特質分析
- **陰陽平衡檢視** - 能量場平衡狀況

## 技術架構

### 前端技術
- **HTML5** - 語義化結構
- **CSS3** - 響應式設計與動畫效果
- **JavaScript (ES6+)** - 互動邏輯與動畫控制
- **Chart.js** - 數據視覺化圖表
- **Typed.js** - 打字機動畫效果

### 字體與設計
- **Noto Serif TC** - 中文宋體，增強文化氛圍
- **Google Fonts** - 網頁字體優化
- **自訂主題系統** - 支援多種視覺風格切換

## 專案結構

```
├── index.html              # 首頁動畫（入口儀式）
├── bazi.html               # 八字輸入與軍團召喚頁
├── report.html             # 命盤報告展示頁
├── test-cases.html         # 測試案例頁面
│
├── css/                    # 樣式表資料夾
│   ├── style.css           # 全站主樣式
│   ├── index.css           # 首頁專用樣式
│   ├── bazi.css            # 八字頁面樣式
│   ├── report.css          # 報告頁面樣式
│   └── theme.css           # 顏色與能量場切換樣式
│
├── js/                     # JavaScript 控制邏輯
│   ├── animation.js        # 首頁動畫與粒子效果控制
│   ├── app.js              # 八字邏輯與 API 串接
│   ├── report.js           # 報告頁渲染與多風格生成
│   ├── api.js              # API 接口相關功能
│   ├── enhanced-app.js     # 增強版應用邏輯
│   └── 其他輔助模組...      # 敘事生成、計算器等
│
├── assets/                 # 靜態資源資料夾
│   ├── logo/               # Maison de Chao × Rainbow Sanctuary 品牌圖騰
│   ├── bg/                 # 背景圖、粒子動畫素材
│   ├── fonts/              # 品牌字體（宋體、黑體、Garamond）
│   └── audio/              # 語音開場、角色語音配音（可選）
│
├── data/                   # 資料結構與範例
│   └── sample.json         # 八字數據結構範例與敘事設定
│
├── docs/                   # 專案文件
│   └── BRANCH_PROTECTION.md # 分支保護設定指南
│
├── .github/                # GitHub 設定
│   └── workflows/          # CI/CD 工作流程
│       ├── branch-protection.yml    # 分支保護檢查
│       ├── pr-validation.yml       # Pull Request 驗證
│       ├── application-tests.yml   # 應用程式測試
│       └── deployment-check.yml    # 部署準備檢查
│
└── README.md               # 專案說明文件
```

## 安裝與使用

### 環境需求
- 現代網頁瀏覽器 (Chrome, Firefox, Safari, Edge)
- 本地伺服器環境 (可選，用於 API 功能)

### 快速開始

1. **克隆專案**
   ```bash
   git clone https://github.com/Madison-de-Chao/New-Rainbow-Sanctuary-bazu.git
   cd New-Rainbow-Sanctuary-bazu
   ```

2. **啟動本地伺服器**
   ```bash
   # 使用 Python
   python -m http.server 8000
   
   # 或使用 Node.js
   npx serve .
   
   # 或使用 PHP
   php -S localhost:8000
   ```

3. **訪問應用**
   開啟瀏覽器，前往 `http://localhost:8000`

### 使用流程

1. **進入首頁** - 欣賞品牌動畫，選擇敘事語氣
2. **輸入生辰** - 在八字頁面填入出生年月日時
3. **生成命盤** - 系統計算四柱八字與五行分佈
4. **查看報告** - 獲得個人化的命理分析報告
5. **匯出分享** - 列印或分享你的專屬報告

## API 整合

### 後端需求
本專案需要後端 API 支援以下端點：

```javascript
// 生成八字命盤
POST /generate
{
  "input": {
    "yyyy": 1990,
    "mm": 5,
    "dd": 15,
    "hh": 14,
    "minute": 0,
    "zMode": "late"
  },
  "tone": "military"
}

// 生成詳細報告
POST /report
{
  "chart": { ... },      // 八字命盤數據
  "narrative": { ... }   // 敘事內容
}
```

### 數據格式
參考 `data/sample.json` 查看完整的數據結構範例，包含：
- **pillars** - 四柱八字信息
- **fiveElements** - 五行分佈統計
- **yinYang** - 陰陽能量比例
- **tenGods** - 十神關係分析
- **narrative** - 多風格敘事內容

## 開發指南

### 新增敘事風格
1. 在 `data/sample.json` 的 `toneSettings` 中定義新風格
2. 在 `js/report.js` 中實作對應的生成函數
3. 在 `index.html` 的選擇器中加入新選項

### 自訂主題樣式
- 編輯 `css/theme.css` 調整色彩與視覺效果
- 修改 CSS 變數來快速切換整體風格
- 支援深色/淺色模式切換

### 擴展動畫效果
- `js/animation.js` 控制首頁粒子與動畫
- 使用 Canvas API 和 requestAnimationFrame
- 可自訂粒子數量、運動軌跡和顏色

## 瀏覽器支援

| 瀏覽器 | 版本 | 狀態 |
|--------|------|------|
| Chrome | 60+ | ✅ 完全支援 |
| Firefox | 55+ | ✅ 完全支援 |
| Safari | 12+ | ✅ 完全支援 |
| Edge | 79+ | ✅ 完全支援 |
| IE | - | ❌ 不支援 |

## 貢獻指南

歡迎提交 Issue 和 Pull Request！

### 開發流程
1. Fork 本專案
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request
6. 等待自動化檢查通過
7. 請求程式碼審查
8. 合併至主分支

### 程式碼規範
- 使用一致的縮排（2個空格）
- 中文註解與變數命名
- 保持函數簡潔單一職責
- 遵循現有的程式碼風格

### 程式碼驗證
在提交程式碼前，請確保通過語法檢查：

```bash
# 檢查 JavaScript 語法
npm run syntax-check

# 或直接執行檢查腳本
node scripts/check-js-syntax.js

# 執行完整測試套件
npm test
```

自動化檢查包含：
- ✅ **JavaScript 語法驗證** - 確保所有 JS 檔案無語法錯誤
- ✅ **JSON 格式檢查** - 驗證設定檔案格式正確
- ✅ **檔案結構檢查** - 確認必要檔案存在

### 分支保護
本專案啟用嚴格的分支保護機制：
- 🔒 **禁止強制推送** - 防止 `git push --force` 覆蓋歷史
- 🔒 **禁止刪除主分支** - 保護 `main`/`master` 分支不被意外刪除
- ✅ **必須通過狀態檢查** - 所有 CI/CD 檢查必須通過才能合併
- 👥 **需要程式碼審查** - 至少一位審查者批准才能合併

詳細設定說明請參考：[分支保護設定指南](docs/BRANCH_PROTECTION.md)

## 授權條款

本專案採用 MIT 授權條款。詳見 [LICENSE](LICENSE) 檔案。

## 聯絡資訊

- **專案作者**: Madison de Chao
- **機構**: Maison de Chao × Rainbow Sanctuary
- **專案網址**: https://github.com/Madison-de-Chao/New-Rainbow-Sanctuary-bazu

---

*「從這裡開始，成為自己生命劇本的主角」*
