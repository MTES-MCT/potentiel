import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { PlainType } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../..';
import * as DépôtCandidature from '../dépôtCandidature.valueType';
import * as InstructionCandidature from '../instructionCandidature.valueType';

import { ImporterCandidatureCommand } from './importerCandidature.command';

export type ImporterCandidatureUseCase = Message<
  'Candidature.UseCase.ImporterCandidature',
  {
    appelOffreValue: string;
    périodeValue: string;
    familleValue: string;
    numéroCREValue: string;
    instructionCandidatureValue: PlainType<InstructionCandidature.ValueType>;
    dépôtCandidatureValue: PlainType<DépôtCandidature.ValueType>;
    détailsValue?: Record<string, string>;
    importéLeValue: string;
    importéParValue: string;
  }
>;

export const registerImporterCandidatureUseCase = () => {
  const handler: MessageHandler<ImporterCandidatureUseCase> = async ({
    appelOffreValue,
    familleValue,
    périodeValue,
    numéroCREValue,
    instructionCandidatureValue,
    dépôtCandidatureValue,
    importéLeValue,
    importéParValue,
    détailsValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      `${appelOffreValue}#${périodeValue}#${familleValue}#${numéroCREValue}`,
    );

    const importéLe = DateTime.convertirEnValueType(importéLeValue);

    // TODO : la conversion en Buffer ne devrait pas être dans le use case, les détails devrait être passer à la commande et via le ProjetAggregate il faudrait avoir accés au document projet et une fonction enregistrer qui permet de faire du JSON en plus du blob
    const buf = Buffer.from(JSON.stringify(détailsValue));
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
        instructionCandidature: InstructionCandidature.bind(instructionCandidatureValue),
        dépôtCandidature: DépôtCandidature.bind(dépôtCandidatureValue),
        importéLe,
        importéPar: Email.convertirEnValueType(importéParValue),
      },
    });
  };

  mediator.register('Candidature.UseCase.ImporterCandidature', handler);
};
