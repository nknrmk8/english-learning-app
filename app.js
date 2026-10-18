"use strict";
/* =========================================================
   Meeting English Trainer — app logic
   ========================================================= */

/* ---------- utils ---------- */
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const norm = s => String(s || "").toLowerCase().replace(/[^a-z0-9'\s]/g, " ").replace(/\s+/g, " ").trim();
const words = s => norm(s).split(" ").filter(Boolean);
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const todayKey = () => new Date().toISOString().slice(0, 10);
const rnd = arr => arr[Math.floor(Math.random() * arr.length)];
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
const fmtMin = sec => sec < 60 ? "0" : String(Math.round(sec / 60));

/* ---------- storage ---------- */
const APP_KEY = "met_app_v2";
let APP = loadApp();
let P = null;            // current profile data
let PKEY = "";

function loadApp() {
  try { const a = JSON.parse(localStorage.getItem(APP_KEY)); if (a && a.profiles) return a; } catch (e) { }
  return { profiles: [], current: null };
}
function saveApp() { try { localStorage.setItem(APP_KEY, JSON.stringify(APP)); } catch (e) { } }

function blankProfileData() {
  return {
    settings: { rate: 1.0, v1: "", v2: "", v3: "", ja: "", showJa: true, fs: "m", theme: "" },
    study: {}, scenario: {}, saved: [],
    skills: { listening: [], speaking: [], vocabulary: [], fluency: [], pronunciation: [] },
    weak: { phrases: {}, words: {}, listen: {} },
    sessions: {}, logs: [], recordings: []
  };
}
function loadProfile(id) {
  PKEY = "met_p_" + id;
  try { P = JSON.parse(localStorage.getItem(PKEY)); } catch (e) { P = null; }
  if (!P) P = blankProfileData();
  // migrate / fill
  const b = blankProfileData();
  for (const k in b) if (P[k] == null) P[k] = b[k];
  P.settings = Object.assign(b.settings, P.settings);
  for (const k in b.skills) if (!Array.isArray(P.skills[k])) P.skills[k] = [];
  for (const k in b.weak) if (!P.weak[k]) P.weak[k] = {};
}
function save() { try { localStorage.setItem(PKEY, JSON.stringify(P)); } catch (e) { } }

/* ---------- session timer ---------- */
let tickTimer = null;
function startTick() {
  clearInterval(tickTimer);
  tickTimer = setInterval(() => {
    if (document.visibilityState !== "visible" || !P) return;
    const d = todayKey();
    const s = P.sessions[d] || { sec: 0, lessons: 0, utter: 0, correct: 0, total: 0 };
    s.sec += 10; P.sessions[d] = s; save();
  }, 10000);
}
function sessToday() {
  const d = todayKey();
  return P.sessions[d] || (P.sessions[d] = { sec: 0, lessons: 0, utter: 0, correct: 0, total: 0 });
}
function weekStats() {
  const out = { sec: 0, lessons: 0, utter: 0, correct: 0, total: 0, days: 0 };
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now); d.setDate(now.getDate() - i);
    const s = P.sessions[d.toISOString().slice(0, 10)];
    if (s) { out.sec += s.sec; out.lessons += s.lessons; out.utter += s.utter; out.correct += s.correct; out.total += s.total; if (s.sec > 30) out.days++; }
  }
  return out;
}

/* ---------- skills ---------- */
const SKILL_LABEL = { listening: "Listening", speaking: "Speaking", vocabulary: "Vocabulary", fluency: "Fluency", pronunciation: "Pronunciation" };
function pushSkill(k, v) {
  if (!P.skills[k]) P.skills[k] = [];
  P.skills[k].push(Math.round(v));
  if (P.skills[k].length > 60) P.skills[k].shift();
}
function skillAvg(k) {
  const a = P.skills[k] || [];
  if (!a.length) return null;
  const recent = a.slice(-12);
  return Math.round(recent.reduce((x, y) => x + y, 0) / recent.length);
}

/* ---------- IndexedDB (recordings) ---------- */
let _db = null;
function db() {
  return new Promise((res, rej) => {
    if (_db) return res(_db);
    if (!("indexedDB" in window)) return rej(new Error("no idb"));
    const q = indexedDB.open("met_rec", 1);
    q.onupgradeneeded = () => { if (!q.result.objectStoreNames.contains("rec")) q.result.createObjectStore("rec"); };
    q.onsuccess = () => { _db = q.result; res(_db); };
    q.onerror = () => rej(q.error);
  });
}
async function recPut(key, blob) {
  try { const d = await db(); await new Promise((r, j) => { const t = d.transaction("rec", "readwrite"); t.objectStore("rec").put(blob, key); t.oncomplete = r; t.onerror = () => j(t.error); }); return true; }
  catch (e) { return false; }
}
async function recGet(key) {
  try { const d = await db(); return await new Promise((r, j) => { const t = d.transaction("rec", "readonly"); const q = t.objectStore("rec").get(key); q.onsuccess = () => r(q.result || null); q.onerror = () => j(q.error); }); }
  catch (e) { return null; }
}
async function recDel(key) {
  try { const d = await db(); await new Promise(r => { const t = d.transaction("rec", "readwrite"); t.objectStore("rec").delete(key); t.oncomplete = r; t.onerror = r; }); } catch (e) { }
}

/* =========================================================
   TTS
   ========================================================= */
let EN_VOICES = [], JA_VOICES = [];
const FEMALE_RE = /female|zira|jenny|aria|michelle|\bana\b|emma|ava|sonia|libby|natasha|clara|samantha|karen|moira|tessa|serena|susan|linda|heather|hazel|catherine|salli|joanna|kendra|kimberly|ivy|amy|nicole|nanami|haruka|kyoko|sayaka|ayumi|mizuki/i;
const MALE_RE = /male|david|mark|\bguy\b|ryan|thomas|andrew|brian|christopher|eric|roger|steve|alex|daniel|fred|george|james|william|liam|matthew|joey|justin|russell|ichiro|keita|naoki|takumi/i;

function refreshVoices() {
  const all = (window.speechSynthesis ? speechSynthesis.getVoices() : []) || [];
  EN_VOICES = all.filter(v => (v.lang || "").toLowerCase().startsWith("en"));
  JA_VOICES = all.filter(v => (v.lang || "").toLowerCase().startsWith("ja"));
}
function guessGender(v) { if (FEMALE_RE.test(v.name)) return "female"; if (MALE_RE.test(v.name)) return "male"; return ""; }

/* 仕様 4章: Voice1 女性/標準/明瞭, Voice2 男性/自然速度, Voice3 やや速め */
const VOICE_PROFILES = [
  { key: "v1", no: 1, name: "Voice 1 — 女性・標準速度", desc: "ゆっくり明瞭。まず意味を掴む", want: "female", rate: 0.85 },
  { key: "v2", no: 2, name: "Voice 2 — 男性・自然な会話速度", desc: "実際の会議に近いスピード", want: "male", rate: 1.0 },
  { key: "v3", no: 3, name: "Voice 3 — やや速め・ネイティブ寄り", desc: "聞き取りの負荷を上げる仕上げ", want: "any", rate: 1.22 }
];
function voiceFor(prof) {
  const set = P && P.settings[prof.key];
  if (set) { const v = EN_VOICES.find(v => v.name === set); if (v) return v; }
  if (prof.want === "female") return EN_VOICES.find(v => guessGender(v) === "female") || EN_VOICES[0] || null;
  if (prof.want === "male") return EN_VOICES.find(v => guessGender(v) === "male") || EN_VOICES[1] || EN_VOICES[0] || null;
  // v3: v1/v2 と別の声を優先
  const used = [P && P.settings.v1, P && P.settings.v2].filter(Boolean);
  return EN_VOICES.find(v => !used.includes(v.name) && v !== EN_VOICES[0]) || EN_VOICES[EN_VOICES.length - 1] || EN_VOICES[0] || null;
}
function jaVoice() {
  if (P && P.settings.ja) { const v = JA_VOICES.find(v => v.name === P.settings.ja); if (v) return v; }
  return JA_VOICES[0] || null;
}

let seqToken = 0, seqActive = false;
function stopSpeak() { seqActive = false; seqToken++; if (window.speechSynthesis) { try { speechSynthesis.cancel(); } catch (e) { } } }
function ttsAvailable() { return "speechSynthesis" in window; }

function speakOne(text, { voice = null, rate = 1, lang = "en-US", onBoundary = null, onEnd = null } = {}) {
  if (!ttsAvailable()) { toast("この端末は音声合成に対応していません"); if (onEnd) onEnd(); return; }
  stopSpeak();
  const tok = ++seqToken; seqActive = true;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang; u.rate = clamp(rate * (P ? P.settings.rate : 1), 0.5, 2);
  if (voice) { u.voice = voice; u.lang = voice.lang; }
  if (onBoundary) u.onboundary = onBoundary;
  const fin = () => { if (tok === seqToken) { seqActive = false; if (onEnd) onEnd(); } };
  u.onend = fin; u.onerror = fin;
  speechSynthesis.speak(u);
}
function speakSeq(items, onAllEnd) {
  if (!ttsAvailable()) { toast("この端末は音声合成に対応していません"); return; }
  stopSpeak();
  const tok = ++seqToken; seqActive = true;
  let i = 0;
  const next = () => {
    if (!seqActive || tok !== seqToken) return;
    if (i >= items.length) { seqActive = false; if (onAllEnd) onAllEnd(); return; }
    const it = items[i++];
    const u = new SpeechSynthesisUtterance(it.text);
    u.lang = it.lang || "en-US"; u.rate = clamp((it.rate || 1) * (P ? P.settings.rate : 1), 0.5, 2);
    if (it.voice) { u.voice = it.voice; u.lang = it.voice.lang; }
    if (it.onBoundary) u.onboundary = it.onBoundary;
    if (it.onStart) it.onStart();
    const go = () => { if (it.onEnd) it.onEnd(); setTimeout(next, 380); };
    u.onend = go; u.onerror = go;
    speechSynthesis.speak(u);
  };
  next();
}

/* onclick に文字列を直接埋め込むと引用符で壊れるため、data属性経由で読み上げる */
function sayBtn(el) {
  const t = el.dataset.t || "";
  if (!t) return;
  if (el.dataset.lang === "ja") { speakOne(t, { voice: jaVoice(), lang: "ja-JP", rate: 1 }); return; }
  const vi = +(el.dataset.v || 1);
  const prof = VOICE_PROFILES[vi] || VOICE_PROFILES[1];
  speakOne(t, { voice: voiceFor(prof), rate: el.dataset.rate ? +el.dataset.rate : prof.rate });
}

