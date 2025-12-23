import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../..';
import { TypeDocumentInstallateur } from '../..';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '../../../../document-projet';

import { ModifierInstallateurCommand } from './modifierInstallateur.command';

export type ModifierInstallateurUseCase = Message<
  'Lauréat.Installation.UseCase.ModifierInstallateur',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    installateurValue: string;
    dateModificationValue: string;
    raisonValue?: string;
    pièceJustificativeValue?: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerModifierInstallateurUseCase = () => {
  const runner: MessageHandler<ModifierInstallateurUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    installateurValue,
    dateModificationValue,
    raisonValue,
    pièceJustificativeValue,
  }) => {
    const pièceJustificative = pièceJustificativeValue
      ? DocumentProjet.convertirEnValueType(
          identifiantProjetValue,
          TypeDocumentInstallateur.pièceJustificative.formatter(),
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

    await mediator.send<ModifierInstallateurCommand>({
      type: 'Lauréat.Installation.Command.ModifierInstallateur',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        installateur: installateurValue,
        dateModification: DateTime.convertirEnValueType(dateModificationValue),
        raison: raisonValue,
        pièceJustificative,
      },
    });
  };
  mediator.register('Lauréat.Installation.UseCase.ModifierInstallateur', runner);
};
