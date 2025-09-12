import React from 'react';
import routes from '../../../../../routes';
import { Header } from '../Header';
import { DropdownMenu } from '../../molecules/dropdowns/DropdownMenu';
import { Routes } from '@potentiel-applications/routes';

type AcheteurObligéMenuLegacyProps = {
  currentPage?: string;
};

export const AcheteurObligéMenuLegacy = ({ currentPage }: AcheteurObligéMenuLegacyProps) => (
  <>
    <Header.MenuItem
      href={routes.LISTE_PROJETS}
      {...(currentPage === 'list-projects' && { isCurrent: true })}
    >
      Projets
    </Header.MenuItem>
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
    </DropdownMenu>
  </>
);
