import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import * as TypeGarantiesFinancières from '../typeGarantiesFinancières.valueType';
import * as StatutCandidature from '../valueType/statutCandidature.valueType';
import * as TypeTechnologie from '../valueType/typeTechnologie.valueType';
import * as TypeActionnariat from '../valueType/typeActionnariat.valueType';
import { HistoriqueAbandon } from '../candidature';

import { ImporterCandidatureCommand } from './importerCandidature.command';

export type ImporterCandidatureUseCaseCommonPayload = {
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
  prixReferenceValue: number;
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
  détailsValue: Record<string, string>;
};

type ImporterCandidatureUseCasePayload = ImporterCandidatureUseCaseCommonPayload & {
  importéLe: string;
  importéPar: string;
};

export type ImporterCandidatureUseCase = Message<
  'Candidature.UseCase.ImporterCandidature',
  ImporterCandidatureUseCasePayload
>;

export const registerImporterCandidatureUseCase = () => {
  const handler: MessageHandler<ImporterCandidatureUseCase> = async (payload) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      `${payload.appelOffreValue}#${payload.périodeValue}#${payload.familleValue}#${payload.numéroCREValue}`,
    );
    const importéLe = DateTime.convertirEnValueType(payload.importéLe);

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
        ...mapPayloadForCommand(payload),
        importéLe,
        importéPar: Email.convertirEnValueType(payload.importéPar),
      },
    });
  };

  mediator.register('Candidature.UseCase.ImporterCandidature', handler);
};

export const mapPayloadForCommand = (payload: ImporterCandidatureUseCaseCommonPayload) => ({
  statut: StatutCandidature.convertirEnValueType(payload.statutValue),
  dateÉchéanceGf: payload.dateÉchéanceGfValue
    ? DateTime.convertirEnValueType(payload.dateÉchéanceGfValue)
    : undefined,
  technologie: TypeTechnologie.convertirEnValueType(payload.technologieValue),
  typeGarantiesFinancières: payload.typeGarantiesFinancièresValue
    ? TypeGarantiesFinancières.convertirEnValueType(payload.typeGarantiesFinancièresValue)
    : undefined,
  actionnariat: payload.actionnariatValue
    ? TypeActionnariat.convertirEnValueType(payload.actionnariatValue)
    : undefined,
  historiqueAbandon: HistoriqueAbandon.convertirEnValueType(payload.historiqueAbandonValue),
  nomProjet: payload.nomProjetValue,
  localité: payload.localitéValue,
  emailContact: payload.emailContactValue,
  evaluationCarboneSimplifiée: payload.evaluationCarboneSimplifiéeValue,
  nomCandidat: payload.nomCandidatValue,
  nomReprésentantLégal: payload.nomReprésentantLégalValue,
  noteTotale: payload.noteTotaleValue,
  prixReference: payload.prixReferenceValue,
  puissanceProductionAnnuelle: payload.puissanceProductionAnnuelleValue,
  motifÉlimination: payload.motifÉliminationValue,
  puissanceALaPointe: payload.puissanceALaPointeValue,
  sociétéMère: payload.sociétéMèreValue,
  territoireProjet: payload.territoireProjetValue,
});
