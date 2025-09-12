import { MainNavigationProps } from '@codegouvfr/react-dsfr/MainNavigation';
import { match, P } from 'ts-pattern';
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

const toutesLesDemandesWording = 'Toutes les demandes';

const getNavigationItemsBasedOnRole = (utilisateur: Utilisateur.ValueType) => {
  const demandesMenuLinks: Array<MenuProps.Link> = [
    {
      text: 'Abandon',
      linkProps: {
        href: Routes.Abandon.lister({
          statut: utilisateur.role.estÉgaleÀ(Role.porteur)
            ? ['demandé', 'en-instruction', 'confirmé', 'confirmation-demandée']
            : ['demandé', 'en-instruction', 'confirmé'],
        }),
      },
    },
    {
      text: 'Recours',
      linkProps: {
        href: Routes.Recours.lister({ statut: ['demandé', 'en-instruction'] }),
      },
    },
    {
      text: 'Représentant légal',
      linkProps: {
        href: Routes.ReprésentantLégal.changement.lister({ statut: 'demandé' }),
      },
    },
    {
      text: 'Actionnaire',
      linkProps: {
        href: Routes.Actionnaire.changement.lister({ statut: 'demandé' }),
      },
    },

    {
      text: 'Puissance',
      linkProps: {
        href: Routes.Puissance.changement.lister({
          statut: 'demandé',
          autoriteInstructrice: utilisateur.role.estDGEC()
            ? 'dgec-admin'
            : utilisateur.role.estDreal()
              ? 'dreal'
              : undefined,
        }),
      },
    },
    {
      text: 'Producteur',
      linkProps: {
        href: Routes.Producteur.changement.lister,
      },
    },
    {
      text: 'Fournisseur',
      linkProps: {
        href: Routes.Fournisseur.changement.lister,
      },
    },
    {
      text: 'Délai',
      linkProps: {
        href: Routes.Délai.lister,
      },
    },
  ];

  const garantiesFinancièresMenuLinks: Array<MenuProps.Link> = [
    {
      text: 'Garanties financières à traiter',
      linkProps: {
        href: Routes.GarantiesFinancières.dépôt.lister,
      },
    },
    {
      text: 'Projets avec garanties financières en attente',
      linkProps: {
        href: Routes.GarantiesFinancières.enAttente.lister,
      },
    },
    {
      text: 'Demandes de mainlevée en cours',
      linkProps: {
        href: Routes.GarantiesFinancières.demandeMainlevée.lister({ statut: 'demandé' }),
      },
    },
  ];

  return match(utilisateur.role.nom)
    .returnType<MainNavigationProps['items']>()
    .with(P.union('admin', 'dgec-validateur'), () => [
      {
        text: 'Projets',
        linkProps: {
          href: '/projets.html',
        },
      },
      {
        text: 'Demandes',
        menuLinks: demandesMenuLinks,
      },
      {
        text: 'Garanties Financières',
        menuLinks: garantiesFinancièresMenuLinks,
      },
      {
        text: 'Candidatures',
        menuLinks: [
          {
            text: 'Nouveaux candidats',
            linkProps: {
              href: Routes.Candidature.importer,
            },
          },
          {
            text: 'Candidats à notifier',
            linkProps: {
              href: Routes.Période.lister({
                statut: Routes.Période.defaultStatutValueForPériodeList,
              }),
            },
          },
          {
            text: 'Correction par lot',
            linkProps: {
              href: Routes.Candidature.corrigerParLot,
            },
          },
          {
            text: 'Tous les candidats',
            linkProps: {
              href: Routes.Candidature.lister({ estNotifié: false }),
            },
          },
        ],
      },
      {
        text: 'Raccordements',
        menuLinks: [
          {
            text: 'Tous les dossiers de raccordement',
            linkProps: {
              href: Routes.Raccordement.lister,
            },
          },
          {
            text: 'Importer des dates de mise en service',
            linkProps: {
              href: Routes.Raccordement.importer,
            },
          },
          {
            text: 'Corriger des références dossier',
            linkProps: {
              href: Routes.Raccordement.corrigerRéférencesDossier,
            },
          },
        ],
      },
      {
        text: 'Gestion des accès',
        menuLinks: [
          {
            text: 'Utilisateurs',
            linkProps: {
              href: Routes.Utilisateur.lister({ actif: true }),
            },
          },
          {
            text: 'Inviter un utilisateur',
            linkProps: {
              href: Routes.Utilisateur.inviter,
            },
          },
        ],
      },
      {
        text: 'Outils',
        menuLinks: [
          {
            text: 'Tableau de bord',
            linkProps: {
              href: 'https://potentiel.e2.rie.gouv.fr/',
            },
          },
          {
            text: 'Gérer les gestionnaires de réseau',
            linkProps: {
              href: Routes.Gestionnaire.lister,
            },
          },
        ],
      },
    ])
    .with('dreal', () => [
      {
        text: 'Projets',
        linkProps: {
          href: '/projets.html',
        },
      },
      {
        text: 'Demandes',
        menuLinks: demandesMenuLinks,
      },
      {
        text: 'Garanties Financières',
        menuLinks: garantiesFinancièresMenuLinks,
      },
      {
        text: 'Raccordements',
        linkProps: {
          href: Routes.Raccordement.lister,
        },
      },
      {
        text: 'Tableau de bord',
        linkProps: {
          href: 'https://potentiel.e2.rie.gouv.fr/',
        },
      },
    ])
    .with('porteur-projet', () => [
      {
        text: 'Mes projets',
        linkProps: {
          href: '/projets.html',
        },
      },
      {
        text: 'Demandes',
        menuLinks: demandesMenuLinks,
      },
      {
        text: 'Garanties Financières',
        menuLinks: garantiesFinancièresMenuLinks,
      },
      {
        text: 'Projets à réclamer',
        linkProps: {
          href: Routes.Utilisateur.réclamerProjet,
        },
      },
    ])
    .with('caisse-des-dépôts', () => [
      {
        text: 'Projets',
        linkProps: {
          href: '/projets.html',
        },
      },
    ])
    .with('cre', () => [
      {
        text: 'Projets',
        linkProps: {
          href: '/projets.html',
        },
      },
      {
        text: 'Demandes',
        menuLinks: demandesMenuLinks.filter((link) => link.text !== toutesLesDemandesWording),
      },
      {
        text: 'Raccordements',
        linkProps: {
          href: Routes.Raccordement.lister,
        },
      },
      {
        text: 'Tableau de bord',
        linkProps: {
          href: 'https://potentiel.e2.rie.gouv.fr/',
        },
      },
    ])
    .with('ademe', () => [
      {
        text: 'Projets',
        linkProps: {
          href: '/projets.html',
        },
      },
      {
        text: 'Tableau de bord',
        linkProps: {
          href: '/ademe/statistiques.html',
        },
      },
    ])
    .with('acheteur-obligé', () => [
      {
        text: 'Projets',
        linkProps: {
          href: '/projets.html',
        },
      },
      {
        text: 'Demandes',
        menuLinks: [
          {
            text: 'Représentant légal',
            linkProps: {
              href: Routes.ReprésentantLégal.changement.lister({ statut: 'demandé' }),
            },
          },
          {
            text: 'Actionnaire(s)',
            linkProps: {
              href: Routes.Actionnaire.changement.lister({ statut: 'demandé' }),
            },
          },
          {
            text: 'Puissance',
            linkProps: {
              href: Routes.Puissance.changement.lister({
                statut: 'demandé',
              }),
            },
          },
          {
            text: 'Producteur',
            linkProps: {
              href: Routes.Producteur.changement.lister,
            },
          },
          {
            text: 'Fournisseur',
            linkProps: {
              href: Routes.Fournisseur.changement.lister,
            },
          },
        ],
      },
      {
        text: 'Tableau de bord',
        linkProps: {
          href: '/acheteur-oblige/statistiques.html',
        },
      },
    ])
    .with('grd', () => [
      {
        text: 'Raccordements',
        menuLinks: [
          {
            text: 'Tous les dossiers de raccordement',
            linkProps: {
              href: Routes.Raccordement.lister,
            },
          },
          {
            text: 'Importer des dates de mise en service',
            linkProps: {
              href: Routes.Raccordement.importer,
            },
          },
          {
            text: 'Corriger des références dossier',
            linkProps: {
              href: Routes.Raccordement.corrigerRéférencesDossier,
            },
          },
        ],
      },
    ])
    .exhaustive();
};
