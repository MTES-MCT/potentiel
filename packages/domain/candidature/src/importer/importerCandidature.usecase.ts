import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import * as StatutCandidature from '../statutCandidature.valueType';
import * as Technologie from '../technologie.valueType';
import { HistoriqueAbandon } from '../candidature';

import { ImporterCandidatureCommand } from './importerCandidature.command';

export type ImporterCandidatureUseCase = Message<
  'Candidature.UseCase.ImporterCandidature',
  {
    typeGarantiesFinancièresValue?: string;
    historiqueAbandonValue: string;
    appelOffreValue: string;
    périodeValue: string;
    familleValue?: string;
    numéroCREValue: string;
    nomProjetValue: string;
    sociétéMèreValue?: string;
    nomCandidatValue: string;
    puissanceProductionAnnuelleValue: number;
    prixReferenceValue: number;
    noteTotaleValue: number;
    nomReprésentantLégalValue: string;
    emailContactValue: string;
    adresse1Value: string;
    adresse2Value?: string;
    codePostalValue: string;
    communeValue: string;
    statutValue: string;
    motifÉliminationValue?: string;
    puissanceALaPointeValue?: boolean;
    evaluationCarboneSimplifiéeValue: number;
    valeurÉvaluationCarboneValue?: number;
    technologieValue?: string;
    financementCollectifValue: boolean;
    gouvernancePartagéeValue: boolean;
    dateÉchéanceGfValue?: string;
    détailsValue?: Record<string, string>;
  }
>;

export const registerImporterCandidatureUseCase = () => {
  const handler: MessageHandler<ImporterCandidatureUseCase> = async (payload) => {
    const { appelOffreValue, périodeValue, familleValue, numéroCREValue } = payload;
    const {
      statutValue,
      dateÉchéanceGfValue,
      technologieValue,
      historiqueAbandonValue,
      typeGarantiesFinancièresValue,
    } = payload;
    await mediator.send<ImporterCandidatureCommand>({
      type: 'Candidature.Command.ImporterCandidature',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(
          `${appelOffreValue}#${périodeValue}#${familleValue}#${numéroCREValue}`,
        ),
        appelOffre: appelOffreValue,
        période: périodeValue,
        famille: familleValue || '',
        numéroCRE: numéroCREValue,
        statut: StatutCandidature.convertirEnValueType(statutValue),
        dateÉchéanceGf: dateÉchéanceGfValue
          ? DateTime.convertirEnValueType(dateÉchéanceGfValue)
          : undefined,
        technologie: technologieValue
          ? Technologie.convertirEnValueType(technologieValue)
          : undefined,
        typeGarantiesFinancières: typeGarantiesFinancièresValue
          ? GarantiesFinancières.TypeGarantiesFinancières.convertirEnValueType(
              typeGarantiesFinancièresValue,
            )
          : undefined,
        historiqueAbandon: HistoriqueAbandon.convertirEnValueType(historiqueAbandonValue),
        nomProjet: payload.nomProjetValue,
        adresse1: payload.adresse1Value,
        adresse2: payload.adresse2Value,
        codePostal: payload.codePostalValue,
        commune: payload.communeValue,
        emailContact: payload.emailContactValue,
        evaluationCarboneSimplifiée: payload.evaluationCarboneSimplifiéeValue,
        financementCollectif: payload.financementCollectifValue,
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
        détails: payload.détailsValue,
      },
    });
  };

  mediator.register('Candidature.UseCase.ImporterCandidature', handler);
};
