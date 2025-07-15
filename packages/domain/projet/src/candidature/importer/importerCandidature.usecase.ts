import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { IdentifiantProjet } from '../..';
import { Dépôt, Instruction } from '..';

import { ImporterCandidatureCommand } from './importerCandidature.command';

export type ImporterCandidatureUseCase = Message<
  'Candidature.UseCase.ImporterCandidature',
  {
    appelOffreValue: string;
    périodeValue: string;
    familleValue: string;
    numéroCREValue: string;

    dépôtValue: Dépôt.RawType;
    instructionValue: Instruction.RawType;

    détailsValue?: Record<string, string>;
    importéLe: string;
    importéPar: string;
  }
>;

export const registerImporterCandidatureUseCase = () => {
  const handler: MessageHandler<ImporterCandidatureUseCase> = async (message) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      `${message.appelOffreValue}#${message.périodeValue}#${message.familleValue}#${message.numéroCREValue}`,
    );
    const importéLe = DateTime.convertirEnValueType(message.importéLe);

    // pour le moment, on garde ce fichier de détails car tous les champs n'ont pas vocation à être extraits
    const buf = Buffer.from(JSON.stringify(message.détailsValue));
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
        dépôt: Dépôt.convertirEnValueType(message.dépôtValue),
        instruction: Instruction.convertirEnValueType(message.instructionValue),
        importéLe,
        importéPar: Email.convertirEnValueType(message.importéPar),
      },
    });
  };

  mediator.register('Candidature.UseCase.ImporterCandidature', handler);
};
