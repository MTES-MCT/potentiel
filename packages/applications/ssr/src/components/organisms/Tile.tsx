import { fr } from '@codegouvfr/react-dsfr';
import React, { FC } from 'react';

type TileProps = {
  className?: string;
  children: React.ReactNode;
};

export const Tile: FC<TileProps> = ({ children, className = '' }) => (
  <div
    className={`p-5 border border-solid border-b-[3px] ${className}`}
    style={{
      border: fr.colors.decisions.border.default.grey.default,
      borderBottom: fr.colors.decisions.border.default.blueFrance.default,
    }}
  >
    {children}
  </div>
);
