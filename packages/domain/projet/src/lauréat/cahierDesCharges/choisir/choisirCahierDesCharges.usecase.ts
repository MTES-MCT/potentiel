import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { IdentifiantProjet } from '../../../index.js';

import { ChoisirCahierDesChargesCommand } from './choisirCahierDesCharges.command.js';

export type ChoisirCahierDesChargesUseCase = Message<
  'Lauréat.UseCase.ChoisirCahierDesCharges',
  {
    identifiantProjetValue: string;
    modifiéLeValue: string;
    modifiéParValue: string;
    cahierDesChargesValue: string;
  }
>;

export const registerChoisirCahierDesChargesUseCase = () => {
  const handler: MessageHandler<ChoisirCahierDesChargesUseCase> = async ({
    identifiantProjetValue,
    modifiéLeValue,
    modifiéParValue,
    cahierDesChargesValue,
  }) => {
    await mediator.send<ChoisirCahierDesChargesCommand>({
      type: 'Lauréat.Command.ChoisirCahierDesCharges',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        modifiéLe: DateTime.convertirEnValueType(modifiéLeValue),
        modifiéPar: Email.convertirEnValueType(modifiéParValue),
        cahierDesCharges:
          AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(cahierDesChargesValue),
      },
    });
  };

  mediator.register('Lauréat.UseCase.ChoisirCahierDesCharges', handler);
};
