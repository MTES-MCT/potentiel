import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { Dépôt, Instruction } from '..';
import { IdentifiantProjet } from '../..';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '../../document-projet';

import { CorrigerCandidatureCommand } from './corrigerCandidature.command';

export type CorrigerCandidatureUseCase = Message<
  'Candidature.UseCase.CorrigerCandidature',
  {
    identifiantProjetValue: string;

    dépôtValue: Dépôt.RawType;
    instructionValue: Instruction.RawType;

    corrigéLe: string;
    corrigéPar: string;
    doitRégénérerAttestation?: true;
    détailsValue?: Record<string, string>;
  }
>;

export const registerCorrigerCandidatureUseCase = () => {
  const handler: MessageHandler<CorrigerCandidatureUseCase> = async (payload) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      payload.identifiantProjetValue,
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
        dépôt: Dépôt.convertirEnValueType(payload.dépôtValue),
        instruction: Instruction.convertirEnValueType(payload.instructionValue),
        corrigéLe: DateTime.convertirEnValueType(payload.corrigéLe),
        corrigéPar: Email.convertirEnValueType(payload.corrigéPar),
        doitRégénérerAttestation: payload.doitRégénérerAttestation,
        détailsMisÀJour: détailsMisÀJour || undefined,
      },
    });
  };
  mediator.register('Candidature.UseCase.CorrigerCandidature', handler);
};
