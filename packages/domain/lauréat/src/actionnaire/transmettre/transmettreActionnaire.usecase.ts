import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { TransmettreActionnaireCommand } from './transmettreActionnaire.command';

export type TransmettreActionnaireUseCase = Message<
  'Lauréat.Actionnaire.UseCase.TransmettreActionnaire',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    actionnaireValue: string;
    dateTransmissionValue: string;
  }
>;

export const registerTransmettreActionnaireUseCase = () => {
  const runner: MessageHandler<TransmettreActionnaireUseCase> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    actionnaireValue,
    dateTransmissionValue,
  }) =>
    mediator.send<TransmettreActionnaireCommand>({
      type: 'Lauréat.Actionnaire.Command.TransmettreActionnaire',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateurValue),
        actionnaire: actionnaireValue,
        dateTransmission: DateTime.convertirEnValueType(dateTransmissionValue),
      },
    });

  mediator.register('Lauréat.Actionnaire.UseCase.TransmettreActionnaire', runner);
};
