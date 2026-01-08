import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../..';
import { Dépôt, DétailCandidature, Instruction } from '..';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '../../document-projet';

import { ImporterCandidatureCommand } from './importerCandidature.command';

export type ImporterCandidatureUseCase = Message<
  'Candidature.UseCase.ImporterCandidature',
  {
    identifiantProjetValue: string;

    dépôtValue: Dépôt.RawType;
    instructionValue: Instruction.RawType;

    détailsValue: DétailCandidature.RawType;
    importéLe: string;
    importéPar: string;
  }
>;

export const registerImporterCandidatureUseCase = () => {
  const handler: MessageHandler<ImporterCandidatureUseCase> = async (payload) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      payload.identifiantProjetValue,
    );
    const importéLe = DateTime.convertirEnValueType(payload.importéLe);

    // pour le moment, on garde ce fichier de détails car tous les champs n'ont pas vocation à être extraits
    const buf = Buffer.from(JSON.stringify(payload.détailsValue));
    const blob = new Blob([buf]);
    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: blob.stream(),
        documentProjet: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          'candidature/import',
          importéLe.formatter(),
          'application/json',
        ),
      },
    });

    await mediator.send<ImporterCandidatureCommand>({
      type: 'Candidature.Command.ImporterCandidature',
      data: {
        identifiantProjet,
        dépôt: Dépôt.convertirEnValueType(payload.dépôtValue),
        instruction: Instruction.convertirEnValueType(payload.instructionValue),
        importéLe,
        importéPar: Email.convertirEnValueType(payload.importéPar),
        détail: payload.détailsValue,
      },
    });
  };

  mediator.register('Candidature.UseCase.ImporterCandidature', handler);
};
