import React from 'react';
import routes from '../../../../../routes';
import { Header } from '../Header';
import { DropdownMenu } from '../../molecules/dropdowns/DropdownMenu';
import { Routes } from '@potentiel-applications/routes';
import { MenuGarantiesFinancières } from './_utils/garantiesFinancières.menuLegacy';

type DrealMenuLegacyProps = {
  currentPage?: string;
  features: Array<string>;
};

export const DrealMenuLegacy = ({ currentPage, features }: DrealMenuLegacyProps) => (
  <>
    <Header.MenuItem
      href={routes.LISTE_PROJETS}
      {...(currentPage === 'list-projects' && { isCurrent: true })}
    >
      Projets
    </Header.MenuItem>
    <DropdownMenu buttonChildren={'Demandes'}>
      {!features.includes('délai') && (
        <DropdownMenu.DropdownItem
          href={routes.ADMIN_LIST_REQUESTS}
          {...(currentPage === 'list-requests' && { isCurrent: true })}
        >
          Toutes les demandes
        </DropdownMenu.DropdownItem>
      )}
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
      <DropdownMenu.DropdownItem
        href={Routes.Puissance.changement.lister({
          statut: 'demandé',
          autoriteInstructrice: 'dreal',
        })}
      >
        Puissance
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Producteur.changement.lister}>
        Producteur
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Fournisseur.changement.lister}>
        Fournisseur
      </DropdownMenu.DropdownItem>
      {features.includes('délai') && (
        <DropdownMenu.DropdownItem href={Routes.Délai.lister}>Délai</DropdownMenu.DropdownItem>
      )}
    </DropdownMenu>
    <MenuGarantiesFinancières />
    <Header.MenuItem href={Routes.Raccordement.lister}>Raccordements</Header.MenuItem>
    <Header.MenuItem href={'https://potentiel.e2.rie.gouv.fr/'} externe>
      Tableau de bord
    </Header.MenuItem>
  </>
);
