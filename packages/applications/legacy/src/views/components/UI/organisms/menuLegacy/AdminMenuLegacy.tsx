import React from 'react';
import routes from '../../../../../routes';
import { Header } from '../Header';
import { DropdownMenu } from '../../molecules/dropdowns/DropdownMenu';
import { Routes } from '@potentiel-applications/routes';
import { MenuGarantiesFinancières } from './_utils/garantiesFinancières.menuLegacy';

type AdminMenuLegacyProps = {
  currentPage?: string;
  showPuissanceV2: boolean;
};

export const AdminMenuLegacy = ({ currentPage, showPuissanceV2 }: AdminMenuLegacyProps) => (
  <>
    <Header.MenuItem
      href={routes.LISTE_PROJETS}
      {...(currentPage === 'list-projects' && { isCurrent: true })}
    >
      Projets
    </Header.MenuItem>
    <DropdownMenu buttonChildren={'Demandes'}>
      <DropdownMenu.DropdownItem
        href={routes.ADMIN_LIST_REQUESTS}
        {...(currentPage === 'list-requests' && { isCurrent: true })}
      >
        Toutes les demandes
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
        <DropdownMenu.DropdownItem
          href={Routes.Puissance.changement.lister({
            statut: 'demandé',
            autoriteInstructrice: 'dgec-admin',
          })}
        >
          Puissance
        </DropdownMenu.DropdownItem>
      )}
    </DropdownMenu>
    <MenuGarantiesFinancières />
    <DropdownMenu buttonChildren={'Candidatures'}>
      <DropdownMenu.DropdownItem href={Routes.Candidature.importer}>
        Nouveaux candidats
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={Routes.Période.lister({
          statut: Routes.Période.defaultStatutValueForPériodeList,
        })}
      >
        Candidats à notifier
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Candidature.corrigerParLot}>
        Correction par lot
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={Routes.Candidature.lister({
          estNotifié: false,
        })}
      >
        Tous les candidats
      </DropdownMenu.DropdownItem>
    </DropdownMenu>
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
    <DropdownMenu buttonChildren={'Gestion des accès'}>
      <DropdownMenu.DropdownItem href={Routes.Utilisateur.lister}>
        Utilisateurs
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Utilisateur.inviter}>
        Inviter un utilisateur
      </DropdownMenu.DropdownItem>
    </DropdownMenu>

    <DropdownMenu buttonChildren={'Outils'}>
      <DropdownMenu.DropdownItem
        href={routes.ADMIN_STATISTIQUES}
        {...(currentPage === 'admin-statistiques' && { isCurrent: true })}
      >
        Tableau de bord
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Gestionnaire.lister}>
        Gérer les gestionnaires de réseau
      </DropdownMenu.DropdownItem>
    </DropdownMenu>
  </>
);
