import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadActionnaireFactory } from '../actionnaire.aggregate';

export type DemanderModificationCommand = Message<
  'Lauréat.Actionnaire.Command.DemanderModification',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    raison?: string;
    actionnaire: string;
    pièceJustificative: DocumentProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateDemande: DateTime.ValueType;
  }
>;

export const registerDemandeModificationActionnaireCommand = (loadAggregate: LoadAggregate) => {
  const loadActionnaire = loadActionnaireFactory(loadAggregate);
  const handler: MessageHandler<DemanderModificationCommand> = async ({
    identifiantProjet,
    pièceJustificative,
    raison,
    actionnaire,
    identifiantUtilisateur,
    dateDemande,
  }) => {
    const actionnaireAggregate = await loadActionnaire(identifiantProjet, false);

    await actionnaireAggregate.demanderModification({
      identifiantProjet,
      pièceJustificative,
      raison,
      identifiantUtilisateur,
      dateDemande,
      actionnaire,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.DemanderModification', handler);
};
