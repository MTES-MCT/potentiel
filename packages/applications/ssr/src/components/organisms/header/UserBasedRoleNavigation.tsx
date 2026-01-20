import { MainNavigationProps } from '@codegouvfr/react-dsfr/MainNavigation';
import { MenuProps } from '@codegouvfr/react-dsfr/MainNavigation/Menu';

import { Routes } from '@potentiel-applications/routes';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { getContext } from '@potentiel-applications/request-context';

import { NavLinks } from './NavLinks';

export function UserBasedRoleNavigation() {
  const utilisateur = getContext()?.utilisateur;

  const navigationItems = utilisateur ? getNavigationItemsBasedOnRole(utilisateur) : [];

  return <NavLinks items={navigationItems} />;
}

type MenuItem = { label: string; url: string; permission: Role.Policy | false };
const mapToMenuProps = (items: MenuItem[], rôle: Role.ValueType): Array<MenuProps.Link> =>
  items
    .filter(({ permission }) => typeof permission === 'string' && rôle.aLaPermission(permission))
    .map(({ label, url }) => ({
      text: label,
      linkProps: {
        href: url,
      },
    }));

const getNavigationItemsBasedOnRole = ({ rôle }: Utilisateur.ValueType) => {
  const projetMenuLinks: Array<MenuItem> = [
    {
      label: 'Lauréats',
      url: Routes.Lauréat.lister(),
      permission: 'lauréat.lister',
    },
    {
      label: 'Éliminés',
      url: Routes.Éliminé.lister(),
      permission: 'éliminé.lister',
    },
  ];

  const toutesDemandesMenuLinks: Array<MenuItem> = [
    {
      label: 'Actionnaire',
      url: Routes.Actionnaire.changement.lister({ statut: ['demandé'] }),
      permission: 'actionnaire.listerChangement',
    },
    {
      label: 'Délai',
      url: Routes.Délai.lister({
        statut: ['demandé', 'en-instruction'],
        autoriteCompetente: rôle.estDGEC() ? 'dgec' : rôle.estDreal() ? 'dreal' : undefined,
      }),
      permission: 'délai.listerDemandes',
    },
    {
      label: 'Dispositif de stockage',
      url: Routes.Installation.changement.dispositifDeStockage.lister,
      permission: 'installation.dispositifDeStockage.listerChangement',
    },
    {
      label: 'Fournisseur',
      url: Routes.Fournisseur.changement.lister,
      permission: 'fournisseur.listerChangement',
    },
    {
      label: 'Installateur',
      url: Routes.Installation.changement.installateur.lister,
      permission: 'installation.installateur.listerChangement',
    },
    {
      label: "Nature de l'exploitation",
      url: Routes.NatureDeLExploitation.changement.lister,
      permission: 'natureDeLExploitation.listerChangement',
    },
    {
      label: 'Nom du projet',
      url: Routes.Lauréat.changement.nomProjet.lister,
      permission: 'nomProjet.listerChangement',
    },
    {
      label: 'Puissance',
      url: Routes.Puissance.changement.lister({
        statut: ['demandé'],
      }),
      permission: 'puissance.listerChangement',
    },
    {
      label: 'Producteur',
      url: Routes.Producteur.changement.lister,
      permission: 'producteur.listerChangement',
    },

    {
      label: 'Recours',
      url: Routes.Recours.lister({ statut: ['demandé', 'en-instruction'] }),
      permission: 'recours.consulter.liste',
    },
    {
      label: 'Représentant légal',
      url: Routes.ReprésentantLégal.changement.lister({ statut: ['demandé'] }),
      permission: 'représentantLégal.listerChangement',
    },
    {
      label: 'Abandon',
      url: Routes.Abandon.lister({
        statut: rôle.estPorteur()
          ? ['demandé', 'en-instruction', 'confirmé', 'confirmation-demandée']
          : ['demandé', 'en-instruction', 'confirmé'],
        autorite: rôle.estDGEC() ? 'dgec' : rôle.estDreal() ? 'dreal' : undefined,
      }),
      permission: 'abandon.lister.demandes',
    },
  ];

  const garantiesFinancièresMenuLinks: Array<MenuItem> = [
    {
      label: 'Garanties financières à traiter',
      url: Routes.GarantiesFinancières.dépôt.lister(),
      permission: 'garantiesFinancières.dépôt.lister',
    },
    {
      label: 'Projets avec garanties financières en attente',
      url: Routes.GarantiesFinancières.enAttente.lister({ statut: 'actif' }),
      permission: 'garantiesFinancières.enAttente.lister',
    },
    {
      label: 'Demandes de mainlevée',
      url: Routes.GarantiesFinancières.demandeMainlevée.lister({
        statut: ['demandé', 'en-instruction'],
      }),
      permission: 'garantiesFinancières.mainlevée.lister',
    },
  ];

  const candidatureMenuLinks: Array<MenuItem> = [
    {
      label: 'Nouveaux candidats',
      url: Routes.Candidature.importer(),
      permission: 'candidature.importer',
    },
    {
      label: 'Candidats à notifier',
      url: Routes.Période.lister({
        statut: 'a-notifier',
      }),
      permission: 'période.lister',
    },
    {
      label: 'Correction par lot',
      url: Routes.Candidature.corrigerParLot,
      permission: 'candidature.corriger',
    },
    {
      label: 'Tous les candidats',
      url: Routes.Candidature.lister({ estNotifié: false }),
      permission: 'candidature.lister',
    },
  ];

  const raccordementsMenuLinks: Array<MenuItem> = [
    {
      label: 'Tous les dossiers de raccordement',
      url: Routes.Raccordement.lister,
      permission: 'raccordement.listerDossierRaccordement',
    },
    {
      label: 'Importer des dates de mise en service',
      url: Routes.Raccordement.importer,
      permission: 'raccordement.date-mise-en-service.transmettre',
    },
    {
      label: 'Corriger des références dossier',
      url: Routes.Raccordement.corrigerRéférencesDossier,
      permission: rôle.estPorteur() ? false : 'raccordement.référence-dossier.modifier',
    },
    {
      label: 'Gérer les gestionnaires de réseau',
      url: Routes.Gestionnaire.lister,
      permission: 'réseau.gestionnaire.lister',
    },
  ];

  const utilisateurMenuLinks: Array<MenuItem> = [
    {
      label: 'Utilisateurs',
      url: Routes.Utilisateur.lister({ actif: true }),
      permission: 'utilisateur.lister',
    },
    {
      label: 'Invitater un utilisateur',
      url: Routes.Utilisateur.inviter,
      permission: 'utilisateur.inviter',
    },
  ];

  const menu: MainNavigationProps.Item[] = [
    {
      text: 'Projets',
      menuLinks: mapToMenuProps(projetMenuLinks, rôle),
    },
    {
      text: 'Demandes',
      menuLinks: mapToMenuProps(toutesDemandesMenuLinks, rôle),
    },
    {
      text: 'Garanties Financières',
      menuLinks: mapToMenuProps(garantiesFinancièresMenuLinks, rôle),
    },
    {
      text: 'Candidatures',
      menuLinks: mapToMenuProps(candidatureMenuLinks, rôle),
    },
    {
      text: 'Raccordements',
      menuLinks: mapToMenuProps(raccordementsMenuLinks, rôle),
    },
    {
      text: 'Gestion des accès',
      menuLinks: mapToMenuProps(utilisateurMenuLinks, rôle),
    },
    ...mapToMenuProps(
      [
        {
          label: 'Projets à réclamer',
          url: Routes.Utilisateur.réclamerProjet,
          permission: 'accès.réclamerProjet',
        },
        {
          label: 'Tableau de bord',
          url: 'https://potentiel.e2.rie.gouv.fr/',
          permission: 'statistiquesDGEC.consulter',
        },
      ],
      rôle,
    ),
  ];

  return menu.filter(({ menuLinks, linkProps }) => menuLinks?.length || linkProps?.href);
};
