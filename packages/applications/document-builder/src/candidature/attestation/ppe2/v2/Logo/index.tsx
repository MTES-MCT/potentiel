import React from 'react';
import { match } from 'ts-pattern';

import { LogoMCE } from './MCE';
import { LogoMEFSIN } from './MEFSIN';
import { LogoGouvernement } from './Gouvernement';

export const Logo = ({
  imagesRootPath,
  nom,
}: {
  imagesRootPath: string;
  nom: 'MCE' | 'MEFSIN' | 'Gouvernement';
}) => {
  const Component = match(nom)
    .with('MCE', () => LogoMCE)
    .with('MEFSIN', () => LogoMEFSIN)
    .with('Gouvernement', () => LogoGouvernement)
    .exhaustive();

  return <Component imagesRootPath={imagesRootPath} />;
};
