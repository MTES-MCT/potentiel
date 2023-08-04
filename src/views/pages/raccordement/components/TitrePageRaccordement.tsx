import { PlugIcon } from '@components';
import React, { ComponentProps, FC } from 'react';

export const TitrePageRaccordement: FC<ComponentProps<'div'>> = ({ children }) => (
  <div className="flex items-center">
    <PlugIcon className="mr-2" aria-hidden />
    <span>Raccordement</span>
  </div>
);
