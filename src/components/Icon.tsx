import React from "react";
import * as Icons from "../assets/Icons";

interface IProps extends React.SVGProps<SVGSVGElement> {
  icon: string;
}
const IconImage = ({ icon, ...rest }: IProps) => {
  const Icon = (Icons as any)[icon];
  const { className, ...svgProps } = rest;
  if (!Icon) return null;
  return (
    <Icon
      fill="var(--color-text-tertiary)"
      {...svgProps}
    />
  );
};

export default React.memo(IconImage);