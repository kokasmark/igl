import { TeammateColors } from "../constants/constants";
import type { IMatch } from "../types/Game";
import Icon from "./Icon";
import WeaponRow from "./WeaponRow";

export default function BuyPhase({ match, updateMatch, updateIndex }: { match: IMatch, updateMatch: React.Dispatch<React.SetStateAction<IMatch>>, updateIndex: () => void }) {
    const round = match.rounds.at(-1)!;

    if (!round) return;

    return (
        <div className="flex items-start justify-between flex-col gap-2 section w-full">
            <div className="card-header w-full">
                <div className="flex flex-col items-start gap-2">
                    <p className="text-2xl! text-[var(--color-text-secondary)]">Buy phase</p>
                    <p className="text-[var(--color-text-tertiary)] text-sm">Predicted buys. Tracked economy.</p>
                </div>
                <button className="btn btn-success" onClick={updateIndex}>Next</button>
            </div>

            <div className="flex w-full items-center justify-evenly">
                {round.players?.map((p, i) => {

                    const isEco = p.money <= 2000;
                    const isForce = p.money > 2000 && match.rounds.at(-2) && match.rounds.at(-2)?.won;
                    const isFull = p.money > 4000;
                    const isDrop = p.money > 4000 && match.rounds.at(-2) && match.rounds.at(-2)?.won;

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
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 flex-1">
                                {/* Primary */}
                                {p.primary && (
                                    <WeaponRow
                                        weapon={p.primary}
                                    />
                                )}

                                {/* Secondary */}
                                {p.secondary && (
                                    <WeaponRow
                                        weapon={p.secondary}
                                    />
                                )}

                                {/* Knife */}
                                <WeaponRow
                                    weapon={p.knife}
                                />
                            </div>

                            <div className="flex gap-1">
                                {isEco && (<div className="w-fit badge badge-info">Eco</div>)}
                                {isForce && (<div className="w-fit badge badge-warning">Force buy</div>)}
                                {isFull && (<div className="w-fit badge badge-danger">Full buy</div>)}
                                {isDrop && (<div className="w-fit badge badge-success">Drop</div>)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}