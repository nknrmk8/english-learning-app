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
const dateKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const todayKey = () => dateKey(new Date());
const rnd = arr => arr[Math.floor(Math.random() * arr.length)];
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
const fmtMin = sec => !sec ? "0" : sec < 60 ? "<1" : String(Math.round(sec / 60));

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
let _quotaWarned = false;
function save() {
  if (!P || !PKEY) return;
  try { localStorage.setItem(PKEY, JSON.stringify(P)); return; } catch (e) { }
  // 容量超過: 古いログ・録音メタを間引いて再試行
  try {
    if (P.logs && P.logs.length > 5) P.logs = P.logs.slice(0, 5);
    if (P.recordings && P.recordings.length > 10) {
      P.recordings.slice(10).forEach(r => recDel(r.id));
      P.recordings = P.recordings.slice(0, 10);
    }
    localStorage.setItem(PKEY, JSON.stringify(P));
    if (!_quotaWarned) { _quotaWarned = true; toast("保存容量が不足したため、古いログを整理しました"); }
  } catch (e2) {
    if (!_quotaWarned) { _quotaWarned = true; toast("学習データを保存できませんでした（端末の空き容量をご確認ください）"); }
  }
}

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
    const s = P.sessions[dateKey(d)];
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
/* 3つの「喋り方」。速度差ではなく発話スタイルで作り分ける */
const VOICE_PROFILES = [
  { key: "v1", name: "ネイティブ寄りの話し方", short: "ネイティブ寄り",
    desc: "実際の会議で耳にするままの自然な流れ", mode: "normal", rate: 1.0 },
  { key: "v2", name: "1語ずつはっきり", short: "1語ずつはっきり",
    desc: "普通の速さのまま単語を区切って発音。1語ずつ聞き取る", mode: "word", rate: 1.0 },
  { key: "v3", name: "普通の喋り言葉（別の声）", short: "普通の喋り言葉",
    desc: "話者が変わり、人によるニュアンスの違いに慣れる", mode: "normal", rate: 1.04 }
];
/* 通し再生のセグメント（英 → 日 → 英 → 英） */
const SEGMENTS = [
  { tag: "EN", prof: 0 },
  { tag: "JA", prof: -1 },
  { tag: "EN", prof: 1 },
  { tag: "EN", prof: 2 }
];
/* ニューラル系の音声名。最も自然に聞こえるものを「ネイティブ寄り」に充てる */
const NATURAL_RE = /natural|neural|online|google|premium|enhanced|siri/i;
let casualIdx = 0;   // 「普通の喋り言葉」は再生のたびに話者を変える

function setVoice(key) {
  const name = P && P.settings[key];
  if (!name) return null;
  return EN_VOICES.find(v => v.name === name) || null;
}
function pickNative() {
  return setVoice("v1") || EN_VOICES.find(v => NATURAL_RE.test(v.name)) || EN_VOICES[0] || null;
}
function pickClear() {
  const set = setVoice("v2"); if (set) return set;
  const nat = pickNative();
  return EN_VOICES.find(v => v !== nat) || nat;
}
function pickCasual() {
  const set = setVoice("v3"); if (set) return set;
  const used = [pickNative(), pickClear()];
  const pool = EN_VOICES.filter(v => !used.includes(v));
  if (!pool.length) return EN_VOICES[EN_VOICES.length - 1] || null;
  return pool[casualIdx % pool.length];
}
function voiceFor(prof) {
  return prof.key === "v1" ? pickNative() : prof.key === "v2" ? pickClear() : pickCasual();
}
/* 音声が1種類しかない端末でも「人による違い」が出るよう抑揚を振る */
function casualPitch() { return [1.0, 0.9, 1.1][casualIdx % 3]; }

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
    if (it.pitch) u.pitch = clamp(it.pitch, 0.5, 2);
    if (it.voice) { u.voice = it.voice; u.lang = it.voice.lang; }
    if (it.onBoundary) u.onboundary = it.onBoundary;
    if (it.onStart) it.onStart();
    const go = () => { if (it.onEnd) it.onEnd(); setTimeout(next, it.gap == null ? 380 : it.gap); };
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
  const vi = +(el.dataset.v || 0);
  const prof = VOICE_PROFILES[vi] || VOICE_PROFILES[0];
  speakOne(t, { voice: voiceFor(prof), rate: el.dataset.rate ? +el.dataset.rate : prof.rate });
}

/* =========================================================
   音声認識 + 録音
   ========================================================= */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
let activeRec = null, recTimer = null, mediaRec = null, mediaStream = null, recChunks = [], recStartAt = 0;

function stopRec() {
  if (recTimer) { clearTimeout(recTimer); recTimer = null; }
  if (recTick) { clearInterval(recTick); recTick = null; }
  if (listenSt) { listenSt.done = true; listenSt = null; }
  if (activeRec) { try { activeRec.abort(); } catch (e) { } activeRec = null; }
  stopMedia();
}
function stopMedia() {
  try { if (mediaRec && mediaRec.state !== "inactive") mediaRec.stop(); } catch (e) { }
  mediaRec = null;
  if (mediaStream) { mediaStream.getTracks().forEach(t => { try { t.stop(); } catch (e) { } }); mediaStream = null; }
}
/* 認識 + 同時録音。ユーザーが「喋り終わりました」を押すまで聞き続ける。
   onDone(transcript, confidence, blob, seconds) / onInterim(text) */
let listenSt = null, recTick = null;

