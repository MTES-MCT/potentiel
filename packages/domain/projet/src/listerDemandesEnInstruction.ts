import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { Email } from '@potentiel-domain/common';
import type { RangeOptions } from '@potentiel-domain/entity';

import type { GetNombreDemandesProjet } from './getNombreDemandesProjet.port.js';
import type { GetScopeProjetUtilisateur } from './getScopeProjetUtilisateur.port.js';
import type { AutoritéCompétente } from './lauréat/abandon/index.js';

type DemandesEnInstructionListItemReadModel = Record<
  AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction,
  { count: number }
>;

export type ListerDemandesEnInstructionReadModel = {
  items: DemandesEnInstructionListItemReadModel;
  range?: RangeOptions;
};

export type ListerDemandesEnInstructionQuery = Message<
  'Projet.Query.ListerDemandesEnInstruction',
  {
    utilisateur: Email.RawType;
    appelOffre?: Array<string>;
    autoritéCompétente: AutoritéCompétente.RawType;
    range?: RangeOptions;
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
    range,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const items = await getNombreDemandesProjet(autoritéCompétente, scope.régions, undefined);

    return {
      items,
      range,
    };
  };

  mediator.register('Projet.Query.ListerDemandesEnInstruction', handler);
};
