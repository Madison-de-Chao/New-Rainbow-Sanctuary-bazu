# 分支保護設定指南 | Branch Protection Setup Guide

## 概述 | Overview

本專案已實作完整的分支保護機制，透過 GitHub Actions 工作流程提供自動化狀態檢查，確保程式碼品質和專案穩定性。

This project implements comprehensive branch protection through GitHub Actions workflows that provide automated status checks to ensure code quality and project stability.

## 工作流程說明 | Workflow Description

### 1. 分支保護檢查 | Branch Protection Checks
**檔案**: `.github/workflows/branch-protection.yml`

**觸發條件 | Triggers**:
- 推送至 `main` 或 `master` 分支
- 對 `main` 或 `master` 分支的 Pull Request

**檢查項目 | Checks**:
- ✅ **程式碼品質檢查** - HTML、JavaScript、CSS、JSON 語法驗證
- ✅ **檔案結構檢查** - 確認必要檔案存在，檢查敏感檔案
- ✅ **文件完整性檢查** - 驗證 README.md 必要章節
- ✅ **安全性檢查** - 偵測硬編碼密碼、API 金鑰等安全問題
- ✅ **相容性檢查** - 檢查瀏覽器相容性和現代 JavaScript 功能

### 2. Pull Request 驗證 | Pull Request Validation
**檔案**: `.github/workflows/pr-validation.yml`

**觸發條件 | Triggers**:
- Pull Request 開啟、同步、重新開啟

**檢查項目 | Checks**:
- ✅ **PR 標題格式檢查** - 建議使用 Conventional Commit 格式
- ✅ **關鍵檔案變更檢查** - 對重要檔案變更提出警告
- ✅ **提交訊息檢查** - 確保提交訊息有意義且足夠詳細
- ✅ **合併衝突檢查** - 偵測合併衝突標記
- ✅ **檔案大小檢查** - 警告大型檔案
- ✅ **相依性檢查** - 檢查新增的外部相依性

### 3. 應用程式測試 | Application Tests
**檔案**: `.github/workflows/application-tests.yml`

**檢查項目 | Checks**:
- ✅ **功能測試** - 應用程式啟動和頁面可訪問性測試
- ✅ **資料驗證** - 驗證 sample.json 資料結構完整性
- ✅ **JavaScript 功能測試** - 模組載入和語法驗證
- ✅ **CSS 驗證** - 樣式檔案語法和結構檢查
- ✅ **無障礙性檢查** - HTML 無障礙功能驗證

### 4. 部署準備檢查 | Deployment Readiness Check
**檔案**: `.github/workflows/deployment-check.yml`

**檢查項目 | Checks**:
- ✅ **部署驗證** - 確認所有必要靜態檔案存在
- ✅ **開發產物檢查** - 警告不應部署的開發檔案
- ✅ **效能檢查** - 分析 HTTP 請求數和資源優化
- ✅ **瀏覽器相容性** - 檢查 CSS 和 JavaScript 相容性
- ✅ **SEO 檢查** - 驗證 meta 標籤和 SEO 相關設定

## GitHub 分支保護規則設定 | GitHub Branch Protection Rules Setup

### 管理員設定步驟 | Admin Setup Steps

1. **前往倉庫設定**
   - 導航至 GitHub 倉庫
   - 點擊 `Settings` 標籤
   - 在左側選單選擇 `Branches`

2. **新增分支保護規則**
   - 點擊 `Add rule`
   - 在 `Branch name pattern` 輸入 `main` (或 `master`)

3. **啟用保護選項**
   ```
   ✅ Restrict pushes that create files larger than 100 MB
   ✅ Require a pull request before merging
   ✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging
   ✅ Require conversation resolution before merging
   ✅ Restrict pushes that create files larger than 100 MB
   ✅ Do not allow bypassing the above settings
   ```

4. **設定必要狀態檢查**
   在 `Require status checks to pass before merging` 區域中，搜尋並添加以下檢查：
   ```
   - Code Quality Check
   - File Structure Check
   - Documentation Check
   - Security Check
   - Compatibility Check
   - Pull Request Checks
   - Functional Tests
   - Data Validation Tests
   - JavaScript Functionality Tests
   - CSS Validation Tests
   - Accessibility Check
   - Deployment Validation
   - Browser Compatibility Check
   - SEO and Meta Tags Check
   ```