/* =========================================================
   音声認識 + 録音
   ========================================================= */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
let activeRec = null, recTimer = null, mediaRec = null, mediaStream = null, recChunks = [], recStartAt = 0;

function stopRec() {
  if (recTimer) { clearTimeout(recTimer); recTimer = null; }
  if (activeRec) { try { activeRec.abort(); } catch (e) { } activeRec = null; }
  stopMedia();
}
function stopMedia() {
  try { if (mediaRec && mediaRec.state !== "inactive") mediaRec.stop(); } catch (e) { }
  mediaRec = null;
  if (mediaStream) { mediaStream.getTracks().forEach(t => { try { t.stop(); } catch (e) { } }); mediaStream = null; }
}
/* 認識 + 同時録音。onDone(transcript, confidence, blob, seconds) */
async function listenOnce(onDone, onErr) {
  if (!SR) { if (onErr) onErr("unsupported"); return; }
  stopRec();
  recChunks = []; recStartAt = Date.now();
  // 録音（任意・失敗しても認識は続行）
  try {
    if (navigator.mediaDevices && window.MediaRecorder) {
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRec = new MediaRecorder(mediaStream);
      mediaRec.ondataavailable = e => { if (e.data && e.data.size) recChunks.push(e.data); };
      mediaRec.start();
    }
  } catch (e) { mediaRec = null; }

  const rec = new SR();
  rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 1; rec.continuous = false;
  let finished = false;
  const finish = (txt, conf) => {
    if (finished) return; finished = true;
    const sec = (Date.now() - recStartAt) / 1000;
    const blobs = recChunks.slice();
    const type = (mediaRec && mediaRec.mimeType) || "audio/webm";
    stopMedia();
    setTimeout(() => {
      const blob = blobs.length ? new Blob(blobs, { type }) : null;
      onDone(txt, conf, blob, sec);
    }, 120);
  };
  rec.onresult = e => {
    try { rec.stop(); } catch (err) { }
    const r = e.results[0][0];
    finish(r.transcript, typeof r.confidence === "number" ? r.confidence : null);
  };
  rec.onerror = e => {
    if (activeRec === rec) activeRec = null;
    if (recTimer) { clearTimeout(recTimer); recTimer = null; }
    stopMedia();
    if (!finished) { finished = true; if (onErr) onErr(e.error); }
  };
  rec.onend = () => {
    if (activeRec === rec) activeRec = null;
    if (recTimer) { clearTimeout(recTimer); recTimer = null; }
    if (!finished) { finished = true; stopMedia(); if (onErr) onErr(null); }
  };
  activeRec = rec;
  try { rec.start(); } catch (e) { stopMedia(); if (onErr) onErr("start-failed"); return; }
  recTimer = setTimeout(() => { if (activeRec === rec) { try { rec.stop(); } catch (e) { } } }, 15000);
}

/* =========================================================
   発話評価（6軸・簡易ヒューリスティック）
   ========================================================= */
const FILLERS = ["um", "uh", "er", "ah", "eh", "hmm", "like", "you know"];
const POLITE = ["could you", "would you", "may i", "i would like", "i'd like", "please", "let me", "shall we", "i think", "i'm afraid", "could we", "would it be", "thank you", "understood", "i see", "my understanding"];
const CASUAL = ["gonna", "wanna", "yeah", "yep", "nope", "kinda", "sorta", "stuff", "guys", "ok ok"];

function lcsLen(a, b) {
  const m = a.length, n = b.length;
  if (!m || !n) return 0;
  let prev = new Array(n + 1).fill(0), cur = new Array(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
    [prev, cur] = [cur, prev]; cur.fill(0);
  }
  return prev[n];
}
/* ref: 目標英文, hyp: 認識結果, keys: 重要表現, sec: 発話秒数 */
function evaluate(ref, hyp, keys, sec, conf) {
  const rw = words(ref), hw = words(hyp);
  const hset = new Set(hw);
  const hits = rw.map(w => hset.has(w));
  const hitN = hits.filter(Boolean).length;

  // 正確性
  const accuracy = rw.length ? Math.round(100 * hitN / rw.length) : 0;
  // 文法（語順保存）
  const grammar = rw.length ? Math.round(100 * lcsLen(rw, hw) / rw.length) : 0;
  // 語彙（重要表現の使用）
  let vocabulary;
  const nh = norm(hyp);
  if (keys && keys.length) {
    const used = keys.filter(k => nh.includes(norm(k.w))).length;
    vocabulary = Math.round(100 * used / keys.length);
  } else {
    const content = rw.filter(w => w.length > 3);
    vocabulary = content.length ? Math.round(100 * content.filter(w => hset.has(w)).length / content.length) : accuracy;
  }
  // 発音（認識信頼度 × 一致率）
  const cbase = conf == null ? null : Math.round(conf * 100);
  const pronunciation = cbase == null ? Math.round(accuracy * 0.9 + 5) : Math.round(cbase * 0.55 + accuracy * 0.45);
  // 流暢さ（話速・フィラー・長さ）
  const wps = sec > 0.4 ? hw.length / sec : 0;
  let rateScore = 0;
  if (wps <= 0) rateScore = 0;
  else if (wps < 1.2) rateScore = 45 + wps / 1.2 * 35;       // 遅い
  else if (wps <= 3.2) rateScore = 100;                      // 自然
  else rateScore = Math.max(55, 100 - (wps - 3.2) * 22);     // 速すぎ
  const fillerN = FILLERS.filter(f => nh.includes(f)).length;
  const lenRatio = rw.length ? hw.length / rw.length : 0;
  const lenPen = lenRatio < 0.55 ? (0.55 - lenRatio) * 90 : (lenRatio > 1.8 ? (lenRatio - 1.8) * 40 : 0);
  const fluency = Math.round(clamp(rateScore - fillerN * 9 - lenPen, 0, 100));
  // 会議表現としての自然さ
  const refPolite = POLITE.filter(p => norm(ref).includes(p)).length;
  const hypPolite = POLITE.filter(p => nh.includes(p)).length;
  const casualN = CASUAL.filter(c => nh.includes(c)).length;
  let naturalness = Math.round(grammar * 0.55 + vocabulary * 0.25 + 20);
  if (refPolite > 0) naturalness += hypPolite > 0 ? 8 : -16;
  naturalness -= casualN * 12;
  naturalness = Math.round(clamp(naturalness, 0, 100));

  const total = Math.round(accuracy * 0.26 + grammar * 0.2 + vocabulary * 0.16 + pronunciation * 0.16 + fluency * 0.1 + naturalness * 0.12);
  const missed = rw.filter((w, i) => !hits[i] && w.length > 3);

  // 改善英文
  let advice;
  if (total >= 85) advice = { label: "とても自然です。この表現で会議でも通用します。", text: ref };
  else if (accuracy >= 55) advice = { label: "意味は通じます。会議ではこちらがより自然です。", text: ref };
  else advice = { label: "まずはモデル英文をそのまま言えるように練習しましょう。", text: ref };

  return { accuracy, grammar, vocabulary, pronunciation, fluency, naturalness, total, hits, rw, missed, wps, advice };
}

/* =========================================================
   コンテンツ索引
   ========================================================= */
let PH_BY_ID = {}, CAT_BY_ID = {};
function buildIndex() {
  PH_BY_ID = {}; CAT_BY_ID = {};
  (window.PHRASES || []).forEach(p => PH_BY_ID[p.id] = p);
  (window.CATEGORIES || []).forEach(c => CAT_BY_ID[c.id] = c);
}
const catName = id => (CAT_BY_ID[id] && CAT_BY_ID[id].name) || id || "";
const catIcon = id => (CAT_BY_ID[id] && CAT_BY_ID[id].icon) || "📄";
const lvClass = lv => lv === "初級" ? "lv1" : lv === "中級" ? "lv2" : "lv3";

/* 重要表現 + Tier語 のハイライト */
let KW_RE = null;
function buildKwRe() {
  const tiers = Object.keys(window.TIER_WORDS || {});
  if (!tiers.length) { KW_RE = null; return; }
  const esc2 = w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  KW_RE = new RegExp("\\b(" + tiers.sort((a, b) => b.length - a.length).map(esc2).join("|") + ")\\b", "gi");
}
function hlTier(text) {
  if (!KW_RE) return esc(text);
  return esc(text).replace(KW_RE, m => {
    const key = Object.keys(window.TIER_WORDS).find(k => k.toLowerCase() === m.toLowerCase());
    if (!key) return m;
    return `<span class="kw t${window.TIER_WORDS[key].t}" data-k="${esc(key)}" onclick="event.stopPropagation();wordSheet(this.dataset.k)">${m}</span>`;
  });
}
/* 重要表現を優先ハイライト（phrase.keys） */
function hlPhrase(p) {
  let html = esc(p.en);
  const keys = (p.keys || []).slice().sort((a, b) => b.w.length - a.w.length);
  const marks = [];
  keys.forEach((k, i) => {
    const re = new RegExp(k.w.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "i");
    const esced = esc(k.w);
    const idx = html.toLowerCase().indexOf(esced.toLowerCase());
    if (idx >= 0) {
      const token = `\u0001${marks.length}\u0001`;
      marks.push(`<span class="kw key" data-p="${esc(p.id)}" data-i="${i}" onclick="event.stopPropagation();keySheet(this.dataset.p,+this.dataset.i)">${html.substr(idx, esced.length)}</span>`);
      html = html.slice(0, idx) + token + html.slice(idx + esced.length);
    }
  });
  // 残りに Tier ハイライト
  if (KW_RE) {
    html = html.replace(KW_RE, m => {
      const key = Object.keys(window.TIER_WORDS).find(k => k.toLowerCase() === m.toLowerCase());
      if (!key) return m;
      return `<span class="kw t${window.TIER_WORDS[key].t}" data-k="${esc(key)}" onclick="event.stopPropagation();wordSheet(this.dataset.k)">${m}</span>`;
    });
  }
  marks.forEach((m, i) => { html = html.replace(`\u0001${i}\u0001`, m); });
  return html;
}

/* =========================================================
   ナビゲーション
   ========================================================= */
