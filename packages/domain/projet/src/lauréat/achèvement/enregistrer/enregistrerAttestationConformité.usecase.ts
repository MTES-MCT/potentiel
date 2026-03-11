import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';

import { EnregistrerAttestationConformitéCommand } from './enregistrerAttestationConformité.command.js';

export type EnregistrerAttestationConformitéUseCase = Message<
  'Lauréat.Achèvement.UseCase.EnregistrerAttestationConformité',
  {
    identifiantProjetValue: string;
    attestationConformitéValue: {
      format: string;
    };
    enregistréeLeValue: string;
    enregistréeParValue: string;
  }
>;

export const registerEnregistrerAttestationConformitéUseCase = () => {
  const runner: MessageHandler<EnregistrerAttestationConformitéUseCase> = async ({
    identifiantProjetValue,
    attestationConformitéValue,
    enregistréeLeValue,
    enregistréeParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const enregistréeLe = DateTime.convertirEnValueType(enregistréeLeValue);
    const enregistréePar = Email.convertirEnValueType(enregistréeParValue);

    await mediator.send<EnregistrerAttestationConformitéCommand>({
      type: 'Lauréat.Achèvement.Command.EnregistrerAttestationConformité',
      data: {
        identifiantProjet,
        attestationConformité: attestationConformitéValue,
        enregistréeLe,
        enregistréePar,
      },
    });
  };
  mediator.register('Lauréat.Achèvement.UseCase.EnregistrerAttestationConformité', runner);
};
