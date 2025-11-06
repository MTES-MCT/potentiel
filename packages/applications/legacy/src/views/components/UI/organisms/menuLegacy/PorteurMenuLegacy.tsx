import React from 'react';

import { Header } from '../Header';
import { DropdownMenu } from '../../molecules/dropdowns/DropdownMenu';
import { Routes } from '@potentiel-applications/routes';
import { MenuLegacyGarantiesFinancières } from './_utils/garantiesFinancières.menuLegacy';
import { MenuLegacyProjet } from './_utils/projet.menuLegacy';

export const PorteurMenuLegacy = (
  <>
    <MenuLegacyProjet />
    <DropdownMenu buttonChildren={'Demandes'}>
      <DropdownMenu.DropdownItem
        href={Routes.Abandon.lister({
          statut: ['demandé', 'en-instruction', 'confirmé', 'confirmation-demandée'],
        })}
      >
        Abandon
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={Routes.Recours.lister({ statut: ['demandé', 'en-instruction'] })}
      >
        Recours
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={Routes.ReprésentantLégal.changement.lister({ statut: ['demandé'] })}
      >
        Représentant légal
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={Routes.Actionnaire.changement.lister({ statut: ['demandé'] })}
      >
        Actionnaire
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Puissance.changement.lister({ statut: ['demandé'] })}>
        Puissance
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Producteur.changement.lister}>
        Producteur
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Fournisseur.changement.lister}>
        Fournisseur
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={Routes.Délai.lister({ statut: ['demandé', 'en-instruction'] })}
      >
        Délai
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.NatureDeLExploitation.changement.lister}>
        Nature de l'exploitation
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Installation.changementInstallateur.lister}>
        Installateur
      </DropdownMenu.DropdownItem>
    </DropdownMenu>
    <MenuLegacyGarantiesFinancières />
    <Header.MenuItem href={Routes.Utilisateur.réclamerProjet}>Projets à réclamer</Header.MenuItem>
  </>
);
