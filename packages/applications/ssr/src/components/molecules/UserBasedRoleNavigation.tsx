import { MainNavigationProps } from '@codegouvfr/react-dsfr/MainNavigation';

import { Routes } from '@potentiel-applications/routes';
import { Utilisateur } from '@potentiel-domain/utilisateur';

import { getOptionalAuthenticatedUser } from '@/utils/getAuthenticatedUser.handler';

import { NavLinks } from './NavLinks';

export async function UserBasedRoleNavigation() {
  const utilisateur = await getOptionalAuthenticatedUser();

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
              text: 'Notifier des candidats',
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
          text: 'Imports',
          menuLinks: [
            {
              text: 'Courriers historiques',
              linkProps: {
                href: '/admin/importer-documents-historiques',
              },
            },
            {
              text: 'Dates de mise en service',
              linkProps: {
                href: Routes.Raccordement.importer,
              },
            },
            {
              text: 'Correction de références dossier',
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
            {
              text: 'Dreals',
              linkProps: {
                href: '/admin/dreals.html',
              },
            },
            {
              text: 'Partenaires',
              linkProps: {
                href: '/admin/utilisateurs-partenaires.html',
              },
            },
            {
              text: 'Dgec validateurs',
              linkProps: {
                href: '/admin/inviter-dgec-validateur.html',
              },
            },
            {
              text: 'Administrateurs',
              linkProps: {
                href: '/admin/inviter-administrateur.html',
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
          text: 'Dates de mise en service',
          linkProps: {
            href: Routes.Raccordement.importer,
          },
        },
      ];
    default:
      return [];
  }
};
