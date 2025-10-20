import React from 'react';

import { MenuLegacyProjet } from './_utils/projet.menuLegacy';
import { Header } from '../Header';

export const AdemeMenuLegacy = (
  <>
    <MenuLegacyProjet />
    <Header.MenuItem href={'https://potentiel.e2.rie.gouv.fr/'} externe>
      Tableau de bord
    </Header.MenuItem>
  </>
);
