import React from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DropdownMenu } from '../../../molecules';

export const MenuGarantiesFinancières = () => (
  <DropdownMenu buttonChildren={'Garanties financières'}>
    <DropdownMenu.DropdownItem href={Routes.GarantiesFinancières.dépôt.lister}>
      Garanties financières à traiter
    </DropdownMenu.DropdownItem>
    <DropdownMenu.DropdownItem href={Routes.GarantiesFinancières.enAttente.lister}>
      Projets avec garanties financières en attente
    </DropdownMenu.DropdownItem>
    <DropdownMenu.DropdownItem
      href={Routes.GarantiesFinancières.demandeMainlevée.lister({ statut: 'demandé' })}
    >
      Demandes de mainlevée
    </DropdownMenu.DropdownItem>
  </DropdownMenu>
);
