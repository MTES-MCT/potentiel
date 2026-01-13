import React from 'react';

import { DropdownMenu } from '../../molecules/dropdowns/DropdownMenu';
import { Routes } from '@potentiel-applications/routes';
import { MenuLegacyProjet } from './_utils/projet.menuLegacy';
import { Header } from '../Header';

// viovio je crois que je peux supprimer tout ça
export const AcheteurObligéMenuLegacy = (
  <>
    <MenuLegacyProjet />
    <DropdownMenu buttonChildren={'Demandes'}>
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
      <DropdownMenu.DropdownItem href={Routes.Installation.changement.installateur.lister}>
        Installateur
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Installation.changement.dispositifDeStockage.lister}>
        Dispositif de stockage
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Lauréat.changement.nomProjet.lister}>
        Nom projet
      </DropdownMenu.DropdownItem>
    </DropdownMenu>
    <DropdownMenu buttonChildren={'Raccordements'}>
      <DropdownMenu.DropdownItem href={Routes.Raccordement.lister}>
        Tous les dossiers de raccordement
      </DropdownMenu.DropdownItem>
    </DropdownMenu>
    <Header.MenuItem href={Routes.Export.page}>Export de données</Header.MenuItem>
  </>
);
