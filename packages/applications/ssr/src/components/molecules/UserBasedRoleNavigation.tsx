import { getAccessToken } from '@/utils/getAccessToken';
import { MainNavigation, MainNavigationProps } from '@codegouvfr/react-dsfr/MainNavigation';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Route } from 'next';

import { ROUTES_LEGACY } from '@/routes.legacy';

export async function UserBasedRoleNavigation() {
  const accessToken = await getAccessToken();

  const navigationItems = accessToken
    ? getNavigationItemsBasedOnRole(Utilisateur.convertirEnValueType(accessToken).role.nom)
    : [];

  return <MainNavigation id="header-navigation" items={navigationItems}></MainNavigation>;
}

const getNavigationItemsBasedOnRole = (role: string): MainNavigationProps['items'] => {
  switch (role) {
    case 'admin':
    case 'dgec-validateur':
      return [
        {
          text: 'Projets',
          linkProps: {
            href: ROUTES_LEGACY.GET_LISTE_PROJETS,
          },
        },
        {
          text: 'Demandes',
          menuLinks: [
            {
              text: 'Toutes les demandes',
              linkProps: {
                href: ROUTES_LEGACY.GET_LISTE_DEMANDES,
              },
            },
            {
              text: 'Abandons',
              linkProps: {
                href: '/laureats/abandons',
              },
            },
          ],
        },
        {
          text: 'Imports',
          menuLinks: [
            {
              text: 'Nouveaux candidats',
              linkProps: {
                href: ROUTES_LEGACY.GET_IMPORT_CANDIDATS,
              },
            },
            {
              text: 'Courriers historiques',
              linkProps: {
                href: ROUTES_LEGACY.GET_IMPORT_DOCUMENTS_HISTORIQUE,
              },
            },
            {
              text: 'Dates de mise en service',
              linkProps: {
                href: ROUTES_LEGACY.GET_IMPORT_DATES_MISE_EN_SERVICE,
              },
            },
          ],
        },
        {
          text: 'Désignation',
          menuLinks: [
            {
              text: 'Notifier des candidats',
              linkProps: {
                href: ROUTES_LEGACY.GET_NOTIFIER_CANDIDATS,
              },
            },
            {
              text: 'Régénérer des attestations',
              linkProps: {
                href: ROUTES_LEGACY.GET_REGENERER_CERTIFICATS,
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
                href: ROUTES_LEGACY.GET_LISTE_CANDIDATS_EN_ATTENTE,
              },
            },
            {
              text: 'Emails en erreur',
              linkProps: {
                href: ROUTES_LEGACY.GET_LISTE_EMAILS_EN_ERREUR,
              },
            },
            {
              text: 'Dreals',
              linkProps: {
                href: ROUTES_LEGACY.GET_LISTE_DREALS,
              },
            },
            {
              text: 'Partenaires',
              linkProps: {
                href: ROUTES_LEGACY.GET_LISTE_PARTENAIRES,
              },
            },
            {
              text: 'Dgec validateurs',
              linkProps: {
                href: ROUTES_LEGACY.GET_INVITER_DGEC_VALIDATEUR,
              },
            },
            {
              text: 'Administrateurs',
              linkProps: {
                href: ROUTES_LEGACY.GET_INVITER_ADMINISTRATEUR,
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
                href: ROUTES_LEGACY.GET_ADMIN_STATISTIQUES,
              },
            },
            {
              text: 'Gérer les gestionnaires de réseau',
              linkProps: {
                href: ROUTES_LEGACY.GET_LISTE_GESTIONNAIRES_RESEAU,
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
            href: ROUTES_LEGACY.GET_LISTE_PROJETS,
          },
        },
        {
          text: 'Demandes',
          menuLinks: [
            {
              text: 'Toutes les demandes',
              linkProps: {
                href: ROUTES_LEGACY.GET_LISTE_DEMANDES,
              },
            },
            {
              text: 'Abandons',
              linkProps: {
                href: '/laureats/abandons',
              },
            },
          ],
        },
        {
          text: 'Garanties Financières',
          linkProps: {
            href: '/admin/garanties-financieres.html' as Route,
          },
        },
      ];
    case 'porteur-projet':
      return [
        {
          text: 'Mes projets',
          linkProps: {
            href: ROUTES_LEGACY.GET_LISTE_PROJETS,
          },
        },
        {
          text: 'Demandes',
          menuLinks: [
            {
              text: 'Mes demandes',
              linkProps: {
                href: ROUTES_LEGACY.GET_LISTE_DEMANDES_PORTEURS,
              },
            },
            {
              text: 'Abandons',
              linkProps: {
                href: '/laureats/abandons',
              },
            },
          ],
        },
        {
          text: 'Projets à réclamer',
          linkProps: {
            href: ROUTES_LEGACY.GET_LISTE_PROJETS_A_RECLAMER,
          },
        },
      ];
    case 'caisse-des-dépôts':
      return [
        {
          text: 'Projets',
          linkProps: {
            href: ROUTES_LEGACY.GET_LISTE_PROJETS,
          },
        },
      ];
    case 'cre':
      return [
        {
          text: 'Projets',
          linkProps: {
            href: ROUTES_LEGACY.GET_LISTE_PROJETS,
          },
        },
        {
          text: 'Tableau de bord',
          linkProps: {
            href: ROUTES_LEGACY.GET_CRE_STATISTIQUES,
          },
        },
      ];
    case 'ademe':
      return [
        {
          text: 'Projets',
          linkProps: {
            href: ROUTES_LEGACY.GET_LISTE_PROJETS,
          },
        },
        {
          text: 'Tableau de bord',
          linkProps: {
            href: ROUTES_LEGACY.GET_ADEME_STATISTIQUES,
          },
        },
      ];
    case 'acheteur-obligé':
      return [
        {
          text: 'Projets',
          linkProps: {
            href: ROUTES_LEGACY.GET_LISTE_PROJETS,
          },
        },
        {
          text: 'Tableau de bord',
          linkProps: {
            href: ROUTES_LEGACY.GET_ACHETEUR_OBLIGE_STATISTIQUES,
          },
        },
      ];

    default:
      return [];
  }
};
