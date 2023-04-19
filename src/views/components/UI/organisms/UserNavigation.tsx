import React from 'react';
import routes from '@routes';
import { Header } from '../../Header';
import { DropdownMenu } from '../molecules/dropdowns/DropdownMenu';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';

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
      return MenuAdmin(currentPage);
    case 'dgec-validateur':
      return MenuAdmin(currentPage);
    case 'cre':
      return MenuCre(currentPage);
    case 'caisse-des-dépôts':
      return MenuCaisseDesDépôts(currentPage);
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
    <Header.MenuItem
      href={routes.ADMIN_LIST_REQUESTS}
      {...(currentPage === 'list-requests' && { isCurrent: true })}
    >
      Demandes
    </Header.MenuItem>
    <DropdownMenu buttonChildren={'Imports'}>
      <DropdownMenu.DropdownItem
        href={routes.IMPORT_PROJECTS}
        {...(currentPage === 'import-projects' && { isCurrent: true })}
      >
        Nouveaux candidats
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={routes.UPLOAD_LEGACY_MODIFICATION_FILES}
        {...(currentPage === 'admin-upload-legacy-modification-files' && { isCurrent: true })}
      >
        Courriers historiques
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={routes.IMPORT_DONNEES_RACCORDEMENT}
        {...(currentPage === 'import-données-raccordement' && { isCurrent: true })}
      >
        Données de raccordement
      </DropdownMenu.DropdownItem>
    </DropdownMenu>
    <DropdownMenu buttonChildren={'Désignation'}>
      <DropdownMenu.DropdownItem
        href={routes.GET_NOTIFIER_CANDIDATS()}
        {...(currentPage === 'notify-candidates' && { isCurrent: true })}
      >
        Notifier des candidats
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={routes.ADMIN_REGENERATE_CERTIFICATES}
        {...(currentPage === 'regenerate-certificates' && { isCurrent: true })}
      >
        Régénérer des attestations
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
    </DropdownMenu>

    <DropdownMenu buttonChildren={'Outils'}>
      <DropdownMenu.DropdownItem
        href={routes.ADMIN_STATISTIQUES}
        {...(currentPage === 'admin-statistiques' && { isCurrent: true })}
      >
        Tableau de bord
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={routes.GET_LISTE_GESTIONNAIRES_RESEAU}
        {...(currentPage === 'liste-gestionnaires-réseau' && { isCurrent: true })}
      >
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
    <Header.MenuItem
      href={routes.USER_LIST_REQUESTS}
      {...(currentPage === 'list-requests' && { isCurrent: true })}
    >
      Mes demandes
    </Header.MenuItem>
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
    <Header.MenuItem
      href={routes.ADMIN_LIST_REQUESTS}
      {...(currentPage === 'list-requests' && { isCurrent: true })}
    >
      Demandes
    </Header.MenuItem>
    <Header.MenuItem
      href={routes.ADMIN_GARANTIES_FINANCIERES}
      {...(currentPage === 'list-garanties-financieres' && { isCurrent: true })}
    >
      Garanties Financières
    </Header.MenuItem>
  </>
);