const TITLES = { home: "ホーム", scenarios: "会議シナリオ", study: "学習", review: "復習・テスト", phrases: "単語・フレーズ集", progress: "進捗", roleplay: "ロールプレイ", settings: "設定" };
const TABS = ["home", "scenarios", "review", "phrases", "progress"];
let CUR = "home";

function go(name, opt) {
  stopSpeak(); stopRec(); stopAuto();
  CUR = name;
  document.querySelectorAll("#app .view").forEach(v => v.classList.remove("active"));
  const el = $("v-" + name); if (el) el.classList.add("active");
  document.querySelectorAll(".tabbar button").forEach(b => b.classList.remove("on"));
  const t = $("t-" + name); if (t) t.classList.add("on");
  $("barTitle").textContent = TITLES[name] || name;
  window.scrollTo(0, 0);
  const R = { home: renderHome, scenarios: renderScenarios, review: renderReview, phrases: renderPhrases, progress: renderProgress, roleplay: renderRoleplayMenu, settings: renderSettings };
  if (R[name]) R[name](opt);
}
function toast(msg) {
  let el = $("_toast");
  if (!el) {
    el = document.createElement("div"); el.id = "_toast";
    el.style.cssText = "position:fixed;left:50%;bottom:calc(var(--nav-h) + 18px);transform:translateX(-50%);background:var(--navy-800);color:#fff;padding:10px 16px;border-radius:999px;font-size:.82rem;z-index:80;box-shadow:var(--sh-3);max-width:90vw;text-align:center";
    document.body.appendChild(el);
  }
  el.textContent = msg; el.style.opacity = "1";
  clearTimeout(el._t); el._t = setTimeout(() => { el.style.opacity = "0"; }, 2200);
}
function openSheet(html) { $("sheetBody").innerHTML = html; $("sheet").classList.add("open"); $("overlay").classList.add("open"); }
function closeSheet() { stopSpeak(); $("sheet").classList.remove("open"); $("overlay").classList.remove("open"); }

/* =========================================================
   ログイン
   ========================================================= */
function renderLogin() {
  const ps = APP.profiles;
  $("loginProfiles").innerHTML = ps.length ? `
    <div class="note" style="margin-bottom:9px">学習者を選択</div>
    ${ps.map(p => `<button class="tile" onclick="pickProfile('${p.id}')">
        <span class="ic">${p.pass ? "🔒" : "👤"}</span>
        <span class="body"><span class="t">${esc(p.name)}</span><span class="d">${p.pass ? "パスコードあり" : "パスコードなし"}</span></span>
        <span class="go">›</span></button>`).join("")}
    <hr class="divider">` : "";
  $("loginForm").innerHTML = `
    <button class="btn block ghost" onclick="showNewProfile()">＋ 新しい学習者を追加</button>`;
}
function showNewProfile() {
  $("loginForm").innerHTML = `
    <label class="fld"><span>お名前（ニックネーム可）</span>
      <input type="text" id="npName" maxlength="20" placeholder="例：Taro" autocomplete="off"></label>
    <label class="fld"><span>パスコード（任意・4桁以上の数字）</span>
      <input type="password" id="npPass" inputmode="numeric" maxlength="12" placeholder="未設定でもOK" autocomplete="off"></label>
    <div class="btnrow">
      <button class="btn pri" onclick="createProfile()">作成して始める</button>
      <button class="btn ghost" onclick="renderLogin()">キャンセル</button>
    </div>`;
  setTimeout(() => $("npName") && $("npName").focus(), 60);
}
function createProfile() {
  const name = ($("npName").value || "").trim();
  if (!name) { toast("お名前を入力してください"); return; }
  const pass = ($("npPass").value || "").trim();
  if (pass && !/^\d{4,}$/.test(pass)) { toast("パスコードは4桁以上の数字にしてください"); return; }
  const id = "u" + Date.now().toString(36);
  APP.profiles.push({ id, name, pass: pass || "", created: Date.now() });
  APP.current = id; saveApp();
  enterApp(id);
}
function pickProfile(id) {
  const p = APP.profiles.find(x => x.id === id);
  if (!p) return;
  if (!p.pass) { APP.current = id; saveApp(); enterApp(id); return; }
  $("loginForm").innerHTML = `
    <label class="fld"><span>${esc(p.name)} さんのパスコード</span>
      <input type="password" id="lpPass" inputmode="numeric" maxlength="12" autocomplete="off"></label>
    <div class="btnrow">
      <button class="btn pri" onclick="tryPass('${id}')">ログイン</button>
      <button class="btn ghost" onclick="renderLogin()">戻る</button>
    </div>
    <div class="note" style="margin-top:8px">忘れた場合は
      <button class="btn sm ghost" onclick="removeProfile('${id}')">この学習者を削除</button>してやり直せます。</div>`;
  setTimeout(() => $("lpPass") && $("lpPass").focus(), 60);
  $("lpPass") && $("lpPass").addEventListener("keydown", e => { if (e.key === "Enter") tryPass(id); });
}
function tryPass(id) {
  const p = APP.profiles.find(x => x.id === id);
  if (($("lpPass").value || "") === p.pass) { APP.current = id; saveApp(); enterApp(id); }
  else toast("パスコードが違います");
}
function removeProfile(id) {
  if (!confirm("この学習者の学習データをすべて削除します。よろしいですか？")) return;
  APP.profiles = APP.profiles.filter(p => p.id !== id);
  if (APP.current === id) APP.current = null;
  saveApp(); try { localStorage.removeItem("met_p_" + id); } catch (e) { }
  renderLogin();
}
function logout() { stopSpeak(); stopRec(); APP.current = null; saveApp(); $("app").hidden = true; $("login").classList.add("active"); renderLogin(); }

function enterApp(id) {
  loadProfile(id);
  applySettings();
  $("login").classList.remove("active");
  $("app").hidden = false;
  const p = APP.profiles.find(x => x.id === id);
  $("avatarBtn").textContent = (p.name || "U").slice(0, 1).toUpperCase();
  $("barSub").textContent = p.name + " さん";
  startTick();
  go("home");
}
function applySettings() {
  document.documentElement.className = "fs-" + (P.settings.fs || "m");
  if (P.settings.theme) document.documentElement.setAttribute("data-theme", P.settings.theme);
  else document.documentElement.removeAttribute("data-theme");
}
function toggleTheme() {
  const cur = P.settings.theme;
  P.settings.theme = cur === "dark" ? "light" : cur === "light" ? "" : "dark";
  save(); applySettings();
  toast(P.settings.theme === "dark" ? "ダークテーマ" : P.settings.theme === "light" ? "ライトテーマ" : "端末の設定に合わせます");
}

/* =========================================================
   ホーム
   ========================================================= */
function phraseDone(id) { const s = P.study[id]; return !!(s && s.done); }
function scenarioProgress(sc) {
  const total = sc.steps.length;
  const done = sc.steps.filter(s => phraseDone(s.phrase)).length;
  return { done, total, pct: total ? Math.round(100 * done / total) : 0 };
}
function nextScenario() {
  const list = window.SCENARIOS || [];
  const partial = list.map(s => ({ s, p: scenarioProgress(s) })).filter(x => x.p.done > 0 && x.p.done < x.p.total);
  if (partial.length) return partial[0].s;
  const fresh = list.find(s => scenarioProgress(s).done === 0);
  return fresh || list[0];
}
function weakList(kind, n) {
  return Object.entries(P.weak[kind] || {}).sort((a, b) => b[1] - a[1]).slice(0, n);
}
function renderHome() {
  const w = weekStats(), t = sessToday();
  const sc = nextScenario();
  const scp = sc ? scenarioProgress(sc) : null;
  const allPh = (window.PHRASES || []).length;
  const donePh = Object.values(P.study).filter(s => s.done).length;
  const weakP = weakList("phrases", 3);
  const acc = w.total ? Math.round(100 * w.correct / w.total) : 0;

  $("v-home").innerHTML = `
    <div class="hero">
      <div class="h">今日の学習</div>
      <div class="m">${sc ? esc(sc.title) : "シナリオを選んで始めましょう"}</div>
      ${scp ? `<div style="margin-top:10px"><div class="bar" style="background:rgba(255,255,255,.25)"><i style="width:${scp.pct}%;background:#fff"></i></div>
        <div style="font-size:.72rem;opacity:.85;margin-top:5px">${scp.done} / ${scp.total} フレーズ完了</div></div>` : ""}
      <div class="btnrow">
        <button class="btn solid" onclick="openScenario('${sc ? sc.id : ""}')">▶ 続きから学習</button>
        <button class="btn" onclick="go('scenarios')">シナリオ一覧</button>
      </div>
    </div>

    <div class="statgrid">
      <div class="stat"><b>${fmtMin(t.sec)}</b><span>今日の学習（分）</span></div>
      <div class="stat"><b>${fmtMin(w.sec)}</b><span>今週の学習（分）</span></div>
      <div class="stat"><b>${w.utter}</b><span>今週の発話回数</span></div>
      <div class="stat"><b>${w.total ? acc + "%" : "—"}</b><span>今週の正答率</span></div>
    </div>

    <h2 class="sec">学習の進み</h2>
    <div class="card">
      <div class="barrow"><span class="lbl">フレーズ習得</span><span class="bar"><i style="width:${allPh ? Math.round(100 * donePh / allPh) : 0}%"></i></span><span class="val">${donePh}/${allPh}</span></div>
      <div class="barrow"><span class="lbl">シナリオ完了</span><span class="bar"><i style="width:${(window.SCENARIOS || []).length ? Math.round(100 * (window.SCENARIOS || []).filter(s => scenarioProgress(s).pct === 100).length / window.SCENARIOS.length) : 0}%"></i></span><span class="val">${(window.SCENARIOS || []).filter(s => scenarioProgress(s).pct === 100).length}/${(window.SCENARIOS || []).length}</span></div>
    </div>

    <h2 class="sec">苦手項目</h2>
    ${weakP.length ? `<div class="card">
        ${weakP.map(([id, c]) => {
          const p = PH_BY_ID[id];
          return p ? `<button class="tile" style="box-shadow:none;margin-bottom:7px" onclick="studyOne('${id}')">
            <span class="ic">⚠️</span><span class="body"><span class="t" style="font-size:.86rem">${esc(p.en.slice(0, 46))}${p.en.length > 46 ? "…" : ""}</span>
            <span class="d">${esc(catName(p.cat))}・${c}回つまずき</span></span><span class="go">›</span></button>` : "";
        }).join("")}
        <button class="btn block acc" onclick="go('review')">苦手だけを復習する</button>
      </div>` : `<div class="card"><div class="note">まだ記録がありません。学習を進めると、間違えた例文や聞き取れなかった文がここに集まります。</div></div>`}

    <h2 class="sec">メニュー</h2>
    <button class="tile" onclick="go('roleplay')"><span class="ic">🤝</span><span class="body"><span class="t">AIロールプレイ</span><span class="d">会議形式でAIと英語で対話する</span></span><span class="go">›</span></button>
    <button class="tile" onclick="go('phrases')"><span class="ic">📚</span><span class="body"><span class="t">単語・フレーズ集</span><span class="d">重要表現・業務用語集を調べる</span></span><span class="go">›</span></button>
    <button class="tile" onclick="go('progress')"><span class="ic">📊</span><span class="body"><span class="t">進捗・能力推移</span><span class="d">5分野の習熟度を確認する</span></span><span class="go">›</span></button>`;
}

