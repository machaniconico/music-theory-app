import Link from "next/link";

const SECTIONS = [
  {
    title: "コードの基礎",
    description: "音程・和音の構造を理解する",
    href: "/learn/chord-basics",
    icon: "🎵",
    color: "var(--color-primary)",
  },
  {
    title: "コードの種類",
    description: "Major, Minor, 7thなど各コードの響き",
    href: "/learn/chord-types",
    icon: "🎶",
    color: "var(--color-secondary)",
  },
  {
    title: "スケール",
    description: "メジャー・マイナー・モードを学ぶ",
    href: "/learn/scales",
    icon: "🎼",
    color: "var(--color-accent-blue)",
  },
  {
    title: "ダイアトニックコード",
    description: "キーの中で使えるコードと機能",
    href: "/learn/diatonic",
    icon: "🏗️",
    color: "var(--color-accent-green)",
  },
  {
    title: "コード進行",
    description: "定番パターンを学んで使いこなす",
    href: "/learn/progressions",
    icon: "🔄",
    color: "var(--color-accent-rose)",
  },
  {
    title: "テンション",
    description: "9th, 11th, 13thで響きを豊かに",
    href: "/learn/tensions",
    icon: "✨",
    color: "var(--color-secondary)",
  },
];

const TOOLS = [
  {
    title: "インタラクティブピアノ",
    description: "コードやスケールを視覚と音で確認できるピアノ",
    href: "/piano",
    gradient: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
  },
  {
    title: "コード進行ビルダー",
    description: "ダイアトニックコードを並べてオリジナルの進行を作ろう",
    href: "/builder",
    gradient: "linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-green))",
  },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-20">
      {/* Hero */}
      <section className="text-center space-y-6 pt-8">
        <div className="text-6xl mb-4">🎹</div>
        <h1
          className="text-gradient"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}
        >
          Music Theory Lab
        </h1>
        <p
          className="text-lg max-w-2xl mx-auto leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          コード理論をインタラクティブに学ぼう。
          <br />
          視覚と音で、音楽の仕組みを直感的に理解できます。
        </p>
      </section>

      {/* Tools */}
      <section className="space-y-6">
        <h2
          className="text-center"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
        >
          ツール
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group relative overflow-hidden rounded-2xl p-8 no-underline transition-all duration-300"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ background: tool.gradient }}
              />
              <div className="relative z-10">
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
                >
                  {tool.title}
                </h3>
                <p className="text-sm m-0" style={{ color: "var(--color-text-secondary)" }}>
                  {tool.description}
                </p>
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: tool.gradient }}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Learning Sections */}
      <section className="space-y-6">
        <h2
          className="text-center"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
        >
          学ぶ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS.map((section, i) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-2xl p-6 no-underline transition-all duration-300 animate-fade-in"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-subtle)",
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{section.icon}</span>
                <div>
                  <h3
                    className="text-base font-bold mb-1 group-hover:translate-x-1 transition-transform duration-200"
                    style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
                  >
                    {section.title}
                  </h3>
                  <p className="text-sm m-0" style={{ color: "var(--color-text-secondary)" }}>
                    {section.description}
                  </p>
                </div>
              </div>
              <div
                className="mt-4 h-0.5 w-0 group-hover:w-full transition-all duration-300"
                style={{ background: section.color }}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8" style={{ color: "var(--color-text-tertiary)" }}>
        <p className="text-sm">Music Theory Lab</p>
      </footer>
    </div>
  );
}
