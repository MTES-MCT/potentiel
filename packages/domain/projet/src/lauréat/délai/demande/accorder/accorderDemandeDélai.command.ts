import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Role } from '@potentiel-domain/utilisateur';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type AccorderDemandeDélaiCommand = Message<
  'Lauréat.Délai.Command.AccorderDemandeDélai',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
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
    });
  };
  mediator.register('Lauréat.Délai.Command.AccorderDemandeDélai', handler);
};
