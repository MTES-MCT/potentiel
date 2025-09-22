import React from 'react';
import { DropdownMenu } from '../../molecules/dropdowns/DropdownMenu';
import { Routes } from '@potentiel-applications/routes';

export const GrdMenuLegacy = (
  <DropdownMenu buttonChildren={'Raccordements'}>
    <DropdownMenu.DropdownItem href={Routes.Raccordement.lister}>
      Tous les dossiers de raccordement
    </DropdownMenu.DropdownItem>
    <DropdownMenu.DropdownItem href={Routes.Raccordement.importer}>
      Importer des dates de mise en service
    </DropdownMenu.DropdownItem>
    <DropdownMenu.DropdownItem href={Routes.Raccordement.corrigerRéférencesDossier}>
      Corriger des références dossier
    </DropdownMenu.DropdownItem>
  </DropdownMenu>
);
