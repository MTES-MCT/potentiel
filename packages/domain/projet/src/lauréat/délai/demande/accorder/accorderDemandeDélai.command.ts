import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

import type {
  DocumentProjet,
  GetProjetAggregateRoot,
  IdentifiantProjet,
} from '../../../../index.js';

export type AccorderDemandeDélaiCommand = Message<
  'Lauréat.Délai.Command.AccorderDemandeDélai',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateDemande: DateTime.ValueType;
    dateAccord: DateTime.ValueType;
    nombreDeMois: number;
    réponseSignée: DocumentProjet.ValueType;
    rôleUtilisateur: Role.ValueType;
  }
>;

export const registerAccorderDemandeDélaiCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<AccorderDemandeDélaiCommand> = async ({
    identifiantProjet,
    dateAccord,
    dateDemande,
    identifiantUtilisateur,
    nombreDeMois,
    réponseSignée,
    rôleUtilisateur,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.délai.accorderDemandeDélai({
      identifiantUtilisateur,
      réponseSignée,
      dateAccord,
      nombreDeMois,
      rôleUtilisateur,
      dateDemande,
    });
  };
  mediator.register('Lauréat.Délai.Command.AccorderDemandeDélai', handler);
};
