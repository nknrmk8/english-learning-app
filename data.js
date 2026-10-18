/* =========================================================
   data.js — 共通コンテンツ + 教材データの統合
   （PHRASES_A / PHRASES_B は data-a.js / data-b.js で定義）
   ========================================================= */

/* ---------- 12章: 初期コンテンツカテゴリ ---------- */
const CATEGORIES = [
  { id:"vendor",   name:"開発委託・ベンダー管理", desc:"指示、確認、成果物",        icon:"🤝" },
  { id:"progress", name:"進捗・遅延",             desc:"進捗、原因、リカバリー",    icon:"📈" },
  { id:"manpower", name:"人員・人月",             desc:"リソース、人月、要員調整",  icon:"👥" },
  { id:"budget",   name:"予算・コスト",           desc:"年度予算、見積、超過",      icon:"💰" },
  { id:"license",  name:"ライセンス",             desc:"費用、課金先、承認",        icon:"🔑" },
  { id:"report",   name:"週次・月次報告",         desc:"実績、差異、課題",          icon:"📋" },
  { id:"sales",    name:"売上・ビジネス",         desc:"売上、計画、予測",          icon:"📊" },
  { id:"release",  name:"リリース",               desc:"Go/No-Go、承認",            icon:"🚀" },
  { id:"quality",  name:"品質・テスト",           desc:"不具合、品質、テスト",      icon:"🧪" },
  { id:"ops",      name:"運用保守",               desc:"障害、調査、恒久対応",      icon:"🔧" },
];

