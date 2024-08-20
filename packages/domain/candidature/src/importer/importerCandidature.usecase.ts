import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import * as StatutCandidature from '../statutCandidature.valueType';
import * as Technologie from '../technologie.valueType';
import { HistoriqueAbandon } from '../candidature';

import { ImporterCandidatureCommand } from './importerCandidature.command';

export type ImporterCandidatureUseCasePayload = {
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
  motifÉliminationValue: string;
  puissanceALaPointeValue: boolean;
  evaluationCarboneSimplifiéeValue: number;
  valeurÉvaluationCarboneValue?: number;
  technologieValue: string;
  financementCollectifValue: boolean;
  financementParticipatifValue: boolean;
  gouvernancePartagéeValue: boolean;
  dateÉchéanceGfValue?: string;
  territoireProjetValue: string;
  détailsValue: Record<string, string>;
};

export type ImporterCandidatureUseCase = Message<
  'Candidature.UseCase.ImporterCandidature',
  ImporterCandidatureUseCasePayload
>;

export const registerImporterCandidatureUseCase = () => {
  const handler: MessageHandler<ImporterCandidatureUseCase> = async (payload) =>
    mediator.send<ImporterCandidatureCommand>({
      type: 'Candidature.Command.ImporterCandidature',
      data: mapPayloadForCommand(payload),
    });

  mediator.register('Candidature.UseCase.ImporterCandidature', handler);
};

export const mapPayloadForCommand = (payload: ImporterCandidatureUseCasePayload) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(
    `${payload.appelOffreValue}#${payload.périodeValue}#${payload.familleValue}#${payload.numéroCREValue}`,
  ),
  appelOffre: payload.appelOffreValue,
  période: payload.périodeValue,
  famille: payload.familleValue,
  numéroCRE: payload.numéroCREValue,
  statut: StatutCandidature.convertirEnValueType(payload.statutValue),
  dateÉchéanceGf: payload.dateÉchéanceGfValue
    ? DateTime.convertirEnValueType(payload.dateÉchéanceGfValue)
    : undefined,
  technologie: Technologie.convertirEnValueType(payload.technologieValue),
  typeGarantiesFinancières: payload.typeGarantiesFinancièresValue
    ? GarantiesFinancières.TypeGarantiesFinancières.convertirEnValueType(
        payload.typeGarantiesFinancièresValue,
      )
    : undefined,
  historiqueAbandon: HistoriqueAbandon.convertirEnValueType(payload.historiqueAbandonValue),
  nomProjet: payload.nomProjetValue,
  localité: payload.localitéValue,
  emailContact: payload.emailContactValue,
  evaluationCarboneSimplifiée: payload.evaluationCarboneSimplifiéeValue,
  financementCollectif: payload.financementCollectifValue,
  financementParticipatif: payload.financementParticipatifValue,
  gouvernancePartagée: payload.financementCollectifValue,
  nomCandidat: payload.nomCandidatValue,
  nomReprésentantLégal: payload.nomReprésentantLégalValue,
  noteTotale: payload.noteTotaleValue,
  prixReference: payload.prixReferenceValue,
  puissanceProductionAnnuelle: payload.puissanceProductionAnnuelleValue,
  motifÉlimination: payload.motifÉliminationValue,
  puissanceALaPointe: payload.puissanceALaPointeValue,
  sociétéMère: payload.sociétéMèreValue,
  valeurÉvaluationCarbone: payload.valeurÉvaluationCarboneValue,
  territoireProjet: payload.territoireProjetValue,
  détails: payload.détailsValue,
});
