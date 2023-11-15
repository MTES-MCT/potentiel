import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Message, MessageHandler, mediator } from 'mediateur';
import { RelancerTransmissionPreuveRecandidatureCommand } from './relancerTransmissionPreuveRecandidatureAbandon.command';

export type RelancerTransmissionPreuveRecandidatureAbandonUseCase = Message<
  'RELANCER_TRANSMISSION_PREUVE_RECANDIDATURE_USECASE',
  {
    identifiantProjetValue: string;
    dateRelanceValue: string;
  }
>;

export const registerRelancerTransmissionPreuveRecandidatureAbandonUseCase = () => {
  const runner: MessageHandler<RelancerTransmissionPreuveRecandidatureAbandonUseCase> = async ({
    identifiantProjetValue,
    dateRelanceValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateRelance = DateTime.convertirEnValueType(dateRelanceValue);

    await mediator.send<RelancerTransmissionPreuveRecandidatureCommand>({
      type: 'RELANCER_TRANSMISSION_PREUVE_RECANDIDATURE_COMMAND',
      data: {
        identifiantProjet,
        dateRelance,
      },
    });
  };
  mediator.register('RELANCER_TRANSMISSION_PREUVE_RECANDIDATURE_USECASE', runner);
};
