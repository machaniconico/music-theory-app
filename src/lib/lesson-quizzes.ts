export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  hint?: string;
}

export interface LessonQuiz {
  lessonId: string;
  title: string;
  questions: QuizQuestion[];
}

export const LESSON_QUIZZES: Record<string, LessonQuiz> = {
  "chord-basics": {
    lessonId: "chord-basics",
    title: "コードの基礎 理解度チェック",
    questions: [
      {
        q: "長3度（M3）は何半音？",
        options: ["2半音", "3半音", "4半音", "5半音"],
        correct: 2,
        hint: "CからEまで、C → C# → D → D# → E と4つ。",
      },
      {
        q: "メジャーコードとマイナーコードを分ける音はどれ？",
        options: ["ルート", "3度", "5度", "オクターブ"],
        correct: 1,
        hint: "長3度ならメジャー、短3度ならマイナー。",
      },
      {
        q: "Cマイナー（Cm）の構成音は？",
        options: ["C, E, G", "C, Eb, G", "C, E, Gb", "C, Eb, Gb"],
        correct: 1,
        hint: "短3度 = Eb。完全5度 = G。",
      },
    ],
  },

  "chord-types": {
    lessonId: "chord-types",
    title: "コードの種類 理解度チェック",
    questions: [
      {
        q: "ディミニッシュコード（dim）は短3度と何度で構成？",
        options: ["完全5度", "減5度", "増5度", "長3度"],
        correct: 1,
        hint: "dim = ルート + 短3度 + 減5度（6半音）。",
      },
      {
        q: "Major 7th（M7）とDominant 7th（7）の違いは？",
        options: [
          "7度の音が長短で違う",
          "3度の音が違う",
          "5度の音が違う",
          "ルートが違う",
        ],
        correct: 0,
        hint: "M7は長7度、7は短7度。",
      },
      {
        q: "sus4コードで3度の代わりに使われる音程は？",
        options: ["長2度", "短3度", "完全4度", "完全5度"],
        correct: 2,
        hint: "sus = 「掛留する」。4度で解決を求める。",
      },
    ],
  },

  "scales": {
    lessonId: "scales",
    title: "スケール 理解度チェック",
    questions: [
      {
        q: "メジャースケール（イオニアン）の全音/半音パターンは？",
        options: [
          "全全半全全半全",
          "全半全全全半全",
          "全全半全全全半",
          "全全全半全全半",
        ],
        correct: 2,
        hint: "ド-レ-ミ-ファ-ソ-ラ-シ-ド。3-4間と7-8間が半音。",
      },
      {
        q: "メジャーペンタトニックは何音で構成される？",
        options: ["3音", "5音", "6音", "7音"],
        correct: 1,
        hint: "Penta=5。メジャーから4度と7度を抜いた5音。",
      },
      {
        q: "ドリアンスケールはどのキーのメジャースケールを2番目から始めたもの？",
        options: ["CメジャーのD", "CメジャーのE", "DメジャーのC", "DメジャーのE"],
        correct: 0,
        hint: "D ドリアン = C メジャーの2番目。白鍵のみ。",
      },
    ],
  },

  "diatonic": {
    lessonId: "diatonic",
    title: "ダイアトニックコード 理解度チェック",
    questions: [
      {
        q: "メジャーキーのIIIのコードの性質は？",
        options: ["メジャー", "マイナー", "ディミニッシュ", "オーギュメント"],
        correct: 1,
        hint: "I=M, II=m, III=m, IV=M, V=M, VI=m, VII=dim。",
      },
      {
        q: "「ドミナント」と呼ばれるコードの機能は？",
        options: [
          "安定・解決",
          "不安定・緊張",
          "安定だがやや不安",
          "リズム",
        ],
        correct: 1,
        hint: "Vコードは強い解決欲求をもつ。",
      },
      {
        q: "Cメジャーキーのサブドミナントにあたるコードは？",
        options: ["C", "Dm", "F", "G"],
        correct: 2,
        hint: "IVコード=F。落ち着いた進行を生む。",
      },
    ],
  },

  "progressions": {
    lessonId: "progressions",
    title: "コード進行 理解度チェック",
    questions: [
      {
        q: "「王道進行」のコード進行は？",
        options: [
          "I → IV → V → I",
          "IV → V → IIIm → VIm",
          "VIm → IV → V → I",
          "I → V → VIm → IV",
        ],
        correct: 1,
        hint: "IV→V→IIIm→VIm。J-POPの大定番。",
      },
      {
        q: "「ツーファイブワン（II-V-I）」はどんなジャンルで多用される？",
        options: ["ロック", "ジャズ", "EDM", "レゲエ"],
        correct: 1,
        hint: "ジャズの最重要進行。IIm7→V7→IM7。",
      },
      {
        q: "「カノン進行」の最初のコードは？",
        options: ["I", "IV", "V", "VIm"],
        correct: 0,
        hint: "I → V → VIm → IIIm → IV → I → IV → V。",
      },
    ],
  },

  "tensions": {
    lessonId: "tensions",
    title: "テンション 理解度チェック",
    questions: [
      {
        q: "9thのテンション音はルートから何半音？",
        options: ["12半音", "13半音", "14半音", "16半音"],
        correct: 2,
        hint: "長2度（2半音）をオクターブ上げて14半音。",
      },
      {
        q: "テンションが使えないのは次のうちどれ？",
        options: ["ベース音と半音でぶつかるテンション", "9thのテンション", "13thのテンション", "#11thのテンション"],
        correct: 0,
        hint: "コードトーンと半音でぶつかる音はアヴォイド。",
      },
      {
        q: "「add9」と「M9」の違いは？",
        options: [
          "add9は7度を含まない、M9は含む",
          "M9は7度を含まない、add9は含む",
          "使える9度の種類が違う",
          "違いはない",
        ],
        correct: 0,
        hint: "add9 = トライアド+9、M9 = M7+9。",
      },
    ],
  },

  "secondary-dominants": {
    lessonId: "secondary-dominants",
    title: "セカンダリードミナント 理解度チェック",
    questions: [
      {
        q: "セカンダリードミナントとは？",
        options: [
          "キーの第2のトニック",
          "ダイアトニック外のドミナント7thで別のコードを仮のトニック化する手法",
          "マイナーキーの属和音",
          "サブドミナントの別名",
        ],
        correct: 1,
        hint: "V/X（Xの5度）をドミナント7thとして挿入する。",
      },
      {
        q: "Cメジャーキーで V/V にあたるコードは？",
        options: ["G7", "D7", "A7", "E7"],
        correct: 1,
        hint: "Vは G。Gの5度上（完全5度上）の D をルートに D7。",
      },
      {
        q: "Cメジャーキーで V/VI（=V/Am）にあたるコードは？",
        options: ["E7", "A7", "B7", "D7"],
        correct: 0,
        hint: "VI = Am。Am の5度上は E で E7。",
      },
    ],
  },

  "modal-interchange": {
    lessonId: "modal-interchange",
    title: "モーダルインターチェンジ 理解度チェック",
    questions: [
      {
        q: "モーダルインターチェンジ（借用和音）とは？",
        options: [
          "転調後にだけ使えるコード",
          "同主調の別モード（主にマイナー）からコードを借用する",
          "テンションノートの追加",
          "転回形の一種",
        ],
        correct: 1,
        hint: "Cメジャーの中にCマイナーのコードを差し込む。",
      },
      {
        q: "Cメジャーキーで「iv」と書いたら借用和音はどれ？",
        options: ["F", "Fm", "Fdim", "FM7"],
        correct: 1,
        hint: "メジャーキーではIVがF（メジャー）。小文字ivはマイナーからの借用でFm。",
      },
      {
        q: "「Creep 進行」I-III-IV-iv の最後のコードは？",
        options: [
          "メジャーのIVコード",
          "同主調マイナーから借用したivコード",
          "セカンダリードミナント",
          "ドミナント7th",
        ],
        correct: 1,
        hint: "IV→iv のモーダルインターチェンジが特徴。",
      },
    ],
  },

  "modulation": {
    lessonId: "modulation",
    title: "転調 理解度チェック",
    questions: [
      {
        q: "ピボットコード転調の特徴は？",
        options: [
          "前ぶれなしに半音上げる",
          "両キーに共通するコードを経由して滑らかに移る",
          "マイナーキーにしか使えない",
          "転調先は常に5度上になる",
        ],
        correct: 1,
        hint: "両キーのダイアトニックに共通するコードが「蝶番」。",
      },
      {
        q: "J-POPのサビ繰り返しで多い転調は？",
        options: [
          "属調（5度上）への転調",
          "半音/全音上げの直接転調",
          "平行調への転調",
          "下属調への転調",
        ],
        correct: 1,
        hint: "感情のピークを作る「キー上げ」は直接転調。",
      },
      {
        q: "Cメジャーキーの vi（Am）は、どのキーの ii として再解釈できる？",
        options: ["Fメジャー", "Gメジャー", "Dメジャー", "Bbメジャー"],
        correct: 1,
        hint: "Gメジャーの ii は Am。Cメジャーとの共通和音として使える。",
      },
    ],
  },
};
