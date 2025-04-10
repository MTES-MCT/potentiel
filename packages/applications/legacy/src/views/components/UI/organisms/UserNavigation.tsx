import React from 'react';
import routes from '../../../../routes';
import { Header } from './Header';
import { DropdownMenu } from '../molecules/dropdowns/DropdownMenu';
import { UtilisateurReadModel } from '../../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { Routes } from '@potentiel-applications/routes';

const MenuGarantiesFinancières = () => (
  <DropdownMenu buttonChildren={'Garanties financières'}>
    <DropdownMenu.DropdownItem href={Routes.GarantiesFinancières.dépôt.lister}>
      Garanties financières à traiter
    </DropdownMenu.DropdownItem>
    <DropdownMenu.DropdownItem href={Routes.GarantiesFinancières.enAttente.lister}>
      Projets avec garanties financières en attente
    </DropdownMenu.DropdownItem>
    <DropdownMenu.DropdownItem href={Routes.GarantiesFinancières.demandeMainlevée.lister}>
      Demandes de mainlevée
    </DropdownMenu.DropdownItem>
  </DropdownMenu>
);

type UserNavigationProps = {
  user: UtilisateurReadModel;
  currentPage?: string;
};
export const UserNavigation = ({ user, currentPage }: UserNavigationProps) => {
  switch (user.role) {
    case 'porteur-projet':
      return MenuPorteurProjet(currentPage);
    case 'acheteur-obligé':
      return MenuAcheteurObligé(currentPage);
    case 'ademe':
      return MenuAdeme(currentPage);
    case 'dreal':
      return MenuDreal(currentPage);
    case 'admin':
    case 'dgec-validateur':
      return MenuAdmin(currentPage);
    case 'cre':
      return MenuCre(currentPage);
    case 'caisse-des-dépôts':
      return MenuCaisseDesDépôts(currentPage);
    case 'grd':
      return MenuGRD();
  }
};

const MenuCaisseDesDépôts = (currentPage?: string) => (
  <Header.MenuItem
    href={routes.LISTE_PROJETS}
    {...(currentPage === 'list-projects' && { isCurrent: true })}
  >
    Projets
  </Header.MenuItem>
);

const MenuCre = (currentPage?: string) => (
  <>
    <Header.MenuItem
      href={routes.LISTE_PROJETS}
      {...(currentPage === 'list-projects' && { isCurrent: true })}
    >
      Projets
    </Header.MenuItem>
    <DropdownMenu buttonChildren={'Demandes'}>
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
    </DropdownMenu>
    <Header.MenuItem href={Routes.Raccordement.lister}>Raccordements</Header.MenuItem>
    <Header.MenuItem
      href={routes.GET_CRE_STATISTIQUES}
      {...(currentPage === 'cre-statistiques' && { isCurrent: true })}
    >
      Tableau de bord
    </Header.MenuItem>
  </>
);

const MenuAdmin = (currentPage?: string) => (
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

const MenuPorteurProjet = (currentPage?: string) => (
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
      <DropdownMenu.DropdownItem href={Routes.Puissance.changement.lister({ statut: 'demandé' })}>
        Puissance
      </DropdownMenu.DropdownItem>
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

const MenuAcheteurObligé = (currentPage?: string) => (
  <>
    <Header.MenuItem
      href={routes.LISTE_PROJETS}
      {...(currentPage === 'list-projects' && { isCurrent: true })}
    >
      Projets
    </Header.MenuItem>
    <DropdownMenu buttonChildren={'Demandes'}>
      <DropdownMenu.DropdownItem
        href={Routes.ReprésentantLégal.changement.lister({ statut: 'demandé' })}
      >
        Représentant légal
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Actionnaire.changement.lister({ statut: 'demandé' })}>
        Actionnaire
      </DropdownMenu.DropdownItem>
    </DropdownMenu>
    <Header.MenuItem
      href={routes.ACHETEUR_OBLIGE_STATISTIQUES}
      {...(currentPage === 'acheteur-oblige-statistiques' && { isCurrent: true })}
    >
      Tableau de bord
    </Header.MenuItem>
  </>
);

const MenuAdeme = (currentPage?: string) => (
  <>
    <Header.MenuItem
      href={routes.LISTE_PROJETS}
      {...(currentPage === 'list-projects' && { isCurrent: true })}
    >
      Projets
    </Header.MenuItem>
    <Header.MenuItem
      href={routes.ADEME_STATISTIQUES}
      {...(currentPage === 'ademe-statistiques' && { isCurrent: true })}
    >
      Tableau de bord
    </Header.MenuItem>
  </>
);

const MenuDreal = (currentPage?: string) => (
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
    </DropdownMenu>
    <MenuGarantiesFinancières />
    <Header.MenuItem href={Routes.Raccordement.lister}>Raccordements</Header.MenuItem>
  </>
);

const MenuGRD = () => (
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
