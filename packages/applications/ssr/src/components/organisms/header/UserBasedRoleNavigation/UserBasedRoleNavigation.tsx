import type { MainNavigationProps } from '@codegouvfr/react-dsfr/MainNavigation';
import type { MenuProps } from '@codegouvfr/react-dsfr/MainNavigation/Menu';
import { headers } from 'next/headers';

import { Routes } from '@potentiel-applications/routes';
import type { Role, Utilisateur } from '@potentiel-domain/utilisateur';

import { isFeatureEnabled } from '@/app/_helpers/getFeatureFlag';
import { getSessionUser } from '@/auth/getSessionUser';
import { NavLinks } from '../NavLinks';
import { getDemandesLinks } from './getDemandesLinks';
export async function UserBasedRoleNavigation() {
  const utilisateur = await getSessionUser({ headers: await headers() });

  const navigationItems = utilisateur ? getNavigationItemsBasedOnRole(utilisateur) : [];

  return <NavLinks items={navigationItems} />;
}

export type MenuItem = {
  label: string;
  url: string;
  permission: Role.Policy | Array<Role.Policy> | false;
};

const mapToMenuProps = (items: MenuItem[], rôle: Role.ValueType): Array<MenuProps.Link> =>
  items
    .filter(({ permission }) => {
      if (Array.isArray(permission)) {
        return permission.some((perm) => typeof perm === 'string' && rôle.aLaPermission(perm));
      }

      return typeof permission === 'string' && rôle.aLaPermission(permission);
    })
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

  const toutesDemandesMenuLinks: Array<MenuItem> = getDemandesLinks({
    estPorteur: rôle.estPorteur(),
    autorité: rôle.estDGEC() ? 'dgec' : rôle.estDreal() ? 'dreal' : undefined,
    keys: [
      'abandon',
      'actionnaire',
      'délai',
      'dispositifDeStockage',
      'fournisseur',
      'installateur',
      'natureDeLExploitation',
      'nomProjet',
      'puissance',
      'producteur',
      'recours',
      'représentantLégal',
    ],
  });

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
      url: Routes.Candidature.lister({ notifie: 'a-notifier' }),
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
      label: 'Inviter un utilisateur',
      url: Routes.Utilisateur.inviter,
      permission: 'utilisateur.inviter',
    },
  ];

  const donnéesMenuLinks: Array<MenuItem> = [
    {
      label: 'Exports',
      url: Routes.Export.page,
      permission: [
        'raccordement.exporterDossierRaccordement',
        'candidature.exporterDétailsFournisseur',
        'lauréat.exporterListe',
        'éliminé.exporterListe',
        'candidature.exporterListe',
      ],
    },
    {
      label: 'Statistiques',
      url: 'https://potentiel.e2.rie.gouv.fr/',
      permission: 'statistiquesDGEC.consulter',
    },
  ];

  const menu: MainNavigationProps.Item[] = [
    ...(isFeatureEnabled('tableau-de-bord')
      ? mapToMenuProps(
          [
            {
              label: 'Tableau de bord',
              url: Routes.TableauDeBord.consulter(),
              permission: 'tableauDeBord.consulter',
            },
          ],
          rôle,
        ).map((link) => ({
          text: link.text,
          linkProps: link.linkProps,
        }))
      : []),
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
      text: 'Accès',
      menuLinks: mapToMenuProps(utilisateurMenuLinks, rôle),
    },
    {
      text: 'Données',
      menuLinks: mapToMenuProps(donnéesMenuLinks, rôle),
    },
    ...mapToMenuProps(
      [
        {
          label: 'Projets à réclamer',
          url: Routes.Accès.réclamerProjet,
          permission: 'accès.réclamerProjet',
        },
      ],
      rôle,
    ),
  ];

  return menu.filter(({ menuLinks, linkProps }) => menuLinks?.length || linkProps?.href);
};
