import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { Dépôt, Instruction } from '..';
import { IdentifiantProjet } from '../..';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '../../document-projet';
import { ImporterDétailCandidatureCommand } from '../détail/importer/importerDétailCandidature.command';
import { cleanDétails } from '../détail/_helpers/cleanDétails';
import { DétailCandidatureRaw } from '../détail/détailCandidature.type';

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
    détailsValue?: DétailCandidatureRaw;
  }
>;

export const registerCorrigerCandidatureUseCase = () => {
  const handler: MessageHandler<CorrigerCandidatureUseCase> = async (payload) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      payload.identifiantProjetValue,
    );
    const corrigéLe = DateTime.convertirEnValueType(payload.corrigéLe);

    if (payload.détailsValue && Object.keys(payload.détailsValue).length > 0) {
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
        détailsMisÀJour:
          payload.détailsValue && Object.keys(payload.détailsValue).length > 0 ? true : undefined,
      },
    });

    if (payload.détailsValue && Object.keys(payload.détailsValue).length > 0) {
      await mediator.send<ImporterDétailCandidatureCommand>({
        type: 'Candidature.Command.ImporterDétailCandidature',
        data: {
          identifiantProjet,
          importéLe: corrigéLe,
          détails: cleanDétails(payload.détailsValue),
        },
      });
    }
  };

  mediator.register('Candidature.UseCase.CorrigerCandidature', handler);
};
