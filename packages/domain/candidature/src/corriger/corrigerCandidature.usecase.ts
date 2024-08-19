import { Message, MessageHandler, mediator } from 'mediateur';

import {
  ImporterCandidatureUseCasePayload,
  mapPayloadForCommand,
} from '../importer/importerCandidature.usecase';

import { CorrigerCandidatureCommand } from './corrigerCandidature.command';

type CorrigerCandidatureUseCasePayload = ImporterCandidatureUseCasePayload;

export type CorrigerCandidatureUseCase = Message<
  'Candidature.UseCase.CorrigerCandidature',
  CorrigerCandidatureUseCasePayload
>;

export const registerCorrigerCandidatureUseCase = () => {
  const handler: MessageHandler<CorrigerCandidatureUseCase> = async (payload) =>
    mediator.send<CorrigerCandidatureCommand>({
      type: 'Candidature.Command.CorrigerCandidature',
      data: mapPayloadForCommand(payload),
    });

  mediator.register('Candidature.UseCase.CorrigerCandidature', handler);
};
