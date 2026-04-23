export function SiteFooter() {
  return (
    <footer
      className="max-w-6xl mx-auto px-4 md:px-6 py-10 mt-16"
      style={{
        borderTop: "1px solid var(--color-border-subtle)",
        color: "var(--color-text-tertiary)",
      }}
    >
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between text-xs">
        <div>
          <span
            className="font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-secondary)" }}
          >
            🎹 Music Theory Lab
          </span>
          <span className="ml-2">コード理論をインタラクティブに学ぶ</span>
        </div>
        <div className="flex gap-4">
          <a
            href="https://github.com/machaniconico/music-theory-app"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline transition-colors"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            GitHub
          </a>
          <a
            href="https://machaniconico.com"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline transition-colors"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            @まちゃ
          </a>
          <span>MIT License</span>
        </div>
      </div>
    </footer>
  );
}
