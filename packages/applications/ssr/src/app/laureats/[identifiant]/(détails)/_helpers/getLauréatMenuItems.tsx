import { SideMenuProps } from '@codegouvfr/react-dsfr/SideMenu';
import React from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Utilisateur } from '@potentiel-domain/utilisateur';

import { BadgeTâches } from '../(components)/BadgeTâches';
import { DomaineAction, getAction } from '../../_helpers';

export type MenuItem = SideMenuProps.Item;

type GetLauréatMenuItemsProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  utilisateur: Utilisateur.ValueType;
};

const domainesMap: Record<DomaineAction, boolean> = {
  abandon: true,
  dispositifDeStockage: true,
  délai: true,
  nomProjet: true,
  recours: true,
  installateur: true,
  natureDeLExploitation: true,
  puissance: true,
  fournisseur: true,
  producteur: true,
  représentantLégal: true,
  // TODO gestion du cas particulier Actionnaire
  actionnaire: true,
  siteDeProduction: true,
};
const domaines = Object.keys(domainesMap) as DomaineAction[];

export const getLauréatMenuItems = async ({
  identifiantProjet,
  utilisateur,
}: GetLauréatMenuItemsProps): Promise<SideMenuProps.Item[]> => {
  const link = (text: string, href: string) => ({ linkProps: { href }, text });
  const linkToSection = (text: string, path: string) =>
    link(text, `${Routes.Lauréat.détails(identifiantProjet.formatter())}/${path}`);
  const linkToAction = async (domain: DomaineAction) => {
    const action = await getAction({
      domain,
      identifiantProjet,
      rôle: utilisateur.rôle,
    });
    return action ? link(action.labelActions, action.url) : undefined;
  };

  const tâchesMenu = utilisateur.rôle.aLaPermission('tâche.consulter')
    ? {
        ...linkToSection('Tâches', 'taches'),
        text: (
          <BadgeTâches identifiantProjet={identifiantProjet} utilisateur={utilisateur}>
            Tâches
          </BadgeTâches>
        ),
      }
    : undefined;

  const actionsDomaine = (await Promise.all(domaines.map(linkToAction))).filter((item) => !!item);

  const modificationMenu =
    actionsDomaine.length > 0
      ? {
          text: 'Modification',
          items: actionsDomaine,
        }
      : undefined;

  return [
    linkToSection('Tableau de bord', ''),
    {
      text: 'Détails du projet',
      items: [
        linkToSection('Informations générales', 'informations-generales'),
        linkToSection('Évaluation carbone', 'evaluation-carbone'),
        linkToSection('Installation', 'installation'),
      ],
    },
    modificationMenu,
    tâchesMenu,
    linkToSection('Historique', 'historique'),
    linkToSection('Utilisateurs', 'utilisateurs'),
    // seulement pour porteur, admin et dreal
    // est ce nécessaire de restreindre pour les autres rôles ?
    linkToSection('Imprimer la page', 'imprimer'),
  ].filter((item) => !!item);
};
