import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, IdentifiantProjet } from '../../../../index.js';
import { TypologieInstallation } from '../../../../candidature/index.js';
import { EnregistrerDocumentProjetCommand } from '../../../../document-projet/index.js';
import { TypeDocumentTypologieInstallation } from '../../index.js';

import { ModifierTypologieInstallationCommand } from './modifierTypologieInstallation.command.js';

export type ModifierTypologieInstallationUseCase = Message<
  'Lauréat.Installation.UseCase.ModifierTypologieInstallation',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    typologieInstallationValue: TypologieInstallation.RawType[];
    dateModificationValue: string;
    raisonValue: string;
    pièceJustificativeValue?: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerModifierTypologieInstallationUseCase = () => {
  const runner: MessageHandler<ModifierTypologieInstallationUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    typologieInstallationValue,
    dateModificationValue,
    raisonValue,
    pièceJustificativeValue,
  }) => {
    const pièceJustificative = pièceJustificativeValue
      ? DocumentProjet.convertirEnValueType(
          identifiantProjetValue,
          TypeDocumentTypologieInstallation.pièceJustificative.formatter(),
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

    await mediator.send<ModifierTypologieInstallationCommand>({
      type: 'Lauréat.Installation.Command.ModifierTypologieInstallation',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        typologieInstallation: typologieInstallationValue.map(
          TypologieInstallation.convertirEnValueType,
        ),
        dateModification: DateTime.convertirEnValueType(dateModificationValue),
        raison: raisonValue,
        pièceJustificative,
      },
    });
  };
  mediator.register('Lauréat.Installation.UseCase.ModifierTypologieInstallation', runner);
};