5. **進階保護選項**
   ```
   ✅ Require signed commits (建議)
   ✅ Include administrators (強制管理員也遵循規則)
   ✅ Allow force pushes (不建議啟用)
   ✅ Allow deletions (不建議啟用)
   ```

### 開發者工作流程 | Developer Workflow

1. **建立功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **進行開發並提交**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

3. **推送分支**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **建立 Pull Request**
   - 在 GitHub 上建立 Pull Request
   - 等待所有狀態檢查通過
   - 請求程式碼審查

5. **合併前確認**
   - 所有狀態檢查必須顯示綠色 ✅
   - 至少一位審查者批准
   - 解決所有對話

## 狀態檢查失敗處理 | Handling Failed Status Checks

### 常見問題和解決方案 | Common Issues and Solutions

#### 1. 程式碼品質檢查失敗
```bash
❌ Code Quality Check failed
```
**解決方案**:
- 檢查 HTML 檔案是否有完整的 `<!DOCTYPE>` 和 `</html>` 標籤
- 使用 `node -c filename.js` 驗證 JavaScript 語法
- 檢查 CSS 檔案括號是否配對
- 使用 `python3 -m json.tool filename.json` 驗證 JSON 格式

#### 2. 檔案結構檢查失敗
```bash
❌ File Structure Check failed
```
**解決方案**:
- 確認所有必要檔案存在：`index.html`, `bazi.html`, `report.html`, `README.md`, `css/style.css`, `js/app.js`, `data/sample.json`
- 移除或忽略敏感檔案（`.env`, `*.key`, `*password*` 等）

#### 3. 安全性檢查失敗
```bash
❌ Security Check failed
```
**解決方案**:
- 移除硬編碼的密碼或 API 金鑰
- 將敏感資訊移至環境變數或設定檔
- 確保不提交機密資料

#### 4. Pull Request 檢查失敗
```bash
❌ Pull Request Checks failed
```
**解決方案**:
- 使用描述性的 PR 標題（建議: `feat: 新功能`, `fix: 修復問題`, `docs: 更新文件`）
- 撰寫有意義的提交訊息（至少 10 個字元）
- 解決合併衝突

## 自訂檢查規則 | Customizing Check Rules

### 修改工作流程
要自訂檢查規則，編輯對應的工作流程檔案：

```yaml
# 例如：修改必要檔案清單
required_files=(
  "index.html"
  "bazi.html" 
  "report.html"
  "README.md"
  "css/style.css"
  "js/app.js"
  "data/sample.json"
  # 在此添加新的必要檔案
)
```

### 添加新的檢查
可以在現有工作流程中添加新的檢查步驟：

```yaml
- name: Custom Check
  run: |
    echo "Running custom validation..."
    # 在此添加自訂檢查邏輯
    echo "✅ Custom check passed"
```

## 監控和維護 | Monitoring and Maintenance

### 檢視工作流程狀態
- 在 GitHub 倉庫的 `Actions` 標籤中檢視工作流程執行狀態
- 檢查失敗的工作流程日誌以了解問題原因

### 定期維護
- 定期檢查和更新工作流程
- 根據專案需求調整檢查規則
- 確保所有相依性保持最新

## 緊急情況 | Emergency Procedures

### 暫時停用保護
如遇緊急情況需要快速推送：
1. 聯絡倉庫管理員
2. 暫時停用分支保護規則
3. 進行必要的推送
4. 立即重新啟用保護規則

### 繞過檢查（不建議）
管理員可以在特殊情況下繞過狀態檢查，但應謹慎使用此功能。

---

## 支援 | Support

如有任何問題或建議，請：
1. 查看工作流程執行日誌
2. 建立 Issue 描述問題
3. 聯絡專案維護者

**記住**：分支保護是為了確保程式碼品質和專案穩定性。雖然可能會增加一些開發時間，但長期來看有助於減少錯誤和提高專案品質。