/* =========================================================
   シナリオ一覧
   ========================================================= */
let scFilterCat = "all", scFilterLv = "all";
function renderScenarios() {
  const cats = window.CATEGORIES || [];
  const list = (window.SCENARIOS || []).filter(s =>
    (scFilterCat === "all" || s.cat === scFilterCat) && (scFilterLv === "all" || s.level === scFilterLv));
  $("v-scenarios").innerHTML = `
    <div class="filterbar">
      <button class="${scFilterCat === "all" ? "on" : ""}" onclick="scFilterCat='all';renderScenarios()">すべて</button>
      ${cats.map(c => `<button class="${scFilterCat === c.id ? "on" : ""}" onclick="scFilterCat='${c.id}';renderScenarios()">${c.icon} ${esc(c.name)}</button>`).join("")}
    </div>
    <div class="chips" style="margin-bottom:12px">
      <span class="note" style="margin-right:3px">難易度</span>
      ${["all", "初級", "中級", "上級"].map(l => `<button class="chip ${scFilterLv === l ? "cat" : ""}" style="cursor:pointer;border:1px solid var(--line)" onclick="scFilterLv='${l}';renderScenarios()">${l === "all" ? "すべて" : l}</button>`).join("")}
    </div>
    ${list.length ? list.map(s => {
      const p = scenarioProgress(s);
      return `<div class="card" style="cursor:pointer" onclick="openScenario('${s.id}')">
        <div class="chips" style="margin-bottom:7px">
          <span class="chip cat">${catIcon(s.cat)} ${esc(catName(s.cat))}</span>
          <span class="chip ${lvClass(s.level)}">${esc(s.level)}</span>
          ${p.pct === 100 ? '<span class="chip ok">✓ 完了</span>' : p.done ? `<span class="chip warn">学習中 ${p.done}/${p.total}</span>` : ""}
        </div>
        <div style="font-weight:800;font-size:1rem">${esc(s.title)}</div>
        <div class="note" style="margin-top:4px">${esc(s.desc || "")}</div>
        <div style="margin-top:10px" class="bar"><i style="width:${p.pct}%;background:${p.pct === 100 ? "var(--ok)" : "var(--accent)"}"></i></div>
        <div class="note" style="margin-top:5px">${p.total} ステップ・${p.done} 完了</div>
      </div>`;
    }).join("") : `<div class="empty"><span class="big">🔍</span>該当するシナリオがありません</div>`}`;
}

/* =========================================================
   学習画面（STEP 1→2→3）
   ========================================================= */
let ST = null; // {scenario, idx, phrase, step, v:[done], jaDone, result}
function openScenario(id) {
  const sc = (window.SCENARIOS || []).find(s => s.id === id);
  if (!sc) { toast("シナリオが見つかりません"); return; }
  const firstUndone = sc.steps.findIndex(s => !phraseDone(s.phrase));
  startStudy(sc, firstUndone < 0 ? 0 : firstUndone);
}
function studyOne(phraseId) {
  const p = PH_BY_ID[phraseId]; if (!p) return;
  startStudy({ id: "_single", title: "ピンポイント練習", steps: [{ phrase: phraseId, note: "" }], cat: p.cat, level: p.level }, 0);
}
function startStudy(sc, idx) {
  ST = { sc, idx, step: 1, v: [false, false, false], jaDone: false, result: null, recKey: null };
  go("study");
}
function renderStudy() {
  if (!ST) { go("scenarios"); return; }
  const stp = ST.sc.steps[ST.idx];
  const p = PH_BY_ID[stp.phrase];
  if (!p) { $("v-study").innerHTML = `<div class="empty">フレーズデータが見つかりません（${esc(stp.phrase)}）</div>`; return; }
  ST.phrase = p;
  const saved = P.saved.includes(p.id);
  const rec = P.study[p.id] || {};
  $("barTitle").textContent = ST.sc.title;

  $("v-study").innerHTML = `
    <button class="back" onclick="go('scenarios')">← シナリオ一覧</button>
    <div class="card pad-s" style="margin-bottom:11px">
      <div class="chips">
        <span class="chip cat">${catIcon(p.cat)} ${esc(catName(p.cat))}</span>
        <span class="chip ${lvClass(p.level)}">${esc(p.level)}</span>
        <span class="chip">${ST.idx + 1} / ${ST.sc.steps.length}</span>
        ${rec.done ? '<span class="chip ok">✓ 習得済み</span>' : ""}
        <button class="chip" style="cursor:pointer;margin-left:auto" onclick="toggleSave('${p.id}')">${saved ? "★ 保存済み" : "☆ 保存"}</button>
      </div>
      ${stp.note ? `<div class="note" style="margin-top:7px">🎯 この発言のねらい：${esc(stp.note)}</div>` : ""}
      <div class="bar" style="margin-top:9px"><i style="width:${Math.round(100 * (ST.idx) / ST.sc.steps.length)}%"></i></div>
    </div>

    <div class="steps">
      ${[1, 2, 3].map(n => `<button class="steptab ${ST.step === n ? "on" : ""} ${stepDone(n) ? "done" : ""}" onclick="gotoStep(${n})">
        <span class="n">STEP ${n}</span>${["英語を聞く×3", "日本語を聞く", "自分で話す"][n - 1]}</button>`).join("")}
    </div>

    <div id="stepBody"></div>`;
  renderStep();
}
function stepDone(n) {
  if (!ST) return false;
  if (n === 1) return ST.v.every(Boolean);
  if (n === 2) return ST.jaDone;
  return !!ST.result;
}
function gotoStep(n) { stopSpeak(); stopRec(); ST.step = n; renderStep(); }

function renderStep() {
  const p = ST.phrase, b = $("stepBody");
  if (ST.step === 1) {
    b.innerHTML = `
      <div class="card">
        <div class="note" style="margin-bottom:9px">同じ英文を3つの音声で聞きます。すべて聞くと STEP 2 に進めます。</div>
        <div class="en-lg" id="enText">${hlPhrase(p)}</div>
        <hr class="divider">
        ${VOICE_PROFILES.map((v, i) => `
          <div class="voicecard ${ST.v[i] ? "done" : ""}" id="vc${i}">
            <button class="vplay" onclick="playVoice(${i})">${ST.v[i] ? "↻" : "▶"}</button>
            <div class="vmeta"><div class="vname">${esc(v.name)}</div><div class="vdesc">${esc(v.desc)}</div></div>
            <span class="vcheck">${ST.v[i] ? "✓" : ""}</span>
          </div>`).join("")}
        <div class="btnrow">
          <button class="btn pri" onclick="playAll3()">▶ 3音声を通して再生</button>
          <button class="btn ghost" onclick="markListenHard()">🤔 聞き取れなかった</button>
        </div>
        ${!ttsAvailable() ? '<div class="banner warn" style="margin-top:10px">この端末は音声合成に対応していません。英文を目で追って進めてください。</div>' : ""}
        <div class="btnrow"><button class="btn acc block" ${ST.v.every(Boolean) ? "" : "disabled"} onclick="gotoStep(2)">STEP 2 へ進む →</button></div>
      </div>`;
  } else if (ST.step === 2) {
    b.innerHTML = `
      <div class="card">
        <div class="note" style="margin-bottom:9px">英文の意味を日本語音声で確認します。</div>
        <div class="en-md">${hlPhrase(p)}</div>
        <div class="ja-sub" style="font-size:1rem;margin-top:10px">${esc(p.ja)}</div>
        <div class="btnrow">
          <button class="btn pri" onclick="playJa()">🔊 日本語を聞く</button>
          <button class="btn ghost" onclick="gotoStep(1)">← 英語をもう一度</button>
        </div>
        <hr class="divider">
        ${(p.keys || []).length ? `<div class="srow"><b>重要表現</b>
          ${p.keys.map((k, i) => `<div style="margin-top:5px"><span class="kw key" data-p="${esc(p.id)}" data-i="${i}" onclick="keySheet(this.dataset.p,+this.dataset.i)">${esc(k.w)}</span> — ${esc(k.mean)}</div>`).join("")}</div>` : ""}
        ${p.situation ? `<div class="srow"><b>使用場面</b>${esc(p.situation)}</div>` : ""}
        <div class="btnrow"><button class="btn acc block" ${ST.jaDone ? "" : "disabled"} onclick="gotoStep(3)">STEP 3 へ進む →</button></div>
      </div>`;
  } else {
    const r = ST.result;
    b.innerHTML = `
      <div class="card">
        <div class="note">次の日本語を英語で言ってみましょう。${S3Hint()}</div>
        <div style="font-size:1.08rem;font-weight:700;margin:10px 0 4px">「${esc(p.ja)}」</div>
        ${ST.peek ? `<div class="en-md" style="margin-top:8px">${hlPhrase(p)}</div>` : ""}
        <div class="micwrap">
          <button class="micbtn" id="micBtn" onclick="startSpeak()">🎙</button>
          <div class="note" id="micHint">${SR ? "タップして英語で話してください" : "この端末は音声認識に対応していません"}</div>
        </div>
        <div class="btnrow" style="justify-content:center">
          <button class="btn sm ghost" onclick="ST.peek=!ST.peek;renderStep()">${ST.peek ? "英文を隠す" : "英文を見る"}</button>
          <button class="btn sm ghost" onclick="playVoice(0)">🔊 お手本</button>
          ${SR ? "" : `<button class="btn sm ghost" onclick="manualInput()">⌨ 文字で入力</button>`}
        </div>
        <div id="scoreArea">${r ? scoreHtml(r) : ""}</div>
      </div>`;
  }
}
function S3Hint() { return SR ? "" : "（音声認識に非対応の端末では、文字入力で採点できます）"; }

