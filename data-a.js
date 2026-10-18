/* data-a.js : 開発委託/進捗/人員/予算/ライセンス
   ----------------------------------------------------------------
   担当カテゴリ: vendor / progress / manpower / budget / license
   既存 index.html（PHRASES / TEIKEI）の実会議データのうち、
   上記5カテゴリに該当するものを新スキーマへ移植し、不足分を補完。
   固有名詞はすべて仮称（SystemX / ToolY / ModuleZ、日本拠点A / 海外拠点B / 海外拠点C）。
   ---------------------------------------------------------------- */
"use strict";

const PHRASES_A = [

  /* ===================================================================
     vendor : 開発委託・ベンダー管理（指示 / 確認 / 成果物）  18件
     =================================================================== */
  {
    id: "a001",
    cat: "vendor",
    level: "初級",
    en: "Please share the schedule with us.",
    ja: "スケジュールを共有してください。",
    keys: [
      { w: "share the schedule", mean: "スケジュールを共有する", pron: "ʃer ðə ˈskedʒuːl" }
    ],
    situation: "週次進捗会議で、海外拠点C（委託先）に最新スケジュールの提示を依頼するとき。",
    alts: ["Could you send us the latest schedule?", "Please provide the updated timeline.", "We would appreciate the schedule by this week."],
    examples: ["Please share the schedule with us by the end of this week."]
  },
  {
    id: "a002",
    cat: "vendor",
    level: "中級",
    en: "Maybe the PO will be issued in the third week of July.",
    ja: "POは7月第3週に発行されるかもしれません。",
    keys: [
      { w: "PO", mean: "発注書（Purchase Order）", pron: "ˌpiː ˈoʊ" },
      { w: "be issued", mean: "発行される", pron: "bi ˈɪʃuːd" }
    ],
    situation: "週次進捗会議で、海外拠点BへのPO（発注書）発行時期の見込みを共有するとき。",
    alts: ["The PO is expected to be issued by mid-July.", "We plan to issue the PO in late July.", "The PO issuance might slip to the fourth week."],
    examples: ["Maybe the PO will be issued in the third week of August instead."]
  },
  {
    id: "a003",
    cat: "vendor",
    level: "中級",
    en: "Could you confirm the PO amount and the billing period?",
    ja: "POの金額と請求期間を確認していただけますか？",
    keys: [
      { w: "PO amount", mean: "発注金額", pron: "ˌpiː ˈoʊ əˈmaʊnt" },
      { w: "billing period", mean: "請求期間", pron: "ˈbɪlɪŋ ˈpɪriəd" }
    ],
    situation: "発注前の確認会で、発注書ドラフトの金額と請求期間に誤りがないか委託先と突き合わせるとき。",
    alts: ["Please double-check the PO value and billing term.", "Can you verify the amount on the PO?", "Is the billing period correct on this PO?"],
    examples: ["Could you confirm the PO amount and the billing period before we sign it?"]
  },
  {
    id: "a004",
    cat: "vendor",
    level: "初級",
    en: "We will send the official quotation by Wednesday.",
    ja: "正式な見積書を水曜日までにお送りします。",
    keys: [
      { w: "official quotation", mean: "正式見積書", pron: "əˈfɪʃl kwoʊˈteɪʃn" }
    ],
    situation: "見積レビューの終盤で、見積書の提出期限をその場でコミットするとき。",
    alts: ["The formal quote will be ready by Wednesday.", "We will issue the quotation this week.", "Expect the official estimation by midweek."],
    examples: ["We will send the official quotation by Friday at the latest."]
  },
  {
    id: "a005",
    cat: "vendor",
    level: "中級",
    en: "We are following up on the delivery sign-off.",
    ja: "納品の承認（サインオフ）をフォローしています。",
    keys: [
      { w: "following up", mean: "追いかけて確認している", pron: "ˈfɑːloʊɪŋ ʌp" },
      { w: "sign-off", mean: "承認・承認サイン", pron: "ˈsaɪn ɔːf" }
    ],
    situation: "週次進捗会議で、作業はほぼ完了しているが発注側の最終承認待ちである状況を報告するとき。",
    alts: ["We are waiting for the final sign-off.", "The sign-off process is in progress.", "We expect to get the approval today."],
    examples: ["We are following up on the delivery sign-off with the user department."]
  },
  {
    id: "a006",
    cat: "vendor",
    level: "初級",
    en: "I will check the status with the responsible person.",
    ja: "担当者に状況を確認します。",
    keys: [
      { w: "check the status", mean: "状況を確認する", pron: "tʃek ðə ˈstætəs" },
      { w: "responsible person", mean: "担当者・責任者", pron: "rɪˈspɑːnsəbl ˈpɜːrsn" }
    ],
    situation: "会議中にその場で答えられない質問を受け、持ち帰って確認すると引き取るとき。",
    alts: ["Let me confirm with the person in charge.", "I will check and follow up.", "I will get back to you after checking."],
    examples: ["I will check the status with the responsible person and reply by tomorrow."]
  },
  {
    id: "a007",
    cat: "vendor",
    level: "中級",
    en: "Please make sure all deliverables are submitted by the due date.",
    ja: "すべての成果物を期日までに提出するようにしてください。",
    keys: [
      { w: "deliverables", mean: "成果物", pron: "dɪˈlɪvərəblz" },
      { w: "due date", mean: "期日・締切", pron: "ˈduː deɪt" }
    ],
    situation: "納品直前のフォロー会議で、委託先に提出漏れがないよう念押しするとき。",
    alts: ["All deliverables must be submitted on time.", "Please do not miss the submission deadline.", "We expect the full set of deliverables by the due date."],
    examples: ["Please make sure all deliverables are submitted by the due date of March 31st."]
  },
  {
    id: "a008",
    cat: "vendor",
    level: "初級",
    en: "Could you send us the weekly report every Friday?",
    ja: "週次報告を毎週金曜に送っていただけますか？",
    keys: [
      { w: "weekly report", mean: "週次報告書", pron: "ˈwiːkli rɪˈpɔːrt" }
    ],
    situation: "キックオフで委託先との報告ルールを決める場面。定期報告の頻度と曜日を指定するとき。",
    alts: ["Please submit a weekly report every Friday.", "We would like a status report on a weekly basis.", "Can we agree on Friday as the reporting day?"],
    examples: ["Could you send us the weekly report every Friday before noon?"]
  },
  {
    id: "a009",
    cat: "vendor",
    level: "上級",
    en: "The work scope of this consignment contract needs to be clarified.",
    ja: "この委託契約の作業範囲を明確にする必要があります。",
    keys: [
      { w: "work scope", mean: "作業範囲", pron: "wɜːrk skoʊp" },
      { w: "consignment contract", mean: "委託契約", pron: "kənˈsaɪnmənt ˈkɑːntrækt" },
      { w: "clarified", mean: "明確にされる", pron: "ˈklerəfaɪd" }
    ],
    situation: "契約前のレビュー会で、どこまでが委託範囲か曖昧なまま進んでいると指摘するとき。",
    alts: ["We need to define the scope of the consignment more clearly.", "The contract scope is still ambiguous.", "Let us clarify what is in scope and out of scope."],
    examples: ["The work scope of this consignment contract needs to be clarified before the kick-off."]
  },
  {
    id: "a010",
    cat: "vendor",
    level: "初級",
    en: "Who is in charge of this task on your side?",
    ja: "この作業は御社側ではどなたが担当ですか？",
    keys: [
      { w: "in charge of", mean: "〜の担当である", pron: "ɪn tʃɑːrdʒ əv" },
      { w: "on your side", mean: "御社側では", pron: "ɑːn jʊr saɪd" }
    ],
    situation: "キックオフや課題検討会で、委託先の窓口となる担当者を特定するとき。",
    alts: ["Who owns this task in your team?", "Could you tell us the person in charge?", "Who should we contact for this item?"],
    examples: ["Who is in charge of the interface design on your side?"]
  },
  {
    id: "a011",
    cat: "vendor",
    level: "初級",
    en: "Please follow the coding standard we provided.",
    ja: "当方が提供したコーディング規約に従ってください。",
    keys: [
      { w: "follow the coding standard", mean: "コーディング規約に従う", pron: "ˈfɑːloʊ ðə ˈkoʊdɪŋ ˈstændərd" }
    ],
    situation: "開発着手前の説明会で、品質を揃えるために守るべきルールを委託先に指示するとき。",
    alts: ["The coding rules must be applied to all modules.", "Please comply with our development standard.", "Use the standard we shared in the kick-off."],
    examples: ["Please follow the coding standard we provided for all ModuleZ components."]
  },
  {
    id: "a012",
    cat: "vendor",
    level: "上級",
    en: "We would like to review the deliverable before the final submission.",
    ja: "最終提出の前に成果物をレビューさせていただきたいです。",
    keys: [
      { w: "review the deliverable", mean: "成果物をレビューする", pron: "rɪˈvjuː ðə dɪˈlɪvərəbl" },
      { w: "final submission", mean: "最終提出", pron: "ˈfaɪnl səbˈmɪʃn" }
    ],
    situation: "成果物レビュー会で、手戻りを防ぐため納品前のドラフト段階での確認機会を求めるとき。",
    alts: ["Can we have a draft review before you submit it?", "Please send us the draft version first.", "We want to check the deliverable in advance."],
    examples: ["We would like to review the deliverable before the final submission next Monday."]
  },
  {
    id: "a013",
    cat: "vendor",
    level: "上級",
    en: "Any additional work beyond the scope requires a change request.",
    ja: "スコープ外の追加作業には変更要求（CR）が必要です。",
    keys: [
      { w: "beyond the scope", mean: "範囲を超えて", pron: "bɪˈjɑːnd ðə skoʊp" },
      { w: "change request", mean: "変更要求（CR）", pron: "tʃeɪndʒ rɪˈkwest" }
    ],
    situation: "追加依頼が契約範囲を超えていると判明した場面で、正式な手続きが必要だと線を引くとき。",
    alts: ["Out-of-scope work must go through the CR process.", "We cannot absorb this without a change request.", "This needs a formal change procedure."],
    examples: ["Any additional work beyond the scope requires a change request and a revised quotation."]
  },
  {
    id: "a014",
    cat: "vendor",
    level: "中級",
    en: "Could you give us a status update by tomorrow morning?",
    ja: "明日の朝までに状況報告をいただけますか？",
    keys: [
      { w: "status update", mean: "状況報告", pron: "ˈstætəs ˈʌpdeɪt" }
    ],
    situation: "障害対応など急ぎの案件で、委託先に短い期限を切って報告を求めるとき。",
    alts: ["Please update us by tomorrow morning.", "We need the latest status first thing tomorrow.", "Can you report the situation by 9 a.m. tomorrow?"],
    examples: ["Could you give us a status update by tomorrow morning on the pending items?"]
  },
  {
    id: "a015",
    cat: "vendor",
    level: "上級",
    en: "The acceptance criteria should be agreed before the delivery.",
    ja: "検収基準は納品前に合意しておくべきです。",
    keys: [
      { w: "acceptance criteria", mean: "検収基準・受入基準", pron: "əkˈseptəns kraɪˈtɪriə" },
      { w: "delivery", mean: "納品", pron: "dɪˈlɪvəri" }
    ],
    situation: "契約・計画レビューで、納品後の揉め事を防ぐため合格条件の事前合意を提案するとき。",
    alts: ["Let us fix the acceptance conditions in advance.", "We need to agree on how to judge the completion.", "The criteria for acceptance must be clear first."],
    examples: ["The acceptance criteria should be agreed before the delivery of each module."]
  },
  {
    id: "a016",
    cat: "vendor",
    level: "中級",
    en: "We will issue the instruction document by the end of this week.",
    ja: "作業指示書を今週末までに発行します。",
    keys: [
      { w: "issue", mean: "発行する", pron: "ˈɪʃuː" },
      { w: "instruction document", mean: "作業指示書", pron: "ɪnˈstrʌkʃn ˈdɑːkjumənt" }
    ],
    situation: "会議で口頭合意した依頼内容を、正式文書に落として委託先へ渡すと約束するとき。",
    alts: ["The written instruction will be sent this week.", "We will formalize the request in a document.", "You will receive the work order by Friday."],
    examples: ["We will issue the instruction document by the end of this week so you can start on Monday."]
  },
  {
    id: "a017",
    cat: "vendor",
    level: "上級",
    en: "Please escalate to us immediately if you find any blocking issue.",
    ja: "作業を止めるような問題が見つかったら、すぐにエスカレーションしてください。",
    keys: [
      { w: "escalate", mean: "上位へ報告する・エスカレーションする", pron: "ˈeskəleɪt" },
      { w: "blocking issue", mean: "作業停止につながる問題", pron: "ˈblɑːkɪŋ ˈɪʃuː" }
    ],
    situation: "委託先が問題を抱え込んで遅延が表面化しないよう、早期報告のルールを徹底するとき。",
    alts: ["Raise it to us as soon as you are blocked.", "Do not wait for the weekly meeting to report a blocker.", "Immediate escalation is required for blocking items."],
    examples: ["Please escalate to us immediately if you find any blocking issue in the test environment."]
  },
  {
    id: "a018",
    cat: "vendor",
    level: "上級",
    en: "Let me confirm the division of roles between your team and ours.",
    ja: "御社チームと当方の役割分担を確認させてください。",
    keys: [
      { w: "division of roles", mean: "役割分担", pron: "dɪˈvɪʒn əv roʊlz" }
    ],
    situation: "キックオフや体制見直しの場で、どちらがどこまでやるかを整理するとき。",
    alts: ["Let us clarify who does what.", "I would like to align on the responsibility split.", "Can we review the responsibility matrix between the two teams?"],
    examples: ["Let me confirm the division of roles between your team and ours for the UAT phase."]
  },

  /* ===================================================================
     progress : 進捗・遅延（進捗 / 原因 / リカバリープラン）  23件
     =================================================================== */
  {
    id: "a019",
    cat: "progress",
    level: "初級",
    en: "How is the development progress for the new feature?",
    ja: "新機能の開発進捗はどうですか？",
    keys: [
      { w: "development progress", mean: "開発の進捗", pron: "dɪˈveləpmənt ˈprɑːɡrəs" }
    ],
    situation: "週次進捗会議の冒頭で、担当機能の状況を確認するとき。",
    alts: ["Could you update us on the development status?", "Where do we stand on the new feature?"],
    examples: ["How is the development progress for the ModuleZ payment function?"]
  },
  {
    id: "a020",
    cat: "progress",
    level: "初級",
    en: "The development is 80 percent complete as of today.",
    ja: "本日時点で開発は80％完了です。",
    keys: [
      { w: "percent complete", mean: "％完了", pron: "pərˈsent kəmˈpliːt" },
      { w: "as of today", mean: "本日時点で", pron: "æz əv təˈdeɪ" }
    ],
    situation: "週次会議での定量的な進捗報告。数字と基準日をセットで述べるのが基本形。",
    alts: ["We are 80 percent done with development.", "Progress stands at 80 percent today.", "Coding is almost complete, at 80 percent."],
    examples: ["The development is 60 percent complete as of today, and testing starts next week."]
  },
  {
    id: "a021",
    cat: "progress",
    level: "初級",
    en: "On time, actual and target is 98 percent.",
    ja: "予定どおりで、実績と目標は98％です。",
    keys: [
      { w: "On time", mean: "予定どおりで", pron: "ɑːn taɪm" },
      { w: "actual and target", mean: "実績と目標", pron: "ˈæktʃuəl ænd ˈtɑːrɡət" }
    ],
    situation: "月次レポートレビューで、リリース進捗の実績値を目標値と並べて報告するとき。",
    alts: ["We are on schedule with 98 percent achievement.", "Actual progress meets the 98 percent target.", "The release is on track at 98 percent."],
    examples: ["On time, actual and target is 95 percent for this month."]
  },
  {
    id: "a022",
    cat: "progress",
    level: "中級",
    en: "The target is 69 percent, and the actual is 64 percent.",
    ja: "目標は69％、実績は64％です。",
    keys: [
      { w: "target", mean: "目標（値）", pron: "ˈtɑːrɡət" },
      { w: "actual", mean: "実績（値）", pron: "ˈæktʃuəl" }
    ],
    situation: "月次進捗報告で、目標と実績を対で述べ、その差分を議論の入口にするとき。",
    alts: ["We are 5 points behind the target.", "Actual progress is 64 percent against the 69 percent target.", "We are slightly below the target."],
    examples: ["The target is 80 percent, and the actual is 72 percent, so we are 8 points behind."]
  },
  {
    id: "a023",
    cat: "progress",
    level: "中級",
    en: "There is a two-day delay due to the environment issue.",
    ja: "環境の問題により2日の遅延が発生しています。",
    keys: [
      { w: "delay", mean: "遅延", pron: "dɪˈleɪ" },
      { w: "due to", mean: "〜が原因で", pron: "duː tuː" }
    ],
    situation: "週次会議で遅延の事実と原因をセットで報告するとき。事実→原因→対策の順が鉄則。",
    alts: ["We are two days behind schedule.", "The environment trouble caused a short delay.", "There is a slight slippage of two days."],
    examples: ["There is a one-week delay due to the license approval process."]
  },
  {
    id: "a024",
    cat: "progress",
    level: "中級",
    en: "We can catch up by the end of next week.",
    ja: "来週末までに挽回できます。",
    keys: [
      { w: "catch up", mean: "遅れを取り戻す", pron: "kætʃ ʌp" }
    ],
    situation: "遅延を報告した直後に、いつまでに挽回できるかの見込みを添えるとき。",
    alts: ["We will recover the delay by next Friday.", "The schedule will be back on track next week.", "We expect to catch up soon."],
    examples: ["We can catch up by the end of this month if the test data arrives on time."]
  },
  {
    id: "a025",
    cat: "progress",
    level: "中級",
    en: "We were able to recover slightly, but we are still delayed.",
    ja: "少し挽回できましたが、まだ遅延しています。",
    keys: [
      { w: "recover", mean: "挽回する・回復する", pron: "rɪˈkʌvər" },
      { w: "still delayed", mean: "まだ遅れている", pron: "stɪl dɪˈleɪd" }
    ],
    situation: "遅延案件の進捗を正直に報告する場面。回復傾向であることも必ず添える。",
    alts: ["We caught up a little, but not fully yet.", "The delay is shrinking but still remains.", "We are recovering, though still behind schedule."],
    examples: ["We were able to recover slightly, but we are still delayed by three days."]
  },
  {
    id: "a026",
    cat: "progress",
    level: "初級",
    en: "It might be moved from July to August.",
    ja: "7月から8月に後ろ倒しになるかもしれません。",
    keys: [
      { w: "might be moved", mean: "移動するかもしれない", pron: "maɪt bi muːvd" }
    ],
    situation: "リリース時期が後ろ倒しになる可能性を、確定前に予告として共有するとき。",
    alts: ["The schedule may slip to August.", "It could be postponed to August.", "There is a chance of moving it to August."],
    examples: ["It might be moved from the first quarter to the second quarter."]
  },
  {
    id: "a027",
    cat: "progress",
    level: "上級",
    en: "We will still stick to July on this one.",
    ja: "この件については、引き続き7月のままでいきます。",
    keys: [
      { w: "stick to", mean: "〜を維持する・固執する", pron: "stɪk tuː" }
    ],
    situation: "リスケを検討したうえで、当初スケジュールを維持すると判断を伝えるとき。",
    alts: ["We will keep the July schedule.", "No change to the July target for now.", "Let us maintain the original July plan."],
    examples: ["We will still stick to the original plan on this one, even with the extra requests."]
  },
  {
    id: "a028",
    cat: "progress",
    level: "中級",
    en: "The milestone review is scheduled for Friday.",
    ja: "マイルストーンレビューは金曜日に予定されています。",
    keys: [
      { w: "milestone review", mean: "マイルストーンレビュー・節目審査", pron: "ˈmaɪlstoʊn rɪˈvjuː" },
      { w: "scheduled for", mean: "〜に予定されている", pron: "ˈskedʒuːld fɔːr" }
    ],
    situation: "週次会議の締めで、工程の重要な節目となるレビューの日程を全員に確認・周知するとき。",
    alts: ["The phase-gate review is on Friday.", "We will hold the milestone meeting this week.", "Friday is the checkpoint review."],
    examples: ["The milestone review is scheduled for the last working day of this month."]
  },
  {
    id: "a029",
    cat: "progress",
    level: "中級",
    en: "The action is to work overtime to recover the delay.",
    ja: "対策として、残業により遅延を挽回します。",
    keys: [
      { w: "work overtime", mean: "残業する", pron: "wɜːrk ˈoʊvərtaɪm" },
      { w: "recover the delay", mean: "遅延を挽回する", pron: "rɪˈkʌvər ðə dɪˈleɪ" }
    ],
    situation: "遅延報告のあと、具体的なリカバリーアクションを提示するとき。",
    alts: ["We will put in extra hours to catch up.", "Overtime work is planned for the delay recovery.", "The team will work extra hours this month."],
    examples: ["The action is to add one more engineer to recover the delay."]
  },
  {
    id: "a030",
    cat: "progress",
    level: "上級",
    en: "We will negotiate a new target release schedule with the user.",
    ja: "ユーザーと新しいリリース目標日を交渉します。",
    keys: [
      { w: "negotiate", mean: "交渉する", pron: "nɪˈɡoʊʃieɪt" },
      { w: "target release schedule", mean: "目標リリース日程", pron: "ˈtɑːrɡət rɪˈliːs ˈskedʒuːl" }
    ],
    situation: "追加要件や遅延により当初日程が守れず、リリース日の再設定を対策として提示するとき。",
    alts: ["We will discuss a revised release date with the user.", "The release schedule needs to be re-negotiated.", "We will agree on a new target date."],
    examples: ["We will negotiate a new target release schedule with the user by the end of this week."]
  },
  {
    id: "a031",
    cat: "progress",
    level: "上級",
    en: "An issue was found during user testing due to a missed requirement from the user.",
    ja: "ユーザー側の要件漏れにより、ユーザーテストで問題が見つかりました。",
    keys: [
      { w: "user testing", mean: "ユーザーテスト", pron: "ˈjuːzər ˈtestɪŋ" },
      { w: "missed requirement", mean: "要件漏れ", pron: "mɪst rɪˈkwaɪərmənt" }
    ],
    situation: "遅延原因を説明する場面。責任の所在を感情的にならず、事実として淡々と述べる。",
    alts: ["An issue was found during the user test phase.", "The defect came from a missing requirement.", "The problem was caused by an overlooked requirement."],
    examples: ["An issue was found during user testing due to a missed requirement from the operation team."]
  },
  {
    id: "a032",
    cat: "progress",
    level: "初級",
    en: "Once it is decided, we will adjust the plan.",
    ja: "決まり次第、計画を調整します。",
    keys: [
      { w: "Once it is decided", mean: "決まり次第", pron: "wʌns ɪt ɪz dɪˈsaɪdɪd" },
      { w: "adjust the plan", mean: "計画を調整する", pron: "əˈdʒʌst ðə plæn" }
    ],
    situation: "未確定の変更について、今は動かず確定後に反映すると答えるとき。",
    alts: ["We will update the plan when it is fixed.", "Nothing is decided yet, so let us wait for the final decision.", "We will reflect it once it is finalized."],
    examples: ["Once it is decided, we will adjust the manpower plan accordingly."]
  },
  {
    id: "a033",
    cat: "progress",
    level: "初級",
    en: "Currently we are on time and two members are proceeding.",
    ja: "現在は予定どおりで、2名のメンバーが進めています。",
    keys: [
      { w: "on time", mean: "予定どおり", pron: "ɑːn taɪm" },
      { w: "proceeding", mean: "進めている・進行中である", pron: "prəˈsiːdɪŋ" }
    ],
    situation: "小規模タスクの進捗を、状況と体制をあわせて短く報告するとき。",
    alts: ["We are on schedule with two members.", "Two members are progressing as planned.", "We are on track; two people are working on it."],
    examples: ["Currently we are on time and three members are proceeding with the SystemX migration."]
  },
  {
    id: "a034",
    cat: "progress",
    level: "上級",
    en: "Could you explain the root cause of the delay and the recovery plan?",
    ja: "遅延の根本原因とリカバリープランを説明していただけますか？",
    keys: [
      { w: "root cause", mean: "根本原因", pron: "ruːt kɔːz" },
      { w: "recovery plan", mean: "挽回計画・リカバリープラン", pron: "rɪˈkʌvəri plæn" }
    ],
    situation: "遅延報告を受けた管理側が、原因と対策をセットで求めるとき。追及の定番表現。",
    alts: ["What caused the delay, and how will you recover it?", "We need both the cause analysis and the countermeasure.", "Please report the reason and your catch-up plan."],
    examples: ["Could you explain the root cause of the delay and the recovery plan by the next meeting?"]
  },
  {
    id: "a035",
    cat: "progress",
    level: "中級",
    en: "We are one week behind the baseline schedule.",
    ja: "ベースラインのスケジュールより1週間遅れています。",
    keys: [
      { w: "behind", mean: "遅れて", pron: "bɪˈhaɪnd" },
      { w: "baseline schedule", mean: "基準計画・ベースライン日程", pron: "ˈbeɪslaɪn ˈskedʒuːl" }
    ],
    situation: "当初計画（ベースライン）との差分として、遅延量を定量的に示すとき。",
    alts: ["We have a one-week slippage against the baseline.", "The plan is one week late compared to the original.", "There is a gap of one week from the baseline."],
    examples: ["We are two weeks behind the baseline schedule because of the specification change."]
  },
  {
    id: "a036",
    cat: "progress",
    level: "上級",
    en: "The delay will not affect the go-live date at this moment.",
    ja: "現時点では、この遅延は本番稼働日に影響しません。",
    keys: [
      { w: "affect", mean: "影響を与える", pron: "əˈfekt" },
      { w: "go-live date", mean: "本番稼働日", pron: "ˈɡoʊ laɪv deɪt" },
      { w: "at this moment", mean: "現時点では", pron: "æt ðɪs ˈmoʊmənt" }
    ],
    situation: "遅延はあるがクリティカルパスには乗っていない、と影響範囲を切り分けて報告するとき。",
    alts: ["There is no impact on the go-live so far.", "The cutover date remains unchanged for now.", "The delay is absorbed within the buffer."],
    examples: ["The delay will not affect the go-live date at this moment, but we will watch it weekly."]
  },
  {
    id: "a037",
    cat: "progress",
    level: "中級",
    en: "Let me update you on the progress of each work package.",
    ja: "各作業パッケージの進捗を報告させてください。",
    keys: [
      { w: "update you on", mean: "〜について最新状況を伝える", pron: "ˈʌpdeɪt juː ɑːn" },
      { w: "work package", mean: "作業パッケージ（WBSの単位）", pron: "wɜːrk ˈpækɪdʒ" }
    ],
    situation: "進捗報告の口火を切るとき。項目ごとに順を追って説明すると宣言する。",
    alts: ["I will walk you through the status item by item.", "Let me go through each work item.", "Here is the progress for each deliverable."],
    examples: ["Let me update you on the progress of each work package, starting with the interface design."]
  },
  {
    id: "a038",
    cat: "progress",
    level: "上級",
    en: "If the recovery plan does not work, we need to re-baseline the schedule.",
    ja: "リカバリープランが機能しない場合は、スケジュールのベースラインを引き直す必要があります。",
    keys: [
      { w: "recovery plan", mean: "挽回計画", pron: "rɪˈkʌvəri plæn" },
      { w: "re-baseline", mean: "計画基準を引き直す", pron: "riː ˈbeɪslaɪn" }
    ],
    situation: "挽回が難しくなった場合の次の一手を、遅延対応会議であらかじめ合意しておくとき。",
    alts: ["Otherwise we must revise the official plan.", "A formal schedule change will be required.", "We would then reset the milestones."],
    examples: ["If the recovery plan does not work, we need to re-baseline the schedule at the next steering committee."]
  },
  {
    id: "a083",
    cat: "progress",
    level: "初級",
    en: "Are we behind schedule on this item?",
    ja: "この項目は予定より遅れていますか？",
    keys: [
      { w: "behind schedule", mean: "予定より遅れて", pron: "bɪˈhaɪnd ˈskedʒuːl" }
    ],
    situation: "進捗報告を聞いたあと、遅れの有無をはっきり確認するとき。遅延議論の入口となる一言。",
    alts: ["Is this item running late?", "Are we on schedule for this one?", "Do we have any delay here?"],
    examples: ["Are we behind schedule on the integration test as well?"]
  },
  {
    id: "a084",
    cat: "progress",
    level: "初級",
    en: "Could you tell us what caused the delay?",
    ja: "遅延の原因を教えていただけますか？",
    keys: [
      { w: "what caused the delay", mean: "何が遅延を引き起こしたか", pron: "wʌt kɔːzd ðə dɪˈleɪ" }
    ],
    situation: "遅延があると分かった直後に、原因を尋ねるとき。責めずに事実を聞き出す言い方。",
    alts: ["What is the reason for the delay?", "Why did it slip?", "Could you explain the background of the delay?"],
    examples: ["Could you tell us what caused the delay in the environment setup?"]
  },
  {
    id: "a085",
    cat: "progress",
    level: "中級",
    en: "Could you share your recovery plan to get back on track?",
    ja: "予定に戻すためのリカバリープランを共有していただけますか？",
    keys: [
      { w: "recovery plan", mean: "挽回計画・リカバリープラン", pron: "rɪˈkʌvəri plæn" },
      { w: "get back on track", mean: "軌道に戻る", pron: "ɡet bæk ɑːn træk" }
    ],
    situation: "原因を聞いたあと、挽回策とその実行時期を具体的に出させるとき。",
    alts: ["How do you plan to catch up?", "We need your catch-up plan with dates.", "What is your plan to recover the schedule?"],
    examples: ["Could you share your recovery plan to get back on track by the end of this month?"]
  },

  /* ===================================================================
     manpower : 人員・人月（リソース / 人月 / 要員調整）  18件
     =================================================================== */
  {
    id: "a039",
    cat: "manpower",
    level: "中級",
    en: "Do you have other concerns on the forecast manpower plan?",
    ja: "要員計画の見通しについて、他に懸念はありますか？",
    keys: [
      { w: "concerns", mean: "懸念", pron: "kənˈsɜːrnz" },
      { w: "forecast manpower plan", mean: "要員計画の見通し", pron: "ˈfɔːrkæst ˈmænpaʊər plæn" }
    ],
    situation: "次四半期の要員計画レビューの締めで、参加者に残った懸念を拾いにいくとき。",
    alts: ["Any other issues regarding the manpower forecast?", "Is there anything else about the staffing plan?", "Do you foresee any risks in the resource plan?"],
    examples: ["Do you have other concerns on the forecast manpower plan for the next half year?"]
  },
  {
    id: "a040",
    cat: "manpower",
    level: "上級",
    en: "We have already reflected the actual consumption up to June in the manpower forecast.",
    ja: "6月までの実績消化を要員計画の見通しに反映済みです。",
    keys: [
      { w: "reflected", mean: "反映した", pron: "rɪˈflektɪd" },
      { w: "actual consumption", mean: "実績消化（実際に使った工数）", pron: "ˈæktʃuəl kənˈsʌmpʃn" },
      { w: "manpower forecast", mean: "要員の見通し", pron: "ˈmænpaʊər ˈfɔːrkæst" }
    ],
    situation: "週次会議の冒頭で、要員計画表のどこを更新したかを説明するとき。",
    alts: ["The actual figures up to June are now included in the forecast.", "The forecast has been updated with the actual consumption.", "Both figures now show the real numbers."],
    examples: ["We have already reflected the actual consumption up to September in the manpower forecast."]
  },
  {
    id: "a041",
    cat: "manpower",
    level: "中級",
    en: "We can transfer manpower from another item if needed.",
    ja: "必要であれば、他の項目から要員を回すことができます。",
    keys: [
      { w: "transfer manpower", mean: "要員を移す", pron: "ˈtrænsfɜːr ˈmænpaʊər" },
      { w: "if needed", mean: "必要であれば", pron: "ɪf ˈniːdɪd" }
    ],
    situation: "要員計画レビューで、増加が見込まれる案件へ優先度の低い案件から転用する提案をするとき。",
    alts: ["We can reassign some members to this item.", "Manpower can be shifted depending on the needs.", "Let us move resources from the lower-priority items."],
    examples: ["We can transfer manpower from another item if needed, but handover takes two weeks."]
  },
  {
    id: "a042",
    cat: "manpower",
    level: "中級",
    en: "Sometimes there is no request, and sometimes a large request suddenly comes in.",
    ja: "依頼が全く無い時もあれば、突然大きな依頼が来ることもあります。",
    keys: [
      { w: "a large request", mean: "大きな依頼", pron: "ə lɑːrdʒ rɪˈkwest" },
      { w: "comes in", mean: "入ってくる", pron: "kʌmz ɪn" }
    ],
    situation: "要員計画レビューで、依頼量が読めないため見通しが立てにくい事情を説明するとき。",
    alts: ["The workload from the user side is unstable.", "It is very difficult to forecast this item.", "The requests come in irregularly."],
    examples: ["Sometimes there is no request, and sometimes a large request suddenly comes in, so we keep one buffer member."]
  },
  {
    id: "a043",
    cat: "manpower",
    level: "初級",
    en: "At this point, I do not think the volume will increase.",
    ja: "現時点では、ボリュームが増えることはないと思います。",
    keys: [
      { w: "At this point", mean: "現時点では", pron: "æt ðɪs pɔɪnt" },
      { w: "volume", mean: "物量・作業量", pron: "ˈvɑːljuːm" }
    ],
    situation: "発注量の増減を聞かれ、「減るか現状維持のどちらか」という見通しを答えるとき。",
    alts: ["There is no chance of an increase for now.", "The possibility is only decrease or remain the same.", "This is the maximum amount."],
    examples: ["At this point, I do not think the volume will increase in the second half."]
  },
  {
    id: "a044",
    cat: "manpower",
    level: "初級",
    en: "One senior engineer will join the team from August.",
    ja: "8月からシニアエンジニアが1名チームに参画します。",
    keys: [
      { w: "senior engineer", mean: "シニアエンジニア・上級技術者", pron: "ˈsiːnjər ˌendʒɪˈnɪr" },
      { w: "join the team", mean: "チームに参画する", pron: "dʒɔɪn ðə tiːm" }
    ],
    situation: "体制強化のための要員追加を、週次会議で報告するとき。",
    alts: ["A new senior member joins in August.", "We are adding one experienced engineer.", "The team will be reinforced from August."],
    examples: ["Two junior engineers will join the team from October."]
  },
  {
    id: "a045",
    cat: "manpower",
    level: "中級",
    en: "We need to secure two more testers for UAT.",
    ja: "UATに向けてテスターをあと2名確保する必要があります。",
    keys: [
      { w: "secure", mean: "確保する", pron: "sɪˈkjʊr" },
      { w: "testers", mean: "テスト担当者", pron: "ˈtestərz" },
      { w: "UAT", mean: "ユーザー受入テスト", pron: "ˌjuː eɪ ˈtiː" }
    ],
    situation: "後工程の体制不足を早めに提起し、要員手配を依頼するとき。",
    alts: ["Two additional testers are required for UAT.", "We are short of testing resources.", "Please arrange two more QA members."],
    examples: ["We need to secure two more testers for the regression test in February."]
  },
  {
    id: "a046",
    cat: "manpower",
    level: "中級",
    en: "The monthly cost is about 60,000, with no additional headcount.",
    ja: "月額コストは約6万で、追加の要員はありません。",
    keys: [
      { w: "monthly cost", mean: "月額コスト", pron: "ˈmʌnθli kɔːst" },
      { w: "additional headcount", mean: "追加要員数", pron: "əˈdɪʃənl ˈhedkaʊnt" }
    ],
    situation: "サポート拡張の提案会議で、人を増やさず手当のみで対応する構成を説明するとき。",
    alts: ["It only covers the night differential and weekend allowance.", "No extra people are needed, just allowances.", "The fee is 60K per month without new members."],
    examples: ["The monthly cost is about 80,000, with no additional headcount on our side."]
  },
  {
    id: "a047",
    cat: "manpower",
    level: "初級",
    en: "This task requires about three man-months in total.",
    ja: "この作業には合計で約3人月が必要です。",
    keys: [
      { w: "man-months", mean: "人月（工数の単位）", pron: "ˈmæn mʌnθs" },
      { w: "in total", mean: "合計で", pron: "ɪn ˈtoʊtl" }
    ],
    situation: "見積説明の場で、作業量を人月で提示するとき。日本側との議論で最も使う単位。",
    alts: ["The estimated effort is three man-months.", "We need roughly three person-months for this.", "The workload comes to three man-months."],
    examples: ["This task requires about five man-months in total, including the test phase."]
  },
  {
    id: "a048",
    cat: "manpower",
    level: "上級",
    en: "We need a mitigation plan for the resource shortage.",
    ja: "要員不足に対する軽減策が必要です。",
    keys: [
      { w: "mitigation plan", mean: "リスク軽減策", pron: "ˌmɪtɪˈɡeɪʃn plæn" },
      { w: "resource shortage", mean: "要員不足", pron: "ˈriːsɔːrs ˈʃɔːrtɪdʒ" }
    ],
    situation: "リスク管理の議題で、要員リスクへの対応計画の作成を正式に求めるとき。",
    alts: ["Please prepare a countermeasure for the staffing issue.", "We need a backup plan for the manpower risk.", "How do we mitigate this resource risk?"],
    examples: ["We need a mitigation plan for the resource shortage before the UAT phase starts."]
  },
  {
    id: "a049",
    cat: "manpower",
    level: "初級",
    en: "How many members are assigned to this project?",
    ja: "このプロジェクトには何名が割り当てられていますか？",
    keys: [
      { w: "assigned to", mean: "〜に割り当てられている", pron: "əˈsaɪnd tuː" }
    ],
    situation: "新しい案件の説明を受けた直後に、体制規模を把握するための基本質問。",
    alts: ["What is the current team size?", "How big is the team for this project?", "Could you tell us the headcount of this project?"],
    examples: ["How many members are assigned to the SystemX migration team at this moment?"]
  },
  {
    id: "a050",
    cat: "manpower",
    level: "中級",
    en: "Two members will be released from the project at the end of September.",
    ja: "9月末に2名がプロジェクトから離任します。",
    keys: [
      { w: "released from the project", mean: "プロジェクトから離任する", pron: "rɪˈliːst frəm ðə ˈprɑːdʒekt" }
    ],
    situation: "要員計画レビューで離任予定を事前共有し、引き継ぎとリスクの議論につなげるとき。",
    alts: ["Two people will roll off at the end of September.", "We will lose two members after September.", "Their assignment ends in September."],
    examples: ["Two members will be released from the project at the end of this fiscal year."]
  },
  {
    id: "a051",
    cat: "manpower",
    level: "上級",
    en: "The utilization rate of the team is around 85 percent this month.",
    ja: "今月のチーム稼働率は約85％です。",
    keys: [
      { w: "utilization rate", mean: "稼働率", pron: "ˌjuːtələˈzeɪʃn reɪt" }
    ],
    situation: "月次レビューで要員の稼働状況を指標で報告し、空き時間の使い道の議論につなげるとき。",
    alts: ["The team is running at 85 percent utilization.", "We have about 15 percent idle time this month.", "The billable ratio is 85 percent."],
    examples: ["The utilization rate of the team is around 70 percent this month, so we used the free hours for training."]
  },
  {
    id: "a052",
    cat: "manpower",
    level: "上級",
    en: "Could you reduce the man-month by sharing the resource with another project?",
    ja: "他プロジェクトと要員を共有して人月を減らせませんか？",
    keys: [
      { w: "reduce the man-month", mean: "人月を減らす", pron: "rɪˈduːs ðə ˈmæn mʌnθ" },
      { w: "sharing the resource", mean: "要員を共有すること", pron: "ˈʃerɪŋ ðə ˈriːsɔːrs" }
    ],
    situation: "見積交渉で、専任ではなく兼任体制にできないか打診してコストを下げにいくとき。",
    alts: ["Can the member be shared with another team to cut the cost?", "Is a part-time assignment possible?", "Could we lower the effort by resource sharing?"],
    examples: ["Could you reduce the man-month by sharing the tester with the maintenance team?"]
  },
  {
    id: "a053",
    cat: "manpower",
    level: "上級",
    en: "We are short of skilled engineers, so training takes extra man-hours.",
    ja: "熟練エンジニアが不足しているため、教育に追加工数がかかります。",
    keys: [
      { w: "short of", mean: "〜が不足している", pron: "ʃɔːrt əv" },
      { w: "extra man-hours", mean: "追加の工数（人時）", pron: "ˈekstrə ˈmæn aʊərz" }
    ],
    situation: "増員要請に対し、単純な人数追加では解決せず立ち上げ工数が要ることを説明するとき。",
    alts: ["Adding people does not help immediately because of the learning curve.", "We need ramp-up time for new members.", "Skill shortage increases the overall effort."],
    examples: ["We are short of skilled engineers, so training takes extra man-hours in the first two months."]
  },
  {
    id: "a054",
    cat: "manpower",
    level: "初級",
    en: "Please update the resource plan based on the latest forecast.",
    ja: "最新の見通しに基づいて要員計画を更新してください。",
    keys: [
      { w: "resource plan", mean: "要員計画", pron: "ˈriːsɔːrs plæn" },
      { w: "latest forecast", mean: "最新の見通し", pron: "ˈleɪtɪst ˈfɔːrkæst" }
    ],
    situation: "需要見通しが変わった後の会議で、要員計画の作り直しを指示するとき。",
    alts: ["Revise the staffing plan with the new numbers.", "The manpower table should reflect the latest figures.", "Please refresh the resource plan this week."],
    examples: ["Please update the resource plan based on the latest forecast before the next review."]
  },
  {
    id: "a086",
    cat: "manpower",
    level: "初級",
    en: "How many additional members do we need to recover the delay?",
    ja: "遅延を挽回するには何名の追加要員が必要ですか？",
    keys: [
      { w: "additional members", mean: "追加要員", pron: "əˈdɪʃənl ˈmembərz" },
      { w: "recover the delay", mean: "遅延を挽回する", pron: "rɪˈkʌvər ðə dɪˈleɪ" }
    ],
    situation: "リカバリープランを聞いたあと、挽回に必要な増員数を具体的に確認するとき。",
    alts: ["How many extra people are required to catch up?", "What headcount do you need for the recovery?", "Do we need more members to get back on schedule?"],
    examples: ["How many additional members do we need to recover the delay before the UAT starts?"]
  },
  {
    id: "a087",
    cat: "manpower",
    level: "上級",
    en: "Let us adjust the monthly man-month allocation from October to December.",
    ja: "10月から12月の月別人月配分を調整しましょう。",
    keys: [
      { w: "adjust", mean: "調整する", pron: "əˈdʒʌst" },
      { w: "man-month allocation", mean: "人月の配分", pron: "ˈmæn mʌnθ ˌæləˈkeɪʃn" }
    ],
    situation: "増員の合意後、要員計画表の月別の数字をその場で振り直すとき。",
    alts: ["We should rebalance the monthly effort across the quarter.", "Let us move some man-months to the later months.", "The monthly distribution needs to be revised."],
    examples: ["Let us adjust the monthly man-month allocation from January to March after the change request."]
  },

  /* ===================================================================
     budget : 予算・コスト（年度予算 / 見積 / 超過）  16件
     =================================================================== */
  {
    id: "a055",
    cat: "budget",
    level: "初級",
    en: "We are exceeding budget.",
    ja: "予算を超過しています。",
    keys: [
      { w: "exceeding", mean: "超過している", pron: "ɪkˈsiːdɪŋ" },
      { w: "budget", mean: "予算", pron: "ˈbʌdʒɪt" }
    ],
    situation: "月次コスト実績レビューで、予算超過という課題を率直に共有するとき。",
    alts: ["We are over budget.", "Costs have exceeded the plan.", "The spending is above the threshold."],
    examples: ["We are exceeding budget by about ten percent this quarter."]
  },
  {
    id: "a056",
    cat: "budget",
    level: "中級",
    en: "Even if we remove that cost, the budget is still exceeded.",
    ja: "そのコストを除いても、まだ予算を超過しています。",
    keys: [
      { w: "remove that cost", mean: "そのコストを除く", pron: "rɪˈmuːv ðæt kɔːst" },
      { w: "still exceeded", mean: "なお超過している", pron: "stɪl ɪkˈsiːdɪd" }
    ],
    situation: "予算超過の原因を切り分けながら、特定費目を除いても超過が解消しないと説明するとき。",
    alts: ["The budget overrun remains even without that item.", "Removing that portion does not solve the overrun.", "We still need extra budget for the exceeding part."],
    examples: ["Even if we remove the ToolY license cost, the budget is still exceeded."]
  },
  {
    id: "a057",
    cat: "budget",
    level: "中級",
    en: "Around 600 to 1.2 million per month per year.",
    ja: "年間ベースで月あたり約60万〜120万です。",
    keys: [
      { w: "Around", mean: "約・およそ", pron: "əˈraʊnd" },
      { w: "per month", mean: "月あたり", pron: "pər mʌnθ" }
    ],
    situation: "コスト見積の初期説明で、委託コストの概算レンジを口頭で提示するとき。",
    alts: ["Roughly 0.6 to 1.2 million monthly.", "The monthly estimation ranges from 600K to 1.2M.", "It costs about one million per month on average."],
    examples: ["Around 300 to 500 thousand per month for the maintenance part."]
  },
  {
    id: "a058",
    cat: "budget",
    level: "初級",
    en: "I suggest we divide it into half.",
    ja: "半分に分けることを提案します。",
    keys: [
      { w: "divide it into half", mean: "折半する", pron: "dɪˈvaɪd ɪt ˈɪntə hæf" }
    ],
    situation: "費用負担をどちらが持つかで折り合わないとき、折半案を提示する交渉場面。",
    alts: ["How about splitting it fifty-fifty?", "Let us share the cost equally.", "I propose an equal distribution."],
    examples: ["I suggest we divide it into half between the Japan site and the overseas site."]
  },
  {
    id: "a059",
    cat: "budget",
    level: "中級",
    en: "This PO will be charged to the overseas site only.",
    ja: "このPOは海外拠点のみに請求されます。",
    keys: [
      { w: "be charged to", mean: "〜に請求される・課金される", pron: "bi tʃɑːrdʒd tuː" },
      { w: "overseas site", mean: "海外拠点", pron: "ˈoʊvərsiːz saɪt" }
    ],
    situation: "予算・請求の議題で、費用の負担部門（課金先）を明確化し認識齟齬を防ぐとき。",
    alts: ["The cost will be billed to the overseas site.", "This charge applies only to that site.", "The Japan site will not be charged for this PO."],
    examples: ["This PO will be charged to the Japan site only, not to the overseas site."]
  },
  {
    id: "a060",
    cat: "budget",
    level: "中級",
    en: "That rate feels too high. Please reconfirm it.",
    ja: "その単価は高すぎる気がします。再確認してください。",
    keys: [
      { w: "rate", mean: "単価・レート", pron: "reɪt" },
      { w: "reconfirm", mean: "再確認する", pron: "ˌriːkənˈfɜːrm" }
    ],
    situation: "見積レビューで単価に疑義を示し、担当者への再確認を指示するとき。",
    alts: ["The unit price seems expensive. Could you double-check?", "Please go back and verify the rate.", "I do not expect such a big jump in the rate."],
    examples: ["That rate feels too high for a junior member. Please reconfirm it with the manager."]
  },
  {
    id: "a061",
    cat: "budget",
    level: "上級",
    en: "Sales looks the same as the budget, so the difference must be the expense, right?",
    ja: "売上は予算並みなので、差分は費用ということですよね？",
    keys: [
      { w: "the same as the budget", mean: "予算どおりで", pron: "ðə seɪm æz ðə ˈbʌdʒɪt" },
      { w: "the expense", mean: "費用・経費", pron: "ði ɪkˈspens" }
    ],
    situation: "四半期レビューで、数字の構造を自分の仮説で確認しながら議論を前に進めるとき。",
    alts: ["So the gap comes from the cost side, correct?", "The expense side explains the difference, right?", "Is my understanding correct that the expense increased?"],
    examples: ["Sales looks the same as the budget, so the difference must be the expense, right? Please show the breakdown."]
  },
  {
    id: "a062",
    cat: "budget",
    level: "中級",
    en: "Could you break down the estimation by phase?",
    ja: "見積をフェーズ別に分解していただけますか？",
    keys: [
      { w: "break down", mean: "分解する・内訳を示す", pron: "breɪk daʊn" },
      { w: "estimation", mean: "見積り", pron: "ˌestɪˈmeɪʃn" }
    ],
    situation: "総額だけ示された見積に対し、見積レビューで工程別の内訳を求めるとき。",
    alts: ["Please provide a phase-by-phase breakdown.", "Can we see the cost per phase?", "I would like the details behind the total amount."],
    examples: ["Could you break down the estimation by phase and by role?"]
  },
  {
    id: "a063",
    cat: "budget",
    level: "上級",
    en: "We are exceeding budget, so we need to discuss countermeasures.",
    ja: "予算を超過しているため、対策を協議する必要があります。",
    keys: [
      { w: "exceeding budget", mean: "予算超過している", pron: "ɪkˈsiːdɪŋ ˈbʌdʒɪt" },
      { w: "countermeasures", mean: "対策", pron: "ˈkaʊntərmeʒərz" }
    ],
    situation: "超過の報告で終わらせず、その場で対策議論へ持ち込むとき。",
    alts: ["The overrun requires an action plan.", "Let us discuss how to bring the cost back.", "We should agree on countermeasures today."],
    examples: ["We are exceeding budget, so we need to discuss countermeasures in this meeting."]
  },
  {
    id: "a064",
    cat: "budget",
    level: "初級",
    en: "What is the budget for this fiscal year?",
    ja: "今年度の予算はいくらですか？",
    keys: [
      { w: "fiscal year", mean: "会計年度・年度", pron: "ˈfɪskl jɪr" }
    ],
    situation: "年度計画の検討会で、予算の総枠を確認する基本質問。",
    alts: ["How much budget do we have this year?", "Could you tell us the annual budget?", "What is the approved amount for this year?"],
    examples: ["What is the budget for this fiscal year for the maintenance contract?"]
  },
  {
    id: "a065",
    cat: "budget",
    level: "初級",
    en: "The remaining budget for this fiscal year is about 20 percent.",
    ja: "今年度の残予算は約20％です。",
    keys: [
      { w: "remaining budget", mean: "残予算", pron: "rɪˈmeɪnɪŋ ˈbʌdʒɪt" }
    ],
    situation: "年度途中のコストレビューで消化状況を報告し、残りで何ができるかを議論するとき。",
    alts: ["We have used 80 percent of the annual budget.", "About one fifth of the budget is left.", "The balance is roughly 20 percent."],
    examples: ["The remaining budget for this fiscal year is about 20 percent, so we should prioritize carefully."]
  },
  {
    id: "a066",
    cat: "budget",
    level: "上級",
    en: "We need to apply for an additional budget to cover the overrun.",
    ja: "超過分を賄うため、追加予算を申請する必要があります。",
    keys: [
      { w: "apply for", mean: "申請する", pron: "əˈplaɪ fɔːr" },
      { w: "additional budget", mean: "追加予算", pron: "əˈdɪʃənl ˈbʌdʒɪt" },
      { w: "overrun", mean: "超過（額）", pron: "ˈoʊvərrʌn" }
    ],
    situation: "超過が避けられないと判断し、社内の追加予算申請に踏み切ると決めるとき。",
    alts: ["An extra budget request is required.", "We should go through the internal approval for more budget.", "The gap must be covered by a supplementary budget."],
    examples: ["We need to apply for an additional budget to cover the overrun by the end of this month."]
  },
  {
    id: "a067",
    cat: "budget",
    level: "中級",
    en: "The cost is within the budget we planned at the beginning of the year.",
    ja: "コストは年初に計画した予算の範囲内です。",
    keys: [
      { w: "within the budget", mean: "予算の範囲内で", pron: "wɪˈðɪn ðə ˈbʌdʒɪt" },
      { w: "at the beginning of the year", mean: "年度初めに", pron: "æt ðə bɪˈɡɪnɪŋ əv ðə jɪr" }
    ],
    situation: "月次レビューで良い報告をするとき。計画比で問題がないことを明確に言い切る。",
    alts: ["We are on budget as planned.", "No overrun against the annual plan.", "Spending is under control."],
    examples: ["The cost is within the budget we planned at the beginning of the year, including the extra tickets."]
  },
  {
    id: "a068",
    cat: "budget",
    level: "上級",
    en: "Please explain the variance between the planned cost and the actual cost.",
    ja: "計画コストと実績コストの差異を説明してください。",
    keys: [
      { w: "variance", mean: "差異", pron: "ˈveriəns" },
      { w: "planned cost", mean: "計画コスト", pron: "plænd kɔːst" },
      { w: "actual cost", mean: "実績コスト", pron: "ˈæktʃuəl kɔːst" }
    ],
    situation: "月次・四半期レビューで、計画と実績のズレの理由を報告者に求めるとき。",
    alts: ["Why is there a gap between plan and actual?", "Could you analyze the cost variance?", "We need the reason for the difference."],
    examples: ["Please explain the variance between the planned cost and the actual cost for the third quarter."]
  },
  {
    id: "a069",
    cat: "budget",
    level: "初級",
    en: "Can we carry over the unused budget to the next fiscal year?",
    ja: "未使用の予算を翌年度に繰り越すことはできますか？",
    keys: [
      { w: "carry over", mean: "繰り越す", pron: "ˈkæri ˈoʊvər" },
      { w: "unused budget", mean: "未使用予算", pron: "ʌnˈjuːzd ˈbʌdʒɪt" }
    ],
    situation: "年度末が近づき、残予算の扱いを管理部門に確認するとき。",
    alts: ["Is a budget carry-over possible?", "Can the remaining amount be moved to next year?", "Do we lose the unused portion at year-end?"],
    examples: ["Can we carry over the unused budget to the next fiscal year, or do we need to spend it by March?"]
  },
  {
    id: "a070",
    cat: "budget",
    level: "上級",
    en: "We will freeze the non-essential spending until the end of the quarter.",
    ja: "四半期末まで、緊急性の低い支出を凍結します。",
    keys: [
      { w: "freeze", mean: "凍結する", pron: "friːz" },
      { w: "non-essential spending", mean: "緊急性の低い支出", pron: "ˌnɑːnɪˈsenʃl ˈspendɪŋ" }
    ],
    situation: "コスト超過への即効性のある対策として、支出の一時停止を会議で宣言するとき。",
    alts: ["All optional costs are on hold.", "We stop discretionary spending for now.", "Only mandatory expenses will be approved."],
    examples: ["We will freeze the non-essential spending until the end of the quarter to recover the overrun."]
  },

  /* ===================================================================
     license : ライセンス（費用 / 課金先 / 承認）  16件
     =================================================================== */
  {
    id: "a071",
    cat: "license",
    level: "中級",
    en: "The license cost is included in the overseas site budget.",
    ja: "ライセンス費用は海外拠点の予算に含まれています。",
    keys: [
      { w: "license cost", mean: "ライセンス費用", pron: "ˈlaɪsns kɔːst" },
      { w: "included in", mean: "〜に含まれている", pron: "ɪnˈkluːdɪd ɪn" }
    ],
    situation: "予算レビューで、ライセンス費をどの予算で見ているかを明確にし二重計上や漏れを防ぐとき。",
    alts: ["The license fee sits in the overseas budget.", "That cost is already covered by the site budget.", "We budgeted the license at the site level."],
    examples: ["The license cost is included in the project budget, not in the operation budget."]
  },
  {
    id: "a072",
    cat: "license",
    level: "初級",
    en: "Who will be charged for the license fee?",
    ja: "ライセンス費用は誰に課金されますか？",
    keys: [
      { w: "be charged for", mean: "〜の費用を請求される", pron: "bi tʃɑːrdʒd fɔːr" },
      { w: "license fee", mean: "ライセンス料", pron: "ˈlaɪsns fiː" }
    ],
    situation: "複数拠点が使うツールについて、課金先（負担拠点）を確定させるとき。",
    alts: ["Which site bears the license cost?", "Who owns this cost?", "Where should we book the license fee?"],
    examples: ["Who will be charged for the license fee when both sites use ToolY?"]
  },
  {
    id: "a073",
    cat: "license",
    level: "中級",
    en: "The environment setup is delayed because of a license issue.",
    ja: "ライセンスの問題により、環境構築が遅れています。",
    keys: [
      { w: "environment setup", mean: "環境構築", pron: "ɪnˈvaɪrənmənt ˈsetʌp" },
      { w: "license issue", mean: "ライセンス上の問題", pron: "ˈlaɪsns ˈɪʃuː" }
    ],
    situation: "週次会議で、遅延の原因がライセンス手配にあると報告するとき。進捗と予算の双方に関わる。",
    alts: ["We cannot complete the setup until the license is granted.", "The license procurement is blocking the setup.", "A licensing problem caused the delay."],
    examples: ["The environment setup is delayed by one week because of a license issue with ToolY."]
  },
  {
    id: "a074",
    cat: "license",
    level: "初級",
    en: "How many licenses do we need for the new tool?",
    ja: "新しいツールにはライセンスが何本必要ですか？",
    keys: [
      { w: "How many licenses", mean: "ライセンスは何本", pron: "haʊ ˈmeni ˈlaɪsnsɪz" }
    ],
    situation: "ツール導入の検討初期に、必要数量を確認して概算費用を出すとき。",
    alts: ["What is the required number of licenses?", "How many seats do we have to buy?", "Could you tell us the license quantity?"],
    examples: ["How many licenses do we need for the new tool if ten members use it?"]
  },
  {
    id: "a075",
    cat: "license",
    level: "中級",
    en: "The license will be renewed automatically in April.",
    ja: "ライセンスは4月に自動更新されます。",
    keys: [
      { w: "renewed automatically", mean: "自動更新される", pron: "rɪˈnuːd ˌɔːtəˈmætɪkli" }
    ],
    situation: "契約棚卸しの場で自動更新の仕組みを共有し、不要なら事前解約が要ると注意喚起するとき。",
    alts: ["Auto-renewal takes place in April.", "Unless we cancel, it renews in April.", "The contract rolls over automatically."],
    examples: ["The license will be renewed automatically in April, so we must decide by February."]
  },
  {
    id: "a076",
    cat: "license",
    level: "上級",
    en: "We need management approval before purchasing the additional licenses.",
    ja: "追加ライセンスの購入前に、経営層の承認が必要です。",
    keys: [
      { w: "management approval", mean: "経営層の承認", pron: "ˈmænɪdʒmənt əˈpruːvl" },
      { w: "additional licenses", mean: "追加ライセンス", pron: "əˈdɪʃənl ˈlaɪsnsɪz" }
    ],
    situation: "現場判断で買えない金額に達したため、社内承認プロセスが必要だと説明するとき。",
    alts: ["The purchase requires an internal approval first.", "We must go through the internal approval process.", "Executive sign-off is mandatory for this amount."],
    examples: ["We need management approval before purchasing the additional licenses over one million yen."]
  },
  {
    id: "a077",
    cat: "license",
    level: "初級",
    en: "The annual license fee is about three million yen.",
    ja: "年間のライセンス費用は約300万円です。",
    keys: [
      { w: "annual license fee", mean: "年間ライセンス費用", pron: "ˈænjuəl ˈlaɪsns fiː" }
    ],
    situation: "予算計上の検討会で、ライセンスの年額を提示して判断材料にするとき。",
    alts: ["It costs roughly three million per year.", "The yearly licensing cost is three million yen.", "We pay about three million annually for the license."],
    examples: ["The annual license fee is about five million yen for the enterprise plan."]
  },
  {
    id: "a078",
    cat: "license",
    level: "上級",
    en: "Could you confirm whether the license is per user or per server?",
    ja: "ライセンスがユーザー単位かサーバー単位かを確認していただけますか？",
    keys: [
      { w: "per user", mean: "ユーザー単位で", pron: "pər ˈjuːzər" },
      { w: "per server", mean: "サーバー単位で", pron: "pər ˈsɜːrvər" }
    ],
    situation: "課金モデルで総額が大きく変わるため、契約形態を正確に確認するとき。",
    alts: ["Is it a named-user license or a server license?", "What is the licensing model?", "How is the license counted?"],
    examples: ["Could you confirm whether the license is per user or per server before we calculate the cost?"]
  },
  {
    id: "a079",
    cat: "license",
    level: "中級",
    en: "The license cost is the main reason for the budget overrun.",
    ja: "予算超過の主因はライセンス費用です。",
    keys: [
      { w: "the main reason", mean: "主な原因", pron: "ðə meɪn ˈriːzn" },
      { w: "budget overrun", mean: "予算超過", pron: "ˈbʌdʒɪt ˈoʊvərrʌn" }
    ],
    situation: "超過の内訳を分析し、どの費目が効いているかを特定して報告するとき。",
    alts: ["Licensing is what pushed us over the budget.", "Most of the overrun comes from the license.", "The gap is mainly driven by the license fee."],
    examples: ["The license cost is the main reason for the budget overrun this quarter."]
  },
  {
    id: "a080",
    cat: "license",
    level: "中級",
    en: "Please share the license agreement before we sign it.",
    ja: "署名の前にライセンス契約書を共有してください。",
    keys: [
      { w: "license agreement", mean: "ライセンス契約書", pron: "ˈlaɪsns əˈɡriːmənt" }
    ],
    situation: "契約条件（利用範囲・解約条件）を法務が確認できるよう、事前提出を求めるとき。",
    alts: ["We need to review the terms before signing.", "Could you send the agreement for our legal check?", "Let us read the contract first."],
    examples: ["Please share the license agreement before we sign it so our legal team can review the terms."]
  },
  {
    id: "a081",
    cat: "license",
    level: "中級",
    en: "We should consider downgrading the license plan to reduce the cost.",
    ja: "コスト削減のため、ライセンスプランのダウングレードを検討すべきです。",
    keys: [
      { w: "downgrading", mean: "下位プランへ変更すること", pron: "ˌdaʊnˈɡreɪdɪŋ" },
      { w: "license plan", mean: "ライセンスのプラン", pron: "ˈlaɪsns plæn" }
    ],
    situation: "使っていない機能が多いと分かった場面で、プラン変更をコスト削減案として提示するとき。",
    alts: ["A lower plan may be enough for our usage.", "Let us review whether we need the premium edition.", "Switching to the standard plan would save cost."],
    examples: ["We should consider downgrading the license plan to reduce the cost by about 30 percent."]
  },
  {
    id: "a082",
    cat: "license",
    level: "初級",
    en: "The license expires at the end of March, so we need to decide by February.",
    ja: "ライセンスは3月末で期限切れになるため、2月までに判断が必要です。",
    keys: [
      { w: "expires", mean: "期限が切れる", pron: "ɪkˈspaɪərz" },
      { w: "decide by", mean: "〜までに判断する", pron: "dɪˈsaɪd baɪ" }
    ],
    situation: "期限から逆算して、いつまでに社内決裁を取る必要があるかを共有するとき。",
    alts: ["We must make the call one month before expiry.", "The deadline for the decision is February.", "The contract ends in March, so plan backwards."],
    examples: ["The license expires at the end of September, so we need to decide by August."]
  },
  {
    id: "a088",
    cat: "license",
    level: "上級",
    en: "Have you confirmed the license cost with the site that will be charged?",
    ja: "課金される拠点とライセンス費用の確認は取れていますか？",
    keys: [
      { w: "license cost", mean: "ライセンス費用", pron: "ˈlaɪsns kɔːst" },
      { w: "the site that will be charged", mean: "課金される拠点", pron: "ðə saɪt ðæt wɪl bi tʃɑːrdʒd" }
    ],
    situation: "リリース判定会議で、ライセンス費用を負担する拠点と金額の合意が取れているか確認するとき。",
    alts: ["Did you align the license cost with the charged site?", "Has the paying site agreed to the amount?", "Is the cost agreed with the site that bears it?"],
    examples: ["Have you confirmed the license cost with the site that will be charged for ToolY?"]
  },
  {
    id: "a089",
    cat: "license",
    level: "上級",
    en: "Please make sure they have enough remaining budget for this fiscal year before the release.",
    ja: "リリース前に、先方の今年度の残予算が足りているか必ず確認してください。",
    keys: [
      { w: "remaining budget", mean: "残予算", pron: "rɪˈmeɪnɪŋ ˈbʌdʒɪt" },
      { w: "fiscal year", mean: "会計年度・年度", pron: "ˈfɪskl jɪr" }
    ],
    situation: "リリース判定会議で、課金先拠点の年度残予算を事前に確認するよう指示するとき。",
    alts: ["Check their budget balance before we release.", "We must verify that their annual budget still covers this.", "Confirm the remaining amount on their side first."],
    examples: ["Please make sure they have enough remaining budget for this fiscal year before the release of ModuleZ."]
  },
  {
    id: "a090",
    cat: "license",
    level: "初級",
    en: "Have we received approval from the site?",
    ja: "拠点から承認は得られていますか？",
    keys: [
      { w: "received approval", mean: "承認を得た", pron: "rɪˈsiːvd əˈpruːvl" }
    ],
    situation: "リリース判定会議で、課金先拠点からの正式承認が取れているかを確認するとき。",
    alts: ["Do we have their approval already?", "Has the site approved it?", "Is the approval in place?"],
    examples: ["Have we received approval from the site for the additional license cost?"]
  },
  {
    id: "a091",
    cat: "license",
    level: "上級",
    en: "If the cost exceeds their remaining budget, we may need to postpone the release.",
    ja: "費用が先方の残予算を超える場合、リリースを延期する必要があるかもしれません。",
    keys: [
      { w: "exceeds", mean: "超える", pron: "ɪkˈsiːdz" },
      { w: "remaining budget", mean: "残予算", pron: "rɪˈmeɪnɪŋ ˈbʌdʒɪt" },
      { w: "postpone the release", mean: "リリースを延期する", pron: "poʊstˈpoʊn ðə rɪˈliːs" }
    ],
    situation: "リリース判定会議の締めで、予算が足りない場合の判断方針を明言するとき。",
    alts: ["We would have to delay the release in that case.", "A budget shortfall means the release must wait.", "Without budget, the go-live cannot proceed."],
    examples: ["If the cost exceeds their remaining budget, we may need to postpone the release to the next fiscal year."]
  }

];

