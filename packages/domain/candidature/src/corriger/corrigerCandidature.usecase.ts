import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import {
  ImporterCandidatureUseCaseCommonPayload,
  mapPayloadForCommand,
} from '../importer/importerCandidature.usecase';
import { EnregistrerDétailsCandidatureCommand } from '../importer/enregistrerDétails.command';

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
  const handler: MessageHandler<CorrigerCandidatureUseCase> = async (payload) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      `${payload.appelOffreValue}#${payload.périodeValue}#${payload.familleValue}#${payload.numéroCREValue}`,
    );
    const corrigéLe = DateTime.convertirEnValueType(payload.corrigéLe);
    await mediator.send<CorrigerCandidatureCommand>({
      type: 'Candidature.Command.CorrigerCandidature',
      data: {
        identifiantProjet,
        ...mapPayloadForCommand(payload),
        corrigéLe: DateTime.convertirEnValueType(payload.corrigéLe),
        corrigéPar: Email.convertirEnValueType(payload.corrigéPar),
      },
    });

    await mediator.send<EnregistrerDétailsCandidatureCommand>({
      type: 'Candidature.Command.EnregistrerDétailsCandidature',
      data: {
        identifiantProjet,
        détails: payload.détailsValue,
        date: corrigéLe,
      },
    });
  };
  mediator.register('Candidature.UseCase.CorrigerCandidature', handler);
};
