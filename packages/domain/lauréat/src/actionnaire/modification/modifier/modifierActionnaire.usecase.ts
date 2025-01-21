import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { Role } from '@potentiel-domain/utilisateur';

import { TypeDocumentActionnaire } from '../..';

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
    rôleValue: string;
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
    rôleValue,
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

    const rôle = Role.convertirEnValueType(rôleValue);

    await mediator.send<ModifierActionnaireCommand>({
      type: 'Lauréat.Actionnaire.Command.ModifierActionnaire',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        actionnaire: actionnaireValue,
        dateModification: DateTime.convertirEnValueType(dateModificationValue),
        pièceJustificative,
        rôle,
        raison: raisonValue,
      },
    });
  };
  mediator.register('Lauréat.Actionnaire.UseCase.ModifierActionnaire', runner);
};
