import React, { FC } from 'react';

type TileProps = {
  className?: string;
  children: React.ReactNode;
};

export const Tile: FC<TileProps> = ({ children, className = '' }) => (
  <div
    className={`p-5 border border-solid border-b-[3px] border-decisions-border-default-grey-default border-b-decisions-border-active-blueFrance-default
     ${className}`}
  >
    {children}
  </div>
);