function startListening(onDone, onErr, onInterim) {
  if (!SR) { if (onErr) onErr("unsupported"); return; }
  stopRec();
  recChunks = []; recStartAt = Date.now();
  const st = { onDone, onErr, onInterim, finalText: "", conf: 0, confN: 0,
               userStopped: false, done: false, restarts: 0, rec: null, fatal: null };
  listenSt = st;

  const build = () => {
    const rec = new SR();
    rec.lang = "en-US"; rec.continuous = true; rec.interimResults = true; rec.maxAlternatives = 1;
    rec.onresult = e => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i], alt = res[0];
        if (res.isFinal) {
          st.finalText += (st.finalText ? " " : "") + String(alt.transcript).trim();
          if (typeof alt.confidence === "number" && alt.confidence > 0) { st.conf += alt.confidence; st.confN++; }
        } else interim += alt.transcript;
      }
      if (st.onInterim) st.onInterim((st.finalText + " " + interim).trim());
    };
    rec.onerror = e => {
      if (e.error === "no-speech" || e.error === "aborted") return;   // 黙っていても止めない
      if (e.error === "not-allowed" || e.error === "service-not-allowed" || e.error === "audio-capture") {
        st.fatal = e.error; st.userStopped = true;
        try { rec.stop(); } catch (x) { }
      }
    };
    rec.onend = () => {
      if (st !== listenSt || st.done) return;
      if (st.userStopped) { finishListening(); return; }
      // ユーザーがまだ止めていない（無音で切れただけ）→ 聞き直して継続
      if (st.restarts < 60 && Date.now() - recStartAt < 180000) {
        st.restarts++;
        try { st.rec = build(); activeRec = st.rec; st.rec.start(); return; } catch (x) { }
      }
      finishListening();
    };
    return rec;
  };

  try { st.rec = build(); activeRec = st.rec; st.rec.start(); }
  catch (e) { listenSt = null; if (onErr) onErr("start-failed"); return; }

  // 3分で強制終了（押し忘れ対策）
  recTimer = setTimeout(() => { if (listenSt === st) stopListening(); }, 180000);

  // 録音はベストエフォート（失敗しても認識は続ける）
  if (navigator.mediaDevices && window.MediaRecorder) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      if (st !== listenSt || st.done) { stream.getTracks().forEach(t => { try { t.stop(); } catch (x) { } }); return; }
      mediaStream = stream;
      mediaRec = new MediaRecorder(stream);
      mediaRec.ondataavailable = ev => { if (ev.data && ev.data.size) recChunks.push(ev.data); };
      mediaRec.start();
    }).catch(() => { mediaRec = null; });
  }
}

/* ユーザーが「喋り終わりました」を押したとき */
function stopListening() {
  const st = listenSt;
  if (!st || st.done) return;
  st.userStopped = true;
  if (st.rec) { try { st.rec.stop(); } catch (e) { finishListening(); } }
  else finishListening();
}

