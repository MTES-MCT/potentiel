import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser.handler';
import { MainNavigation, MainNavigationProps } from '@codegouvfr/react-dsfr/MainNavigation';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-libraries/routes';

export async function UserBasedRoleNavigation() {
  let utilisateur: Utilisateur.ValueType | undefined;

  try {
    utilisateur = await getAuthenticatedUser({});
  } catch (error) {}

  const navigationItems = utilisateur ? getNavigationItemsBasedOnRole(utilisateur) : [];

  return <MainNavigation items={navigationItems} />;
}

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
          ],
        },
        {
          text: 'Imports',
          menuLinks: [
            {
              text: 'Nouveaux candidats',
              linkProps: {
                href: '/admin/importer-candidats.html',
              },
            },
            {
              text: 'Courriers historiques',
              linkProps: {
                href: '/admin/importer-documents-historiques',
              },
            },
            {
              text: 'Dates de mise en service',
              linkProps: {
                href: '/admin/importer-dates-mise-en-service.html',
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
                href: '/admin/notifier-candidats.html',
              },
            },
            {
              text: 'Régénérer des attestations',
              linkProps: {
                href: '/admin/regenerer-attestations.html',
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
          ],
        },
        {
          text: 'Garanties Financières',
          linkProps: {
            href: '/admin/garanties-financieres.html',
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
          ],
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

    default:
      return [];
  }
};