function playVoice(i) {
  const prof = VOICE_PROFILES[i], p = ST.phrase;
  const el = $("enText");
  let spans = [];
  if (el) {
    const toks = p.en.split(/(\s+)/); let pos = 0;
    el.innerHTML = toks.map(t => { const s = pos; pos += t.length; return /^\s+$/.test(t) || !t ? t : `<span class="pw" data-s="${s}">${hlPhrase({ en: t, keys: [], id: p.id })}</span>`; }).join("");
    spans = [...el.querySelectorAll(".pw")];
  }
  const card = $("vc" + i);
  document.querySelectorAll(".voicecard").forEach(c => c.classList.remove("playing"));
  if (card) card.classList.add("playing");
  speakOne(p.en, {
    voice: voiceFor(prof), rate: prof.rate,
    onBoundary: e => { spans.forEach(s => s.classList.remove("w-now")); let t = null; for (const s of spans) if (+s.dataset.s <= e.charIndex) t = s; if (t) t.classList.add("w-now"); },
    onEnd: () => {
      spans.forEach(s => s.classList.remove("w-now"));
      if (card) card.classList.remove("playing");
      if (!ST.v[i]) { ST.v[i] = true; pushSkill("listening", 72 + i * 6); save(); renderStep(); }
    }
  });
}
function playAll3() {
  const p = ST.phrase;
  speakSeq(VOICE_PROFILES.map((prof, i) => ({
    text: p.en, voice: voiceFor(prof), rate: prof.rate,
    onStart: () => { document.querySelectorAll(".voicecard").forEach(c => c.classList.remove("playing")); const c = $("vc" + i); if (c) c.classList.add("playing"); },
    onEnd: () => { ST.v[i] = true; }
  })), () => { pushSkill("listening", 80); save(); renderStep(); });
}
function playJa() {
  speakOne(ST.phrase.ja, {
    voice: jaVoice(), rate: 1, lang: "ja-JP",
    onEnd: () => { if (!ST.jaDone) { ST.jaDone = true; save(); renderStep(); } }
  });
  if (!jaVoice()) { ST.jaDone = true; setTimeout(renderStep, 300); }
}
function markListenHard() {
  const id = ST.phrase.id;
  P.weak.listen[id] = (P.weak.listen[id] || 0) + 1;
  P.weak.phrases[id] = (P.weak.phrases[id] || 0) + 1;
  save(); toast("「聞き取れなかった文」に記録しました");
}

/* ---- STEP3 発話 ---- */
function manualInput() {
  const t = prompt("英語で入力してください");
  if (t && t.trim()) gradeSpeech(t.trim(), null, null, Math.max(1.5, words(t).length / 2.2));
}
function startSpeak() {
  if (!SR) { manualInput(); return; }
  const btn = $("micBtn"), hint = $("micHint");
  btn.classList.add("rec"); btn.disabled = true;
  hint.innerHTML = '<span class="recdot"></span>聞き取り中…　話し終わると自動で止まります';
  listenOnce(
    (txt, conf, blob, sec) => {
      btn.classList.remove("rec"); btn.disabled = false; hint.textContent = "タップして英語で話してください";
      gradeSpeech(txt, conf, blob, sec);
    },
    err => {
      btn.classList.remove("rec"); btn.disabled = false;
      hint.textContent = "タップして英語で話してください";
      if (err && err !== "aborted" && err !== "no-speech") $("scoreArea").innerHTML = `<div class="banner ng">音声を取得できませんでした（${esc(String(err))}）。マイクの許可をご確認ください。</div>`;
      else if (err === "no-speech") toast("音声が検出されませんでした");
    });
}
async function gradeSpeech(txt, conf, blob, sec) {
  const p = ST.phrase;
  const r = evaluate(p.en, txt, p.keys, sec, conf);
  r.hyp = txt;
  ST.result = r;

  // 記録
  const t = sessToday();
  t.utter++; t.total++; if (r.total >= 70) t.correct++;
  pushSkill("speaking", r.accuracy); pushSkill("vocabulary", r.vocabulary);
  pushSkill("fluency", r.fluency); pushSkill("pronunciation", r.pronunciation);
  const st = P.study[p.id] || { s1: 0, s2: false, tries: 0, best: 0, done: false };
  st.tries++; st.best = Math.max(st.best || 0, r.total); st.last = r.total; st.lastAt = Date.now();
  if (r.total >= 70) { if (!st.done) t.lessons++; st.done = true; }
  P.study[p.id] = st;
  if (r.total < 70) P.weak.phrases[p.id] = (P.weak.phrases[p.id] || 0) + 1;
  r.missed.slice(0, 4).forEach(w => { P.weak.words[w] = (P.weak.words[w] || 0) + 1; });

  // 録音保存
  if (blob) {
    const key = "r" + Date.now().toString(36);
    const ok = await recPut(key, blob);
    if (ok) {
      P.recordings.unshift({ id: key, phraseId: p.id, at: Date.now(), score: r.total });
      while (P.recordings.length > 40) { const old = P.recordings.pop(); recDel(old.id); }
      ST.recKey = key;
    }
  }
  save();
  $("scoreArea").innerHTML = scoreHtml(r);
  $("scoreArea").scrollIntoView({ behavior: "smooth", block: "nearest" });
}
function scoreHtml(r) {
  const col = v => v >= 80 ? "var(--ok)" : v >= 60 ? "var(--warn)" : "var(--ng)";
  const axes = [["発音", r.pronunciation], ["正確性", r.accuracy], ["文法", r.grammar], ["語彙", r.vocabulary], ["流暢さ", r.fluency], ["自然さ", r.naturalness]];
  const last = ST.sc.steps.length - 1 === ST.idx;
  return `
    <hr class="divider">
    <div style="display:flex;align-items:center;gap:14px">
      ${ring(r.total)}
      <div style="flex:1;min-width:0">
        <div style="font-weight:800;font-size:1rem;color:${col(r.total)}">${r.total >= 85 ? "Excellent!" : r.total >= 70 ? "Good!" : r.total >= 50 ? "もう一歩" : "再挑戦しましょう"}</div>
        <div class="note">認識結果：「${esc(r.hyp)}」</div>
        <div class="note">話速 ${r.wps.toFixed(1)} 語/秒</div>
      </div>
    </div>
    <div class="scoregrid">
      ${axes.map(([n, v]) => `<div class="sc"><b style="color:${col(v)}">${v}</b><span>${n}</span></div>`).join("")}
    </div>
    <div class="srow"><b>単語チェック</b>${r.rw.map((w, i) => `<span class="diffw ${r.hits[i] ? "hit" : "miss"}">${esc(w)}</span>`).join(" ")}</div>
    <div class="srow"><b>${esc(r.advice.label)}</b>
      <div class="en-md" style="margin-top:4px">${esc(r.advice.text)}</div>
      <button class="btn sm" style="margin-top:6px" onclick="playVoice(0)">🔊 お手本を聞く</button>
    </div>
    ${(ST.phrase.alts || []).length ? `<div class="srow"><b>別の言い方</b>${ST.phrase.alts.map(a => `<div style="margin-top:3px">・${esc(a)} <button class="btn sm ghost" data-t="${esc(a)}" data-v="1" onclick="sayBtn(this)">🔊</button></div>`).join("")}</div>` : ""}
    ${ST.recKey ? `<div class="srow"><b>自分の録音</b><button class="btn sm" onclick="playRec('${ST.recKey}')">▶ 聞き返す</button></div>` : ""}
    <div class="note" style="margin-top:9px">※採点は端末内の簡易アルゴリズム（単語一致・語順・話速・表現の丁寧さ）による参考値です。</div>
    <div class="btnrow">
      <button class="btn" onclick="ST.result=null;renderStep()">↻ もう一度話す</button>
      ${last ? `<button class="btn ok" onclick="finishScenario()">シナリオを完了する 🎉</button>`
      : `<button class="btn acc" onclick="nextPhrase()">次のフレーズ →</button>`}
    </div>`;
}
function ring(v) {
  const R = 34, C = 2 * Math.PI * R, off = C * (1 - clamp(v, 0, 100) / 100);
  const col = v >= 80 ? "var(--ok)" : v >= 60 ? "var(--warn)" : "var(--ng)";
  return `<div class="ring"><svg width="84" height="84">
    <circle cx="42" cy="42" r="${R}" fill="none" stroke="var(--line)" stroke-width="8"></circle>
    <circle cx="42" cy="42" r="${R}" fill="none" stroke="${col}" stroke-width="8" stroke-linecap="round"
      stroke-dasharray="${C}" stroke-dashoffset="${off}"></circle></svg>
    <span class="num" style="color:${col}">${v}</span></div>`;
}
async function playRec(key) {
  const blob = await recGet(key);
  if (!blob) { toast("録音が見つかりません"); return; }
  const url = URL.createObjectURL(blob);
  const a = new Audio(url);
  a.onended = () => URL.revokeObjectURL(url);
  a.play().catch(() => { toast("再生できませんでした"); URL.revokeObjectURL(url); });
}
function nextPhrase() {
  if (ST.idx < ST.sc.steps.length - 1) { ST = { sc: ST.sc, idx: ST.idx + 1, step: 1, v: [false, false, false], jaDone: false, result: null, recKey: null }; renderStudy(); window.scrollTo(0, 0); }
  else finishScenario();
}
function finishScenario() {
  const sc = ST.sc;
  if (sc.id !== "_single") { P.scenario[sc.id] = { at: Date.now() }; save(); }
  const p = scenarioProgress(sc);
  $("v-study").innerHTML = `
    <div class="card center" style="padding:28px 18px">
      <div style="font-size:2.6rem">🎉</div>
      <h2 style="margin:8px 0 2px;font-size:1.1rem">${esc(sc.title)}</h2>
      <div class="note">${p.done} / ${p.total} フレーズを習得しました</div>
      <div class="btnrow" style="justify-content:center;margin-top:16px">
        ${sc.id !== "_single" ? `<button class="btn acc" onclick="startRoleplayFromScenario('${sc.id}')">通しでロールプレイ 🤝</button>` : ""}
        <button class="btn" onclick="go('scenarios')">シナリオ一覧へ</button>
        <button class="btn ghost" onclick="go('home')">ホーム</button>
      </div>
    </div>`;
}
function toggleSave(id) {
  const i = P.saved.indexOf(id);
  if (i >= 0) { P.saved.splice(i, 1); toast("保存を解除しました"); } else { P.saved.push(id); toast("フレーズ集に保存しました"); }
  save();
  if (CUR === "study") renderStudy(); else if (CUR === "phrases") renderPhrases();
}

