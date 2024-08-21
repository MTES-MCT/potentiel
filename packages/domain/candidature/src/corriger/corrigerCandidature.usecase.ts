import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import {
  ImporterCandidatureUseCaseCommonPayload,
  mapPayloadForCommand,
} from '../importer/importerCandidature.usecase';

import { CorrigerCandidatureCommand } from './corrigerCandidature.command';

type CorrigerCandidatureUseCasePayload = ImporterCandidatureUseCaseCommonPayload & {
  corrigéLe: string;
  corrigéPar: string;
};

export type CorrigerCandidatureUseCase = Message<
  'Candidature.UseCase.CorrigerCandidature',
  CorrigerCandidatureUseCasePayload
>;

export const registerCorrigerCandidatureUseCase = () => {
  const handler: MessageHandler<CorrigerCandidatureUseCase> = async (payload) =>
    mediator.send<CorrigerCandidatureCommand>({
      type: 'Candidature.Command.CorrigerCandidature',
      data: {
        ...mapPayloadForCommand(payload),
        corrigéLe: DateTime.convertirEnValueType(payload.corrigéLe),
        corrigéPar: Email.convertirEnValueType(payload.corrigéPar),
      },
    });

  mediator.register('Candidature.UseCase.CorrigerCandidature', handler);
};
