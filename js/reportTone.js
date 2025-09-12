function generateHealingReport(chart, narrative) { /* ...如前所述... */ }
function generateMilitaryReport(chart, narrative) { /* ...如前所述... */ }
function generateMythicReport(chart, narrative) { /* ...如前所述... */ }
function generateSavageReport(chart, narrative) { /* ...如前所述... */ }

function getSavageComment(tenGod) {
  if (!tenGod || tenGod === "無十神") return "你這柱沒個性，像背景牆。"
  const map = {
    "比肩": "你超愛自己，別人都只是背景板。",
    "劫財": "你搶資源搶得理直氣壯，連朋友都怕你。",
    "食神": "嘴巴很會講，但做事呢？嗯。",
    "傷官": "你是創意爆棚，但情緒也爆炸。",
    "偏財": "你錢來得快，花得更快，存款是傳說。",
    "正財": "你很穩，但穩到讓人想睡。",
    "偏官": "你超會控制人，但不一定控制得住自己。",
    "正官": "你表面服從，內心叛逆，雙面人代表。",
    "偏印": "你活在自己的世界，別人進不來。",
    "正印": "你很照顧人，但有時太黏太煩。"
  }
  const key = Object.keys(map).find(k => tenGod.includes(k))
  return key ? map[key] : "你這柱的個性我都懶得吐槽了。"
}

function renderNarrativeReport(tone, chart, narrative) {
  let html = ""
  if (tone === "healing") html = generateHealingReport(chart, narrative)
  else if (tone === "military") html = generateMilitaryReport(chart, narrative)
  else if (tone === "mythic") html = generateMythicReport(chart, narrative)
  else if (tone === "savage") html = generateSavageReport(chart, narrative)
  else html = "<p>⚠️ 無法辨識語氣，請重新選擇。</p>"

  const body = document.getElementById("report-body")
  body.innerHTML = html
  body.className = `report-body ${tone}-style`
}