/* ---------- 重要単語（3階層ハイライト） ---------- */
const TIER_WORDS = {
 "sign off":{t:1, mean:"承認・承認サイン", ex:"We need your sign off by Friday.", use:"成果物の最終承認を求める場面で頻出。"},
 "on-going":{t:2, mean:"進行中の", ex:"There are three on-going tasks.", use:"進捗報告で「継続中」の案件を指す。"},
 "on time":{t:2, mean:"予定どおり", ex:"The release is on time.", use:"進捗が遅延なしであることを示す定番表現。"},
 "PO":{t:1, mean:"発注書（Purchase Order）", ex:"The PO will be issued next week.", use:"発行時期・請求先の議論で最頻出の略語。"},
 "RA":{t:1, mean:"要件分析（Requirement Analysis）", ex:"The RA phase ends this month.", use:"見積・工程の区切りとして使われる。"},
 "budget":{t:1, mean:"予算", ex:"We are within budget.", use:"予算超過・配分の議論で使用。"},
 "forecast":{t:1, mean:"見通し・予測", ex:"Please update the cost forecast.", use:"要員・コストの見込み値を指す。"},
 "manpower":{t:1, mean:"要員・人的リソース", ex:"The manpower plan needs revision.", use:"要員計画（manpower plan）の形で頻出。"},
 "billing":{t:1, mean:"請求", ex:"The billing will start in August.", use:"請求先・請求開始時期の確認で使用。"},
 "release":{t:1, mean:"リリース", ex:"The release date is fixed.", use:"リリース進捗報告の中心語。"},
 "delivery":{t:1, mean:"納品・納入", ex:"The delivery is scheduled for Q3.", use:"成果物の納品時期を示す。"},
 "exceed":{t:1, mean:"超過する", ex:"We are exceeding budget.", use:"予算・閾値の超過報告で使用。"},
 "target":{t:1, mean:"目標（値）", ex:"Actual and target is 98 percent.", use:"実績（actual）と対で使う。"},
 "distribution":{t:2, mean:"配分・分配", ex:"The cost distribution is fifty-fifty.", use:"費用配分の議論で使用。"},
 "estimation":{t:2, mean:"見積り", ex:"Please review the estimation.", use:"工数・コスト見積のレビューで使用。"},
 "consignment":{t:2, mean:"委託", ex:"This is a consignment contract.", use:"開発委託契約の話題で使用。"},
 "linkage":{t:2, mean:"連携", ex:"The system linkage test starts soon.", use:"システム間連携の文脈で使用。"},
 "threshold":{t:2, mean:"閾値", ex:"The cost exceeded the threshold.", use:"予算・品質の許容ラインを指す。"},
 "deliverable":{t:2, mean:"成果物", ex:"All deliverables are submitted.", use:"納品対象の成果物一覧などで使用。"},
 "SystemX":{t:3, mean:"基幹システムX（仮称）", ex:"SystemX migration is in progress.", use:"移行プロジェクトの対象システム。"},
 "ToolY":{t:3, mean:"データ統合ツールY（仮称）", ex:"ToolY handles the data transfer.", use:"ETL処理の話題で登場。"},
 "ModuleZ":{t:3, mean:"生産管理モジュールZ（仮称）", ex:"ModuleZ will be released in Q4.", use:"生産管理系の開発話題で登場。"},
 "action item":{t:2, mean:"アクションアイテム・宿題", ex:"Let me summarize the action items.", use:"会議の締めで決定事項・担当を整理する際に使用。"},
 "root cause":{t:2, mean:"根本原因", ex:"The root cause is under investigation.", use:"障害・課題の原因分析で使用。"},
 "milestone":{t:2, mean:"マイルストーン・節目", ex:"The milestone review is on Friday.", use:"工程の重要な節目・チェックポイントを指す。"},
 "scope":{t:2, mean:"スコープ・作業範囲", ex:"Is this change within the scope?", use:"契約範囲内か追加費用かの議論で頻出。"},
 "dependency":{t:2, mean:"依存関係", ex:"There is a dependency on the API team.", use:"タスク間・チーム間の前後関係を示す。"},
 "go-live":{t:2, mean:"本番稼働", ex:"The go-live date is October 1st.", use:"システムの本番リリース時期を指す。"},
 "mitigation":{t:2, mean:"（リスクの）軽減策", ex:"We need a mitigation plan.", use:"リスク対応策の議論で使用。"},
 "defect":{t:2, mean:"欠陥・バグ", ex:"The defect rate is within the range.", use:"品質報告でbugよりフォーマルに使う。"},
 "quotation":{t:2, mean:"見積書", ex:"We will send the official quotation.", use:"正式な見積文書を指す（quote とも）。"},
 "UAT":{t:2, mean:"ユーザー受入テスト（User Acceptance Test）", ex:"UAT will start next Monday.", use:"発注側が実施する受入テスト工程。"},
 "sign-off":{t:1, mean:"承認・承認サイン（sign off と同義）", ex:"We are following up on the delivery sign-off.", use:"納品物の最終承認を指す。ハイフン表記も頻出。"},
 "man-month":{t:2, mean:"人月（工数の単位）", ex:"The reduction is about two man-months.", use:"見積・要員計画の工数単位として頻出。"},
 "headcount":{t:2, mean:"要員数・人数", ex:"No additional headcount is needed.", use:"体制の人数を指す。増員議論で使用。"},
 "escalate":{t:2, mean:"エスカレーションする・上位へ上げる", ex:"We will escalate to the executive level.", use:"判断や交渉を上位層に引き上げる場面で使用。"},
 "overtime":{t:2, mean:"残業・時間外労働", ex:"We will work overtime to recover the delay.", use:"遅延挽回策の説明で頻出。"},
 "actual":{t:2, mean:"実績（値）", ex:"The target is 69 percent, and the actual is 64 percent.", use:"target（目標）と対で進捗報告の基本形を作る。"},
 "ToolW":{t:3, mean:"ローコード開発ツールW（仮称）", ex:"The trial application was built with ToolW.", use:"ローコード開発の話題で登場。"},
};

/* ---------- 業務用語集 ---------- */
const GLOSSARY = [
 {ab:"PO", full:"Purchase Order", mean:"発注書"},
 {ab:"RA", full:"Requirement Analysis", mean:"要件分析"},
 {ab:"SystemX", full:"基幹システムX", mean:"業務基幹システム（仮称）"},
 {ab:"ToolY", full:"データ統合ツールY", mean:"ETLツール（仮称）"},
 {ab:"ModuleZ", full:"生産管理モジュールZ", mean:"生産管理システム（仮称）"},
 {ab:"UAT", full:"User Acceptance Test", mean:"ユーザー受入テスト"},
 {ab:"ETA", full:"Estimated Time of Arrival", mean:"完了予定時期"},
 {ab:"WBS", full:"Work Breakdown Structure", mean:"作業分解構成図"},
 {ab:"RFQ", full:"Request for Quotation", mean:"見積依頼"},
 {ab:"OT", full:"Operation Test", mean:"運用テスト（ユーザーテスト）"},
 {ab:"Ringi", full:"稟議", mean:"日本企業の社内承認プロセス（英語でもそのまま使われる）"},
 {ab:"P/L", full:"Profit and Loss", mean:"損益（計算書）"},
 {ab:"SLA", full:"Service Level Agreement", mean:"サービス品質保証契約"},
 {ab:"man-month", full:"Man-Month", mean:"人月（1人が1ヶ月働く工数）"},
];

