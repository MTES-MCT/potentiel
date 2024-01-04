import { getAccessToken } from '@/utils/getAccessToken';
import { MainNavigation, MainNavigationProps } from '@codegouvfr/react-dsfr/MainNavigation';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Route } from 'next';

export async function UserBasedRoleNavigation() {
  const accessToken = await getAccessToken();

  const navigationItems = accessToken
    ? getNavigationItemsBasedOnRole(Utilisateur.convertirEnValueType(accessToken).role.nom)
    : [];

  return (
    <>
      <MainNavigation id="header-navigation" items={navigationItems}></MainNavigation>
    </>
  );
}

const getNavigationItemsBasedOnRole = (role: string): MainNavigationProps['items'] => {
  switch (role) {
    case 'admin':
    case 'dgec-validateur':
      return [
        {
          text: 'Projets',
          linkProps: {
            href: '/projets.html' as Route,
          },
        },
        {
          text: 'Demandes',
          menuLinks: [
            {
              text: 'Toutes les demandes',
              linkProps: {
                href: '/admin/demandes.html' as Route,
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
                href: '/admin/importer-candidats.html' as Route,
              },
            },
            {
              text: 'Courriers historiques',
              linkProps: {
                href: '/admin/importer-documents-historiques' as Route,
              },
            },
            {
              text: 'Dates de mise en service',
              linkProps: {
                href: '/admin/importer-dates-mise-en-service.html' as Route,
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
                href: '/admin/notifier-candidats.html' as Route,
              },
            },
            {
              text: 'Régénérer des attestations',
              linkProps: {
                href: '/admin/regenerer-attestations.html' as Route,
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
                href: '/admin/invitations.html' as Route,
              },
            },
            {
              text: 'Emails en erreur',
              linkProps: {
                href: '/admin/notifications.html' as Route,
              },
            },
            {
              text: 'Dreals',
              linkProps: {
                href: '/admin/dreals.html' as Route,
              },
            },
            {
              text: 'Partenaires',
              linkProps: {
                href: '/admin/utilisateurs-partenaires.html' as Route,
              },
            },
            {
              text: 'Dgec validateurs',
              linkProps: {
                href: '/admin/inviter-dgec-validateur.html' as Route,
              },
            },
            {
              text: 'Administrateurs',
              linkProps: {
                href: '/admin/inviter-administrateur.html' as Route,
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
                href: '/admin/statistiques.html' as Route,
              },
            },
            {
              text: 'Gérer les gestionnaires de réseau',
              linkProps: {
                href: '/admin/gestionnaires-reseau' as Route,
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
            href: '/projets.html' as Route,
          },
        },
        {
          text: 'Demandes',
          menuLinks: [
            {
              text: 'Toutes les demandes',
              linkProps: {
                href: '/admin/demandes.html' as Route,
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
            href: '/projets.html' as Route,
          },
        },
        {
          text: 'Demandes',
          menuLinks: [
            {
              text: 'Mes demandes',
              linkProps: {
                href: '/mes-demandes.html' as Route,
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
            href: '/projets-a-reclamer.html' as Route,
          },
        },
      ];
    case 'caisse-des-dépôts':
      return [
        {
          text: 'Projets',
          linkProps: {
            href: '/projets.html' as Route,
          },
        },
      ];
    case 'cre':
      return [
        {
          text: 'Projets',
          linkProps: {
            href: '/projets.html' as Route,
          },
        },
        {
          text: 'Tableau de bord',
          linkProps: {
            href: '/cre/statistiques.html' as Route,
          },
        },
      ];
    case 'ademe':
      return [
        {
          text: 'Projets',
          linkProps: {
            href: '/projets.html' as Route,
          },
        },
        {
          text: 'Tableau de bord',
          linkProps: {
            href: '/ademe/statistiques.html' as Route,
          },
        },
      ];
    case 'acheteur-obligé':
      return [
        {
          text: 'Projets',
          linkProps: {
            href: '/projets.html' as Route,
          },
        },
        {
          text: 'Tableau de bord',
          linkProps: {
            href: '/acheteur-oblige/statistiques.html' as Route,
          },
        },
      ];

    default:
      return [];
  }
};
