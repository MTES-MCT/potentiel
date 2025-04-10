import { Message, MessageHandler, mediator } from 'mediateur';

import { PlainType } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { IdentifiantProjet } from '../..';
import * as DépôtCandidature from '../dépôtCandidature.valueType';
import * as InstructionCandidature from '../instructionCandidature.valueType';

import { CorrigerCandidatureCommand } from './corrigerCandidature.command';

export type CorrigerCandidatureUseCase = Message<
  'Candidature.UseCase.CorrigerCandidature',
  {
    appelOffreValue: string;
    périodeValue: string;
    familleValue: string;
    numéroCREValue: string;
    instructionCandidatureValue: PlainType<InstructionCandidature.ValueType>;
    dépôtCandidatureValue: PlainType<DépôtCandidature.ValueType>;
    corrigéLeValue: string;
    corrigéParValue: string;
    doitRégénérerAttestationValue?: true;
    détailsValue?: Record<string, string>;
  }
>;

export const registerCorrigerCandidatureUseCase = () => {
  const handler: MessageHandler<CorrigerCandidatureUseCase> = async ({
    appelOffreValue,
    familleValue,
    numéroCREValue,
    périodeValue,
    dépôtCandidatureValue,
    instructionCandidatureValue,
    corrigéLeValue,
    corrigéParValue,
    doitRégénérerAttestationValue,
    détailsValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      `${appelOffreValue}#${périodeValue}#${familleValue}#${numéroCREValue}`,
    );
    const corrigéLe = DateTime.convertirEnValueType(corrigéLeValue);

    // TODO : la conversion en Buffer ne devrait pas être dans le use case, les détails devrait être passer à la commande et via le ProjetAggregate il faudrait avoir accés au document projet et une fonction enregistrer qui permet de faire du JSON en plus du blob
    const détailsMisÀJour = détailsValue && Object.keys(détailsValue).length > 0;

    if (détailsMisÀJour) {
      const buf = Buffer.from(JSON.stringify(détailsValue));
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
        dépôtCandidature: DépôtCandidature.bind(dépôtCandidatureValue),
        instructionCandidature: InstructionCandidature.bind(instructionCandidatureValue),
        corrigéLe,
        corrigéPar: Email.convertirEnValueType(corrigéParValue),
        doitRégénérerAttestation: doitRégénérerAttestationValue,
        détailsMisÀJour: détailsMisÀJour || undefined,
      },
    });
  };
  mediator.register('Candidature.UseCase.CorrigerCandidature', handler);
};
