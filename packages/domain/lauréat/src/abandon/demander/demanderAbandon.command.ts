import { Message, MessageHandler, mediator } from 'mediateur';

import {
  DateTime,
  IdentifiantProjet,
  IdentifiantUtilisateur,
  LoadAggregateDependencies,
} from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { loadAbandonAggregateFactory } from '../abandon.aggregate';

export type DemanderAbandonCommand = Message<
  'DEMANDER_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    raison: string;
    pièceJustificative?: DocumentProjet.ValueType;
    recandidature: boolean;
    utilisateur: IdentifiantUtilisateur.ValueType;
    dateDemande: DateTime.ValueType;
  }
>;

export const registerDemanderAbandonCommand = (dependencies: LoadAggregateDependencies) => {
  const loadAbandonAggregate = loadAbandonAggregateFactory(dependencies);
  const handler: MessageHandler<DemanderAbandonCommand> = async ({
    identifiantProjet,
    pièceJustificative,
    raison,
    recandidature,
    utilisateur,
    dateDemande,
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet, false);

    await abandon.demander({
      identifiantProjet,
      pièceJustificative,
      raison,
      utilisateur,
      dateDemande,
      recandidature,
    });
  };
  mediator.register('DEMANDER_ABANDON_COMMAND', handler);
};
