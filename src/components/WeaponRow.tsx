import type { IWeapon } from "../types/Game";
import Icon from "./Icon";
import Weapon from "./Weapon";

export default function WeaponRow({ weapon, kills, canAddKill, onReplace, onAddKill, onRemoveKill }: {
  weapon?: IWeapon;
  kills?: number;
  canAddKill?: boolean;
  onReplace?: () => void;
  onAddKill?: () => void;
  onRemoveKill?: () => void;
}) {
  return (
    <div
      className="flex justify-between items-center rounded-lg px-2! py-1!"
      style={{ background: "var(--color-background-secondary)" }}
    >
      {!weapon && <p className="h-12 flex items-center cursor-pointer" onClick={onReplace} style={{color: "var(--color-text-tertiary)"}}>Add weapon</p>}
      {weapon && (
        <div className="flex justify-between items-center w-full">
          <Weapon weapon={weapon} width={80} height={48} style={{ cursor: "pointer", opacity: 0.9 }} onClick={onReplace} />
          <div className="flex items-center gap-1 flex-wrap justify-end" style={{ maxWidth: 80 }}>
            {(kills !== undefined && kills > 0) && Array.from({ length: kills }).map((_, k) => (
              <Icon key={k} icon="Skull" fill="var(--color-text-secondary)" height={14} width={14} style={{ cursor: "pointer" }} onClick={onRemoveKill} />
            ))}
            {canAddKill && (
              <span
                className="flex items-center justify-center rounded-full leading-none cursor-pointer flex-shrink-0 user-select-none"
                style={{ height: 16, width: 16, fontSize: 14, lineHeight: 1, paddingBottom: 1, background: "var(--color-background-tertiary)", border: "0.5px solid var(--color-border-secondary)", color: "var(--color-text-secondary)" }}
                onClick={onAddKill}
              >
                +
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}