import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import {
  ImporterCandidatureUseCaseCommonPayload,
  mapPayloadForCommand,
} from '../importer/importerCandidature.usecase';

import { CorrigerCandidatureCommand } from './corrigerCandidature.command';

type CorrigerCandidatureUseCaseData = ImporterCandidatureUseCaseCommonPayload & {
  corrigéLe: string;
  corrigéPar: string;
  doitRégénérerAttestation?: true;
  détailsValue?: Record<string, string>;
};

export type CorrigerCandidatureUseCase = Message<
  'Candidature.UseCase.CorrigerCandidature',
  CorrigerCandidatureUseCaseData
>;

export const registerCorrigerCandidatureUseCase = () => {
  const handler: MessageHandler<CorrigerCandidatureUseCase> = async (payload) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      `${payload.appelOffreValue}#${payload.périodeValue}#${payload.familleValue}#${payload.numéroCREValue}`,
    );
    const corrigéLe = DateTime.convertirEnValueType(payload.corrigéLe);

    const détailsMisÀJour = payload.détailsValue && Object.keys(payload.détailsValue).length > 0;

    if (détailsMisÀJour) {
      const buf = Buffer.from(JSON.stringify(payload.détailsValue));
      const blob = new Blob([buf]);
      await mediator.send<EnregistrerDocumentProjetCommand>({
        type: 'Document.Command.EnregistrerDocumentProjet',
        data: {
          content: blob.stream(),
          documentProjet: DocumentProjet.convertirEnValueType(
            identifiantProjet.formatter(),
            'candidature/import',
            corrigéLe.formatter(),
            'application/json',
          ),
        },
      });
    }

    await mediator.send<CorrigerCandidatureCommand>({
      type: 'Candidature.Command.CorrigerCandidature',
      data: {
        identifiantProjet,
        ...mapPayloadForCommand(payload),
        corrigéLe: DateTime.convertirEnValueType(payload.corrigéLe),
        corrigéPar: Email.convertirEnValueType(payload.corrigéPar),
        doitRégénérerAttestation: payload.doitRégénérerAttestation,
        détailsMisÀJour: détailsMisÀJour || undefined,
      },
    });
  };
  mediator.register('Candidature.UseCase.CorrigerCandidature', handler);
};
