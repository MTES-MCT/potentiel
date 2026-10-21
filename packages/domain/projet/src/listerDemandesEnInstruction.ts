import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime, Email } from '@potentiel-domain/common';

import type { GetNombreDemandesProjet } from './getNombreDemandesProjet.port.js';
import type { GetScopeProjetUtilisateur } from './getScopeProjetUtilisateur.port.js';
import type { AutoritéCompétente } from './lauréat/abandon/index.js';

export type DemandesEnInstructionListItemReadModel = Record<
  AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction,
  { total: number; new: number }
>;

export type ListerDemandesEnInstructionReadModel = {
  items: DemandesEnInstructionListItemReadModel;
};

export type ListerDemandesEnInstructionQuery = Message<
  'Projet.Query.ListerDemandesEnInstruction',
  {
    utilisateur: Email.RawType;
    appelOffre?: Array<string>;
    autoritéCompétente: AutoritéCompétente.RawType;
  },
  ListerDemandesEnInstructionReadModel
>;

export type ListerDemandesEnInstructionDependencies = {
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
  getNombreDemandesProjet: GetNombreDemandesProjet;
};

export const registerListerDemandesEnInstructionQuery = ({
  getScopeProjetUtilisateur,
  getNombreDemandesProjet,
}: ListerDemandesEnInstructionDependencies) => {
  const handler: MessageHandler<ListerDemandesEnInstructionQuery> = async ({
    autoritéCompétente,
    utilisateur,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const items = await getNombreDemandesProjet(
      autoritéCompétente,
      DateTime.now().retirerNombreDeMois(1).formatter(),
      scope.régions,
    );

    return {
      items,
    };
  };

  mediator.register('Projet.Query.ListerDemandesEnInstruction', handler);
};
