import { MainNavigationProps } from '@codegouvfr/react-dsfr/MainNavigation';
import { match, P } from 'ts-pattern';
import { MenuProps } from '@codegouvfr/react-dsfr/MainNavigation/Menu';

import { Routes } from '@potentiel-applications/routes';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { getContext } from '@potentiel-applications/request-context';

import { NavLinks } from './NavLinks';

export function UserBasedRoleNavigation() {
  const utilisateur = getContext()?.utilisateur;

  const navigationItems = utilisateur ? getNavigationItemsBasedOnRole(utilisateur) : [];

  return <NavLinks items={navigationItems} />;
}

const toutesLesDemandesWording = 'Toutes les demandes';

const getNavigationItemsBasedOnRole = (utilisateur: Utilisateur.ValueType) => {
  const projetMenuLinks: Array<MenuProps.Link> = [
    {
      text: 'Lauréats',
      linkProps: {
        href: Routes.Lauréat.lister(),
      },
    },
    {
      text: 'Éliminés',
      linkProps: {
        href: Routes.Éliminé.lister(),
      },
    },
  ];

  const demandesMenuLinks: Array<MenuProps.Link> = [
    {
      text: 'Abandon',
      linkProps: {
        href: Routes.Abandon.lister({
          statut: utilisateur.estPorteur()
            ? ['demandé', 'en-instruction', 'confirmé', 'confirmation-demandée']
            : ['demandé', 'en-instruction', 'confirmé'],
          autorite: utilisateur.estDGEC() ? 'dgec' : utilisateur.estDreal() ? 'dreal' : undefined,
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
        href: Routes.ReprésentantLégal.changement.lister({ statut: ['demandé'] }),
      },
    },
    {
      text: 'Actionnaire',
      linkProps: {
        href: Routes.Actionnaire.changement.lister({ statut: ['demandé'] }),
      },
    },

    {
      text: 'Puissance',
      linkProps: {
        href: Routes.Puissance.changement.lister({
          statut: ['demandé'],
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
        href: Routes.Délai.lister({
          statut: ['demandé', 'en-instruction'],
          autoriteCompetente: utilisateur.rôle.estDGEC()
            ? 'dgec'
            : utilisateur.rôle.estDreal()
              ? 'dreal'
              : undefined,
        }),
      },
    },
    {
      text: "Nature de l'exploitation",
      linkProps: {
        href: Routes.NatureDeLExploitation.changement.lister,
      },
    },
    {
      text: 'Installateur',
      linkProps: {
        href: Routes.Installation.changement.installateur.lister,
      },
    },
    {
      text: 'Dispositif de stockage',
      linkProps: {
        href: Routes.Installation.changement.dispositifDeStockage.lister,
      },
    },
    {
      text: 'Nom du projet',
      linkProps: {
        href: Routes.Lauréat.changement.nomProjet.lister,
      },
    },
  ];

  const garantiesFinancièresMenuLinks: Array<MenuProps.Link> = [
    {
      text: 'Garanties financières à traiter',
      linkProps: {
        href: Routes.GarantiesFinancières.dépôt.lister(),
      },
    },
    {
      text: 'Projets avec garanties financières en attente',
      linkProps: {
        href: Routes.GarantiesFinancières.enAttente.lister({ statut: 'actif' }),
      },
    },
    {
      text: 'Demandes de mainlevée',
      linkProps: {
        href: Routes.GarantiesFinancières.demandeMainlevée.lister({
          statut: ['demandé', 'en-instruction'],
        }),
      },
    },
  ];

  return match(utilisateur.rôle.nom)
    .returnType<MainNavigationProps['items']>()
    .with(P.union('admin', 'dgec-validateur'), () => [
      {
        text: 'Projets',
        menuLinks: projetMenuLinks,
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
              href: Routes.Candidature.importer(),
            },
          },
          {
            text: 'Candidats à notifier',
            linkProps: {
              href: Routes.Période.lister({
                statut: 'a-notifier',
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
          {
            text: 'Export de données',
            linkProps: {
              href: Routes.Export.page,
            },
          },
        ],
      },
    ])
    .with('dreal', () => [
      {
        text: 'Projets',
        menuLinks: projetMenuLinks,
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
        text: 'Projets',
        menuLinks: projetMenuLinks,
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
        menuLinks: projetMenuLinks,
      },
    ])
    .with('cre', () => [
      {
        text: 'Projets',
        menuLinks: projetMenuLinks,
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
        text: 'Export de données',
        linkProps: {
          href: Routes.Export.page,
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
        menuLinks: projetMenuLinks,
      },
      {
        text: 'Tableau de bord',
        linkProps: {
          href: 'https://potentiel.e2.rie.gouv.fr/',
        },
      },
    ])
    .with('cocontractant', () => [
      {
        text: 'Projets',
        menuLinks: projetMenuLinks,
      },
      {
        text: 'Demandes',
        menuLinks: [
          {
            text: 'Représentant légal',
            linkProps: {
              href: Routes.ReprésentantLégal.changement.lister({ statut: ['demandé'] }),
            },
          },
          {
            text: 'Actionnaire(s)',
            linkProps: {
              href: Routes.Actionnaire.changement.lister({ statut: ['demandé'] }),
            },
          },
          {
            text: 'Puissance',
            linkProps: {
              href: Routes.Puissance.changement.lister({
                statut: ['demandé'],
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
              href: Routes.Délai.lister({
                statut: ['demandé', 'en-instruction'],
                autoriteCompetente: utilisateur.rôle.estDGEC()
                  ? 'dgec'
                  : utilisateur.rôle.estDreal()
                    ? 'dreal'
                    : undefined,
              }),
            },
          },
          {
            text: "Nature de l'exploitation",
            linkProps: {
              href: Routes.NatureDeLExploitation.changement.lister,
            },
          },
          {
            text: 'Installateur',
            linkProps: {
              href: Routes.Installation.changement.installateur.lister,
            },
          },
          {
            text: 'Dispositif de stockage',
            linkProps: {
              href: Routes.Installation.changement.dispositifDeStockage.lister,
            },
          },
          {
            text: 'Nom du projet',
            linkProps: {
              href: Routes.Lauréat.changement.nomProjet.lister,
            },
          },
        ],
      },
      {
        text: 'Export de données',
        linkProps: {
          href: Routes.Export.page,
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
