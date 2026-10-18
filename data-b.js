/* data-b.js : 報告/売上/リリース/品質/運用保守 */
const PHRASES_B = [
  /* ===================== quality : 品質・テスト ===================== */
  {
    id: "b001",
    cat: "quality",
    level: "初級",
    en: "We found three critical bugs during the integration test.",
    ja: "結合テストで重大なバグを3件検出しました。",
    keys: [
      { w: "critical bugs", mean: "重大な不具合", pron: "ˈkrɪtɪkəl bʌɡz" },
      { w: "integration test", mean: "結合テスト", pron: "ˌɪntɪˈɡreɪʃən test" }
    ],
    situation: "週次進捗会議の品質報告パートで、結合テストの結果として重大度の高い欠陥を共有するとき。",
    alts: ["Three severe defects were detected in the IT phase.", "We identified three blocker issues in the integration test.", "The integration test revealed three critical defects."],
    examples: ["We found two critical bugs during the regression test.", "They found several critical bugs during the system test of ModuleZ."]
  },
  {
    id: "b002",
    cat: "quality",
    level: "初級",
    en: "The defect rate is within the acceptable range.",
    ja: "欠陥率は許容範囲内です。",
    keys: [
      { w: "defect rate", mean: "欠陥率・不具合密度", pron: "ˈdiːfekt reɪt" },
      { w: "acceptable range", mean: "許容範囲", pron: "əkˈseptəbl reɪndʒ" }
    ],
    situation: "月次品質レビューで、品質指標の実績が基準を満たしていることを報告するとき。",
    alts: ["The bug density meets our quality target.", "Defects are under the threshold.", "Quality metrics are within the standard."],
    examples: ["The defect rate is slightly above the acceptable range this month."]
  },
  {
    id: "b003",
    cat: "quality",
    level: "初級",
    en: "UAT will start next Monday as planned.",
    ja: "UATは予定どおり来週月曜に開始します。",
    keys: [
      { w: "UAT", mean: "ユーザー受入テスト", pron: "juː eɪ tiː" },
      { w: "as planned", mean: "予定どおりに", pron: "æz plænd" }
    ],
    situation: "テスト計画の確認会で、受入テストの開始時期を確定事項として周知するとき。",
    alts: ["The user acceptance test begins on Monday.", "UAT kicks off next week as scheduled.", "We are ready to start UAT on time."],
    examples: ["The migration will start next weekend as planned.", "UAT will start one week later than planned."]
  },
  {
    id: "b004",
    cat: "quality",
    level: "初級",
    en: "How many test cases have you executed so far?",
    ja: "これまでにテストケースを何件消化しましたか？",
    keys: [
      { w: "test cases", mean: "テストケース", pron: "test ˈkeɪsɪz" },
      { w: "executed", mean: "実施した・消化した", pron: "ˈeksɪkjuːtɪd" }
    ],
    situation: "テスト進捗の確認会で、海外拠点Bにテスト消化状況を数字で尋ねるとき。",
    alts: ["What is the test execution progress so far?", "How many cases are completed out of the total?", "Could you tell us the number of executed test cases?"],
    examples: ["How many test cases have you executed in the system test phase?"]
  },
  {
    id: "b005",
    cat: "quality",
    level: "中級",
    en: "Could you share the test evidence by tomorrow?",
    ja: "テストエビデンスを明日までに共有していただけますか？",
    keys: [
      { w: "test evidence", mean: "テストの実施記録・証跡", pron: "test ˈevɪdəns" },
      { w: "by tomorrow", mean: "明日までに", pron: "baɪ təˈmɒroʊ" }
    ],
    situation: "品質確認のため、海外拠点Bにテスト実施記録（スクリーンショットやログ）の提出を依頼するとき。",
    alts: ["Please submit the test results by tomorrow.", "We need the evidence documents by EOD tomorrow.", "Could you provide the test logs as well?"],
    examples: ["Could you share the review record by tomorrow?", "Could you share the test evidence for the failed cases?"]
  },
  {
    id: "b006",
    cat: "quality",
    level: "中級",
    en: "An issue was found during user testing due to a missed requirement.",
    ja: "要件漏れにより、ユーザーテストで問題が見つかりました。",
    keys: [
      { w: "user testing", mean: "ユーザーテスト", pron: "ˈjuːzər ˈtestɪŋ" },
      { w: "missed requirement", mean: "要件の漏れ", pron: "mɪst rɪˈkwaɪərmənt" }
    ],
    situation: "遅延や不具合の原因説明で、責任の所在を感情的にならず事実として述べるとき。",
    alts: ["An NG was found during the user test.", "The defect came from a missing requirement.", "The issue was caused by an overlooked requirement."],
    examples: ["An issue was found during user testing due to a wrong parameter setting."]
  },
  {
    id: "b007",
    cat: "quality",
    level: "中級",
    en: "The test coverage of ModuleZ is still below our standard.",
    ja: "ModuleZのテストカバレッジは、まだ当社基準を下回っています。",
    keys: [
      { w: "test coverage", mean: "テスト網羅率", pron: "test ˈkʌvərɪdʒ" },
      { w: "below our standard", mean: "当社基準を下回って", pron: "bɪˈloʊ aʊər ˈstændərd" }
    ],
    situation: "品質レビューで、テストの網羅性が不足していることを具体的な指標で指摘するとき。",
    alts: ["The coverage ratio of ModuleZ does not meet our criteria yet.", "We need more test cases to reach the required coverage.", "The coverage is still insufficient for ModuleZ."],
    examples: ["The test coverage of SystemX is already above our standard."]
  },
  {
    id: "b008",
    cat: "quality",
    level: "中級",
    en: "Twelve defects are still open, and three of them are high severity.",
    ja: "12件の欠陥が未解決で、うち3件は重要度が高いものです。",
    keys: [
      { w: "still open", mean: "未解決のままで", pron: "stɪl ˈoʊpən" },
      { w: "high severity", mean: "重要度が高い", pron: "haɪ sɪˈverɪti" }
    ],
    situation: "品質会議で、未解決欠陥の件数と重要度の内訳を報告するとき。",
    alts: ["We have twelve outstanding defects, three of which are severe.", "Twelve issues remain unresolved, including three major ones.", "There are twelve open tickets and three are high priority."],
    examples: ["Five defects are still open, and one of them is high severity."]
  },
  {
    id: "b009",
    cat: "quality",
    level: "中級",
    en: "The fix has been verified in the staging environment.",
    ja: "修正はステージング環境で検証済みです。",
    keys: [
      { w: "verified", mean: "検証済みの", pron: "ˈverɪfaɪd" },
      { w: "staging environment", mean: "ステージング環境・検証環境", pron: "ˈsteɪdʒɪŋ ɪnˈvaɪrənmənt" }
    ],
    situation: "不具合対応の完了報告で、修正が検証環境で確認済みであることを伝えるとき。",
    alts: ["We confirmed the fix on the staging server.", "The correction was validated in the test environment.", "The patch passed verification in staging."],
    examples: ["The configuration change has been verified in the staging environment."]
  },
  {
    id: "b010",
    cat: "quality",
    level: "上級",
    en: "We will re-run the regression test after the fix is merged.",
    ja: "修正がマージされた後、回帰テストを再実施します。",
    keys: [
      { w: "regression test", mean: "回帰テスト・デグレ確認", pron: "rɪˈɡreʃən test" },
      { w: "merged", mean: "（修正が）取り込まれた", pron: "mɜːrdʒd" }
    ],
    situation: "欠陥修正の対応方針を説明し、デグレード確認まで含めて約束するとき。",
    alts: ["The regression suite will be executed once the fix is in.", "We will run regression again after merging the correction.", "A full regression cycle follows the fix."],
    examples: ["We will re-run the performance test after the tuning is merged."]
  },
  {
    id: "b011",
    cat: "quality",
    level: "上級",
    en: "We need a root cause analysis for every critical defect before sign-off.",
    ja: "承認前に、すべての重大欠陥について根本原因分析が必要です。",
    keys: [
      { w: "root cause analysis", mean: "根本原因分析", pron: "ruːt kɔːz əˈnæləsɪs" },
      { w: "sign-off", mean: "承認・承認サイン", pron: "ˈsaɪn ɒf" }
    ],
    situation: "品質ゲートのレビューで、承認の前提条件として原因分析の提出を求めるとき。",
    alts: ["Each critical defect requires an RCA before we approve.", "Please provide the cause analysis for all severe issues first.", "No sign-off without a root cause report for critical defects."],
    examples: ["We need a root cause analysis for every production incident."]
  },
  {
    id: "b012",
    cat: "quality",
    level: "上級",
    en: "Our exit criteria require zero open blockers at the end of system test.",
    ja: "当社の完了基準では、システムテスト終了時に未解決のブロッカーがゼロであることが求められます。",
    keys: [
      { w: "exit criteria", mean: "工程完了基準", pron: "ˈeksɪt kraɪˈtɪəriə" },
      { w: "blockers", mean: "作業を止める重大障害", pron: "ˈblɒkərz" },
      { w: "system test", mean: "総合テスト", pron: "ˈsɪstəm test" }
    ],
    situation: "工程完了判定の会議で、次工程へ進む条件を明確に示すとき。",
    alts: ["We cannot close the phase while any blocker remains.", "The completion criteria do not allow open blockers.", "Zero blockers is a precondition to exit system test."],
    examples: ["Our exit criteria require a defect rate below the agreed threshold."]
  },
  {
    id: "b013",
    cat: "quality",
    level: "上級",
    en: "The defect trend is flattening, which suggests the quality is stabilizing.",
    ja: "欠陥の検出傾向が鈍化しており、品質が安定してきていることを示しています。",
    keys: [
      { w: "defect trend", mean: "欠陥の検出傾向", pron: "ˈdiːfekt trend" },
      { w: "stabilizing", mean: "安定してきている", pron: "ˈsteɪbəlaɪzɪŋ" }
    ],
    situation: "品質レビューで、欠陥の発生曲線を根拠に品質状況を評価して説明するとき。",
    alts: ["The number of new defects is leveling off.", "The curve shows that quality is settling down.", "Defect detection has slowed, so the product is maturing."],
    examples: ["The defect trend is still rising, so we should not start UAT yet."]
  },

  /* ===================== report : 週次・月次報告 ===================== */
  {
    id: "b014",
    cat: "report",
    level: "初級",
    en: "The target is 69 percent, and the actual is 64 percent.",
    ja: "目標は69％、実績は64％です。",
    keys: [
      { w: "target", mean: "目標（値）", pron: "ˈtɑːrɡɪt" },
      { w: "actual", mean: "実績（値）", pron: "ˈæktʃuəl" }
    ],
    situation: "週次進捗報告の定型。目標と実績を対にして数字を読み上げるとき。",
    alts: ["We are 5 points behind the target.", "Actual progress is 64 percent against the 69 percent target.", "We are slightly below the target this week."],
    examples: ["The target is 90 percent, and the actual is 92 percent."]
  },
  {
    id: "b015",
    cat: "report",
    level: "初級",
    en: "The development is 80 percent complete as of today.",
    ja: "本日時点で開発は80％完了です。",
    keys: [
      { w: "80 percent complete", mean: "80％完了", pron: "ˈeɪti pərˈsent kəmˈpliːt" },
      { w: "as of today", mean: "本日時点で", pron: "æz əv təˈdeɪ" }
    ],
    situation: "週次会議で、担当工程の進捗率を定量的に報告するとき。",
    alts: ["We are 80 percent done with development.", "Progress stands at 80 percent today.", "Coding is almost complete, at 80 percent."],
    examples: ["The test phase is 50 percent complete as of today."]
  },
  {
    id: "b016",
    cat: "report",
    level: "初級",
    en: "We are on schedule so far.",
    ja: "今のところ予定どおりです。",
    keys: [
      { w: "on schedule", mean: "予定どおりで", pron: "ɒn ˈskedʒuːl" },
      { w: "so far", mean: "今のところ", pron: "soʊ fɑːr" }
    ],
    situation: "週次報告で、特に問題がないことを簡潔に伝えるとき。",
    alts: ["Everything is going as planned at this point.", "No delay so far.", "We are on track for now."],
    examples: ["We are behind schedule, but only by two days so far."]
  },
  {
    id: "b017",
    cat: "report",
    level: "初級",
    en: "I will send the updated material in advance.",
    ja: "更新した資料を事前に送付します。",
    keys: [
      { w: "updated material", mean: "更新した資料", pron: "ʌpˈdeɪtɪd məˈtɪəriəl" },
      { w: "in advance", mean: "事前に", pron: "ɪn ədˈvæns" }
    ],
    situation: "レビュー指摘の反映を約束し、次回会議の前に資料を配布すると伝えて締めるとき。",
    alts: ["The revised material will be shared before the meeting.", "I will distribute the update beforehand.", "Please review the material in advance."],
    examples: ["I will send the agenda in advance so that everyone can prepare."]
  },
  {
    id: "b018",
    cat: "report",
    level: "中級",
    en: "We were able to recover slightly, but we are still delayed.",
    ja: "少し挽回できましたが、まだ遅延しています。",
    keys: [
      { w: "recover slightly", mean: "わずかに挽回する", pron: "rɪˈkʌvər ˈslaɪtli" },
      { w: "still delayed", mean: "いまだ遅延している", pron: "stɪl dɪˈleɪd" }
    ],
    situation: "遅延案件の週次報告で、回復傾向と未達の事実を正直に併せて伝えるとき。",
    alts: ["We caught up a little, but not fully yet.", "The delay is shrinking but still remains.", "We are recovering, though still behind schedule."],
    examples: ["We were able to recover slightly, but the gap is still about one week."]
  },
  {
    id: "b019",
    cat: "report",
    level: "中級",
    en: "Last time you reported around 5 percent. What changed?",
    ja: "前回は約5％と報告していましたね。何が変わったのですか？",
    keys: [
      { w: "Last time", mean: "前回は", pron: "læst taɪm" },
      { w: "What changed", mean: "何が変わったのか", pron: "wʌt tʃeɪndʒd" }
    ],
    situation: "月次レビューでレビューア側が、前回報告との数値の食い違いを追及するとき。",
    alts: ["Why is the figure different from the last report?", "What is the reason for the change since last time?", "The number does not match your previous report. Could you explain?"],
    examples: ["Last time you reported two open issues. What changed?"]
  },
  {
    id: "b020",
    cat: "report",
    level: "中級",
    en: "Could you explain the gap from the previous report?",
    ja: "前回報告との差異を説明していただけますか？",
    keys: [
      { w: "gap", mean: "差異・ギャップ", pron: "ɡæp" },
      { w: "previous report", mean: "前回の報告", pron: "ˈpriːviəs rɪˈpɔːrt" }
    ],
    situation: "レポートレビューで、前回資料との差分の背景説明を求めるとき。",
    alts: ["Please walk us through the difference from the last report.", "What accounts for the change since the previous version?", "Could you clarify why the figures moved?"],
    examples: ["Could you explain the gap from the original plan?"]
  },
  {
    id: "b021",
    cat: "report",
    level: "中級",
    en: "We are following up on the delivery sign-off.",
    ja: "納品の承認（サインオフ）をフォローしています。",
    keys: [
      { w: "following up", mean: "追いかけて確認している", pron: "ˈfɒloʊɪŋ ʌp" },
      { w: "sign-off", mean: "承認・承認サイン", pron: "ˈsaɪn ɒf" }
    ],
    situation: "ほぼ完了した案件について、最終承認待ちであることを週次報告で共有するとき。",
    alts: ["We are waiting for the final sign-off.", "The sign-off process is in progress.", "We expect to get the approval today."],
    examples: ["We are following up on the invoice approval with the finance team."]
  },
  {
    id: "b022",
    cat: "report",
    level: "中級",
    en: "The action is to work overtime to recover the delay.",
    ja: "対策として、残業により遅延を挽回します。",
    keys: [
      { w: "work overtime", mean: "残業する", pron: "wɜːrk ˈoʊvərtaɪm" },
      { w: "recover the delay", mean: "遅延を挽回する", pron: "rɪˈkʌvər ðə dɪˈleɪ" }
    ],
    situation: "遅延報告のあとに、具体的なリカバリ策をセットで提示するとき。",
    alts: ["We will put in extra hours to catch up.", "Overtime work is planned for the delay recovery.", "The team will work extra hours this month."],
    examples: ["The action is to add one engineer to recover the delay."]
  },
  {
    id: "b023",
    cat: "report",
    level: "上級",
    en: "Please think about the message of this slide.",
    ja: "このスライドで何を伝えたいのかを考えてください。",
    keys: [
      { w: "message", mean: "伝えたい主旨", pron: "ˈmesɪdʒ" },
      { w: "slide", mean: "スライド", pron: "slaɪd" }
    ],
    situation: "資料レビューで「見せたい論点と目立つ数字がずれている」と指摘するとき。",
    alts: ["What is the key message of this page?", "Reconsider what you want to say with this slide.", "The highlight does not match your main point."],
    examples: ["Please think about the message of this chart before adding more data."]
  },
  {
    id: "b024",
    cat: "report",
    level: "上級",
    en: "It would be better to compare available hours versus actual.",
    ja: "稼働可能時間と実績を比較する方がよいでしょう。",
    keys: [
      { w: "available hours", mean: "稼働可能時間", pron: "əˈveɪləbl ˈaʊərz" },
      { w: "versus actual", mean: "実績との対比で", pron: "ˈvɜːrsəs ˈæktʃuəl" }
    ],
    situation: "グラフの比較軸が適切でないとき、改善フィードバックとして代替案を示す場面。",
    alts: ["Please redesign the chart using actual figures as the baseline.", "Comparing with the forecast hides the real problem.", "A capacity-versus-actual view would be clearer."],
    examples: ["It would be better to compare the budget versus actual by month."]
  },
  {
    id: "b025",
    cat: "report",
    level: "上級",
    en: "The variance against the plan is mainly caused by the additional support hours.",
    ja: "計画との差異は、主に追加のサポート工数によるものです。",
    keys: [
      { w: "variance", mean: "差異・乖離", pron: "ˈveəriəns" },
      { w: "against the plan", mean: "計画に対して", pron: "əˈɡenst ðə plæn" },
      { w: "support hours", mean: "サポート工数", pron: "səˈpɔːrt ˈaʊərz" }
    ],
    situation: "月次報告で、計画と実績の乖離の原因を分解して説明するとき。",
    alts: ["The deviation from the plan comes mostly from extra support work.", "Additional support effort explains most of the difference.", "The gap is driven by unplanned support hours."],
    examples: ["The variance against the plan is mainly caused by the license cost."]
  },
  {
    id: "b026",
    cat: "report",
    level: "上級",
    en: "Let me walk you through the monthly report page by page.",
    ja: "月次報告を1ページずつご説明します。",
    keys: [
      { w: "walk you through", mean: "順を追って説明する", pron: "wɔːk juː θruː" },
      { w: "page by page", mean: "1ページずつ", pron: "peɪdʒ baɪ peɪdʒ" }
    ],
    situation: "月次レビューの冒頭で、資料の説明を始めることを宣言するとき。",
    alts: ["I will go through the monthly report one page at a time.", "Let me take you through the report section by section.", "I will start from page one of the monthly report."],
    examples: ["Let me walk you through the test results page by page."]
  },

  /* ===================== sales : 売上・ビジネス ===================== */
  {
    id: "b027",
    cat: "sales",
    level: "初級",
    en: "We are exceeding budget.",
    ja: "予算を超過しています。",
    keys: [
      { w: "exceeding budget", mean: "予算を超過している", pron: "ɪkˈsiːdɪŋ ˈbʌdʒɪt" }
    ],
    situation: "コスト実績レビューで、予算超過という課題を率直に共有するとき。",
    alts: ["We are over budget.", "Costs have exceeded the plan.", "The spending is above the approved amount."],
    examples: ["We are exceeding budget by about ten percent this quarter."]
  },
  {
    id: "b028",
    cat: "sales",
    level: "初級",
    en: "This PO will be charged to the overseas site only.",
    ja: "このPOは海外拠点のみに請求されます。",
    keys: [
      { w: "PO", mean: "発注書（Purchase Order）", pron: "piː oʊ" },
      { w: "charged", mean: "請求される", pron: "tʃɑːrdʒd" }
    ],
    situation: "費用の負担部門（請求先）を関係者間で明確化するとき。",
    alts: ["The cost will be billed to the overseas site.", "This charge applies only to the overseas site.", "The Japan site will not be charged for this PO."],
    examples: ["This PO will be charged to the Japan site only."]
  },
  {
    id: "b029",
    cat: "sales",
    level: "初級",
    en: "Sales did not reach the target because the projects slipped.",
    ja: "プロジェクトの後ろ倒しにより、売上は目標に届きませんでした。",
    keys: [
      { w: "Sales", mean: "売上", pron: "seɪlz" },
      { w: "reach the target", mean: "目標に達する", pron: "riːtʃ ðə ˈtɑːrɡɪt" },
      { w: "slipped", mean: "後ろ倒しになった", pron: "slɪpt" }
    ],
    situation: "四半期レビューで売上未達の理由を説明するとき。",
    alts: ["We missed the sales target due to project delays.", "Sales fell short because of the schedule slippage.", "The revenue target was not achieved this quarter."],
    examples: ["Sales did not reach the target because two orders moved to the next quarter."]
  },
  {
    id: "b030",
    cat: "sales",
    level: "初級",
    en: "The monthly cost is about 60,000, with no additional headcount.",
    ja: "月額コストは約6万で、追加の要員はありません。",
    keys: [
      { w: "monthly cost", mean: "月額コスト", pron: "ˈmʌnθli kɒst" },
      { w: "additional headcount", mean: "追加の要員数", pron: "əˈdɪʃənl ˈhedkaʊnt" }
    ],
    situation: "拡張サポートの提案で、金額と前提（増員なし・手当のみ）を説明するとき。",
    alts: ["It only covers the night differential and the weekend allowance.", "No extra people are needed, just the allowances.", "The fee is 60K per month without new members."],
    examples: ["The monthly cost is about 120,000, with two additional engineers."]
  },
  {
    id: "b031",
    cat: "sales",
    level: "中級",
    en: "I suggest we divide it into half.",
    ja: "半分に分けることを提案します。",
    keys: [
      { w: "divide it into half", mean: "折半する", pron: "dɪˈvaɪd ɪt ˈɪntuː hæf" }
    ],
    situation: "費用負担をめぐる交渉で、折半案を提示するとき。",
    alts: ["How about splitting it fifty-fifty?", "Let us share the cost equally.", "I propose an equal distribution between the two sites."],
    examples: ["I suggest we divide it into half, 50 percent for each site."]
  },
  {
    id: "b032",
    cat: "sales",
    level: "中級",
    en: "Even if we remove that cost, the budget is still exceeded.",
    ja: "そのコストを除いても、まだ予算を超過しています。",
    keys: [
      { w: "remove that cost", mean: "その費用を除く", pron: "rɪˈmuːv ðæt kɒst" },
      { w: "still exceeded", mean: "なお超過している", pron: "stɪl ɪkˈsiːdɪd" }
    ],
    situation: "予算超過の原因を切り分けながら、単一要因では説明できないことを示すとき。",
    alts: ["The budget overrun remains even without that item.", "Removing that portion does not solve the overrun.", "We still need extra budget for the exceeding part."],
    examples: ["Even if we remove the license fee, the budget is still exceeded."]
  },
  {
    id: "b033",
    cat: "sales",
    level: "中級",
    en: "That rate feels too high. Please reconfirm it.",
    ja: "その単価は高すぎる気がします。再確認してください。",
    keys: [
      { w: "rate", mean: "単価・レート", pron: "reɪt" },
      { w: "reconfirm", mean: "再確認する", pron: "ˌriːkənˈfɜːrm" }
    ],
    situation: "コストレビューで、借用要員などの単価に疑義を示し再確認を依頼するとき。",
    alts: ["The unit price seems expensive. Could you double-check it?", "Please go back and verify the rate with the manager.", "I do not expect such a big jump in the rate."],
    examples: ["That rate feels too high for a junior engineer. Please reconfirm it."]
  },
  {
    id: "b034",
    cat: "sales",
    level: "中級",
    en: "We need to justify the benefit for the customer.",
    ja: "先方にとってのメリットを説明できる必要があります。",
    keys: [
      { w: "justify", mean: "（費用などを）正当化する", pron: "ˈdʒʌstɪfaɪ" },
      { w: "benefit", mean: "便益・メリット", pron: "ˈbenɪfɪt" }
    ],
    situation: "追加費用の提案にあたり、相手が得る価値を明確にするよう指示するとき。",
    alts: ["We must show clear value for the fee.", "The customer needs a reason to pay for it.", "Please propose something attractive for them."],
    examples: ["We need to justify the benefit for the overseas site before raising the fee."]
  },
  {
    id: "b035",
    cat: "sales",
    level: "中級",
    en: "The contract signing target is September, and the official start is October.",
    ja: "契約締結の目標は9月、正式開始は10月です。",
    keys: [
      { w: "contract signing", mean: "契約締結", pron: "ˈkɒntrækt ˈsaɪnɪŋ" },
      { w: "official start", mean: "正式開始", pron: "əˈfɪʃəl stɑːrt" }
    ],
    situation: "提案から契約・サービス開始までのタイムラインを整理して示すとき。",
    alts: ["We propose in August, sign in September, and start in October.", "The internal approval is targeted for September.", "The service officially begins in October."],
    examples: ["The contract signing target is March, and the official start is April."]
  },
  {
    id: "b036",
    cat: "sales",
    level: "上級",
    en: "Our revenue forecast for the second half is roughly ten percent above this year.",
    ja: "下期の売上見通しは、今年度比で約10％増です。",
    keys: [
      { w: "revenue forecast", mean: "売上見通し", pron: "ˈrevənuː ˈfɔːrkæst" },
      { w: "second half", mean: "下期", pron: "ˈsekənd hæf" }
    ],
    situation: "事業計画のレビューで、下期の売上見込みを前年比で説明するとき。",
    alts: ["We expect about ten percent growth in the second half.", "The H2 outlook is roughly 110 percent of this year.", "Second-half revenue should exceed this year by ten percent."],
    examples: ["Our revenue forecast for the next quarter is slightly below the plan."]
  },
  {
    id: "b037",
    cat: "sales",
    level: "上級",
    en: "The profit margin dropped because we absorbed the extra support cost.",
    ja: "追加のサポート費用を自社で負担したため、利益率が低下しました。",
    keys: [
      { w: "profit margin", mean: "利益率", pron: "ˈprɒfɪt ˈmɑːrdʒɪn" },
      { w: "absorbed", mean: "（費用を）自社で吸収した", pron: "əbˈzɔːrbd" }
    ],
    situation: "損益レビューで、利益率が落ちた理由を構造的に説明するとき。",
    alts: ["Margins fell because the extra support was not billed.", "We took the additional cost on our side, so the margin went down.", "The income ratio decreased due to unbilled support work."],
    examples: ["The profit margin dropped because the exchange rate moved against us."]
  },
  {
    id: "b038",
    cat: "sales",
    level: "上級",
    en: "If they refuse, we will escalate to the executive level.",
    ja: "先方が断った場合は、役員レベルにエスカレーションします。",
    keys: [
      { w: "escalate", mean: "上位層に引き上げる", pron: "ˈeskəleɪt" },
      { w: "executive level", mean: "役員レベル", pron: "ɪɡˈzekjətɪv ˈlevl" }
    ],
    situation: "交渉が難航した場合の対応方針を、会議の中で事前に決めておくとき。",
    alts: ["Worst case, we escalate further.", "We should use the executive channel if needed.", "Let us raise it to the management if they do not agree."],
    examples: ["If the issue is not resolved this week, we will escalate to the executive level."]
  },
  {
    id: "b039",
    cat: "sales",
    level: "上級",
    en: "We should secure the budget approval before the fiscal year ends.",
    ja: "年度内に予算承認を取り付けておくべきです。",
    keys: [
      { w: "budget approval", mean: "予算承認", pron: "ˈbʌdʒɪt əˈpruːvl" },
      { w: "fiscal year", mean: "会計年度", pron: "ˈfɪskəl jɪər" }
    ],
    situation: "予算執行計画の議論で、社内承認を取り付ける期限感を共有するとき。",
    alts: ["The budget must be approved within this fiscal year.", "Let us complete the internal approval before year-end.", "We need the funding confirmed before the year closes."],
    examples: ["We should secure the budget approval before the PO is issued."]
  },

  /* ===================== release : リリース ===================== */
  {
    id: "b040",
    cat: "release",
    level: "初級",
    en: "The release date is fixed for the end of October.",
    ja: "リリース日は10月末で確定しています。",
    keys: [
      { w: "release date", mean: "リリース日", pron: "rɪˈliːs deɪt" },
      { w: "fixed", mean: "確定した", pron: "fɪkst" }
    ],
    situation: "リリース計画の確認会で、予定日が確定済みであることを共有するとき。",
    alts: ["We have confirmed the end of October as the release date.", "The go-live is set for late October.", "October 31st is the agreed release date."],
    examples: ["The release date is fixed for the first week of April."]
  },
  {
    id: "b041",
    cat: "release",
    level: "初級",
    en: "It might be moved from July to August.",
    ja: "7月から8月に後ろ倒しになるかもしれません。",
    keys: [
      { w: "moved from July to August", mean: "7月から8月に後ろ倒しになる", pron: "muːvd frəm dʒʊˈlaɪ tuː ˈɔːɡəst" }
    ],
    situation: "リリース時期が後ろ倒しになる可能性を、確定前に早めに共有するとき。",
    alts: ["The schedule may slip to August.", "It could be postponed to August.", "There is a chance of moving it to August."],
    examples: ["The cutover might be moved from Saturday to Sunday."]
  },
  {
    id: "b042",
    cat: "release",
    level: "初級",
    en: "The milestone review is scheduled for Friday.",
    ja: "マイルストーンレビューは金曜日に予定されています。",
    keys: [
      { w: "milestone review", mean: "マイルストーンレビュー", pron: "ˈmaɪlstoʊn rɪˈvjuː" },
      { w: "scheduled", mean: "予定されている", pron: "ˈskedʒuːld" }
    ],
    situation: "工程の節目レビューの日程を、関係者に確認・周知するとき。",
    alts: ["The phase-gate review is on Friday.", "We will hold the milestone meeting this week.", "Friday is the checkpoint review."],
    examples: ["The Go/No-Go review is scheduled for next Tuesday."]
  },
  {
    id: "b043",
    cat: "release",
    level: "初級",
    en: "Are we ready for the release this weekend?",
    ja: "今週末のリリース準備は整っていますか？",
    keys: [
      { w: "ready for the release", mean: "リリースの準備ができている", pron: "ˈredi fər ðə rɪˈliːs" }
    ],
    situation: "リリース直前の確認会で、各チームに準備状況を一斉に確認するとき。",
    alts: ["Is everything in place for the weekend release?", "Can we confirm that we are ready to release?", "Are there any blockers for this weekend?"],
    examples: ["Are we ready for the release of ModuleZ next month?"]
  },
  {
    id: "b044",
    cat: "release",
    level: "中級",
    en: "This is a potential risk for the go-live schedule.",
    ja: "これは本番稼働スケジュールに対する潜在リスクです。",
    keys: [
      { w: "potential risk", mean: "潜在リスク", pron: "pəˈtenʃəl rɪsk" },
      { w: "go-live", mean: "本番稼働", pron: "ˈɡoʊ laɪv" }
    ],
    situation: "稼働時期に影響し得る事象を、リスクとして早期に提起するとき。",
    alts: ["This may impact the go-live date.", "It could be a risk to the cutover plan.", "We should flag this as a schedule risk."],
    examples: ["The license delay is a potential risk for the go-live schedule."]
  },
  {
    id: "b045",
    cat: "release",
    level: "中級",
    en: "We will negotiate a new target release schedule with the user.",
    ja: "ユーザーと新しいリリース目標日を交渉します。",
    keys: [
      { w: "negotiate", mean: "交渉する", pron: "nɪˈɡoʊʃieɪt" },
      { w: "target release schedule", mean: "リリース目標日程", pron: "ˈtɑːrɡɪt rɪˈliːs ˈskedʒuːl" }
    ],
    situation: "追加要件や不具合でリリースが間に合わないとき、日程再設定を対策として示す場面。",
    alts: ["We will discuss a revised release date with the user.", "The release schedule needs to be re-negotiated.", "We will agree on a new target date with them."],
    examples: ["We will negotiate a new target release schedule with the overseas site."]
  },
  {
    id: "b046",
    cat: "release",
    level: "中級",
    en: "The Go decision requires approval from both sites.",
    ja: "Go判断には、両拠点の承認が必要です。",
    keys: [
      { w: "Go decision", mean: "リリース実施の判断", pron: "ɡoʊ dɪˈsɪʒən" },
      { w: "approval", mean: "承認", pron: "əˈpruːvl" }
    ],
    situation: "Go/No-Go会議で、承認プロセスと承認者の範囲を確認するとき。",
    alts: ["Both sites must sign off before we go.", "We cannot proceed without approval from each side.", "The decision has to be joint between the two sites."],
    examples: ["The No-Go decision requires approval from the project owner only."]
  },
  {
    id: "b047",
    cat: "release",
    level: "中級",
    en: "Let me confirm the rollback plan before we proceed.",
    ja: "進める前に、切り戻し計画を確認させてください。",
    keys: [
      { w: "rollback plan", mean: "切り戻し計画", pron: "ˈroʊlbæk plæn" },
      { w: "proceed", mean: "進める", pron: "prəˈsiːd" }
    ],
    situation: "リリース判定会議で、失敗時の復旧手順が用意されているかを確認するとき。",
    alts: ["Could you walk us through the fallback procedure first?", "Before we proceed, what is the recovery plan if it fails?", "Please confirm how we revert if something goes wrong."],
    examples: ["Let me confirm the test data preparation before we proceed."]
  },
  {
    id: "b048",
    cat: "release",
    level: "中級",
    en: "All release criteria have been met except the performance test.",
    ja: "性能テストを除き、リリース基準はすべて満たされています。",
    keys: [
      { w: "release criteria", mean: "リリース判定基準", pron: "rɪˈliːs kraɪˈtɪəriə" },
      { w: "performance test", mean: "性能テスト", pron: "pərˈfɔːrməns test" }
    ],
    situation: "Go/No-Go会議の冒頭で、判定基準の充足状況を一覧で報告するとき。",
    alts: ["We satisfy every release condition but the performance one.", "Only the performance test remains open against the criteria.", "The checklist is complete except for performance."],
    examples: ["All release criteria have been met except the sign-off from the user."]
  },
  {
    id: "b049",
    cat: "release",
    level: "上級",
    en: "I would rather declare No-Go than release with an unresolved blocker.",
    ja: "未解決のブロッカーを抱えてリリースするくらいなら、No-Goと判断したいです。",
    keys: [
      { w: "No-Go", mean: "リリース見送りの判断", pron: "noʊ ɡoʊ" },
      { w: "unresolved blocker", mean: "未解決の重大障害", pron: "ˌʌnrɪˈzɒlvd ˈblɒkər" }
    ],
    situation: "Go/No-Go会議で、品質を優先してリリース見送りを主張するとき。",
    alts: ["Releasing with an open blocker is not acceptable to me.", "My recommendation is No-Go until the blocker is closed.", "I prefer to postpone rather than ship a known blocker."],
    examples: ["I would rather delay one week than release with an unresolved blocker."]
  },
  {
    id: "b050",
    cat: "release",
    level: "上級",
    en: "The cutover window is six hours, from ten in the evening to four in the morning.",
    ja: "切替作業の実施枠は、夜10時から朝4時までの6時間です。",
    keys: [
      { w: "cutover window", mean: "切替作業の実施時間枠", pron: "ˈkʌtoʊvər ˈwɪndoʊ" },
      { w: "six hours", mean: "6時間", pron: "sɪks ˈaʊərz" }
    ],
    situation: "本番切替の作業計画を共有し、作業可能な時間帯を明示するとき。",
    alts: ["We have a six-hour slot overnight for the switchover.", "The maintenance slot runs from 22:00 to 04:00.", "Our migration window is limited to six hours."],
    examples: ["The cutover window is four hours, so we must automate the data transfer."]
  },
  {
    id: "b051",
    cat: "release",
    level: "上級",
    en: "Who has the final authority to approve the go-live?",
    ja: "本番稼働を最終承認する権限は誰にありますか？",
    keys: [
      { w: "final authority", mean: "最終的な決裁権限", pron: "ˈfaɪnl əˈθɒrɪti" },
      { w: "go-live", mean: "本番稼働", pron: "ˈɡoʊ laɪv" }
    ],
    situation: "判断が割れたときに、最終決裁者が誰かを会議の場で明確にするとき。",
    alts: ["Who makes the final call on the release?", "Which role signs off the go-live decision?", "Could you clarify the final decision maker?"],
    examples: ["Who has the final authority to approve the additional budget?"]
  },
  {
    id: "b052",
    cat: "release",
    level: "上級",
    en: "We will hold the Go/No-Go meeting two days before the cutover.",
    ja: "切替の2日前にGo/No-Go会議を開催します。",
    keys: [
      { w: "Go/No-Go meeting", mean: "リリース可否判定会議", pron: "ɡoʊ noʊ ɡoʊ ˈmiːtɪŋ" },
      { w: "cutover", mean: "本番切替", pron: "ˈkʌtoʊvər" }
    ],
    situation: "リリース計画の説明で、判定のタイミングを確定して関係者に伝えるとき。",
    alts: ["The release decision meeting is set for two days prior.", "We will make the final call 48 hours before the switchover.", "A Go/No-Go checkpoint is planned just before the cutover."],
    examples: ["We will hold the Go/No-Go meeting right after the performance test."]
  },

  /* ===================== ops : 運用保守 ===================== */
  {
    id: "b053",
    cat: "ops",
    level: "初級",
    en: "The root cause is still under investigation.",
    ja: "根本原因はまだ調査中です。",
    keys: [
      { w: "root cause", mean: "根本原因", pron: "ruːt kɔːz" },
      { w: "under investigation", mean: "調査中で", pron: "ˈʌndər ɪnˌvestɪˈɡeɪʃən" }
    ],
    situation: "障害対応の進捗報告で、原因分析がまだ終わっていないことを伝えるとき。",
    alts: ["We are still analyzing the root cause.", "The investigation is on-going.", "We will report the cause by tomorrow."],
    examples: ["The data mismatch is still under investigation."]
  },
  {
    id: "b054",
    cat: "ops",
    level: "初級",
    en: "There is a two-day delay due to the environment issue.",
    ja: "環境の問題により2日の遅延が発生しています。",
    keys: [
      { w: "two-day delay", mean: "2日の遅延", pron: "tuː deɪ dɪˈleɪ" },
      { w: "environment issue", mean: "環境起因の問題", pron: "ɪnˈvaɪrənmənt ˈɪʃuː" }
    ],
    situation: "遅延の事実と原因をセットで、週次の運用報告として伝えるとき。",
    alts: ["We are two days behind because of the environment trouble.", "The environment problem caused a short delay.", "There is a slight slippage of two days."],
    examples: ["There is a one-week delay due to the license issue of ToolY."]
  },
  {
    id: "b055",
    cat: "ops",
    level: "初級",
    en: "Who will take ownership of this issue?",
    ja: "この課題のオーナーは誰になりますか？",
    keys: [
      { w: "take ownership", mean: "責任を持って引き取る", pron: "teɪk ˈoʊnərʃɪp" },
      { w: "issue", mean: "課題・事象", pron: "ˈɪʃuː" }
    ],
    situation: "障害や課題の担当者が曖昧なとき、責任者をその場で明確にするための問いかけ。",
    alts: ["Who is responsible for this item?", "Can someone own this issue?", "Please assign an owner to this task."],
    examples: ["Who will take ownership of the monitoring setup?"]
  },
  {
    id: "b056",
    cat: "ops",
    level: "初級",
    en: "The system has been back to normal since nine this morning.",
    ja: "システムは本日午前9時から正常に戻っています。",
    keys: [
      { w: "back to normal", mean: "正常な状態に戻って", pron: "bæk tuː ˈnɔːrml" }
    ],
    situation: "障害の第一報の後、復旧状況を会議の冒頭で報告するとき。",
    alts: ["Service was restored at nine this morning.", "Everything is running normally again since 9 a.m.", "The system recovered this morning and is stable now."],
    examples: ["The batch process has been back to normal since last night."]
  },
  {
    id: "b057",
    cat: "ops",
    level: "中級",
    en: "We applied a temporary workaround to restore the service.",
    ja: "サービスを復旧させるため、暫定対応を適用しました。",
    keys: [
      { w: "temporary workaround", mean: "暫定的な回避策", pron: "ˈtempəreri ˈwɜːrkəraʊnd" },
      { w: "restore the service", mean: "サービスを復旧させる", pron: "rɪˈstɔːr ðə ˈsɜːrvɪs" }
    ],
    situation: "障害報告で、恒久対応の前にまず実施した暫定処置を説明するとき。",
    alts: ["A provisional fix was applied to bring the service back.", "We used a quick workaround for recovery.", "The service was recovered with a temporary measure."],
    examples: ["We applied a temporary workaround to keep the daily batch running."]
  },
  {
    id: "b058",
    cat: "ops",
    level: "中級",
    en: "Please report the incident to the service desk immediately.",
    ja: "インシデントは直ちにサービスデスクへ報告してください。",
    keys: [
      { w: "incident", mean: "障害・インシデント", pron: "ˈɪnsɪdənt" },
      { w: "service desk", mean: "サービスデスク・受付窓口", pron: "ˈsɜːrvɪs desk" }
    ],
    situation: "運用ルールの確認として、海外拠点Bに障害発生時の連絡手順を徹底するとき。",
    alts: ["Any incident must be logged with the service desk right away.", "Please raise a ticket as soon as you detect a failure.", "Notify the help desk without delay."],
    examples: ["Please report the incident to the operation team immediately."]
  },
  {
    id: "b059",
    cat: "ops",
    level: "中級",
    en: "The permanent fix is planned for the next maintenance window.",
    ja: "恒久対応は次回のメンテナンス枠で実施予定です。",
    keys: [
      { w: "permanent fix", mean: "恒久対応・恒久修正", pron: "ˈpɜːrmənənt fɪks" },
      { w: "maintenance window", mean: "保守作業の実施枠", pron: "ˈmeɪntənəns ˈwɪndoʊ" }
    ],
    situation: "暫定対応の報告に続けて、恒久対応の実施時期を示すとき。",
    alts: ["We will deploy the permanent correction in the next maintenance slot.", "The final fix goes in during the scheduled downtime.", "A full fix is planned for the coming maintenance."],
    examples: ["The permanent fix is planned for the release at the end of this month."]
  },
  {
    id: "b060",
    cat: "ops",
    level: "中級",
    en: "How many support tickets did you receive last month?",
    ja: "先月は何件の問い合わせチケットを受け付けましたか？",
    keys: [
      { w: "support tickets", mean: "問い合わせ・保守依頼の件数", pron: "səˈpɔːrt ˈtɪkɪts" },
      { w: "last month", mean: "先月", pron: "læst mʌnθ" }
    ],
    situation: "月次の運用報告で、問い合わせ量の実績を海外拠点Bに確認するとき。",
    alts: ["What was the ticket volume last month?", "Could you share the number of inquiries in the last month?", "How many cases were raised in the previous month?"],
    examples: ["How many support tickets did you close within the SLA?"]
  },
  {
    id: "b061",
    cat: "ops",
    level: "中級",
    en: "The batch job failed again last night, and we restarted it manually.",
    ja: "昨夜もバッチ処理が失敗したため、手動で再実行しました。",
    keys: [
      { w: "batch job", mean: "バッチ処理", pron: "bætʃ dʒɒb" },
      { w: "restarted it manually", mean: "手動で再実行した", pron: "riːˈstɑːrtɪd ɪt ˈmænjuəli" }
    ],
    situation: "日次運用の報告で、繰り返し発生している障害事象を共有するとき。",
    alts: ["The nightly batch aborted again, so we re-ran it by hand.", "We had another batch failure and recovered it manually.", "The job ended abnormally last night and required a manual rerun."],
    examples: ["The data transfer failed again last night, and we restarted it manually."]
  },
  {
    id: "b062",
    cat: "ops",
    level: "上級",
    en: "We are still within the SLA, but the response time is close to the limit.",
    ja: "SLAの範囲内ではありますが、応答時間が上限に近づいています。",
    keys: [
      { w: "SLA", mean: "サービス品質保証契約", pron: "es el eɪ" },
      { w: "response time", mean: "応答時間・初動時間", pron: "rɪˈspɒns taɪm" }
    ],
    situation: "運用品質のレビューで、契約違反ではないが悪化傾向にあることを警告するとき。",
    alts: ["We meet the SLA, but the margin is very thin.", "Response times are approaching the contractual threshold.", "We have not breached the SLA yet, though the trend is worrying."],
    examples: ["We are still within the SLA, but the ticket backlog is growing."]
  },
  {
    id: "b063",
    cat: "ops",
    level: "上級",
    en: "To prevent recurrence, we will add a monitoring alert on ModuleZ.",
    ja: "再発防止のため、ModuleZに監視アラートを追加します。",
    keys: [
      { w: "prevent recurrence", mean: "再発を防止する", pron: "prɪˈvent rɪˈkɜːrəns" },
      { w: "monitoring alert", mean: "監視アラート", pron: "ˈmɒnɪtərɪŋ əˈlɜːrt" }
    ],
    situation: "障害の恒久対応として、検知の仕組みを含む再発防止策を提案するとき。",
    alts: ["As a preventive action, we will set up an alert for ModuleZ.", "We will introduce monitoring so that the same failure is detected earlier.", "An automatic alert will be configured to avoid a repeat."],
    examples: ["To prevent recurrence, we will add a validation check in the batch job."]
  },
  {
    id: "b064",
    cat: "ops",
    level: "上級",
    en: "Let us schedule a post-incident review with the operation team at the overseas site.",
    ja: "海外拠点の運用チームと障害振り返り会を設定しましょう。",
    keys: [
      { w: "post-incident review", mean: "障害後の振り返り会", pron: "poʊst ˈɪnsɪdənt rɪˈvjuː" },
      { w: "operation team", mean: "運用チーム", pron: "ˌɒpəˈreɪʃən tiːm" }
    ],
    situation: "障害が収束した後、再発防止と学びの共有のために振り返りの場を設定するとき。",
    alts: ["We should hold a lessons-learned session with the operation side.", "Let us arrange a retrospective on this incident.", "A review meeting with the operators would help us improve."],
    examples: ["Let us schedule a post-incident review before the next release."]
  },
  {
    id: "b065",
    cat: "ops",
    level: "上級",
    en: "The same failure happened three times this quarter, so a permanent countermeasure is required.",
    ja: "同じ障害が今四半期に3回発生しているため、恒久対策が必要です。",
    keys: [
      { w: "same failure", mean: "同一の障害", pron: "seɪm ˈfeɪljər" },
      { w: "permanent countermeasure", mean: "恒久対策", pron: "ˈpɜːrmənənt ˈkaʊntərmeʒər" }
    ],
    situation: "繰り返す障害について、暫定対応の継続ではなく抜本対策を求めるとき。",
    alts: ["This is the third occurrence this quarter, so we need a structural fix.", "Repeated failures mean the workaround is not enough.", "We must stop treating the symptom and solve the cause."],
    examples: ["The same failure happened twice last month, so a permanent countermeasure is required."]
  }
];

