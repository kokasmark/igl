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
      style={{ background: "var(--color-background-primary)", width: 520 }}
    >
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
        <i className="ti ti-search" style={{ fontSize: 16, color: "var(--color-text-tertiary)" }} aria-hidden="true" />
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
          <i
            className="ti ti-x cursor-pointer"
            style={{ fontSize: 14, color: "var(--color-text-tertiary)" }}
            onClick={() => setQuery("")}
          />
        )}
      </div>

      <div
        className="grid p-3 scrollbar-none gap-1"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))",
          alignContent: "start",
          minHeight: 220,
          maxHeight: 480,
          overflowY: "auto",
        }}
      >
        {results.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-2 mt-8!"
            style={{ gridColumn: "1 / -1", height: 200, color: "var(--color-text-tertiary)" }}
          >
            <i className="ti ti-zoom-cancel" style={{ fontSize: 28 }} aria-hidden="true" />
            <span style={{ fontSize: 13 }}>No weapons found</span>
          </div>
        ) : results.map(w => (
          <div
            key={w}
            className="flex flex-col items-center justify-end gap-1 rounded-lg cursor-pointer p-2 mt-8!"
            style={{ background: "transparent", transition: "background 0.1s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--color-background-secondary)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            onClick={() => onSelect(w)}
          >
            <Weapon weapon={w} width={72} height={48} />
            <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", textAlign: "center", lineHeight: 1.2 }}>
              {w.replace(/_/g, " ")}
            </span>
            <span className="badge badge-success">${WEAPONS[w].price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}