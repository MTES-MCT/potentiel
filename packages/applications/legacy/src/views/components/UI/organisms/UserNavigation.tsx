import React from 'react';
import routes from '../../../../routes';
import { Header } from './Header';
import { DropdownMenu } from '../molecules/dropdowns/DropdownMenu';
import { UtilisateurReadModel } from '../../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { Routes } from '@potentiel-applications/routes';

const MenuGarantiesFinancières = ({ currentPage }: { currentPage?: string }) => (
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

export const UserNavigation = ({
  user,
  currentPage,
}: {
  user: UtilisateurReadModel;
  currentPage?: string;
}) => {
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
    <Header.MenuItem href={Routes.Abandon.lister}>Abandons</Header.MenuItem>
    <Header.MenuItem href={Routes.Recours.lister}>Recours</Header.MenuItem>
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
      <DropdownMenu.DropdownItem href={Routes.Abandon.lister}>Abandons</DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Recours.lister}>Recours</DropdownMenu.DropdownItem>
    </DropdownMenu>
    <MenuGarantiesFinancières currentPage={currentPage} />
    <DropdownMenu buttonChildren={'Candidatures'}>
      <DropdownMenu.DropdownItem href={Routes.Candidature.importer}>
        Nouveaux candidats
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={Routes.Période.lister({
          statut: Routes.Période.defaultStatutValueForPériodeList,
        })}
      >
        Notifier des candidats
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
        Importer dates mise en service
      </DropdownMenu.DropdownItem>
    </DropdownMenu>
    <DropdownMenu buttonChildren={'Imports'}>
      <DropdownMenu.DropdownItem
        href={routes.UPLOAD_LEGACY_MODIFICATION_FILES}
        {...(currentPage === 'admin-upload-legacy-modification-files' && { isCurrent: true })}
      >
        Courriers historiques
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Raccordement.corrigerRéférencesDossier}>
        Corrections de références dossier
      </DropdownMenu.DropdownItem>
    </DropdownMenu>
    <DropdownMenu buttonChildren={'Gestion des accès'}>
      <DropdownMenu.DropdownItem
        href={routes.ADMIN_INVITATION_LIST}
        {...(currentPage === 'list-invitations' && { isCurrent: true })}
      >
        Candidats en attente
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={routes.ADMIN_NOTIFICATION_LIST}
        {...(currentPage === 'list-notifications' && { isCurrent: true })}
      >
        Emails en erreur
      </DropdownMenu.DropdownItem>

      <DropdownMenu.DropdownItem
        href={routes.ADMIN_DREAL_LIST}
        {...(currentPage === 'list-dreal' && { isCurrent: true })}
      >
        Dreals
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={routes.ADMIN_PARTNER_USERS}
        {...(currentPage === 'admin-users' && { isCurrent: true })}
      >
        Partenaires
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={routes.ADMIN_INVITATION_DGEC_VALIDATEUR}
        {...(currentPage === 'inviter-dgec-validateur' && { isCurrent: true })}
      >
        Dgec validateurs
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={routes.GET_INVITER_UTILISATEUR_ADMINISTRATEUR_PAGE}
        {...(currentPage === 'inviter-administrateur' && { isCurrent: true })}
      >
        Administrateurs
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
      <DropdownMenu.DropdownItem href={Routes.Abandon.lister}>Abandons</DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Recours.lister}>Recours</DropdownMenu.DropdownItem>
    </DropdownMenu>
    <MenuGarantiesFinancières currentPage={currentPage} />
    <Header.MenuItem
      href={routes.USER_LIST_MISSING_OWNER_PROJECTS}
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
      <DropdownMenu.DropdownItem href={Routes.Abandon.lister}>Abandons</DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Recours.lister}>Recours</DropdownMenu.DropdownItem>
    </DropdownMenu>
    <MenuGarantiesFinancières currentPage={currentPage} />
  </>
);

const MenuGRD = () => (
  <Header.MenuItem href={Routes.Raccordement.importer}>
    Importer Dates de Mise en Service
  </Header.MenuItem>
);