/* ---------- ロールプレイ台本 ---------- */
const ROLEPLAYS = {
 progress:{name:"進捗確認会（長編）", icon:"📈", desc:"週次進捗確認会議を丸ごと1本模擬します。あなたはホスト役、AIは海外拠点Bのリーダー役です（全13ターン・約20〜30分）。", turns:[
  {ai:"Good morning. Everyone from site B has joined. We are ready when you are.", ja:"おはようございます。拠点Bのメンバーは全員参加しました。いつでも始められます。", hint:"開会を宣言し、本日のアジェンダ（進捗・品質・スケジュール・リスク）を伝える", sample:"Good morning, everyone. Let's get started. Today's agenda is progress update, quality status, schedule, and risks."},
  {ai:"Understood. Then let me start with the progress. The development is 80 percent complete as of today.", ja:"承知しました。では進捗から。本日時点で開発は80％完了です。", hint:"順調さを認めつつ、残り20%の完了見込み時期を確認する", sample:"Good progress. When do you expect to complete the remaining 20 percent?"},
  {ai:"We expect to finish by the end of July. However, there is one concern about the test environment.", ja:"7月末完了見込みです。ただし、テスト環境について懸念が1点あります。", hint:"懸念の詳細説明を求める", sample:"I see. Could you elaborate on the concern about the test environment?"},
  {ai:"The environment setup is delayed by one week because of a license issue with ToolY.", ja:"ToolYのライセンス問題で、環境構築が1週間遅れています。", hint:"全体スケジュールへの影響と挽回策を確認する", sample:"Does this delay affect the overall schedule? What is your recovery plan?"},
  {ai:"No impact on the go-live so far. We will catch up by assigning one more engineer next week.", ja:"今のところ本番稼働への影響はありません。来週エンジニアを1名追加して挽回します。", hint:"追加要員によるコストへの影響がないか確認する", sample:"Understood. Will the additional engineer affect the cost? Is it still within the budget?"},
  {ai:"No additional cost. It is covered within the current PO. Shall I move on to the quality status?", ja:"追加費用はありません。現行POの範囲内です。品質状況に移ってよいですか？", hint:"了承して品質報告を促す", sample:"Good to hear. Yes, please go ahead with the quality status."},
  {ai:"The defect rate is within the acceptable range. We found three critical bugs in the integration test, and all of them are already fixed.", ja:"欠陥率は許容範囲内です。結合テストで重大バグを3件検出しましたが、すべて修正済みです。", hint:"UATを予定どおり開始できるか確認する", sample:"Thank you. Then can we start UAT next Monday as planned?"},
  {ai:"Yes, UAT can start on Monday. But we need the test data from the Japan side before that.", ja:"はい、月曜に開始できます。ただし、その前に日本側からテストデータをいただく必要があります。", hint:"テストデータの提供を引き受け、期限を確認する", sample:"We will prepare the test data. When exactly do you need it by?"},
  {ai:"By this Friday, please. Otherwise the UAT schedule will be at risk.", ja:"今週金曜までにお願いします。でないとUATスケジュールがリスクになります。", hint:"金曜までの提供を約束し、次の議題（スケジュール）へ進める", sample:"Understood. We will send it by Friday. Now, let's move on to the schedule. Any changes to the milestones?"},
  {ai:"The milestone review is scheduled for Friday as planned, and the go-live in October is still on track.", ja:"マイルストーンレビューは予定どおり金曜、10月の本番稼働も順調です。", hint:"リスクの議題に移り、新しいリスクがないか尋ねる", sample:"Good. Moving on to risks — do you see any new risks we should be aware of?"},
  {ai:"One thing. Two of our testers may leave the project in August, so there is a potential resource risk for UAT.", ja:"1点あります。8月にテスター2名がプロジェクトを離れる可能性があり、UATの要員リスクです。", hint:"軽減策（mitigation plan）の作成を依頼し、期限を切る", sample:"That's important. Could you prepare a mitigation plan for the resource shortage by the next meeting?"},
  {ai:"Sure, we will prepare the mitigation plan by next Wednesday and add it to the risk register.", ja:"承知しました。来週水曜までに軽減策を用意し、リスク管理表に追加します。", hint:"本日のアクションアイテムをまとめる（テストデータ／軽減策）", sample:"Thank you. Let me summarize today's action items. We will send the test data by Friday, and you will prepare the mitigation plan by Wednesday."},
  {ai:"That is correct. Nothing else from our side. Thank you.", ja:"そのとおりです。こちらからは以上です。ありがとうございました。", hint:"議事録の共有を伝えて閉会する", sample:"Thank you all for joining. I will share the minutes after the meeting. See you next week."},
 ]},
 po:{name:"発注確認会（長編）", icon:"📝", desc:"新規POの内容確認会議を模擬します。あなたは日本側の発注担当、AIは海外拠点Cの営業マネージャ役です（全11ターン）。", turns:[
  {ai:"Thank you for your time today. The purpose of this meeting is to confirm the details of the new PO for ModuleZ. Shall we begin?", ja:"本日はお時間ありがとうございます。ModuleZの新規POの詳細確認が目的です。始めてよろしいですか？", hint:"開始を宣言し、確認したい項目（スコープ・金額・期間）を挙げる", sample:"Yes, let's begin. Today I would like to confirm three points: the scope, the amount, and the billing period."},
  {ai:"Understood. First, the scope. This PO covers the development and the integration test of ModuleZ.", ja:"承知しました。まずスコープです。本POはModuleZの開発と結合テストをカバーします。", hint:"UAT支援がスコープに含まれるか確認する", sample:"Is my understanding correct that UAT support is not included in this scope?"},
  {ai:"Correct. UAT support is optional. If you need it, it will be an additional 0.5 million per month.", ja:"そのとおりです。UAT支援はオプションで、必要な場合は月50万円の追加となります。", hint:"金額の内訳（開発・テスト）の説明を求める", sample:"I see. Could you break down the total amount by development and testing?"},
  {ai:"Sure. Development is 4 million, and the integration test is 1.5 million. So the total is 5.5 million.", ja:"はい。開発が400万、結合テストが150万、合計550万です。", hint:"請求期間と請求サイクルを確認する", sample:"Thank you. And what about the billing period? Is it billed monthly?"},
  {ai:"Yes, monthly billing from August to December, five months in total.", ja:"はい、8月から12月までの5ヶ月間、月次請求です。", hint:"作業開始に必要なPO発行期限を確認する", sample:"Understood. By when do you need the PO to be issued to start on time?"},
  {ai:"We need the PO by the end of July. Otherwise the start will be delayed.", ja:"7月末までにPOが必要です。それを過ぎると開始が遅れます。", hint:"社内承認に2週間かかることを伝え、懸念を示す", sample:"That is a bit tight. Our internal approval usually takes two weeks, so we need to start the process this week."},
  {ai:"I understand. If it helps, we can split the PO into two phases: development first, and testing later.", ja:"承知しました。もしよろしければ、POを開発とテストの2フェーズに分割することも可能です。", hint:"分割案に賛成し、まず開発分のみ先行する案を提案する", sample:"That works for us. I suggest we issue the PO for the development part first, and the testing part next month."},
  {ai:"Agreed. Then we will send the revised quotation for the development part by Wednesday.", ja:"了解です。では開発分の修正見積書を水曜までにお送りします。", hint:"支払条件（支払サイト）を確認する", sample:"Thank you. Could you also confirm the payment terms? Is it 60 days after the invoice as usual?"},
  {ai:"Yes, the same as the current contract, 60 days after the invoice date.", ja:"はい、現行契約と同じく請求書発行日から60日です。", hint:"為替レートなど前提条件が現行契約と同じか確認する", sample:"And is my understanding correct that the exchange rate assumption is also the same as the current contract?"},
  {ai:"Correct, no changes to the rate assumptions. Anything else to confirm?", ja:"そのとおりです。レートの前提に変更はありません。他に確認事項はありますか？", hint:"合意内容（分割PO・水曜見積・7月末発行）をまとめる", sample:"Let me summarize. We will split the PO into two phases, you will send the revised quotation by Wednesday, and we will issue the first PO by the end of July."},
  {ai:"Perfect. We will prepare the documents accordingly. Thank you very much.", ja:"完璧です。それに沿って書類を準備します。ありがとうございました。", hint:"お礼を述べ、議事録共有を伝えて閉会する", sample:"Thank you for your time today. I will share the minutes with the action items by tomorrow."},
 ]},
 briefing:{name:"プロジェクト説明会（長編）", icon:"📢", desc:"新規プロジェクトのキックオフ説明会を模擬します。あなたが説明者、AIは海外拠点のPM役として質問します（全11ターン）。", turns:[
  {ai:"Thank you for organizing this session. We heard this is about a new project. Could you give us an overview first?", ja:"本日は設定ありがとうございます。新規プロジェクトの件と聞いています。まず概要を教えていただけますか？", hint:"プロジェクト概要（SystemX移行フェーズ2）を説明する", sample:"Thank you for joining. This project is Phase 2 of the SystemX migration, which covers the remaining modules of the core system."},
  {ai:"I see. What is the main objective of this phase?", ja:"なるほど。このフェーズの主な目的は何ですか？", hint:"目的（老朽化対応・保守コスト削減など）を説明する", sample:"The main objective is to replace the legacy modules and reduce the maintenance cost by 30 percent."},
  {ai:"Understood. Could you clarify the scope? What is in scope and out of scope?", ja:"わかりました。スコープを明確にしていただけますか？何が対象で何が対象外ですか？", hint:"スコープ内（ModuleZ移行・連携改修）とスコープ外（ToolY更改）を説明する", sample:"In scope is the migration of ModuleZ and the linkage modification. The ToolY upgrade is out of scope this time."},
  {ai:"Clear. What about the overall schedule and the key milestones?", ja:"明確です。全体スケジュールと主要マイルストーンはどうなっていますか？", hint:"スケジュール（RA→開発→テスト→稼働）とマイルストーンを説明する", sample:"The RA phase starts in August, development from October, UAT in February, and the go-live is planned for April next year."},
  {ai:"Thank you. How will the team be structured between Japan and our site?", ja:"ありがとうございます。日本側と当拠点のチーム体制はどうなりますか？", hint:"体制（日本側=要件定義・受入／拠点側=開発・テスト）を説明する", sample:"The Japan side will handle the requirement definition and acceptance, and your site will be in charge of development and testing."},
  {ai:"Got it. What about the development environment? Will you provide it, or should we prepare it?", ja:"了解です。開発環境はどうなりますか？御社提供ですか、当方で準備ですか？", hint:"環境（日本側がクラウド環境を提供、9月までに構築）を説明する", sample:"We will provide a cloud-based environment from the Japan side. The setup will be completed by the end of September."},
  {ai:"That helps. Are there any specific quality standards we should follow?", ja:"助かります。準拠すべき品質基準はありますか？", hint:"品質基準（欠陥率の閾値・レビュー必須など）を説明する", sample:"Yes, the defect rate must be within our standard threshold, and all deliverables require a peer review before submission."},
  {ai:"Understood. Do you already see any risks or dependencies at this point?", ja:"承知しました。現時点で想定されるリスクや依存関係はありますか？", hint:"リスク（他システムとの連携・要員確保）を説明する", sample:"The main risk is the dependency on the SystemX interface team. Resource availability in Q4 is also a concern."},
  {ai:"Noted. How do you want to communicate? Weekly meetings like the current project?", ja:"了解です。コミュニケーションはどうしますか？現行プロジェクトのように週次会議ですか？", hint:"会議体（週次進捗・月次レビュー）と使用ツールを説明する", sample:"Yes, we will have a weekly progress meeting and a monthly report review. We will use the same tools as the current project."},
  {ai:"Sounds good. When do you need our estimation for this project?", ja:"良いですね。このプロジェクトの見積はいつまでに必要ですか？", hint:"見積期限を伝え、RA資料の提供を約束する", sample:"Please provide the estimation by the end of August. We will share the RA documents by next week."},
  {ai:"Understood. We will review the documents and send questions by email. Thank you for the clear explanation.", ja:"承知しました。資料を確認し、質問はメールで送ります。わかりやすい説明をありがとうございました。", hint:"お礼を述べ、次のステップを確認して締める", sample:"Thank you. I look forward to your questions. Let's have a follow-up session once you review the documents."},
 ]},
 monthly:{name:"月次レビュー会（長編）", icon:"📊", desc:"四半期・月次レポートのレビュー会議を模擬します。あなたが報告者、AIは日本側のシニアレビューア役として数字やスライドに鋭く質問します（全12ターン）。", turns:[
  {ai:"Good morning. This is the quarterly review meeting. Please start your report when you are ready.", ja:"おはようございます。四半期レビュー会議です。準備ができたら報告を始めてください。", hint:"画面共有を確認し、アジェンダ（売上損益・直接比率・その他）を伝えて開始する", sample:"Can everyone see my screen? Today's agenda is sales and P/L, direct ratio, and other topics. Let me start with sales."},
  {ai:"Before you continue — last time you reported the income ratio at around 5 percent, but this slide shows 2 percent. What changed?", ja:"続ける前に — 前回は利益率を約5％と報告していましたが、このスライドでは2％です。何が変わったのですか？", hint:"前回未反映だった借用要員の費用を今回反映したことを説明する", sample:"The extra expense for the borrowed manpower was not included last time. It is reflected in this report."},
  {ai:"I see. From when to when, and how many people are we talking about?", ja:"なるほど。期間はいつからいつまでで、何名の話ですか？", hint:"期間と人数を具体的な数字で答える", sample:"About four months, from December to March, around two headcount on average."},
  {ai:"That rate feels too high for a junior member. Please reconfirm the rate with the responsible manager.", ja:"若手メンバーにしては単価が高すぎる気がします。担当マネージャに単価を再確認してください。", hint:"再確認を引き受け、いつまでに報告するか期限を添える", sample:"Understood. I will reconfirm the rate with the manager and report back by next week."},
  {ai:"Also, think about the message of this slide. If you do not want to discuss the borrowed-resource cost here, do not highlight it.", ja:"それから、このスライドのメッセージを考えてください。借用要員のコストを議論したくないなら、目立たせないことです。", hint:"指摘を受け入れ、スライドの修正を約束する", sample:"That makes sense. I will revise the slide to focus on the main message."},
  {ai:"Next, the manpower table. This looks like the same story as every month. What is new here?", ja:"次に要員表です。毎月同じ話に見えますが、新しい点は何ですか？", hint:"四半期視点の資料であること、直近月の実績が新規である点を説明する", sample:"This is a quarterly view for the executive. The June results and the training activities are the new part."},
  {ai:"My feedback: compare available hours versus actual, not versus forecast. Otherwise the chart hides the real problem.", ja:"フィードバックです。予測ではなく、稼働可能時間と実績を比較してください。でないと本当の問題が見えません。", hint:"指摘に同意しつつ、空き時間をトレーニングに使った点は示したいと伝える", sample:"Understood, I will redesign the chart. I would also like to show that we used the free hours for training, so the time was not wasted."},
  {ai:"Fair enough. Now, the direct ratio — the support portion in Q1 looks unusually large. Is that the new region support?", ja:"いいでしょう。次に直接比率ですが、Q1のサポート分が異常に大きいですね。新しい地域サポートの分ですか？", hint:"別件（SystemXのチケット対応）であることを説明する", sample:"No, that is separate. The large part is SystemX support, because we absorbed extra tickets while waiting for the PO."},
  {ai:"OK. About the expanded support proposal — how much will you charge per month?", ja:"了解です。拡張サポートの提案について — 月額いくらを請求する予定ですか？", hint:"金額と内訳（追加要員なし・夜勤/週末手当のみ）を説明する", sample:"About 60,000 per month, with no additional headcount. It only covers the night differential and weekend allowance."},
  {ai:"The customer may see little benefit for the night shift. How will you justify the fee?", ja:"先方は夜間シフトにあまりメリットを感じないかもしれません。費用をどう正当化しますか？", hint:"付加価値（トレーニング提供・マニュアル整備・小規模自動化）を提案する", sample:"During their daytime, the dedicated member can provide training, create manuals, and offer small automation. That is the value they pay for."},
  {ai:"Good. What is the timeline for the contract?", ja:"いいですね。契約までのタイムラインは？", hint:"提案→社内承認→開始のスケジュールを月で説明する", sample:"We will propose it in August, target the internal approval in September, and officially start in October."},
  {ai:"Understood. Please send the updated material in advance so the executive can review it. That is all from my side.", ja:"わかりました。役員がレビューできるよう、更新資料を事前に送ってください。私からは以上です。", hint:"資料の事前送付を約束し、お礼を述べて締める", sample:"I will revise the material and send it in advance. Thank you very much for your feedback today."},
 ]},
 nego:{name:"交渉役モード", icon:"⚖️", desc:"予算・PO配分の交渉相手はAI（海外拠点C側マネージャ役）です（全4ターン・短編）。", turns:[
  {ai:"Regarding the additional PO, we think the whole cost should be charged to the Japan site.", ja:"追加POについて、費用は全額日本拠点の負担と考えています。", hint:"折半を提案する", sample:"We understand your point, but I suggest we divide it into half."},
  {ai:"Half and half? That is difficult because the change request came from your side.", ja:"折半ですか？変更要求は御社側からなので難しいです。", hint:"変更の背景を説明して譲歩を引き出す", sample:"The change was required to meet the common quality target, so both sides benefit from it."},
  {ai:"I see your point. Then how about 60-40, with 60 on the Japan side?", ja:"なるほど。では日本側60対40はどうですか？", hint:"条件付きで合意するか、再提案する", sample:"We can accept 60-40 if the delivery date stays within July. Is that acceptable?"},
  {ai:"OK, we can commit to the July delivery under that condition.", ja:"わかりました。その条件なら7月納品をお約束できます。", hint:"合意内容を確認して議事録化を宣言する", sample:"Great. Let me summarize the agreement and share the minutes by tomorrow."},
 ]},
 estimate:{name:"見積説明役モード", icon:"🧮", desc:"あなたが見積・コストの説明役。AIは日本側の上長役として質問します（全4ターン・短編）。", turns:[
  {ai:"Please explain the cost estimation for the next phase.", ja:"次フェーズのコスト見積を説明してください。", hint:"総額とレンジを伝える", sample:"The total cost is around 600 to 1.2 million per month, depending on the manpower plan."},
  {ai:"Why is the range so wide? Can you break it down?", ja:"なぜレンジがそんなに広いのですか？内訳を説明できますか？", hint:"内訳（開発・テスト・管理）を説明する", sample:"The range depends on the test scope. Development is fixed, but the test manpower may double."},
  {ai:"Is there any way to reduce the upper limit?", ja:"上限を下げる方法はありますか？", hint:"削減案を提案する", sample:"We can reduce it by automating the regression tests with ToolY."},
  {ai:"Sounds good. When can you provide the revised estimation?", ja:"良いですね。修正見積はいつ出せますか？", hint:"期限を約束して締める", sample:"We will share the revised estimation by the end of next week."},
 ]},
};

/* ---------- 統合 ---------- */
(function () {
  const A = window.PHRASES_A || [], B = window.PHRASES_B || [];
  const SA = window.SCENARIOS_A || [], SB = window.SCENARIOS_B || [];
  window.PHRASES = A.concat(B);
  window.SCENARIOS = SA.concat(SB);
  window.CATEGORIES = CATEGORIES;
  window.TIER_WORDS = TIER_WORDS;
  window.GLOSSARY = GLOSSARY;
  window.ROLEPLAYS = ROLEPLAYS;
  // 整合性: 参照できない phrase を持つ step を除去し、空のシナリオは落とす
  const ids = new Set(window.PHRASES.map(p => p.id));
  window.SCENARIOS = window.SCENARIOS
    .map(s => Object.assign({}, s, { steps: (s.steps || []).filter(st => ids.has(st.phrase)) }))
    .filter(s => s.steps.length > 0);
})();
