import { TeammateColors, WEAPONS } from "../constants/constants";
import { useModal } from "../ModalProvider";
import type { IMatch, IWeapon } from "../types/Game";
import Icon from "./Icon";
import SearchWeaponModal from "./SearchWeaponModal";
import Weapon from "./Weapon";
import { produce } from "immer";
import WeaponRow from "./WeaponRow";

export default function RoundPhase({ match, updateMatch, updateIndex }: { match: IMatch, updateMatch: React.Dispatch<React.SetStateAction<IMatch>>, updateIndex: () => void }) {

    const { openModal, closeModal } = useModal();

    const killed = (playerIndex: number) => {
        updateMatch(produce(draft => {
            const player = draft.rounds.at(-1)!.players[playerIndex];
            player.alive = false;
        }));
    };

    const addWeapon = (playerIndex: number, slot: "primary" | "secondary", weapon: IWeapon) => {
        updateMatch(produce(draft => {
            const player = draft.rounds.at(-1)!.players[playerIndex];

            if (slot === "primary") player.primary = weapon;
            else if (slot === "secondary") player.secondary = weapon;
        }));
    };

    const removeWeapon = (playerIndex: number, slot: "primary" | "secondary") => {
        updateMatch(produce(draft => {
            const player = draft.rounds.at(-1)!.players[playerIndex];
            if (slot === "primary") delete player.primary;
            else if (slot === "secondary") delete player.secondary;
        }));
    };

    const addKill = (playerIndex: number, weapon: IWeapon) => {
        updateMatch(produce(draft => {
            const player = draft.rounds.at(-1)!.players[playerIndex];
            player.kills[weapon] = (player.kills[weapon] ?? 0) + 1;
        }));
    };

    const removeKill = (playerIndex: number, weapon: IWeapon) => {
        updateMatch(produce(draft => {
            const player = draft.rounds.at(-1)!.players[playerIndex];
            player.kills[weapon] = player.kills[weapon] - 1;
        }));
    };

    const round = match.rounds.at(-1)!;

    const totalRoundKills = round.players.reduce(
        (sum, p) => sum + Object.values(p.kills).reduce((s, k) => s + k, 0),
        0
    );

    return (
        <div className="flex items-start justify-between flex-col gap-2 section w-full">
            <div className="card-header w-full">
                <div className="flex flex-col items-start gap-2">
                    <p className="text-2xl! text-[var(--color-text-secondary)]">Round</p>
                    <p className="text-[var(--color-text-tertiary)] text-sm">Log kills. Note saved weapons.</p>
                </div>
                <button className="btn btn-success" onClick={updateIndex}>Next</button>
            </div>

            <div className="flex w-full items-center justify-evenly">
                {round.players.map((p, i) => {
                    const killReward = Object.entries(p.kills).reduce(
                        (sum, [weapon, kills]) => sum + (WEAPONS[weapon as IWeapon].reward ?? 0) * kills,
                        0
                    );

                    return (
                        <div
                            key={i}
                            className="card flex flex-col gap-3 w-64 relative overflow-hidden"
                            style={{ borderColor: p.alive ? TeammateColors[i] : "var(--color-border-tertiary)", minHeight: 380 }}
                        >
                            {!p.alive && (
                                <div className="absolute w-full h-full backdrop-blur-sm left-0 top-0 flex justify-center items-center" style={{ zIndex: 10 }}>
                                    <Icon icon="Headshot" color="var(--color-text-danger)" height={48} width={48} />
                                </div>
                            )}

                            <div className="card-header" style={{ paddingBottom: 8 }}>
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-3 h-3 block rounded-full flex-shrink-0"
                                        style={{ background: TeammateColors[i] }}
                                    />
                                    <span className="card-title">Player {i + 1}</span>
                                </div>
                                <div className="flex gap-1 items-center">
                                    <span className="badge badge-success">${p.money}</span>
                                    {killReward > 0 && (
                                        <span className="badge badge-neutral">+${killReward}</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 flex-1">
                                {/* Primary */}

                                <WeaponRow
                                    weapon={p.primary}
                                    kills={p.kills[p.primary!] ?? 0}
                                    canAddKill={totalRoundKills < 5}
                                    onReplace={() => openModal(<SearchWeaponModal slot="primary" onSelect={(w) => { removeWeapon(i, "primary"); addWeapon(i, "primary", w); closeModal(); }} />)}
                                    onAddKill={() => addKill(i, p.primary!)}
                                    onRemoveKill={() => removeKill(i, p.primary!)}
                                />

                                {/* Secondary */}
                                <WeaponRow
                                    weapon={p.secondary}
                                    kills={p.kills[p.secondary!] ?? 0}
                                    canAddKill={totalRoundKills < 5}
                                    onReplace={() => openModal(<SearchWeaponModal slot="secondary" onSelect={(w) => { removeWeapon(i, "secondary"); addWeapon(i, "secondary", w); closeModal(); }} />)}
                                    onAddKill={() => addKill(i, p.secondary!)}
                                    onRemoveKill={() => removeKill(i, p.secondary!)}
                                />
                                {/* Knife */}
                                <WeaponRow
                                    weapon={p.knife}
                                    kills={p.kills[p.knife] ?? 0}
                                    canAddKill={totalRoundKills < 5}
                                    onAddKill={() => addKill(i, p.knife)}
                                    onRemoveKill={() => removeKill(i, p.knife)}
                                />
                            </div>

                            <hr style={{ borderColor: "var(--color-border-tertiary)", margin: "0 -1.25rem" }} />

                            <div className="flex flex-col gap-2">
                                <button
                                    className="btn btn-danger btn-sm w-full"
                                    onClick={() => killed(i)}
                                >
                                    <Icon icon="Headshot" width={14} height={14} />Killed
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}