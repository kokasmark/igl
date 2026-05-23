import type { IWeapon } from "./Game";

export interface Player {
    alive: boolean;
    money: number;
    primary?: IWeapon;
    secondary?: IWeapon;
    knife: IWeapon;
    kills: Record<IWeapon, number>;
}