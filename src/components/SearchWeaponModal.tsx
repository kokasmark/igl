import { useState } from "react";
import type { IWeapon } from "../types/Game";
import { isPrimary, isSecondary, WEAPONS } from "../constants/constants";
import Weapon from "./Weapon";

export default function SearchWeaponModal({ slot, onSelect }: { slot: ("primary" | "secondary"), onSelect: (weapon: IWeapon) => void }) {
  const [query, setQuery] = useState("");

  const results = (Object.keys(WEAPONS) as IWeapon[]).filter(w => slot === "secondary" ? isSecondary(w) : isPrimary(w)).filter(w =>
    w.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="card flex flex-col overflow-hidden"
      style={{ background: "var(--color-background-primary)", width: "min(520px, 95vw)" }}
    >
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="flex-1 focus:outline-0 bg-transparent"
          placeholder="Search weapons…"
          style={{ fontSize: 14, color: "var(--color-text-primary)" }}
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
        {query && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => setQuery("")}>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        )}
      </div>

      <div
        className="grid p-3 scrollbar-none gap-1"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
          alignContent: "start",
          minHeight: 200,
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        {results.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-2"
            style={{ gridColumn: "1 / -1", height: 180, color: "var(--color-text-tertiary)" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35M8 11h6" />
            </svg>
            <span style={{ fontSize: 13 }}>No weapons found</span>
          </div>
        ) : results.map(w => (
          <div
            key={w}
            className="flex flex-col items-center justify-end gap-1 rounded-lg cursor-pointer p-2"
            style={{ background: "transparent", transition: "background 0.1s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--color-background-secondary)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            onClick={() => onSelect(w)}
          >
            <Weapon weapon={w} width={64} height={44} />
            <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", textAlign: "center", lineHeight: 1.2 }}>
              {w.replace(/_/g, " ")}
            </span>
            <span className="badge badge-success" style={{ fontSize: 10 }}>${WEAPONS[w].price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}