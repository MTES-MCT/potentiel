import React from 'react';
import routes from '../../../../../routes';
import { DropdownMenu } from '../../molecules';
import { Routes } from '@potentiel-applications/routes';

export const AdemeMenuLegacy = (
  <DropdownMenu buttonChildren={'Projets'}>
    <DropdownMenu.DropdownItem href={Routes.Lauréat.lister()}>
      Projets lauréats
    </DropdownMenu.DropdownItem>
    <DropdownMenu.DropdownItem href={Routes.Projet.lister()}>
      Tous les projets (legacy)
    </DropdownMenu.DropdownItem>
  </DropdownMenu>
);
