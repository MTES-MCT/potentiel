import { MainNavigationProps } from '@codegouvfr/react-dsfr/MainNavigation';

import { Routes } from '@potentiel-applications/routes';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { getContext } from '@potentiel-applications/request-context';

import { NavLinks } from './NavLinks';

export function UserBasedRoleNavigation() {
  const utilisateur = getContext()?.utilisateur;

  const navigationItems = utilisateur ? getNavigationItemsBasedOnRole(utilisateur) : [];

  return <NavLinks items={navigationItems} />;
}

const menuLinks = {
  listerGarantiesFinancières: [
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
        href: Routes.GarantiesFinancières.demandeMainlevée.lister,
      },
    },
  ],
};

const getNavigationItemsBasedOnRole = (
  utilisateur: Utilisateur.ValueType,
): MainNavigationProps['items'] => {
  switch (utilisateur.role.nom) {
    case 'admin':
    case 'dgec-validateur':
      return [
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
              text: 'Toutes les demandes',
              linkProps: {
                href: '/admin/demandes.html',
              },
            },
            {
              text: 'Abandons',
              linkProps: {
                href: Routes.Abandon.lister,
              },
            },
            {
              text: 'Recours',
              linkProps: {
                href: Routes.Recours.lister,
              },
            },
          ],
        },
        {
          text: 'Garanties Financières',
          menuLinks: menuLinks.listerGarantiesFinancières,
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
          text: 'Imports',
          menuLinks: [
            {
              text: 'Courriers historiques',
              linkProps: {
                href: '/admin/importer-documents-historiques',
              },
            },
          ],
        },
        {
          text: 'Gestion des accès',
          menuLinks: [
            {
              text: 'Candidats en attente',
              linkProps: {
                href: '/admin/invitations.html',
              },
            },
            {
              text: 'Emails en erreur',
              linkProps: {
                href: '/admin/notifications.html',
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
                href: '/admin/statistiques.html',
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
      ];
    case 'dreal':
      return [
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
              text: 'Toutes les demandes',
              linkProps: {
                href: '/admin/demandes.html',
              },
            },
            {
              text: 'Abandons',
              linkProps: {
                href: Routes.Abandon.lister,
              },
            },
            {
              text: 'Recours',
              linkProps: {
                href: Routes.Recours.lister,
              },
            },
          ],
        },
        {
          text: 'Garanties Financières',
          menuLinks: [...menuLinks.listerGarantiesFinancières],
        },
        {
          text: 'Raccordements',
          linkProps: {
            href: Routes.Raccordement.lister,
          },
        },
      ];
    case 'porteur-projet':
      return [
        {
          text: 'Mes projets',
          linkProps: {
            href: '/projets.html',
          },
        },
        {
          text: 'Demandes',
          menuLinks: [
            {
              text: 'Mes demandes',
              linkProps: {
                href: '/mes-demandes.html',
              },
            },
            {
              text: 'Abandons',
              linkProps: {
                href: Routes.Abandon.lister,
              },
            },
            {
              text: 'Recours',
              linkProps: {
                href: Routes.Recours.lister,
              },
            },
          ],
        },
        {
          text: 'Garanties Financières',
          menuLinks: menuLinks.listerGarantiesFinancières,
        },
        {
          text: 'Projets à réclamer',
          linkProps: {
            href: '/projets-a-reclamer.html',
          },
        },
      ];
    case 'caisse-des-dépôts':
      return [
        {
          text: 'Projets',
          linkProps: {
            href: '/projets.html',
          },
        },
      ];
    case 'cre':
      return [
        {
          text: 'Projets',
          linkProps: {
            href: '/projets.html',
          },
        },
        {
          text: 'Abandons',
          linkProps: {
            href: Routes.Abandon.lister,
          },
        },
        {
          text: 'Recours',
          linkProps: {
            href: Routes.Recours.lister,
          },
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
            href: '/cre/statistiques.html',
          },
        },
      ];
    case 'ademe':
      return [
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
      ];
    case 'acheteur-obligé':
      return [
        {
          text: 'Projets',
          linkProps: {
            href: '/projets.html',
          },
        },
        {
          text: 'Tableau de bord',
          linkProps: {
            href: '/acheteur-oblige/statistiques.html',
          },
        },
      ];
    case 'grd':
      return [
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
      ];
    default:
      return [];
  }
};
