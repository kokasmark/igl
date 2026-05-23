import { useEffect, useState } from "react";
import type { IMatch, RoundOutcome } from "../types/Game";
import Icon from "./Icon";
import { OUTCOMES } from "../constants/constants";

export default function RoundEndPhase({ match, updateMatch, updateIndex }: { match: IMatch, updateMatch: React.Dispatch<React.SetStateAction<IMatch>>, updateIndex: () => void }) {
  const [selected, setSelected] = useState<RoundOutcome | null>(null);

  const outcome = OUTCOMES.find(o => o.id === selected);

  useEffect(()=>{
    if (!selected) return;
    const won = !outcome?.enemyWins(match.side);

    updateMatch(prev => {
      const rounds = [...prev.rounds];
      rounds[rounds.length - 1] = { ...rounds.at(-1)!, won, outcome: outcome!.id};
      return { ...prev, rounds };
    });
  },[selected])

   const isSelectedPositive = !outcome?.enemyWins(match.side);

  return (
    <div className="flex items-center justify-center h-full flex-col section w-full gap-4">
      <div className="card-header w-full">
            <div className="flex flex-col items-start gap-2">
                <p className="text-2xl! text-[var(--color-text-secondary)]">Round End</p>
                <p className="text-[var(--color-text-tertiary)] text-sm">Select winning / losing condition.</p>
            </div>
            <button className="btn btn-success" onClick={updateIndex}>Next</button>
        </div>

      <div className="flex gap-3">
        {OUTCOMES.map(o => (
          <div
            key={o.id}
            className={`card flex flex-col items-center gap-2 p-4 cursor-pointer ${selected === o.id ? isSelectedPositive ? "badge-success" : "badge-danger" : ""}`}
            style={{
              borderColor: selected === o.id ? isSelectedPositive ? "var(--color-border-success)" : "var(--color-border-danger)" : "var(--color-border-tertiary)",
              background: selected === o.id ? isSelectedPositive ? "var(--color-background-success)" : "var(--color-background-danger)" : "var(--color-background-primary)",
              minWidth: 96,
            }}
            onClick={() => setSelected(o.id)}
          >
            <Icon icon={o.icon} height={32} width={32} fill={selected === o.id ? isSelectedPositive ? "var(--color-text-success)" : "var(--color-text-danger)" : "var(--color-text-secondary)"} 
                color={selected === o.id ? isSelectedPositive ? "var(--color-text-success)" : "var(--color-text-danger)" : "var(--color-text-secondary)"}/>
            <span className="stat-label" style={{ color: selected === o.id ? isSelectedPositive ? "var(--color-text-success)" : "var(--color-text-danger)" : undefined }}>
              {o.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}