/* ===================================================================
   シナリオ（会議の流れを通しで練習）  6件
   sc_flagship = アプリの目玉シナリオ（11ステップ）
   =================================================================== */
const SCENARIOS_A = [
  {
    id: "sc_flagship",
    title: "開発進捗確認とリリース判断",
    cat: "progress",
    level: "中級",
    desc: "進捗確認から遅延・リカバリー・人月調整・ライセンス費用・課金先承認を経てリリース可否を判断する一連の流れ。",
    steps: [
      { phrase: "a019", note: "開発状況を確認する" },
      { phrase: "a083", note: "遅延が出ていないかを確認する" },
      { phrase: "a084", note: "遅延の理由を質問する" },
      { phrase: "a085", note: "リカバリープランを確認する" },
      { phrase: "a086", note: "挽回に必要な追加人員を確認する" },
      { phrase: "a087", note: "月別の人月配分を調整する" },
      { phrase: "a088", note: "ライセンス費用を確認する" },
      { phrase: "a072", note: "課金先を確認する" },
      { phrase: "a089", note: "課金先拠点の年度予算残額を確認する" },
      { phrase: "a090", note: "承認の取得状況を確認する" },
      { phrase: "a091", note: "リリース可否を判断する" }
    ]
  },
  {
    id: "sc_a_vendor",
    title: "委託先への作業指示と成果物確認",
    cat: "vendor",
    level: "中級",
    desc: "役割分担の確認から、報告ルールの不備を発見し、原因を質問したうえで指示書・検収基準を整備してサインオフまで進める委託管理の流れ。",
    steps: [
      { phrase: "a018", note: "確認：双方の役割分担を整理する" },
      { phrase: "a010", note: "確認：相手側の担当者を特定する" },
      { phrase: "a009", note: "問題発見：委託契約の作業範囲が曖昧だと気づく" },
      { phrase: "a014", note: "原因質問：まず現状を報告させる" },
      { phrase: "a016", note: "対応策：正式な作業指示書を発行する" },
      { phrase: "a011", note: "対応策：守るべき規約を明示する" },
      { phrase: "a008", note: "対応策：定期報告の頻度を合意する" },
      { phrase: "a017", note: "対応策：問題発生時の即時報告を徹底する" },
      { phrase: "a015", note: "判断：検収基準を納品前に合意する" },
      { phrase: "a012", note: "判断：最終提出前のドラフトレビューを設定する" },
      { phrase: "a005", note: "判断：最終承認（サインオフ）の取得を確認する" }
    ]
  },
  {
    id: "sc_a_progress",
    title: "遅延の緊急報告とリカバリープラン協議",
    cat: "progress",
    level: "上級",
    desc: "作業パッケージ別の報告からベースライン比の遅延を発見し、原因を質問、挽回策を提案したうえで日程維持か再設定かを判断する遅延対応会議。",
    steps: [
      { phrase: "a037", note: "確認：作業パッケージごとに報告を始める" },
      { phrase: "a022", note: "確認：目標と実績を対で示す" },
      { phrase: "a035", note: "問題発見：ベースライン比の遅延量が判明する" },
      { phrase: "a034", note: "原因質問：根本原因とリカバリープランを求める" },
      { phrase: "a031", note: "原因説明：遅延原因を事実として述べる" },
      { phrase: "a025", note: "原因説明：一部挽回したが遅延が残ると伝える" },
      { phrase: "a029", note: "対応策：具体的なリカバリーアクションを示す" },
      { phrase: "a024", note: "対応策：挽回の完了時期を約束する" },
      { phrase: "a036", note: "判断：本番稼働日への影響有無を切り分ける" },
      { phrase: "a027", note: "判断：当初日程を維持すると決める" },
      { phrase: "a038", note: "判断：駄目なら再ベースラインすると合意しておく" }
    ]
  },
  {
    id: "sc_a_manpower",
    title: "要員計画レビューと人月調整",
    cat: "manpower",
    level: "中級",
    desc: "実績反映と稼働率の確認から要員不足を発見し、需要が読めない原因を質問、転用・兼任化を提案して月別人月の配分を決定する要員計画レビュー。",
    steps: [
      { phrase: "a040", note: "確認：要員計画表の更新内容を説明する" },
      { phrase: "a051", note: "確認：稼働率の実績を示す" },
      { phrase: "a050", note: "問題発見：離任予定により要員が不足すると分かる" },
      { phrase: "a042", note: "原因質問：依頼量が読めない事情を聞き出す" },
      { phrase: "a043", note: "原因説明：今後の物量見通しを答える" },
      { phrase: "a047", note: "対応策：必要工数を人月で提示する" },
      { phrase: "a041", note: "対応策：他案件からの要員転用を提案する" },
      { phrase: "a052", note: "対応策：兼任化による人月削減を打診する" },
      { phrase: "a048", note: "判断：要員不足の軽減策を正式に求める" },
      { phrase: "a054", note: "判断：最新見通しで要員計画を更新させる" },
      { phrase: "a039", note: "判断：他に懸念がないか確認して締める" }
    ]
  },
  {
    id: "sc_a_budget",
    title: "年度予算の超過報告と対策協議",
    cat: "budget",
    level: "上級",
    desc: "年度予算の枠と消化状況の確認から超過を発見し、差異の原因を質問、単価再確認と支出凍結を提案して追加予算申請の可否を判断する月次コストレビュー。",
    steps: [
      { phrase: "a064", note: "確認：年度予算の総枠を確認する" },
      { phrase: "a065", note: "確認：残予算の消化状況を報告する" },
      { phrase: "a055", note: "問題発見：予算超過の事実を共有する" },
      { phrase: "a068", note: "原因質問：計画と実績の差異の説明を求める" },
      { phrase: "a061", note: "原因質問：差分が費用側にあるという仮説を確認する" },
      { phrase: "a079", note: "原因説明：主因がライセンス費用だと特定する" },
      { phrase: "a056", note: "原因説明：その費目を除いても超過が残ると補足する" },
      { phrase: "a060", note: "対応策：疑義のある単価の再確認を指示する" },
      { phrase: "a062", note: "対応策：見積の内訳分解を求める" },
      { phrase: "a070", note: "判断：即効策として支出凍結を宣言する" },
      { phrase: "a066", note: "判断：追加予算の申請を決める" }
    ]
  },
  {
    id: "sc_a_license",
    title: "ライセンス費用の課金先調整と承認取得",
    cat: "license",
    level: "中級",
    desc: "必要数量と課金モデルの確認から予算超過の懸念を発見し、原因を質問、折半やプラン変更を提案して課金先と承認の取得方針を判断する調達協議。",
    steps: [
      { phrase: "a074", note: "確認：必要なライセンス数を確認する" },
      { phrase: "a078", note: "確認：課金モデル（ユーザー単位／サーバー単位）を確認する" },
      { phrase: "a077", note: "確認：年額を提示する" },
      { phrase: "a079", note: "問題発見：ライセンス費が予算超過の主因だと分かる" },
      { phrase: "a072", note: "原因質問：課金先を誰にするか問う" },
      { phrase: "a071", note: "原因説明：どの予算で見ているかを明確にする" },
      { phrase: "a081", note: "対応策：プランのダウングレードを提案する" },
      { phrase: "a058", note: "対応策：負担が割れた場合の折半を提案する" },
      { phrase: "a059", note: "判断：最終的な課金先を確定として述べる" },
      { phrase: "a080", note: "判断：署名前に契約書の共有を求める" },
      { phrase: "a076", note: "判断：経営承認を取得する方針を決める" }
    ]
  }
];

if (typeof window !== "undefined") { window.PHRASES_A = PHRASES_A; window.SCENARIOS_A = SCENARIOS_A; }
