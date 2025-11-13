import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '../../../document-projet';
import { TypeDocumentActionnaire } from '..';
import { IdentifiantProjet } from '../../..';

import { ModifierActionnaireCommand } from './modifierActionnaire.command';

export type ModifierActionnaireUseCase = Message<
  'Lauréat.Actionnaire.UseCase.ModifierActionnaire',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    actionnaireValue: string;
    pièceJustificativeValue?: {
      content: ReadableStream;
      format: string;
    };
    dateModificationValue: string;
    raisonValue: string;
  }
>;

export const registerModifierActionnaireUseCase = () => {
  const runner: MessageHandler<ModifierActionnaireUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    actionnaireValue,
    dateModificationValue,
    pièceJustificativeValue,
    raisonValue,
  }) => {
    const pièceJustificative = pièceJustificativeValue
      ? DocumentProjet.convertirEnValueType(
          identifiantProjetValue,
          TypeDocumentActionnaire.pièceJustificative.formatter(),
          dateModificationValue,
          pièceJustificativeValue.format,
        )
      : undefined;

    if (pièceJustificative) {
      await mediator.send<EnregistrerDocumentProjetCommand>({
        type: 'Document.Command.EnregistrerDocumentProjet',
        data: {
          content: pièceJustificativeValue!.content,
          documentProjet: pièceJustificative,
        },
      });
    }

    await mediator.send<ModifierActionnaireCommand>({
      type: 'Lauréat.Actionnaire.Command.ModifierActionnaire',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        actionnaire: actionnaireValue,
        dateModification: DateTime.convertirEnValueType(dateModificationValue),
        pièceJustificative,
        raison: raisonValue,
      },
    });
  };
  mediator.register('Lauréat.Actionnaire.UseCase.ModifierActionnaire', runner);
};
