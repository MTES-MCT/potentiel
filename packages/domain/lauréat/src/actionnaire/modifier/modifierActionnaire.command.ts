import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { loadActionnaireFactory } from '../actionnaire.aggregate';

export type ModifierActionnaireCommand = Message<
  'Lauréat.Actionnaire.Command.ModifierActionnaire',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    actionnaire: string;
    dateModification: DateTime.ValueType;
    pièceJustificative?: DocumentProjet.ValueType;
    raison: string;
  }
>;

export const registerModifierActionnaireCommand = (loadAggregate: LoadAggregate) => {
  const loadActionnaire = loadActionnaireFactory(loadAggregate);

  const handler: MessageHandler<ModifierActionnaireCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    actionnaire,
    dateModification,
    pièceJustificative,
    raison,
  }) => {
    const actionnaireAggrégat = await loadActionnaire(identifiantProjet);

    await actionnaireAggrégat.modifier({
      identifiantProjet,
      identifiantUtilisateur,
      actionnaire,
      dateModification,
      pièceJustificative,
      raison,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.ModifierActionnaire', handler);
};