const SCENARIOS_B = [
  {
    id: "sc_b1",
    title: "月次報告と計画差異の説明",
    cat: "report",
    level: "中級",
    desc: "月次レポートの実績を報告し、前回報告や計画との差異の原因を説明したうえで、資料改善と挽回策まで約束する流れ。",
    steps: [
      { phrase: "b026", note: "資料の説明を始めることを宣言する" },
      { phrase: "b015", note: "開発工程の進捗率を報告する" },
      { phrase: "b014", note: "目標と実績の数字を対で示す" },
      { phrase: "b018", note: "挽回はしたが遅延が残っていることを正直に伝える" },
      { phrase: "b020", note: "レビューア側が前回報告との差異の説明を求める" },
      { phrase: "b019", note: "レビューア側が数値が変わった理由を追及する" },
      { phrase: "b025", note: "差異の主因が追加サポート工数であると説明する" },
      { phrase: "b023", note: "レビューア側が資料の伝えたい主旨を見直すよう指摘する" },
      { phrase: "b024", note: "グラフの比較軸を変えるよう具体的に助言する" },
      { phrase: "b022", note: "遅延に対するリカバリ策を提示する" },
      { phrase: "b017", note: "修正資料の事前送付を約束して締める" }
    ]
  },
  {
    id: "sc_b2",
    title: "売上未達の報告と追加費用の交渉",
    cat: "sales",
    level: "上級",
    desc: "売上未達と予算超過を報告し、原因を切り分けたうえで、追加サポートの有償提案と費用負担の交渉、承認期限の確認まで進める流れ。",
    steps: [
      { phrase: "b029", note: "売上が目標未達であることと理由を報告する" },
      { phrase: "b037", note: "利益率が低下した構造的な理由を説明する" },
      { phrase: "b027", note: "予算超過という課題を率直に共有する" },
      { phrase: "b032", note: "単一要因では説明できないことを切り分けて示す" },
      { phrase: "b033", note: "上長側が単価に疑義を示し再確認を依頼する" },
      { phrase: "b034", note: "上長側が追加費用には顧客メリットの説明が必要だと指摘する" },
      { phrase: "b030", note: "提案金額と前提（増員なし）を具体的に示す" },
      { phrase: "b031", note: "費用負担の折半を提案する" },
      { phrase: "b035", note: "契約締結とサービス開始のタイムラインを示す" },
      { phrase: "b038", note: "先方に断られた場合のエスカレーション方針を事前に決めておく" },
      { phrase: "b039", note: "年度内の予算承認取得という期限を確認して締める" }
    ]
  },
  {
    id: "sc_b3",
    title: "Go/No-Go 判定会議",
    cat: "release",
    level: "上級",
    desc: "リリース判定基準の充足状況を確認し、重大バグというリスクを発見して、切り戻し計画と承認プロセスを確認したうえで、No-Go と日程再交渉を判断する流れ。",
    steps: [
      { phrase: "b040", note: "確定しているリリース日を共有して議論を始める" },
      { phrase: "b048", note: "判定基準の充足状況を一覧で報告する" },
      { phrase: "b001", note: "結合テストで重大バグが見つかったことを報告する" },
      { phrase: "b044", note: "本番稼働スケジュールへのリスクとして提起する" },
      { phrase: "b047", note: "失敗時の切り戻し計画が用意されているか確認する" },
      { phrase: "b050", note: "切替作業に使える時間枠を確認する" },
      { phrase: "b052", note: "判定会議の実施タイミングを確定する" },
      { phrase: "b046", note: "承認者の範囲（両拠点）を確認する" },
      { phrase: "b051", note: "最終決裁権限者を明確にする" },
      { phrase: "b049", note: "品質を優先して No-Go を主張する" },
      { phrase: "b045", note: "ユーザーと新しいリリース日を交渉すると決める" }
    ]
  },
  {
    id: "sc_b4",
    title: "結合テスト結果レビューと品質判定",
    cat: "quality",
    level: "中級",
    desc: "テスト消化状況と欠陥実績を確認し、重大バグと要件漏れを掘り下げ、根本原因分析とエビデンス提出を求めたうえで、完了基準に照らして判断する流れ。",
    steps: [
      { phrase: "b004", note: "テストケースの消化状況を数字で確認する" },
      { phrase: "b002", note: "欠陥率の実績が基準内であることを報告する" },
      { phrase: "b001", note: "重大バグを3件検出したことを共有する" },
      { phrase: "b008", note: "未解決欠陥の件数と重要度の内訳を示す" },
      { phrase: "b006", note: "要件漏れという発生原因を説明する" },
      { phrase: "b011", note: "承認の前提として根本原因分析を求める" },
      { phrase: "b007", note: "テストカバレッジ不足という追加の問題を指摘する" },
      { phrase: "b005", note: "テストエビデンスの提出を期限付きで依頼する" },
      { phrase: "b010", note: "修正後に回帰テストを再実施すると約束する" },
      { phrase: "b009", note: "修正が検証環境で確認済みであることを報告する" },
      { phrase: "b012", note: "完了基準に照らして次工程へ進めるかを判断する" }
    ]
  },
  {
    id: "sc_b5",
    title: "本番障害の報告と恒久対応の決定",
    cat: "ops",
    level: "中級",
    desc: "障害の復旧状況と事象を報告し、担当と原因、SLAへの影響を確認したうえで、暫定対応から恒久対策と振り返り会の設定までを決める流れ。",
    steps: [
      { phrase: "b056", note: "システムが復旧済みであることをまず報告する" },
      { phrase: "b061", note: "発生した障害事象を具体的に説明する" },
      { phrase: "b055", note: "この課題の担当オーナーを明確にする" },
      { phrase: "b053", note: "根本原因が調査中であることを共有する" },
      { phrase: "b062", note: "SLAへの影響と悪化傾向を確認する" },
      { phrase: "b057", note: "実施済みの暫定対応を説明する" },
      { phrase: "b058", note: "障害発生時の連絡手順を徹底するよう依頼する" },
      { phrase: "b065", note: "同一障害の再発を指摘し恒久対策を求める" },
      { phrase: "b063", note: "監視アラート追加という再発防止策を提案する" },
      { phrase: "b059", note: "恒久対応の実施時期を示す" },
      { phrase: "b064", note: "振り返り会の設定を提案して締める" }
    ]
  }
];

if (typeof window !== "undefined") { window.PHRASES_B = PHRASES_B; window.SCENARIOS_B = SCENARIOS_B; }
