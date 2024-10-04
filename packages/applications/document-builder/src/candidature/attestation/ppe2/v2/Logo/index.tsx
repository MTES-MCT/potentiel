import React from 'react';

import { LogoMCE } from './MCE';
import { LogoMEFSIN } from './MEFSIN';

export const Logo = ({
  imagesRootPath,
  nom,
}: {
  imagesRootPath: string;
  nom: 'MCE' | 'MEFSIN';
}) => {
  switch (nom) {
    case 'MCE':
      return <LogoMCE imagesRootPath={imagesRootPath} />;
    case 'MEFSIN':
      return <LogoMEFSIN imagesRootPath={imagesRootPath} />;
  }
};
