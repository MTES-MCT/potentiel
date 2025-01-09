import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { TypeDocumentActionnaire } from '..';

import { TransmettreActionnaireCommand } from './transmettreActionnaire.command';

export type TransmettreActionnaireUseCase = Message<
  'Lauréat.Actionnaire.UseCase.TransmettreActionnaire',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    actionnaireValue: string;
    dateTransmissionValue: string;
    pièceJustificativeValue?: {
      content: ReadableStream;
      format: string;
    };
  }
>;

// le champs actionnaire ou société mère est optionnel dans la candidature
// donc il peut être directement transmis suite à la notification
export const registerTransmettreActionnaireUseCase = () => {
  const runner: MessageHandler<TransmettreActionnaireUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    actionnaireValue,
    dateTransmissionValue,
    pièceJustificativeValue,
  }) => {
    const pièceJustificative = pièceJustificativeValue
      ? DocumentProjet.convertirEnValueType(
          identifiantProjetValue,
          TypeDocumentActionnaire.pièceJustificative.formatter(),
          dateTransmissionValue,
          pièceJustificativeValue.format,
        )
      : undefined;

    if (pièceJustificativeValue && pièceJustificative) {
      await mediator.send<EnregistrerDocumentProjetCommand>({
        type: 'Document.Command.EnregistrerDocumentProjet',
        data: {
          content: pièceJustificativeValue.content,
          documentProjet: pièceJustificative,
        },
      });
    }

    await mediator.send<TransmettreActionnaireCommand>({
      type: 'Lauréat.Actionnaire.Command.TransmettreActionnaire',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        actionnaire: actionnaireValue,
        dateTransmission: DateTime.convertirEnValueType(dateTransmissionValue),
        pièceJustificative,
      },
    });
  };

  mediator.register('Lauréat.Actionnaire.UseCase.TransmettreActionnaire', runner);
};
