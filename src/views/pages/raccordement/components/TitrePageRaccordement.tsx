import { PlugIcon } from '@potentiel/ui';
import React, { ComponentProps, FC } from 'react';

export const TitrePageRaccordement: FC<ComponentProps<'div'>> = ({ children }) => (
  <>
    <PlugIcon className="mr-1" aria-hidden />
    <span>Raccordement</span>
  </>
);
