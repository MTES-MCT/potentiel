import React from 'react';
import routes from '../../../../../routes';
import { Header } from '../Header';
import { DropdownMenu } from '../../molecules/dropdowns/DropdownMenu';
import { Routes } from '@potentiel-applications/routes';
import { MenuGarantiesFinancières } from './_utils/garantiesFinancières.menuLegacy';

type MenuPorteurProjetProps = {
  currentPage?: string;
  showPuissanceV2: boolean;
};
export const MenuPorteurProjet = ({ currentPage, showPuissanceV2 }: MenuPorteurProjetProps) => (
  <>
    <Header.MenuItem
      href={routes.LISTE_PROJETS}
      {...(currentPage === 'list-projects' && { isCurrent: true })}
    >
      Mes projets
    </Header.MenuItem>
    <DropdownMenu buttonChildren={'Demandes'}>
      <DropdownMenu.DropdownItem
        href={routes.USER_LIST_REQUESTS}
        {...(currentPage === 'list-requests' && { isCurrent: true })}
      >
        Mes demandes
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Abandon.lister({ statut: 'demandé' })}>
        Abandon
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Recours.lister({ statut: 'demandé' })}>
        Recours
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={Routes.ReprésentantLégal.changement.lister({ statut: 'demandé' })}
      >
        Représentant légal
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Actionnaire.changement.lister({ statut: 'demandé' })}>
        Actionnaire
      </DropdownMenu.DropdownItem>
      {showPuissanceV2 && (
        <DropdownMenu.DropdownItem href={Routes.Puissance.changement.lister({ statut: 'demandé' })}>
          Puissance
        </DropdownMenu.DropdownItem>
      )}
    </DropdownMenu>
    <MenuGarantiesFinancières />
    <Header.MenuItem
      href={Routes.Utilisateur.réclamerProjet}
      {...(currentPage === 'list-missing-owner-projects' && { isCurrent: true })}
    >
      Projets à réclamer
    </Header.MenuItem>
  </>
);
