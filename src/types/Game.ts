import type { Player } from "./Player";

export type ISide = "ct" | "t"

export interface IWeaponData{
    reward: number;
    price: number;
}

export type IWeapon = "ak47" |
    "aug" |
    "awp" |
    "bizon" |
    "cz75a" |
    "deagle" |
    "elite" |
    "famas" |
    "fiveseven" |
    "g3sg1" |
    "galilar" |
    "glock" |
    "hkp2000" |
    "knife" |
    "knife_t" |
    "m249" |
    "m4a4" |
    "m4a1_silencer" |
    "mac10" |
    "mag7" |
    "mp5sd" |
    "mp7" |
    "mp9" |
    "negev" |
    "nova" |
    "p250" |
    "p90" |
    "revolver" |
    "sawedoff" |
    "scar20" |
    "sg556" |
    "ssg08" |
    "taser" |
    "tec9" |
    "ump45" |
    "usp_silencer" |
    "xm1014"

export interface IKill{
    weapon: IWeapon;
}

export type RoundOutcome = "defuse" | "explosion" | "timeout" | "ace" | "wiped";

export interface IRound{
    won: boolean;
    outcome?: RoundOutcome;
    players: Player[];
}

export interface IMatch{
    rounds: IRound[];
    side: ISide;
    phase: number;
}