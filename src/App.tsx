import { useEffect, useState } from 'react'
import './App.css'
import { OUTCOMES, WEAPONS } from './constants/constants'
import type { Player } from './types/Player'
import { type IMatch, type IWeapon } from './types/Game'
import BuyPhase from './components/BuyPhase'
import RoundPhase from './components/RoundPhase'
import RoundEndPhase from './components/RoundEndPhase'
import { produce } from 'immer'
import { useSync } from './hooks/useSync'
import Icon from './components/Icon'

const createInitialPlayer = (side: "t" | "ct"): Player => ({
  alive: true,
  money: 800,
  primary: undefined,
  secondary: side === "t" ? "glock" : "usp_silencer",
  knife: side === "t" ? "knife_t" : "knife",
  kills: {},
});

const createInitialMatch = (side: "t" | "ct"): IMatch => ({
  phase: 0,
  side,
  rounds: [{
    won: false,
    players: Array.from({ length: 5 }, () => createInitialPlayer(side)),
  }],
});

function App() {
  const [match, updateMatch] = useState<IMatch>(() => createInitialMatch("ct"));
  const [roomCode, setRoomCode] = useState<string | null>(null);

  const { host, join, destroy } = useSync(
    match,
    (incoming) => updateMatch(incoming)
  );

  const isRoundStart = match.phase === 0;
  const isRoundMid = match.phase === 1;
  const isRoundEnd = match.phase === 2;

  const startAsHost = async () => {
    const code = await host();
    setRoomCode(code);
  };

  const joinRoom = (code: string) => {
    join(code);
    setRoomCode(code);
  };

  const updateIndex = () => {
    const next = (match.phase + 1) % 3;

    switch (next) {
      case 0: onRoundEnd(); break;
      case 1: onRound(); break;
      case 2: onRoundStart(); break;
    }

    updateMatch(produce(draft => { draft.phase = next }))
  };

  const onRoundStart = () => {
    document.title = `igl - Round ${match.rounds.length + 1}`
  }
  const onRound = () => { }
  const onRoundEnd = () => {
    const round = match.rounds.at(-1)!;
    const outcome = OUTCOMES.find(out => out.id === round.outcome);
    if (!outcome) return;

    const enemyWon = outcome.enemyWins(match.side);

    const lossStreak = [...match.rounds]
      .reverse()
      .slice(1)
      .findIndex(r => r.won !== enemyWon);

    const LOSS_BONUSES = [1400, 1900, 2400, 2900, 3400];
    const lossBonus = LOSS_BONUSES[Math.min(lossStreak === -1 ? 0 : lossStreak, LOSS_BONUSES.length - 1)];

    updateMatch(produce(draft => {
      const players = draft.rounds.at(-1)!.players;

      if (enemyWon) {
        players.forEach(p => p.money += 3250);

        if (outcome.id === "explosion")
          players.forEach(p => p.money += 300);

        if (match.side === "ct") {
          const totalKills = players.reduce(
            (sum, p) => sum + Object.values(p.kills).reduce((s, k) => s + k, 0), 0
          );
          players.forEach(p => p.money += totalKills * 50);
        }
      } else {
        if (outcome.id !== "timeout")
          players.forEach(p => p.money += lossBonus);
      }

      const newPlayers = players.map(p => {
        const killReward = Object.entries(p.kills).reduce(
          (sum, [weapon, kills]) => sum + (WEAPONS[weapon as IWeapon]?.reward ?? 0) * kills,
          0
        );

        const rebuyDeduction = p.alive ? 0 : [
          p.primary ? WEAPONS[p.primary].price : 0,
          p.secondary ? WEAPONS[p.secondary].price : 0,
        ].reduce((s, c) => s + c, 0);

        return {
          alive: true,
          money: Math.max(0, p.money + killReward - rebuyDeduction),
          primary: p.alive ? p.primary : undefined,
          secondary: p.alive ? p.secondary : match.side === "t" ? "glock" : "usp_silencer",
          knife: match.side === "t" ? "knife_t" : "knife",
          kills: {},
        } as Player;
      });

      draft.rounds.push({ won: false, players: newPlayers });
    }));
  };

  const roomCodeFromUri = window.location.hash.replace("#", "");

  useEffect(() => {
    if (roomCodeFromUri) {
      joinRoom(roomCodeFromUri);
    } else {
      startAsHost();
    }

    return () => destroy();
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start overflow-hidden px-8! overflow-y-auto scrollbar-none">
      <div className='w-full sticky top-0 z-100 pt-8! pb-4! border-b-1' style={{background: "var(--color-background-primary)", borderColor: "var(--color-border-tertiary)"}}>
        <div className='flex gap-4 items-center flex-wrap'>
          {roomCode && <span className="badge badge-success cursor-pointer hover:scale-105 transition duration-300" 
          onClick={()=> navigator.clipboard.writeText(`${window.location.host}${window.location.pathname.slice(0, window.location.pathname.length - 1)}#${roomCode}`)}>
              {roomCode} <Icon icon='Copy' width={14} height={14} style={{marginLeft: 4}} fill='var(--color-text-success)'/>
            </span>}
          <span className="badge badge-neutral">Round {match.rounds.length}</span>
          <div className="flex gap-2 items-center flex-wrap" style={{marginLeft: 'auto'}}>
            {Array.from({ length: 24 }).map((_, i) => {
              const isPlayed = i < match.rounds.length - 1;

              if (isPlayed) {
                return (
                  <div className="round-pip"
                    style={{
                      background: match.rounds[i].won ? "var(--color-background-success)" : "var(--color-background-danger)",
                      color: match.rounds[i].won ? "var(--color-text-success)" : "var(--color-text-danger)",
                    }}>
                    {match.rounds[i].won ? "W" : "L"}
                  </div>
                )
              }
              else {
                return (
                  <div className="round-pip"
                    style={{
                      background: "var(--color-background-secondary)",
                    }}>

                  </div>
                )
              }
            })}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col justify-center items-start">
        {isRoundStart && (
          <BuyPhase match={match} updateMatch={updateMatch} updateIndex={updateIndex} />
        )}
        {isRoundMid && (
          <RoundPhase match={match} updateMatch={updateMatch} updateIndex={updateIndex} />
        )}
        {isRoundEnd && (
          <RoundEndPhase match={match} updateMatch={updateMatch} updateIndex={updateIndex} />
        )}
      </div>
    </div>
  )
}

export default App