function finishListening() {
  const st = listenSt;
  if (!st || st.done) return;
  st.done = true; listenSt = null;
  if (recTimer) { clearTimeout(recTimer); recTimer = null; }
  if (recTick) { clearInterval(recTick); recTick = null; }
  if (activeRec === st.rec) activeRec = null;
  const sec = (Date.now() - recStartAt) / 1000;
  const conf = st.confN ? st.conf / st.confN : null;
  const type = (mediaRec && mediaRec.mimeType) || "audio/webm";
  const deliver = () => {
    const blob = recChunks.length ? new Blob(recChunks, { type }) : null;
    recChunks = [];
    const txt = st.finalText.trim();
    if (st.fatal) { if (st.onErr) st.onErr(st.fatal); return; }
    if (!txt) { if (st.onErr) st.onErr("no-speech"); return; }
    st.onDone(txt, conf, blob, sec);
  };
  // dataavailable は stop() 後に発火するので onstop を待つ
  if (mediaRec && mediaRec.state !== "inactive") {
    mediaRec.onstop = () => { stopMedia(); deliver(); };
    try { mediaRec.stop(); } catch (e) { stopMedia(); deliver(); }
  } else { stopMedia(); deliver(); }
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
function evaluate(ref, hyp, keys, sec, conf, alts) {
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
  const hset2 = new Set(hw);
  const fillerN = FILLERS.filter(f => f.includes(" ") ? nh.includes(f) : hset2.has(f)).length;
  const lenRatio = rw.length ? hw.length / rw.length : 0;
  const lenPen = lenRatio < 0.55 ? (0.55 - lenRatio) * 90 : (lenRatio > 1.8 ? (lenRatio - 1.8) * 40 : 0);
  const fluency = Math.round(clamp(rateScore - fillerN * 9 - lenPen, 0, 100));
  // 会議表現としての自然さ
  const nr = norm(ref);
  const refPolite = POLITE.filter(p => nr.includes(p)).length;
  const hypPolite = POLITE.filter(p => nh.includes(p)).length;
  const casualN = CASUAL.filter(c => c.includes(" ") ? nh.includes(c) : hset2.has(c)).length;
  let naturalness = Math.round(grammar * 0.55 + vocabulary * 0.25 + 20);
  if (refPolite > 0) naturalness += hypPolite > 0 ? 8 : -16;
  naturalness -= casualN * 12;
  naturalness = Math.round(clamp(naturalness, 0, 100));

  const total = Math.round(accuracy * 0.26 + grammar * 0.2 + vocabulary * 0.16 + pronunciation * 0.16 + fluency * 0.1 + naturalness * 0.12);
  const missed = rw.filter((w, i) => !hits[i] && w.length > 3);

  // 改善英文: 学習者の発話に近い言い回しを候補から選び、会議向けの言い換えとして示す
  let closest = null, cs = -1;
  (alts || []).forEach(a => {
    const aw = words(a), sc2 = aw.length ? lcsLen(aw, hw) / aw.length : 0;
    if (sc2 > cs) { cs = sc2; closest = a; }
  });
  const refLcs = rw.length ? lcsLen(rw, hw) / rw.length : 0;
  let advice;
  if (total >= 85) {
    advice = { label: "とても自然です。この表現で会議でも通用します。", text: ref };
  } else if (closest && cs > refLcs + 0.1) {
    advice = { label: "あなたの言い方に近く、会議でも自然なのはこちらです。", text: closest, also: ref };
  } else if (casualN > 0) {
    advice = { label: "くだけた語が混ざっています。会議ではこう言いましょう。", text: ref };
  } else if (accuracy >= 55) {
    advice = { label: "意味は通じます。会議ではこちらの方が自然です。", text: ref, also: closest };
  } else {
    advice = { label: "まずはモデル英文をそのまま言えるように練習しましょう。", text: ref };
  }

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
  document.querySelectorAll(".tabbar button").forEach(b => { b.classList.remove("on"); b.setAttribute("aria-current", "false"); });
  const t = $("t-" + name); if (t) { t.classList.add("on"); t.setAttribute("aria-current", "page"); }
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
  ["npName", "npPass"].forEach(id => {
    const el = $(id);
    if (el) el.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); createProfile(); } });
  });
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
function logout() {
  stopSpeak(); stopRec();
  clearInterval(tickTimer); tickTimer = null;
  save();                     // 解放前に最後の状態を保存
  P = null; PKEY = "";
  APP.current = null; saveApp();
  $("app").hidden = true; $("login").classList.add("active"); renderLogin();
}

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
      return `<button type="button" class="card" style="cursor:pointer;width:100%;text-align:left;display:block;font:inherit;color:inherit" onclick="openScenario('${s.id}')">
        <div class="chips" style="margin-bottom:7px">
          <span class="chip cat">${catIcon(s.cat)} ${esc(catName(s.cat))}</span>
          <span class="chip ${lvClass(s.level)}">${esc(s.level)}</span>
          ${p.pct === 100 ? '<span class="chip ok">✓ 完了</span>' : p.done ? `<span class="chip warn">学習中 ${p.done}/${p.total}</span>` : ""}
        </div>
        <div style="font-weight:800;font-size:1rem">${esc(s.title)}</div>
        <div class="note" style="margin-top:4px">${esc(s.desc || "")}</div>
        <div style="margin-top:10px" class="bar"><i style="width:${p.pct}%;background:${p.pct === 100 ? "var(--ok)" : "var(--accent)"}"></i></div>
        <div class="note" style="margin-top:5px">${p.total} ステップ・${p.done} 完了</div>
      </button>`;
    }).join("") : `<div class="empty"><span class="big">🔍</span>該当するシナリオがありません</div>`}`;
}

/* =========================================================
   学習画面（STEP 1→2→3）
   ========================================================= */
let ST = null; // {sc, idx, phrase, v:[4セグメント再生済み], result, recKey, hideEn, typing}
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
  ST = { sc, idx, v: [false, false, false, false], result: null, recKey: null, hideEn: false, typing: false };
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
  const total = ST.sc.steps.length;
  $("barTitle").textContent = ST.sc.title;

  $("v-study").innerHTML = `
    <button class="back" onclick="go('scenarios')">← シナリオ一覧</button>

    <div class="card pad-s" style="margin-bottom:11px">
      <div class="chips">
        <span class="chip cat">${catIcon(p.cat)} ${esc(catName(p.cat))}</span>
        <span class="chip ${lvClass(p.level)}">${esc(p.level)}</span>
        <span class="chip">${ST.idx + 1} / ${total}</span>
        ${rec.done ? '<span class="chip ok">✓ 習得済み</span>' : ""}
        <button class="chip" style="cursor:pointer;margin-left:auto" onclick="toggleSave('${p.id}')" aria-pressed="${saved}">${saved ? "★ 保存済み" : "☆ 保存"}</button>
      </div>
      ${stp.note ? `<div class="note" style="margin-top:7px">🎯 この発言のねらい：${esc(stp.note)}</div>` : ""}
      <div class="bar" style="margin-top:9px"><i style="width:${Math.round(100 * ST.sc.steps.filter(x => phraseDone(x.phrase)).length / total)}%"></i></div>
    </div>

    <!-- ① 聞いて理解する -->
    <div class="card">
      <div class="card-head">
        <span class="stepno">1</span><span class="t">聞いて理解する</span>
        <span class="chip" id="chk1" style="margin-left:auto"></span>
      </div>
      <div class="en-lg ${ST.hideEn ? "masked" : ""}" id="enText" lang="en">${hlPhrase(p)}</div>
      ${ST.hideEn ? `<div class="note" style="margin-top:4px">英文を隠しています（タップで表示）</div>`
                  : `<div class="ja-sub">${esc(p.ja)}</div>`}

      <div class="btnrow">
        <button class="btn pri block lg" id="playAllBtn" onclick="playThrough()">▶ 通しで聞く（英 → 日 → 英 → 英）</button>
      </div>

      <div class="note" style="margin:11px 0 7px">再生順（1つずつ個別に再生もできます）</div>
      ${SEGMENTS.map((sg, i) => {
        const prof = sg.prof >= 0 ? VOICE_PROFILES[sg.prof] : null;
        const nm = prof ? prof.name : "日本語で意味を確認";
        const ds = prof ? prof.desc : p.ja;
        return `<div class="seq" id="seq${i}">
          <span class="no">${i + 1}</span>
          <button class="play" onclick="playSeg(${i})" aria-label="${esc(nm)}を再生">▶</button>
          <div class="meta">
            <div class="nm"><span class="tag ${sg.tag === "JA" ? "ja" : "en"}">${sg.tag}</span>${esc(nm)}</div>
            <div class="ds">${esc(ds)}</div>
          </div>
          <span class="vcheck"></span>
        </div>`;
      }).join("")}

      <div class="btnrow">
        <button class="btn ghost" onclick="toggleHideEn()">${ST.hideEn ? "👁 英文を表示" : "🙈 英文を隠す"}</button>
        <button class="btn ghost" onclick="markListenHard()">🤔 聞き取れなかった</button>
      </div>
      ${!ttsAvailable() ? '<div class="banner warn" style="margin-top:10px">この端末は音声合成に対応していません。英文を目で追って進めてください。</div>' : ""}

      ${(p.keys || []).length ? `<hr class="divider"><div class="srow"><b>重要表現</b>
        ${p.keys.map((k, i) => `<div style="margin-top:5px"><span class="kw key" data-p="${esc(p.id)}" data-i="${i}" onclick="keySheet(this.dataset.p,+this.dataset.i)">${esc(k.w)}</span> — ${esc(k.mean)}</div>`).join("")}</div>` : ""}
      ${p.situation ? `<div class="srow"><b>使用場面</b>${esc(p.situation)}</div>` : ""}
    </div>

    <!-- ② 自分で話す -->
    <div class="card">
      <div class="card-head">
        <span class="stepno">2</span><span class="t">自分で話す</span>
        <span class="chip" id="chk2" style="margin-left:auto"></span>
      </div>
      <div id="speakBody"></div>
    </div>

    <div class="btnrow" style="margin-bottom:6px">
      ${ST.idx > 0 ? `<button class="btn ghost" onclick="prevPhrase()">← 前のフレーズ</button>` : ""}
      ${ST.idx < total - 1
        ? `<button class="btn acc" style="margin-left:auto" onclick="nextPhrase()">次のフレーズ →</button>`
        : `<button class="btn ok" style="margin-left:auto" onclick="finishScenario()">シナリオを完了する 🎉</button>`}
    </div>`;
  renderSpeakSection();
  updateSeqUI();
}

/* ② 自分で話す — ここだけ部分更新する（他の操作で入力や採点結果が消えないように） */
function renderSpeakSection() {
  const b = $("speakBody"); if (!b || !ST) return;
  const p = ST.phrase, r = ST.result, rec = !!listenSt;
  b.innerHTML = `
    <div class="note">次の日本語を英語で言ってみましょう。${SR ? "話し終わったら「喋り終わりました」を押してください。" : "（この端末は音声認識に非対応のため、文字入力で採点します）"}</div>
    <div style="font-size:1.04rem;font-weight:700;margin:9px 0 2px">「${esc(p.ja)}」</div>
    <div class="micwrap">
      <button class="micbtn ${rec ? "rec" : ""}" id="micBtn" onclick="${rec ? "endSpeak()" : "startSpeak()"}"
        aria-label="${rec ? "録音を終了する" : "録音を開始する"}">${rec ? "●" : "🎙"}</button>
      <div class="note" id="micHint">${rec ? '<span class="recdot"></span>録音中 <b id="recSec">0</b> 秒'
        : (SR ? "タップして録音を開始" : "下の入力欄に英語を入力してください")}</div>
    </div>
    ${rec ? `
      <div class="btnrow" style="justify-content:center">
        <button class="btn ok lg block" id="endBtn" onclick="endSpeak()">✅ 喋り終わりました</button>
      </div>
      <div class="banner info" id="liveText" lang="en" style="margin-top:10px;min-height:2.8em">聞き取り中…</div>`
    : `
      <div class="btnrow" style="justify-content:center">
        <button class="btn sm ghost" onclick="toggleHideEn()">${ST.hideEn ? "👁 英文を表示" : "🙈 英文を隠して挑戦"}</button>
        <button class="btn sm ghost" onclick="playSeg(0)" aria-label="お手本の音声を再生">🔊 お手本</button>
        ${ST.typing || !SR ? "" : `<button class="btn sm ghost" onclick="manualInput()">⌨ 文字で入力</button>`}
      </div>`}
    ${(ST.typing || !SR) && !rec ? `
      <div style="margin-top:10px">
        <label class="fld"><span>英語で入力して採点</span>
          <textarea id="typeAns" rows="2" lang="en" placeholder="Type your English here..."></textarea></label>
        <div class="btnrow tight"><button class="btn acc" onclick="submitTyped()">この内容で採点する</button></div>
      </div>` : ""}
    <div id="scoreArea" aria-live="polite">${r && !rec ? scoreHtml(r) : ""}</div>`;
}

/* 2セクションの完了マークを更新 */
function updateChecks() {
  if (!ST) return;
  const c1 = $("chk1");
  if (c1) {
    const n = ST.v.filter(Boolean).length;
    const done = n === ST.v.length;
    c1.className = "chip" + (done ? " ok" : "");
    c1.textContent = done ? "✓ 通し再生済み" : (playingSeg >= 0 ? "再生中 " + (playingSeg + 1) + " / 4" : n + " / 4 再生");
  }
  const c2 = $("chk2");
  if (c2) {
    const done = !!ST.result;
    c2.className = "chip" + (done ? " ok" : "");
    c2.textContent = done ? "✓ " + ST.result.total + "点" : "未挑戦";
  }
}
function stepDone(n) {
  if (!ST) return false;
  return n === 1 ? ST.v.every(Boolean) : !!ST.result;
}
function toggleHideEn() {
  ST.hideEn = !ST.hideEn;
  renderStudy();
  if (ST.hideEn) { const sb = $("speakBody"); if (sb) sb.scrollIntoView({ behavior: "smooth", block: "center" }); }
}

/* ====== 再生（英 → 日 → 英 → 英） ====== */
let playingSeg = -1, playingAll = false, enSpans = [];

function prepEnSpans() {
  const el = $("enText");
  if (!el || ST.hideEn) return [];
  const toks = ST.phrase.en.split(/(\s+)/); let pos = 0;
  el.innerHTML = toks.map(t => {
    const st = pos; pos += t.length;
    return /^\s+$/.test(t) || !t ? t : `<span class="pw" data-s="${st}">${esc(t)}</span>`;
  }).join("");
  return [...el.querySelectorAll(".pw")];
}
function hlAt(charIndex) {
  enSpans.forEach(x => x.classList.remove("w-now"));
  let t = null; for (const x of enSpans) if (+x.dataset.s <= charIndex) t = x;
  if (t) t.classList.add("w-now");
}
function clearEnHl() {
  enSpans.forEach(x => x.classList.remove("w-now"));
  const el = $("enText");
  if (el && ST && !ST.hideEn) el.innerHTML = hlPhrase(ST.phrase);
  enSpans = [];
}

/* セグメント i の発話アイテム列を作る */
function segItems(i) {
  const p = ST.phrase, sg = SEGMENTS[i];
  if (sg.prof < 0) return [{ text: p.ja, voice: jaVoice(), lang: "ja-JP", rate: 1, seg: i }];
  const prof = VOICE_PROFILES[sg.prof];
  const voice = voiceFor(prof);
  if (prof.mode === "word") {
    // 語の間にカンマを入れて区切る。発話を分割すると TTS の起動遅延が語数ぶん乗って
    // 間延びするため、1発話のまま「普通の速さ＋短い区切り」にする。
    const toks = p.en.split(/\s+/).filter(Boolean);
    const origAt = []; let pos = 0;
    toks.forEach(w => { const at = p.en.indexOf(w, pos); origAt.push(at); pos = at + w.length; });
    const spokenAt = []; let sp = 0;
    toks.forEach(w => { spokenAt.push(sp); sp += w.length + 2; });
    return [{
      text: toks.join(", "), voice, rate: prof.rate, seg: i,
      onBoundary: e => {
        let k = 0;
        for (let j = 0; j < spokenAt.length; j++) if (spokenAt[j] <= e.charIndex) k = j;
        hlAt(origAt[k]);
      }
    }];
  }
  return [{ text: p.en, voice, rate: prof.rate,
            pitch: sg.prof === 2 ? casualPitch() : 1.0, seg: i,
            onBoundary: e => hlAt(e.charIndex) }];
}

function wrapItems(items) {
  return items.map(it => Object.assign({}, it, {
    onStart: () => {
      playingSeg = it.seg;
      if (it.seg === 1) { enSpans.forEach(x => x.classList.remove("w-now")); }
      if (!ST.v[it.seg]) { ST.v[it.seg] = true; }
      if (it.onStart) it.onStart();
      updateSeqUI();
    }
  }));
}

function playThrough() {
  if (seqActive) { stopPlayback(); return; }
  if (!ttsAvailable()) { toast("この端末は音声合成に対応していません"); return; }
  casualIdx++;
  playingAll = true;
  enSpans = prepEnSpans();
  const items = wrapItems([].concat(segItems(0), segItems(1), segItems(2), segItems(3)));
  updateSeqUI();
  speakSeq(items, finishPlayback);
}
function playSeg(i) {
  if (seqActive && playingSeg === i) { stopPlayback(); return; }
  if (!ttsAvailable()) { toast("この端末は音声合成に対応していません"); return; }
  if (i === 3) casualIdx++;
  playingAll = false;
  enSpans = prepEnSpans();
  const items = wrapItems(segItems(i));
  updateSeqUI();
  speakSeq(items, finishPlayback);
}
function finishPlayback() {
  playingSeg = -1; playingAll = false;
  clearEnHl();
  pushSkill("listening", ST.v.every(Boolean) ? 84 : 72);
  save(); updateSeqUI();
}
function stopPlayback() {
  stopSpeak();
  playingSeg = -1; playingAll = false;
  clearEnHl(); updateSeqUI();
}
/* 再生行の見た目を更新（画面全体は再描画しない） */
function updateSeqUI() {
  if (!ST) return;
  SEGMENTS.forEach((sg, i) => {
    const row = $("seq" + i); if (!row) return;
    const now = playingSeg === i;
    row.classList.toggle("now", now);
    row.classList.toggle("done", !!ST.v[i] && !now);
    const b = row.querySelector(".play"); if (b) b.textContent = now ? "⏸" : ST.v[i] ? "↻" : "▶";
    const c = row.querySelector(".vcheck"); if (c) c.textContent = now ? "🔊" : ST.v[i] ? "✓" : "";
  });
  const mb = $("playAllBtn");
  if (mb) mb.textContent = (seqActive && playingAll) ? "⏸ 停止" : "▶ 通しで聞く（英 → 日 → 英 → 英）";
  updateChecks();
}

function markListenHard() {
  const id = ST.phrase.id;
  P.weak.listen[id] = (P.weak.listen[id] || 0) + 1;
  P.weak.phrases[id] = (P.weak.phrases[id] || 0) + 1;
  save(); toast("「聞き取れなかった文」に記録しました");
}

/* ---- STEP3 発話 ---- */
function manualInput() {
  if (listenSt) return;
  ST.typing = true; renderSpeakSection();
  setTimeout(() => { const el = $("typeAns"); if (el) el.focus(); }, 60);
}
function submitTyped() {
  const el = $("typeAns"); if (!el) return;
  const t = (el.value || "").trim();
  if (!t) { toast("英語で入力してください"); return; }
  gradeSpeech(t, null, null, Math.max(1.5, words(t).length / 2.2));
}
function startSpeak() {
  if (!SR) { manualInput(); return; }
  stopSpeak(); stopPlayback();
  startListening(
    (txt, conf, blob, sec) => { renderSpeakSection(); gradeSpeech(txt, conf, blob, sec); },
    err => {
      renderSpeakSection();
      if (err === "no-speech") toast("音声が聞き取れませんでした。もう一度お試しください");
      else if (err && err !== "aborted") {
        const a = $("scoreArea");
        if (a) a.innerHTML = `<div class="banner ng">音声を取得できませんでした（${esc(String(err))}）。マイクの許可をご確認ください。</div>`;
      }
    },
    txt => { const el = $("liveText"); if (el) el.textContent = txt || "聞き取り中…"; }
  );
  renderSpeakSection();
  // 録音中の経過秒を表示
  if (recTick) clearInterval(recTick);
  recTick = setInterval(() => {
    const el = $("recSec");
    if (!el || !listenSt) { clearInterval(recTick); recTick = null; return; }
    el.textContent = Math.floor((Date.now() - recStartAt) / 1000);
  }, 500);
}
/* 「喋り終わりました」 */
function endSpeak() {
  const h = $("micHint"); if (h) h.textContent = "解析中…";
  const b = $("endBtn"); if (b) { b.disabled = true; b.textContent = "解析中…"; }
  stopListening();
}
async function gradeSpeech(txt, conf, blob, sec) {
  const p = ST.phrase;
  const r = evaluate(p.en, txt, p.keys, sec, conf, p.alts);
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
  updateChecks();
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
      <div class="en-md" style="margin-top:4px" lang="en">${esc(r.advice.text)}</div>
      <button class="btn sm" style="margin-top:6px" data-t="${esc(r.advice.text)}" data-v="0" data-rate="0.9" onclick="sayBtn(this)" aria-label="改善英文を再生">🔊 この言い方を聞く</button>
      ${r.advice.also ? `<div class="note" style="margin-top:7px">もう一つの言い方：<span lang="en">${esc(r.advice.also)}</span>
        <button class="btn sm ghost" data-t="${esc(r.advice.also)}" data-v="0" onclick="sayBtn(this)" aria-label="別の言い方を再生">🔊</button></div>` : ""}
    </div>
    ${(ST.phrase.alts || []).length ? `<div class="srow"><b>別の言い方</b>${ST.phrase.alts.map(a => `<div style="margin-top:3px">・${esc(a)} <button class="btn sm ghost" data-t="${esc(a)}" data-v="0" onclick="sayBtn(this)">🔊</button></div>`).join("")}</div>` : ""}
    ${ST.recKey ? `<div class="srow"><b>自分の録音</b><button class="btn sm" onclick="playRec('${ST.recKey}')">▶ 聞き返す</button></div>` : ""}
    <div class="note" style="margin-top:9px">※採点は端末内の簡易アルゴリズム（単語一致・語順・話速・表現の丁寧さ）による参考値です。</div>
    <div class="btnrow">
      <button class="btn" onclick="ST.result=null;ST.recKey=null;renderSpeakSection();updateChecks()">↻ もう一度話す</button>
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
function prevPhrase() {
  if (!ST || ST.idx <= 0) return;
  const keep = ST.hideEn;
  ST = { sc: ST.sc, idx: ST.idx - 1, v: [false, false, false, false], result: null, recKey: null, hideEn: keep, typing: false };
  renderStudy(); window.scrollTo(0, 0);
}
function nextPhrase() {
  if (ST.idx < ST.sc.steps.length - 1) {
    const keep = ST.hideEn;
    ST = { sc: ST.sc, idx: ST.idx + 1, v: [false, false, false, false], result: null, recKey: null, hideEn: keep, typing: false };
    renderStudy(); window.scrollTo(0, 0);
  }
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
    // つまずき回数を重みにして、苦手なほど出やすくする
    pool = [];
    weakList("phrases", 30).forEach(([id, c]) => {
      const ph = PH_BY_ID[id]; if (!ph) return;
      for (let i = 0; i < Math.min(5, c); i++) pool.push(ph);
    });
    weakList("listen", 15).forEach(([id, c]) => {   // 聞き取れなかった文も出題
      const ph = PH_BY_ID[id]; if (!ph) return;
      for (let i = 0; i < Math.min(3, c); i++) pool.push(ph);
    });
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
          <button class="btn sm" style="margin-top:6px" data-t="${esc(q.en)}" data-v="0" onclick="sayBtn(this)">🔊 再生</button></div>
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
  if (ok) speakOne(rvQ.q.en, { voice: voiceFor(VOICE_PROFILES[0]) });
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
          ${p ? `<button class="btn sm" data-t="${esc(p.en)}" data-v="0" onclick="sayBtn(this)">🔊 お手本</button>
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
            <button class="chip" style="cursor:pointer;margin-left:auto" onclick="toggleSave('${p.id}')" aria-pressed="${P.saved.includes(p.id)}" aria-label="フレーズ集に保存">${P.saved.includes(p.id) ? "★" : "☆"}</button>
          </div>
          <div class="en-md" lang="en">${hlPhrase(p)}</div>
          <div class="ja-sub">${esc(p.ja)}</div>
          <div class="btnrow tight">
            <button class="btn sm pri" data-t="${esc(p.en)}" data-v="0" data-rate=".85" onclick="sayBtn(this)">🔊 ゆっくり</button>
            <button class="btn sm" data-t="${esc(p.en)}" data-v="2" onclick="sayBtn(this)">🔊 普通の喋り</button>
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
    <div class="srow"><b>使用例</b>${esc(w.ex)} <button class="btn sm" data-t="${esc(w.ex)}" data-v="0" onclick="sayBtn(this)">🔊</button></div>
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
      <button class="btn" data-t="${esc(p.en)}" data-v="0" onclick="sayBtn(this)">🔊 文全体</button>
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
  for (let i = 13; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const k = dateKey(d); days.push({ k, s: P.sessions[k] || { sec: 0 } }); }
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
  if (!confirm("学習履歴・苦手記録・録音を削除します。\n（★保存した表現とロールプレイの会話ログは残ります）\nよろしいですか？")) return;
  P.recordings.forEach(r => recDel(r.id));
  const keepSettings = P.settings, keepSaved = P.saved, keepLogs = P.logs;
  P = blankProfileData();
  P.settings = keepSettings; P.saved = keepSaved; P.logs = keepLogs;
  save(); renderProgress(); toast("学習履歴をリセットしました");
}

