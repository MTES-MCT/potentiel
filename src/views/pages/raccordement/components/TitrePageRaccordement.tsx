import { PlugIcon } from '@components';
import React, { ComponentProps, FC } from 'react';

export const TitrePageRaccordement: FC<ComponentProps<'div'>> = ({ children }) => (
  <div className="flex flex-row leading-none">
    <PlugIcon className="mr-1" aria-hidden />
    <div>
      <div>Raccordement</div>
      <div className="font-normal text-sm">{children}</div>
    </div>
  </div>
);
