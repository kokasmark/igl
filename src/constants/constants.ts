import type { IWeapon, IWeaponData, RoundOutcome } from "../types/Game";

export const TeammateColors = [
    "var(--player-orange)",
    "var(--player-green)",
    "var(--player-blue)",
    "var(--player-yellow)",
    "var(--palyer-purple)",
]

export const WEAPONS: Record<IWeapon, IWeaponData> = {
    ak47:          { reward: 300,  price: 2700 },
    aug:           { reward: 300,  price: 3300 },
    awp:           { reward: 100,  price: 4750 },
    famas:         { reward: 300,  price: 2050 },
    galilar:       { reward: 300,  price: 1800 },
    m4a1_silencer: { reward: 300,  price: 2900 },
    m4a4:          { reward: 300,  price: 3100 },
    sg556:         { reward: 300,  price: 3000 },
    ssg08:         { reward: 150,  price: 1700 },

    bizon:         { reward: 600,  price: 1400 },
    mac10:         { reward: 600,  price: 1050 },
    mp5sd:         { reward: 600,  price: 1500 },
    mp7:           { reward: 600,  price: 1700 },
    mp9:           { reward: 600,  price: 1250 },
    p90:           { reward: 300,  price: 2350 },
    ump45:         { reward: 600,  price: 1200 },

    mag7:          { reward: 900,  price: 1300 },
    nova:          { reward: 900,  price: 1050 },
    sawedoff:      { reward: 900,  price: 1100 },
    xm1014:        { reward: 900,  price: 2000 },
    m249:          { reward: 300,  price: 5200 },
    negev:         { reward: 300,  price: 1700 },

    cz75a:         { reward: 100,  price: 500  },
    deagle:        { reward: 300,  price: 700  },
    elite:         { reward: 300,  price: 300  },
    fiveseven:     { reward: 300,  price: 500  },
    glock:         { reward: 300,  price: 200  },
    hkp2000:       { reward: 300,  price: 200  },
    p250:          { reward: 300,  price: 300  },
    revolver:      { reward: 300,  price: 600  },
    tec9:          { reward: 300,  price: 500  },
    usp_silencer:  { reward: 300,  price: 200  },

    knife:         { reward: 1500, price: 0    },
    knife_t:       { reward: 1500, price: 0    },

    taser:         { reward: 300,  price: 200  },
    g3sg1:         { reward: 300,  price: 5000 },
    scar20:        { reward: 0,    price: 5000 },
};

export const OUTCOMES: { id: RoundOutcome; icon: string; label: string; enemyWins: (side: "t" | "ct") => boolean }[] = [
  { id: "defuse",      icon: "Defuse",        label: "Defused",    enemyWins: (s) => s === "ct" },
  { id: "explosion",   icon: "BombExplosion", label: "Exploded",   enemyWins: (s) => s === "t"  },
  { id: "timeout",     icon: "Timer",         label: "Timeout",    enemyWins: (s) => s === "ct" },
  { id: "ace",         icon: "Headshot",      label: "Aced",       enemyWins: (s) => false       },
  { id: "wiped",       icon: "Skull",         label: "Wiped",      enemyWins: (s) => true       },
];

export const isSecondary = (w: IWeapon) => ["glock", "usp_silencer", "hkp2000", "p250", "fiveseven", "cz75a", "deagle", "revolver", "elite", "tec9"].includes(w);
export const isPrimary = (w: IWeapon) => !isSecondary(w) && w !== "knife" && w !== "knife_t";
