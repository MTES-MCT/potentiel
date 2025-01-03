import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { loadActionnaireFactory } from '../actionnaire.aggregate';

export type TransmettreActionnaireCommand = Message<
  'Lauréat.Actionnaire.Command.TransmettreActionnaire',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    actionnaire: string;
    dateTransmission: DateTime.ValueType;
    pièceJustificative?: DocumentProjet.ValueType;
  }
>;

export const registerTransmettreActionnaireCommand = (loadAggregate: LoadAggregate) => {
  const loadActionnaire = loadActionnaireFactory(loadAggregate);
  const handler: MessageHandler<TransmettreActionnaireCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    actionnaire,
    dateTransmission,
    pièceJustificative,
  }) => {
    const actionnaireAggrégat = await loadActionnaire(identifiantProjet, false);

    await actionnaireAggrégat.transmettre({
      identifiantProjet,
      identifiantUtilisateur,
      actionnaire,
      dateTransmission,
      pièceJustificative,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.TransmettreActionnaire', handler);
};
