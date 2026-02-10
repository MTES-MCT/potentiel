import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../index.js';

export type RéclamerAccèsProjetCommand = Message<
  'Projet.Accès.Command.RéclamerAccèsProjet',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateRéclamation: DateTime.ValueType;
  } & (
    | {
        type: 'avec-prix-numéro-cre';
        numéroCRE: string;
        prix: number;
      }
    | {
        type: 'même-email-candidature';
      }
  )
>;

export const registerRéclamerAccèsProjetCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<RéclamerAccèsProjetCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.accès.réclamer(payload);
  };
  mediator.register('Projet.Accès.Command.RéclamerAccèsProjet', handler);
};