/* =========================================================
   ロールプレイ
   ========================================================= */
let RP = null;
function renderRoleplayMenu() {
  const RL = window.ROLEPLAYS || {};
  $("v-roleplay").innerHTML = `
    <div class="banner info">会話全体を最初から表示します。相手の発言は音声で聞き、自分の番は模範例を見ながら声に出して練習します。</div>
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
  RP = { def: rp, turns: rp.turns, kind: "script",
         scores: new Array(rp.turns.length).fill(null), said: new Array(rp.turns.length).fill(""),
         saved: false };
  go("roleplay"); renderRP();
}
function startRoleplayFromScenario(id) {
  const sc = (window.SCENARIOS || []).find(s => s.id === id); if (!sc) return;
  const turns = sc.steps.map(st => {
    const ph = PH_BY_ID[st.phrase];
    return ph ? { ai: "", ja: ph.ja, hint: st.note || "", sample: ph.en } : null;
  }).filter(Boolean);
  if (!turns.length) { toast("このシナリオは通し練習に対応していません"); return; }
  RP = { def: { name: sc.title, desc: sc.desc || "" }, turns, kind: "scenario",
         scores: new Array(turns.length).fill(null), said: new Array(turns.length).fill(""),
         saved: false };
  go("roleplay"); renderRP();
}

/* 会話を最初から全部表示する。相手の発言＝聞く、自分の番＝模範例を見ながら話す */
function renderRP() {
  if (!RP) { renderRoleplayMenu(); return; }
  $("v-roleplay").innerHTML = `
    <button class="back" onclick="RP=null;go('roleplay')">← ロールプレイ一覧</button>
    <div class="card pad-s" style="margin-bottom:11px">
      <div class="chips">
        <span class="chip cat">${esc(RP.def.name)}</span>
        <span class="chip" id="rpProg"></span>
      </div>
      ${RP.def.desc ? `<div class="note" style="margin-top:6px">${esc(RP.def.desc)}</div>` : ""}
      <div class="btnrow">
        <button class="btn pri block lg" id="rpPlayBtn" onclick="rpPlayAll()">▶ 会話を通して聞く</button>
      </div>
      <div class="note" style="margin-top:8px">
        ${SR ? "自分の番は「🎙 話す」を押して、模範例を見ながら英語で言ってみましょう。話し終わったらもう一度押します。"
             : "この端末は音声認識に非対応のため、自分の番は「⌨ 入力」で採点します。"}
      </div>
    </div>
    <div id="rpScript">${RP.turns.map((t, i) => rpTurnHtml(t, i)).join("")}</div>
    <div class="btnrow" style="margin-bottom:6px">
      <button class="btn ghost" onclick="RP=null;go('roleplay')">一覧へ戻る</button>
      <button class="btn ok" style="margin-left:auto" onclick="rpSaveLog()">会話ログに保存</button>
    </div>`;
  updateRpProgress();
}

function rpTurnHtml(t, i) {
  const hasAi = !!(t.ai && String(t.ai).trim());
  return `
    <div class="turn" id="rpturn${i}">
      ${hasAi ? `
        <div class="msg ai" id="rpai${i}">
          <div class="who">🤖 相手</div>
          <div lang="en">${hlTier(t.ai)}</div>
          ${P.settings.showJa && t.ja ? `<div class="jah">${esc(t.ja)}</div>` : ""}
          <div class="btnrow tight">
            <button class="btn sm ghost" data-t="${esc(t.ai)}" data-v="0" onclick="sayBtn(this)" aria-label="相手の発言を再生">🔊 聞く</button>
          </div>
        </div>` : ""}
      <div class="msg me" id="rpme${i}">
        <div class="who">🙋 あなた${t.hint ? "｜" + esc(t.hint) : ""}</div>
        <div lang="en" style="margin-top:3px">${esc(t.sample)}</div>
        ${!hasAi && t.ja ? `<div class="jah">${esc(t.ja)}</div>` : ""}
      </div>
      <div class="turnact">
        <button class="btn sm" data-t="${esc(t.sample)}" data-v="1" data-rate="0.95" onclick="sayBtn(this)" aria-label="模範例を再生">🔊 お手本</button>
        ${SR ? `<button class="btn sm acc" id="rpmic${i}" onclick="rpSpeak(${i})">🎙 話す</button>`
             : `<button class="btn sm acc" onclick="rpType(${i})">⌨ 入力</button>`}
        ${SR ? `<button class="btn sm ghost" onclick="rpType(${i})">⌨ 入力</button>` : ""}
      </div>
      <div id="rpres${i}">${RP.scores[i] != null ? rpResultHtml(i) : ""}</div>
    </div>`;
}

function rpResultHtml(i) {
  const sc = RP.scores[i], said = RP.said[i] || "";
  const cls = sc >= 80 ? "ok" : sc >= 60 ? "warn" : "ng";
  return `<div class="turnres">
    <span class="chip ${cls}">${sc}点</span>
    <span class="said" lang="en">「${esc(said)}」</span>
  </div>`;
}

function updateRpProgress() {
  const el = $("rpProg"); if (!el || !RP) return;
  const done = RP.scores.filter(x => x != null).length;
  el.className = "chip" + (done === RP.turns.length ? " ok" : "");
  el.textContent = `自分の番 ${done} / ${RP.turns.length}`;
  if (done === RP.turns.length && !RP.saved) rpSaveLog(true);
}

/* ---- 通して聞く ---- */
function rpPlayAll() {
  if (seqActive) { stopSpeak(); rpClearFocus(); rpUpdatePlayBtn(); return; }
  if (!ttsAvailable()) { toast("この端末は音声合成に対応していません"); return; }
  const items = [];
  RP.turns.forEach((t, i) => {
    if (t.ai && String(t.ai).trim()) {
      items.push({ text: t.ai, voice: pickNative(), rate: 1.0, onStart: () => rpFocus("rpai" + i) });
    }
    items.push({ text: t.sample, voice: pickClear(), rate: 0.97, onStart: () => rpFocus("rpme" + i) });
  });
  speakSeq(items, () => { rpClearFocus(); rpUpdatePlayBtn(); });
  rpUpdatePlayBtn();
}
function rpFocus(id) {
  document.querySelectorAll(".msg.playing").forEach(e => e.classList.remove("playing"));
  const el = $(id); if (el) { el.classList.add("playing"); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
}
function rpClearFocus() { document.querySelectorAll(".msg.playing").forEach(e => e.classList.remove("playing")); }
function rpUpdatePlayBtn() {
  const b = $("rpPlayBtn"); if (b) b.textContent = seqActive ? "⏸ 停止" : "▶ 会話を通して聞く";
}

/* ---- 自分の番を話す（手動終了） ---- */
function rpSpeak(i) {
  if (listenSt) { stopListening(); return; }
  stopSpeak(); rpClearFocus();
  const b = $("rpmic" + i);
  if (b) { b.classList.remove("acc"); b.classList.add("ng"); b.innerHTML = '<span class="recdot"></span>喋り終わりました'; }
  const res = $("rpres" + i);
  if (res) res.innerHTML = `<div class="banner info" id="rplive${i}" lang="en" style="margin-top:6px">聞き取り中…</div>`;
  startListening(
    (txt, conf, blob, sec) => rpScore(i, txt, conf, sec),
    err => { rpResetMic(i); if (err === "no-speech") toast("音声が聞き取れませんでした"); },
    txt => { const el = $("rplive" + i); if (el) el.textContent = txt || "聞き取り中…"; }
  );
}
function rpResetMic(i) {
  const b = $("rpmic" + i);
  if (b) { b.classList.remove("ng"); b.classList.add("acc"); b.textContent = "🎙 話す"; }
  const res = $("rpres" + i);
  if (res) res.innerHTML = RP.scores[i] != null ? rpResultHtml(i) : "";
}
function rpType(i) {
  if (listenSt) return;
  const res = $("rpres" + i); if (!res) return;
  res.innerHTML = `
    <div style="margin-top:7px">
      <textarea id="rptype${i}" rows="2" lang="en" placeholder="Type your English here..."></textarea>
      <div class="btnrow tight"><button class="btn sm acc" onclick="rpTypeSubmit(${i})">この内容で採点</button>
        <button class="btn sm ghost" onclick="rpResetMic(${i})">やめる</button></div>
    </div>`;
  setTimeout(() => { const el = $("rptype" + i); if (el) el.focus(); }, 60);
}
function rpTypeSubmit(i) {
  const el = $("rptype" + i); if (!el) return;
  const t = (el.value || "").trim();
  if (!t) { toast("英語で入力してください"); return; }
  rpScore(i, t, null, Math.max(1.5, words(t).length / 2.2));
}
function rpScore(i, txt, conf, sec) {
  const t = RP.turns[i];
  const r = evaluate(t.sample, txt, null, sec, conf, null);
  RP.scores[i] = r.total; RP.said[i] = txt;
  const sess = sessToday();
  sess.utter++; sess.total++; if (r.total >= 70) sess.correct++;
  pushSkill("speaking", r.accuracy); pushSkill("fluency", r.fluency);
  save();
  rpResetMic(i);
  updateRpProgress();
}

function rpSaveLog(auto) {
  if (!RP) return;
  const items = RP.turns.map((t, i) => ({
    ai: t.ai || t.ja || "", me: RP.said[i] || "(未挑戦)", sample: t.sample, score: RP.scores[i] == null ? 0 : RP.scores[i]
  }));
  const got = RP.scores.filter(x => x != null);
  const avg = got.length ? Math.round(got.reduce((a, b) => a + b, 0) / got.length) : 0;
  P.logs.unshift({ mode: RP.def.name, at: Date.now(), items, avg });
  while (P.logs.length > 30) P.logs.pop();
  RP.saved = true;
  save();
  toast(auto ? `全ターン完了！ 平均 ${avg} 点で保存しました` : `会話ログに保存しました（平均 ${avg} 点）`);
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
  const vopt = (sel) => EN_VOICES.map(v => {
    const g = guessGender(v);
    return `<option value="${esc(v.name)}" ${v.name === sel ? "selected" : ""}>${esc(v.name)}（${esc(v.lang)}${g ? "・" + (g === "male" ? "男" : "女") : ""}）</option>`;
  }).join("");
  $("v-settings").innerHTML = `
    <h2 class="sec">音声</h2>
    ${VOICE_PROFILES.map((v, i) => `
      <div class="setrow"><span>${i + 1}. ${esc(v.short)}<br><small class="mute" style="font-weight:400">${esc(v.desc)}</small></span>
        <select onchange="P.settings.${v.key}=this.value;save()">
          <option value="">自動選択</option>${vopt(st[v.key])}
        </select></div>`).join("")}
    <div class="setrow"><span>日本語音声</span>
      <select onchange="P.settings.ja=this.value;save()">
        <option value="">自動</option>
        ${JA_VOICES.map(v => `<option value="${esc(v.name)}" ${v.name === st.ja ? "selected" : ""}>${esc(v.name)}</option>`).join("")}
      </select></div>
    <div class="setrow"><span>全体の速度 <b id="rateV">${st.rate.toFixed(1)}×</b></span>
      <input type="range" min="0.7" max="1.4" step="0.1" value="${st.rate}"
        oninput="P.settings.rate=+this.value;document.getElementById('rateV').textContent=(+this.value).toFixed(1)+'×';save()"></div>
    <div class="btnrow"><button class="btn pri" onclick="testVoices()">🔊 通し再生をテスト（英→日→英→英）</button></div>

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
  casualIdx++;
  const items = [
    { text: en, voice: pickNative(), rate: VOICE_PROFILES[0].rate },
    { text: ja, voice: jaVoice(), lang: "ja-JP", rate: 1 },
    { text: en.split(/\s+/).filter(Boolean).join(", "), voice: pickClear(), rate: VOICE_PROFILES[1].rate },
    { text: en, voice: pickCasual(), rate: VOICE_PROFILES[2].rate, pitch: casualPitch() }
  ];
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
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && $("sheet").classList.contains("open")) closeSheet();
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