/* =========================================================
   復習・テスト
   ========================================================= */
let rvMode = "menu", rvQ = null, rvCount = 0, rvHit = 0;
function renderReview() {
  if (rvMode === "quiz") return renderQuiz();
  if (rvMode === "rec") return renderRecordings();
  const wp = weakList("phrases", 20), ww = weakList("words", 12), wl = weakList("listen", 10);
  $("v-review").innerHTML = `
    <div class="banner info">苦手な項目から優先的に出題します。つまずいた回数が多いものほど先に出ます。</div>
    <button class="tile" onclick="startQuiz('weak')"><span class="ic">🎯</span><span class="body"><span class="t">苦手フレーズテスト</span><span class="d">${wp.length ? wp.length + "件の苦手から出題" : "記録が貯まると出題されます"}</span></span><span class="go">›</span></button>
    <button class="tile" onclick="startQuiz('all')"><span class="ic">🔀</span><span class="body"><span class="t">ランダムテスト</span><span class="d">全フレーズから4択で出題</span></span><span class="go">›</span></button>
    <button class="tile" onclick="startQuiz('saved')"><span class="ic">★</span><span class="body"><span class="t">保存した表現のテスト</span><span class="d">${P.saved.length}件を保存中</span></span><span class="go">›</span></button>
    <button class="tile" onclick="rvMode='rec';renderReview()"><span class="ic">🎧</span><span class="body"><span class="t">過去の録音</span><span class="d">${P.recordings.length}件の発話を聞き返す</span></span><span class="go">›</span></button>

    <h2 class="sec">発音が弱い単語</h2>
    <div class="card">${ww.length ? ww.map(([w, c]) => `
      <div class="barrow"><span class="lbl">${esc(w)}</span><span class="bar"><i style="width:${Math.min(100, c * 20)}%;background:var(--ng)"></i></span>
      <span class="val">${c}回</span><button class="btn sm ghost" data-t="${esc(w)}" data-v="0" data-rate="0.85" onclick="sayBtn(this)">🔊</button></div>`).join("")
      : '<div class="note">まだ記録がありません。</div>'}</div>

    <h2 class="sec">聞き取れなかった文</h2>
    <div class="card">${wl.length ? wl.map(([id, c]) => {
      const p = PH_BY_ID[id]; if (!p) return "";
      return `<button class="tile" style="box-shadow:none;margin-bottom:7px" onclick="studyOne('${id}')">
        <span class="ic">👂</span><span class="body"><span class="t" style="font-size:.85rem">${esc(p.en.slice(0, 44))}${p.en.length > 44 ? "…" : ""}</span>
        <span class="d">${c}回 / ${esc(catName(p.cat))}</span></span><span class="go">›</span></button>`;
    }).join("") : '<div class="note">まだ記録がありません。STEP 1 で「聞き取れなかった」を押すとここに貯まります。</div>'}</div>`;
}
function startQuiz(kind) {
  let pool;
  const all = window.PHRASES || [];
  if (kind === "weak") {
    const ids = weakList("phrases", 30).map(x => x[0]);
    pool = ids.map(id => PH_BY_ID[id]).filter(Boolean);
    if (!pool.length) { toast("苦手の記録がまだありません。ランダムで出題します"); pool = all; }
  } else if (kind === "saved") {
    pool = P.saved.map(id => PH_BY_ID[id]).filter(Boolean);
    if (!pool.length) { toast("保存した表現がありません"); return; }
  } else pool = all;
  if (!pool.length) { toast("出題できるフレーズがありません"); return; }
  rvMode = "quiz"; rvCount = 0; rvHit = 0; rvPool = pool;
  nextQuiz();
}
let rvPool = [];
function nextQuiz() {
  const q = rnd(rvPool);
  const others = shuffle((window.PHRASES || []).filter(p => p.id !== q.id)).slice(0, 3);
  rvQ = { q, opts: shuffle([q, ...others]), answered: false };
  renderQuiz();
}
function renderQuiz() {
  const { q, opts, answered, picked } = rvQ;
  $("v-review").innerHTML = `
    <button class="back" onclick="rvMode='menu';renderReview()">← 復習メニュー</button>
    <div class="card">
      <div class="chips" style="margin-bottom:9px">
        <span class="chip cat">${catIcon(q.cat)} ${esc(catName(q.cat))}</span>
        <span class="chip ${lvClass(q.level)}">${esc(q.level)}</span>
        <span class="chip" style="margin-left:auto">${rvCount} 問 / 正解 ${rvHit}</span>
      </div>
      <div class="note">この日本語に合う英語表現を選んでください</div>
      <div style="font-size:1.1rem;font-weight:700;margin:9px 0 13px">「${esc(q.ja)}」</div>
      ${opts.map(o => {
        let cls = "btn block", st = "text-align:left;justify-content:flex-start;margin-bottom:8px";
        if (answered) { if (o.id === q.id) cls += " ok"; else if (o.id === picked) cls += " ng"; }
        return `<button class="${cls}" style="${st}" ${answered ? "disabled" : ""} onclick="answerQuiz('${o.id}')">${esc(o.en)}</button>`;
      }).join("")}
      ${answered ? `
        <hr class="divider">
        <div class="srow"><b>正解</b>${hlPhrase(q)}
          <button class="btn sm" style="margin-top:6px" data-t="${esc(q.en)}" data-v="1" onclick="sayBtn(this)">🔊 再生</button></div>
        <div class="srow"><b>意味</b>${esc(q.ja)}</div>
        <div class="btnrow">
          <button class="btn acc" onclick="nextQuiz()">次の問題 →</button>
          <button class="btn ghost" onclick="studyOne('${q.id}')">このフレーズを練習</button>
        </div>` : ""}
    </div>`;
}
function answerQuiz(id) {
  const ok = id === rvQ.q.id;
  rvQ.answered = true; rvQ.picked = id; rvCount++;
  const t = sessToday(); t.total++;
  if (ok) { rvHit++; t.correct++; pushSkill("vocabulary", 88); }
  else { P.weak.phrases[rvQ.q.id] = (P.weak.phrases[rvQ.q.id] || 0) + 1; pushSkill("vocabulary", 42); }
  save(); renderQuiz();
  if (ok) speakOne(rvQ.q.en, { voice: voiceFor(VOICE_PROFILES[1]) });
}
function renderRecordings() {
  $("v-review").innerHTML = `
    <button class="back" onclick="rvMode='menu';renderReview()">← 復習メニュー</button>
    <h2 class="sec">過去の録音（最新40件）</h2>
    ${P.recordings.length ? P.recordings.map(r => {
      const p = PH_BY_ID[r.phraseId];
      const col = r.score >= 80 ? "ok" : r.score >= 60 ? "warn" : "ng";
      return `<div class="card pad-s">
        <div class="chips" style="margin-bottom:6px">
          <span class="chip ${col}">${r.score}点</span>
          <span class="chip">${new Date(r.at).toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <div style="font-size:.9rem;font-weight:600">${esc(p ? p.en : "(削除されたフレーズ)")}</div>
        <div class="btnrow tight">
          <button class="btn sm pri" onclick="playRec('${r.id}')">▶ 自分の発話</button>
          ${p ? `<button class="btn sm" data-t="${esc(p.en)}" data-v="1" onclick="sayBtn(this)">🔊 お手本</button>
                 <button class="btn sm ghost" onclick="studyOne('${p.id}')">練習する</button>` : ""}
        </div>
      </div>`;
    }).join("") : '<div class="empty"><span class="big">🎧</span>録音はまだありません。<br>STEP 3 で発話すると自動で保存されます。</div>'}
    ${P.recordings.length ? `<button class="btn ng block" onclick="clearRecordings()">すべての録音を削除</button>` : ""}`;
}
async function clearRecordings() {
  if (!confirm("保存された録音をすべて削除します。よろしいですか？")) return;
  for (const r of P.recordings) await recDel(r.id);
  P.recordings = []; save(); renderRecordings();
}

/* =========================================================
   単語・フレーズ集
   ========================================================= */
let phTab = "saved", phCat = "all";
function renderPhrases() {
  const tabs = [["saved", "★ 保存"], ["all", "全フレーズ"], ["glossary", "業務用語集"]];
  let body = "";
  if (phTab === "glossary") {
    body = `<div class="tablewrap"><table class="kvtable">
      <tr><th>略語</th><th>正式名称</th><th>意味</th><th></th></tr>
      ${(window.GLOSSARY || []).map(g => `<tr><td><b>${esc(g.ab)}</b></td><td>${esc(g.full)}</td><td>${esc(g.mean)}</td>
        <td><button class="btn sm ghost" data-t="${esc(g.full)}" data-v="0" data-rate=".9" onclick="sayBtn(this)">🔊</button></td></tr>`).join("")}
    </table></div>`;
  } else {
    let list = phTab === "saved" ? P.saved.map(id => PH_BY_ID[id]).filter(Boolean) : (window.PHRASES || []);
    if (phCat !== "all") list = list.filter(p => p.cat === phCat);
    body = `
      <div class="filterbar">
        <button class="${phCat === "all" ? "on" : ""}" onclick="phCat='all';renderPhrases()">すべて</button>
        ${(window.CATEGORIES || []).map(c => `<button class="${phCat === c.id ? "on" : ""}" onclick="phCat='${c.id}';renderPhrases()">${c.icon} ${esc(c.name)}</button>`).join("")}
      </div>
      ${list.length ? list.map(p => `
        <div class="card">
          <div class="chips" style="margin-bottom:7px">
            <span class="chip cat">${catIcon(p.cat)} ${esc(catName(p.cat))}</span>
            <span class="chip ${lvClass(p.level)}">${esc(p.level)}</span>
            ${phraseDone(p.id) ? '<span class="chip ok">✓</span>' : ""}
            <button class="chip" style="cursor:pointer;margin-left:auto" onclick="toggleSave('${p.id}')">${P.saved.includes(p.id) ? "★" : "☆"}</button>
          </div>
          <div class="en-md">${hlPhrase(p)}</div>
          <div class="ja-sub">${esc(p.ja)}</div>
          <div class="btnrow tight">
            <button class="btn sm pri" data-t="${esc(p.en)}" data-v="0" data-rate=".85" onclick="sayBtn(this)">🔊 ゆっくり</button>
            <button class="btn sm" data-t="${esc(p.en)}" data-v="1" onclick="sayBtn(this)">🔊 自然速度</button>
            <button class="btn sm ghost" data-t="${esc(p.ja)}" data-lang="ja" onclick="sayBtn(this)">🔊 和訳</button>
            <button class="btn sm ghost" onclick="studyOne('${p.id}')">練習</button>
          </div>
        </div>`).join("")
        : `<div class="empty"><span class="big">${phTab === "saved" ? "★" : "🔍"}</span>${phTab === "saved" ? "保存した表現はまだありません。<br>学習画面の「☆ 保存」で追加できます。" : "該当するフレーズがありません"}</div>`}`;
  }
  $("v-phrases").innerHTML = `
    <div class="seg" style="margin-bottom:12px;display:flex;width:100%">
      ${tabs.map(([k, l]) => `<button class="${phTab === k ? "on" : ""}" style="flex:1" onclick="phTab='${k}';renderPhrases()">${l}</button>`).join("")}
    </div>${body}`;
}
function wordSheet(key) {
  const w = (window.TIER_WORDS || {})[key]; if (!w) return;
  const tierName = { 1: "Tier1 必須語", 2: "Tier2 重要語", 3: "Tier3 専門語" }[w.t];
  const used = (window.PHRASES || []).filter(p => norm(p.en).includes(norm(key))).slice(0, 3);
  openSheet(`
    <h3><span class="kw t${w.t}">${esc(key)}</span><span class="chip">${tierName}</span></h3>
    <div class="srow"><b>意味</b>${esc(w.mean)}</div>
    <div class="srow"><b>使用例</b>${esc(w.ex)} <button class="btn sm" data-t="${esc(w.ex)}" data-v="1" onclick="sayBtn(this)">🔊</button></div>
    <div class="srow"><b>使われ方</b>${esc(w.use)}</div>
    ${used.length ? `<div class="srow"><b>この語を含む例文</b>${used.map(p => `<div style="margin-top:4px">・${esc(p.en)}</div>`).join("")}</div>` : ""}
    <div class="btnrow"><button class="btn pri" data-t="${esc(key)}" data-v="0" data-rate=".8" onclick="sayBtn(this)">🔊 発音</button>
      <button class="btn ghost" onclick="closeSheet()">閉じる</button></div>`);
}
function keySheet(phraseId, i) {
  const p = PH_BY_ID[phraseId]; if (!p) return;
  const k = (p.keys || [])[i]; if (!k) return;
  openSheet(`
    <h3><span class="kw key">${esc(k.w)}</span></h3>
    <div class="srow"><b>意味</b>${esc(k.mean)}</div>
    ${k.pron ? `<div class="srow"><b>発音</b>/${esc(k.pron)}/</div>` : ""}
    ${p.situation ? `<div class="srow"><b>使用場面</b>${esc(p.situation)}</div>` : ""}
    <div class="srow"><b>この表現を含む例文</b>${esc(p.en)}</div>
    ${(p.examples || []).length ? `<div class="srow"><b>別の例文</b>${p.examples.map(e => `<div style="margin-top:3px">・${esc(e)}</div>`).join("")}</div>` : ""}
    ${(p.alts || []).length ? `<div class="srow"><b>別の言い方</b>${p.alts.map(a => `<div style="margin-top:3px">・${esc(a)}</div>`).join("")}</div>` : ""}
    <div class="btnrow">
      <button class="btn pri" data-t="${esc(k.w)}" data-v="0" data-rate=".8" onclick="sayBtn(this)">🔊 ${esc(k.w)}</button>
      <button class="btn" data-t="${esc(p.en)}" data-v="1" onclick="sayBtn(this)">🔊 文全体</button>
      <button class="btn ghost" onclick="closeSheet()">閉じる</button></div>`);
}

/* =========================================================
   進捗
   ========================================================= */
function renderProgress() {
  const w = weekStats();
  const acc = w.total ? Math.round(100 * w.correct / w.total) : 0;
  const skills = Object.keys(SKILL_LABEL);
  const cats = window.CATEGORIES || [];
  // 直近14日
  const days = [];
  for (let i = 13; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const k = d.toISOString().slice(0, 10); days.push({ k, s: P.sessions[k] || { sec: 0 } }); }
  const maxSec = Math.max(600, ...days.map(d => d.s.sec));

  $("v-progress").innerHTML = `
    <h2 class="sec">今週</h2>
    <div class="statgrid">
      <div class="stat"><b>${fmtMin(w.sec)}</b><span>学習時間（分）</span></div>
      <div class="stat"><b>${w.lessons}</b><span>完了レッスン数</span></div>
      <div class="stat"><b>${w.utter}</b><span>発話回数</span></div>
      <div class="stat"><b>${w.total ? acc + "%" : "—"}</b><span>正答率</span></div>
    </div>
    <div class="card" style="margin-top:12px">
      <div class="note" style="margin-bottom:8px">直近14日の学習時間</div>
      <div style="display:flex;align-items:flex-end;gap:3px;height:70px">
        ${days.map(d => `<div title="${d.k}" style="flex:1;background:${d.s.sec ? "var(--accent)" : "var(--line)"};height:${Math.max(4, Math.round(100 * d.s.sec / maxSec))}%;border-radius:3px 3px 0 0"></div>`).join("")}
      </div>
      <div class="note center" style="margin-top:5px">${w.days} 日 / 7 日 学習</div>
    </div>

    <h2 class="sec">能力の推移（5分野）</h2>
    <div class="card">
      ${skills.map(k => {
        const v = skillAvg(k);
        return `<div class="barrow"><span class="lbl">${SKILL_LABEL[k]}</span>
          <span class="bar"><i style="width:${v || 0}%;background:${v == null ? "var(--line)" : v >= 75 ? "var(--ok)" : v >= 55 ? "var(--accent)" : "var(--warn)"}"></i></span>
          <span class="val">${v == null ? "—" : v}</span></div>`;
      }).join("")}
      <div class="note" style="margin-top:7px">直近12回の平均。STEP 1 が Listening、STEP 3 の採点が Speaking / Vocabulary / Fluency / Pronunciation に反映されます。</div>
    </div>

    <h2 class="sec">カテゴリ別 習熟度</h2>
    <div class="card">
      ${cats.map(c => {
        const ps = (window.PHRASES || []).filter(p => p.cat === c.id);
        const d = ps.filter(p => phraseDone(p.id)).length;
        const pct = ps.length ? Math.round(100 * d / ps.length) : 0;
        return `<div class="barrow"><span class="lbl">${esc(c.name)}</span><span class="bar"><i style="width:${pct}%;background:${pct >= 80 ? "var(--ok)" : "var(--accent)"}"></i></span><span class="val">${d}/${ps.length}</span></div>`;
      }).join("")}
    </div>

    <div class="btnrow"><button class="btn ng" onclick="resetStats()">学習履歴をリセット</button></div>`;
}
function resetStats() {
  if (!confirm("学習履歴・苦手記録・録音をすべて削除します。よろしいですか？")) return;
  P.recordings.forEach(r => recDel(r.id));
  const keep = P.settings;
  P = blankProfileData(); P.settings = keep; save(); renderProgress(); toast("リセットしました");
}

/* =========================================================
   ロールプレイ
   ========================================================= */
let RP = null;
function renderRoleplayMenu() {
  const RL = window.ROLEPLAYS || {};
  $("v-roleplay").innerHTML = `
    <div class="banner info">会議シナリオを通しで англий…英語だけで対話する練習です。ヒントと模範解答が各ターンに付きます。</div>
    ${Object.entries(RL).map(([k, v]) => `
      <button class="tile" onclick="startRoleplay('${k}')">
        <span class="ic">${v.icon || "🤝"}</span>
        <span class="body"><span class="t">${esc(v.name)}</span><span class="d">${esc(v.desc)}</span></span>
        <span class="go">›</span></button>`).join("")}
    <h2 class="sec">シナリオから通し練習</h2>
    ${(window.SCENARIOS || []).map(s => `<button class="tile" onclick="startRoleplayFromScenario('${s.id}')">
      <span class="ic">${catIcon(s.cat)}</span><span class="body"><span class="t">${esc(s.title)}</span>
      <span class="d">${s.steps.length}ステップを英語だけで通す</span></span><span class="go">›</span></button>`).join("")}
    <h2 class="sec">会話ログ</h2>
    <button class="tile" onclick="showLogs()"><span class="ic">📓</span><span class="body"><span class="t">過去のロールプレイ</span><span class="d">${P.logs.length}件を復習</span></span><span class="go">›</span></button>`;
}
function startRoleplay(key) {
  const rp = (window.ROLEPLAYS || {})[key]; if (!rp) return;
  RP = { def: rp, turns: rp.turns, i: 0, log: { mode: rp.name, at: Date.now(), items: [] }, kind: "script" };
  renderRP();
}
function startRoleplayFromScenario(id) {
  const sc = (window.SCENARIOS || []).find(s => s.id === id); if (!sc) return;
  const turns = sc.steps.map(st => {
    const p = PH_BY_ID[st.phrase];
    return p ? { ai: st.note || "次の内容を英語で伝えてください", ja: p.ja, hint: st.note || "", sample: p.en } : null;
  }).filter(Boolean);
  if (!turns.length) { toast("このシナリオは通し練習に対応していません"); return; }
  RP = { def: { name: sc.title, desc: sc.desc || "" }, turns, i: 0, log: { mode: sc.title, at: Date.now(), items: [] }, kind: "scenario" };
  go("roleplay"); renderRP();
}
function renderRP() {
  $("v-roleplay").innerHTML = `
    <button class="back" onclick="RP=null;go('roleplay')">← ロールプレイ一覧</button>
    <div class="card">
      <div class="chips"><span class="chip cat">${esc(RP.def.name)}</span><span class="chip" id="rpProg">ターン 1 / ${RP.turns.length}</span></div>
      <div class="note" style="margin-top:6px">${esc(RP.def.desc || "")}</div>
      <div class="chat" id="rpChat"></div>
      <div id="rpInput"></div>
    </div>`;
  rpNext();
}
function rpNext() {
  if (RP.i >= RP.turns.length) return rpFinish();
  const t = RP.turns[RP.i];
  $("rpProg").textContent = `ターン ${RP.i + 1} / ${RP.turns.length}`;
  const chat = $("rpChat");
  if (RP.kind === "script") {
    chat.insertAdjacentHTML("beforeend", `<div class="msg ai">${hlTier(t.ai)}
      ${P.settings.showJa && t.ja ? `<div class="jah">${esc(t.ja)}</div>` : ""}
      <div class="btnrow tight"><button class="btn sm ghost" data-t="${esc(t.ai)}" data-v="1" onclick="sayBtn(this)">🔊</button></div></div>`);
    speakOne(t.ai, { voice: voiceFor(VOICE_PROFILES[1]) });
  } else {
    chat.insertAdjacentHTML("beforeend", `<div class="msg ai"><b style="font-size:.76rem;opacity:.8">お題</b><div>${esc(t.ja)}</div>
      ${t.hint ? `<div class="jah">🎯 ${esc(t.hint)}</div>` : ""}</div>`);
  }
  $("rpInput").innerHTML = `
    ${t.hint && RP.kind === "script" ? `<div class="note">💡 ヒント：${esc(t.hint)}</div>` : ""}
    <textarea id="rpAns" rows="2" placeholder="英語で応答…"></textarea>
    <div class="btnrow">
      <button class="btn pri" onclick="rpReply()">送信</button>
      ${SR ? `<button class="btn" id="rpMic" onclick="rpMic()">🎙 音声で応答</button>` : ""}
      <button class="btn ghost" onclick="rpShowSample()">模範例を見る</button>
    </div>`;
  chat.scrollIntoView(false);
}
function rpMic() {
  const b = $("rpMic"); b.innerHTML = '<span class="recdot"></span>聞き取り中…'; b.disabled = true;
  listenOnce((txt) => { $("rpAns").value = txt; b.disabled = false; b.textContent = "🎙 音声で応答"; },
    () => { const bb = $("rpMic"); if (bb) { bb.disabled = false; bb.textContent = "🎙 音声で応答"; } });
}
function rpShowSample() { toast(RP.turns[RP.i].sample); }
function rpReply() {
  const ans = ($("rpAns").value || "").trim();
  if (!ans) { toast("英語で応答を入力してください"); return; }
  const t = RP.turns[RP.i];
  const r = evaluate(t.sample, ans, null, Math.max(1.5, words(ans).length / 2.2), null);
  RP.log.items.push({ ai: RP.kind === "script" ? t.ai : t.ja, me: ans, sample: t.sample, score: r.total });
  const t2 = sessToday(); t2.utter++; t2.total++; if (r.total >= 70) t2.correct++;
  pushSkill("speaking", r.accuracy); pushSkill("fluency", r.fluency); save();
  $("rpChat").insertAdjacentHTML("beforeend", `<div class="msg me">${esc(ans)}
    <div class="sample" style="color:#cfe0ff">📝 模範例：${esc(t.sample)}（一致度 ${r.total}）</div></div>`);
  RP.i++; $("rpInput").innerHTML = "";
  setTimeout(rpNext, 700);
}
function rpFinish() {
  const avg = RP.log.items.length ? Math.round(RP.log.items.reduce((a, b) => a + b.score, 0) / RP.log.items.length) : 0;
  RP.log.avg = avg;
  P.logs.unshift(RP.log); while (P.logs.length > 30) P.logs.pop(); save();
  $("rpInput").innerHTML = `
    <div class="banner ok">🎉 完了！平均一致度 ${avg} 点。会話ログに保存しました。</div>
    <div class="btnrow"><button class="btn pri" onclick="RP=null;go('roleplay')">一覧へ</button>
      <button class="btn ghost" onclick="showLogs()">ログを見る</button></div>`;
}
function showLogs() {
  $("v-roleplay").innerHTML = `
    <button class="back" onclick="go('roleplay')">← ロールプレイ一覧</button>
    <h2 class="sec">会話ログ</h2>
    ${P.logs.length ? P.logs.map(l => `<div class="card">
      <div class="chips" style="margin-bottom:7px"><span class="chip cat">${esc(l.mode)}</span>
        <span class="chip">${new Date(l.at).toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
        ${l.avg != null ? `<span class="chip ${l.avg >= 70 ? "ok" : "warn"}">平均 ${l.avg}</span>` : ""}</div>
      ${l.items.map(it => `<div class="srow"><b>相手 / お題</b>${esc(it.ai)}</div>
        <div class="srow" style="margin-top:3px"><b>自分</b>${esc(it.me)}
          <div style="font-size:.78rem;color:var(--accent);margin-top:2px">模範例：${esc(it.sample)}</div></div><hr class="divider">`).join("")}
    </div>`).join("") : '<div class="empty"><span class="big">📓</span>ログはまだありません</div>'}`;
}

/* =========================================================
   設定
   ========================================================= */
function renderSettings() {
  const st = P.settings;
  const vopt = (sel, want) => EN_VOICES.map(v => {
    const g = guessGender(v);
    return `<option value="${esc(v.name)}" ${v.name === sel ? "selected" : ""}>${esc(v.name)}（${esc(v.lang)}${g ? "・" + (g === "male" ? "男" : "女") : ""}）</option>`;
  }).join("");
  $("v-settings").innerHTML = `
    <h2 class="sec">音声</h2>
    ${VOICE_PROFILES.map(v => `
      <div class="setrow"><span>${esc(v.name.split("—")[0].trim())}<br><small class="mute" style="font-weight:400">${esc(v.desc)}</small></span>
        <select onchange="P.settings.${v.key}=this.value;save()">
          <option value="">自動選択</option>${vopt(st[v.key], v.want)}
        </select></div>`).join("")}
    <div class="setrow"><span>日本語音声</span>
      <select onchange="P.settings.ja=this.value;save()">
        <option value="">自動</option>
        ${JA_VOICES.map(v => `<option value="${esc(v.name)}" ${v.name === st.ja ? "selected" : ""}>${esc(v.name)}</option>`).join("")}
      </select></div>
    <div class="setrow"><span>全体の速度 <b id="rateV">${st.rate.toFixed(1)}×</b></span>
      <input type="range" min="0.7" max="1.4" step="0.1" value="${st.rate}"
        oninput="P.settings.rate=+this.value;document.getElementById('rateV').textContent=(+this.value).toFixed(1)+'×';save()"></div>
    <div class="btnrow"><button class="btn pri" onclick="testVoices()">🔊 3音声＋和訳をテスト再生</button></div>

    <h2 class="sec">表示</h2>
    <div class="setrow"><span>日本語訳の表示</span>
      <div class="seg">
        <button class="${st.showJa ? "on" : ""}" onclick="P.settings.showJa=true;save();renderSettings()">ON</button>
        <button class="${!st.showJa ? "on" : ""}" onclick="P.settings.showJa=false;save();renderSettings()">OFF</button>
      </div></div>
    <div class="setrow"><span>文字サイズ</span>
      <div class="seg">${["s", "m", "l"].map(f => `<button class="${st.fs === f ? "on" : ""}" onclick="setFs('${f}')">${{ s: "小", m: "中", l: "大" }[f]}</button>`).join("")}</div></div>
    <div class="setrow"><span>テーマ</span>
      <div class="seg">
        <button class="${st.theme === "" ? "on" : ""}" onclick="P.settings.theme='';save();applySettings();renderSettings()">自動</button>
        <button class="${st.theme === "light" ? "on" : ""}" onclick="P.settings.theme='light';save();applySettings();renderSettings()">ライト</button>
        <button class="${st.theme === "dark" ? "on" : ""}" onclick="P.settings.theme='dark';save();applySettings();renderSettings()">ダーク</button>
      </div></div>

    <h2 class="sec">アカウント</h2>
    <div class="setrow"><span>学習者</span><span class="mute">${esc((APP.profiles.find(p => p.id === APP.current) || {}).name || "")}</span></div>
    <div class="btnrow"><button class="btn ghost" onclick="logout()">ログアウト（学習者を切替）</button></div>

    <h2 class="sec">このアプリについて</h2>
    <div class="card">
      <div class="note">
        <b>Meeting English Trainer v2.0</b><br>
        システム開発・開発委託の会議を英語で進めるための実務直結トレーニング。<br><br>
        ・学習データはこの端末内（localStorage / IndexedDB）にのみ保存され、外部に送信されません。<br>
        ・音声合成・音声認識は端末のブラウザ機能（Web Speech API）を使用します。iOS Safari は音声認識に非対応のため、STEP 3 は文字入力で採点します。<br>
        ・発話採点は端末内の簡易アルゴリズムによる参考値です。<br>
        ・教材の会議データは実名・実システム名をすべて仮称に置換しています。
      </div>
    </div>`;
}
function setFs(f) { P.settings.fs = f; save(); applySettings(); renderSettings(); }
function testVoices() {
  const en = "Have you confirmed the license cost with the site that will be charged?";
  const ja = "課金先の拠点とライセンス費用を確認しましたか？";
  const items = VOICE_PROFILES.map(v => ({ text: en, voice: voiceFor(v), rate: v.rate }));
  items.push({ text: ja, voice: jaVoice(), lang: "ja-JP", rate: 1 });
  speakSeq(items);
}

/* ---------- 自動再生の停止（将来拡張用フック） ---------- */
function stopAuto() { }

/* =========================================================
   起動
   ========================================================= */
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") { stopRec(); stopSpeak(); }
});
window.addEventListener("pagehide", () => { stopRec(); stopSpeak(); });

function boot() {
  buildIndex(); buildKwRe();
  refreshVoices();
  if (window.speechSynthesis) speechSynthesis.onvoiceschanged = () => {
    refreshVoices();
    if (CUR === "settings" && P) renderSettings();
  };
  renderLogin();
  if (APP.current && APP.profiles.some(p => p.id === APP.current)) {
    const prof = APP.profiles.find(p => p.id === APP.current);
    if (!prof.pass) enterApp(APP.current);
  }
  if (location.protocol !== "file:" && "serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => { });
  }
}
// 学習画面は go() から renderStudy を呼ぶ
const _origGo = go;
window.go = function (name, opt) { _origGo(name, opt); if (name === "study") renderStudy(); };

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
