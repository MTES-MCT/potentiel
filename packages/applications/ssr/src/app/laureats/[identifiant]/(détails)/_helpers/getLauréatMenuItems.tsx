import { SideMenuProps } from '@codegouvfr/react-dsfr/SideMenu';
import React from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Utilisateur } from '@potentiel-domain/utilisateur';

import { BadgeTâches } from '../(components)/BadgeTâches';

export type MenuItem = SideMenuProps.Item;

type GetLauréatMenuItemsProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  utilisateur: Utilisateur.ValueType;
};

export const getLauréatMenuItems = async ({
  identifiantProjet,
  utilisateur,
}: GetLauréatMenuItemsProps): Promise<SideMenuProps.Item[]> => {
  const linkToSection = (text: string, href: string) => {
    return {
      linkProps: { href: `${Routes.Lauréat.détails(identifiantProjet.formatter())}/${href}` },
      text,
    };
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
    {
      text: 'Actions',
      items: [
        // seulement pour porteur, admin et dreal
        // est ce nécessaire de restreindre pour les autres rôles ?
        linkToSection('Imprimer la page', 'imprimer'),
      ],
    },
    tâchesMenu,
    linkToSection('Historique', 'historique'),
    linkToSection('Utilisateurs', 'utilisateurs'),
  ].filter((item) => !!item);
};
