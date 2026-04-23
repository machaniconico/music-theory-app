"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string };
type NavGroup = { label: string; children: NavLink[] };
type NavItem = NavLink | NavGroup;

function isNavGroup(item: NavItem): item is NavGroup {
  return "children" in item;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "学ぶ",
    children: [
      { href: "/learn/chord-basics", label: "コードの基礎" },
      { href: "/learn/chord-types", label: "コードの種類" },
      { href: "/learn/scales", label: "スケール" },
      { href: "/learn/diatonic", label: "ダイアトニックコード" },
      { href: "/learn/progressions", label: "コード進行" },
      { href: "/learn/tensions", label: "テンション" },
      { href: "/learn/secondary-dominants", label: "セカンダリードミナント" },
      { href: "/learn/modal-interchange", label: "モーダルインターチェンジ" },
      { href: "/learn/modulation", label: "転調" },
    ],
  },
  { href: "/piano", label: "ピアノ" },
  { href: "/builder", label: "進行ビルダー" },
  { href: "/melody", label: "メロディ" },
  { href: "/ear-training", label: "耳コピ練習" },
  { href: "/analyze", label: "🔎 解析" },
  { href: "/achievements", label: "🏆" },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16"
      style={{
        background: "oklch(0.13 0.015 260 / 0.85)",
        backdropFilter: "blur(20px) saturate(1.2)",
        borderBottom: "1px solid var(--color-border-subtle)",
      }}
    >
      <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 no-underline"
          onClick={() => setMobileOpen(false)}
        >
          <span className="text-2xl">🎹</span>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
          >
            Music Theory Lab
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) =>
            isNavGroup(item) ? (
              <div key={item.label} className="relative">
                <button
                  onClick={() => setLearnOpen(!learnOpen)}
                  onBlur={() => setTimeout(() => setLearnOpen(false), 200)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
                  style={{
                    color: pathname.startsWith("/learn")
                      ? "var(--color-primary)"
                      : "var(--color-text-secondary)",
                  }}
                >
                  {item.label}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform duration-150 ${learnOpen ? "rotate-180" : ""}`}>
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {learnOpen && (
                  <div
                    className="absolute top-full left-0 mt-1 py-2 rounded-xl min-w-[220px] animate-fade-in"
                    style={{
                      background: "var(--color-bg-elevated)",
                      border: "1px solid var(--color-border)",
                      boxShadow: "0 8px 32px oklch(0 0 0 / 0.4)",
                    }}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setLearnOpen(false)}
                        className="block px-4 py-2.5 text-sm no-underline transition-colors duration-150"
                        style={{
                          color: pathname === child.href
                            ? "var(--color-primary)"
                            : "var(--color-text-secondary)",
                          background: pathname === child.href
                            ? "var(--color-primary-muted)"
                            : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (pathname !== child.href) {
                            e.currentTarget.style.background = "var(--color-surface)";
                            e.currentTarget.style.color = "var(--color-text)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (pathname !== child.href) {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "var(--color-text-secondary)";
                          }
                        }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={(item as NavLink).href}
                href={(item as NavLink).href}
                className="px-3 py-2 rounded-lg text-sm font-medium no-underline transition-colors duration-150"
                style={{
                  color: pathname === (item as NavLink).href
                    ? "var(--color-primary)"
                    : "var(--color-text-secondary)",
                }}
                onMouseEnter={(e) => {
                  if (pathname !== (item as NavLink).href) e.currentTarget.style.color = "var(--color-text)";
                }}
                onMouseLeave={(e) => {
                  if (pathname !== (item as NavLink).href) e.currentTarget.style.color = "var(--color-text-secondary)";
                }}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="メニューを開く"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileOpen ? (
              <>
                <path d="M6 6L18 18" />
                <path d="M6 18L18 6" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden absolute top-16 left-0 right-0 py-4 px-4 animate-fade-in"
          style={{
            background: "var(--color-bg-elevated)",
            borderBottom: "1px solid var(--color-border)",
            boxShadow: "0 8px 32px oklch(0 0 0 / 0.4)",
          }}
        >
          {NAV_ITEMS.map((item) =>
            isNavGroup(item) ? (
              <div key={item.label} className="mb-2">
                <span
                  className="block px-3 py-2 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {item.label}
                </span>
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-3 rounded-lg text-sm no-underline transition-colors"
                    style={{
                      color: pathname === child.href
                        ? "var(--color-primary)"
                        : "var(--color-text-secondary)",
                      minHeight: 44,
                    }}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={(item as NavLink).href}
                href={(item as NavLink).href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-3 rounded-lg text-sm no-underline transition-colors"
                style={{
                  color: pathname === (item as NavLink).href
                    ? "var(--color-primary)"
                    : "var(--color-text-secondary)",
                  minHeight: 44,
                }}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      )}
    </header>
  );
}
