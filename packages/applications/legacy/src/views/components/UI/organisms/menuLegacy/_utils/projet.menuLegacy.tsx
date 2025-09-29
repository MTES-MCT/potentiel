import React from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DropdownMenu } from '../../../molecules';

export const MenuLegacyProjet = () => (
  <DropdownMenu buttonChildren={'Projets'}>
    <DropdownMenu.DropdownItem href={Routes.Lauréat.lister()}>
      Projets lauréats
    </DropdownMenu.DropdownItem>
    <DropdownMenu.DropdownItem href={Routes.Éliminé.lister()}>
      Projets éliminés
    </DropdownMenu.DropdownItem>
  </DropdownMenu>
);
