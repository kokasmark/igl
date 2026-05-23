import React from "react";
import * as Weapons from "../assets/Weapons";

interface IProps extends React.SVGProps<SVGSVGElement> {
  weapon: string;
}
const WeaponImage = ({ weapon, ...rest }: IProps) => {
  const weaponId = weapon.replace("weapon_", "");
  const Weapon = (Weapons as any)[weaponId];
  const { className, ...svgProps } = rest;
  if (!Weapon) return null;
  return (
    <Weapon
      fill="var(--color-text-tertiary)"
      {...svgProps}
    />
  );
};

export default React.memo(WeaponImage);