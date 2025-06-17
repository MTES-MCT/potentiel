import clsx from 'clsx';
import React, { FC } from 'react';

type TileProps = {
  className?: string;
  children: React.ReactNode;
};

export const Tile: FC<TileProps> = ({ children, className = '' }) => (
  <div
    className={clsx(
      `p-5 border border-solid border-b-[3px] border-dsfr-border-default-grey-default border-b-theme-blueFrance`,
      className,
    )}
  >
    {children}
  </div>
);
