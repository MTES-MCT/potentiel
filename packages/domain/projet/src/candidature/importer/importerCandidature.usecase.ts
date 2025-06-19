import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { IdentifiantProjet } from '../..';
import { mapToCommonCandidatureUseCaseData } from '../candidature.mapper';

import { ImporterCandidatureCommand } from './importerCandidature.command';

export type ImporterCandidatureUseCase = Message<
  'Candidature.UseCase.ImporterCandidature',
  {
    typeGarantiesFinancièresValue?: string;
    historiqueAbandonValue: string;
    appelOffreValue: string;
    périodeValue: string;
    familleValue: string;
    numéroCREValue: string;
    nomProjetValue: string;
    sociétéMèreValue: string;
    nomCandidatValue: string;
    puissanceProductionAnnuelleValue: number;
    prixRéférenceValue: number;
    noteTotaleValue: number;
    nomReprésentantLégalValue: string;
    emailContactValue: string;
    localitéValue: {
      adresse1: string;
      adresse2: string;
      codePostal: string;
      commune: string;
      région: string;
      département: string;
    };
    statutValue: string;
    motifÉliminationValue?: string;
    puissanceALaPointeValue: boolean;
    evaluationCarboneSimplifiéeValue: number;
    technologieValue: string;
    actionnariatValue?: string;
    dateÉchéanceGfValue?: string;
    territoireProjetValue: string;
    coefficientKChoisiValue?: boolean;
    fournisseursValue: Array<{
      typeFournisseur: string;
      nomDuFabricant: string;
      lieuDeFabrication: string;
    }>;
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
        ...mapToCommonCandidatureUseCaseData(message),
        importéLe,
        importéPar: Email.convertirEnValueType(message.importéPar),
      },
    });
  };

  mediator.register('Candidature.UseCase.ImporterCandidature', handler);
};
