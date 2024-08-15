import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import * as StatutCandidature from '../statutCandidature.valueType';
import * as Technologie from '../technologie.valueType';
import { HistoriqueAbandon } from '../candidature';

import { CorrigerCandidatureCommand } from './corrigerCandidature.command';

export type CorrigerCandidatureUseCase = Message<
  'Candidature.UseCase.CorrigerCandidature',
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
    prixReferenceValue: number;
    noteTotaleValue: number;
    nomReprésentantLégalValue: string;
    emailContactValue: string;
    adresse1Value: string;
    adresse2Value: string;
    codePostalValue: string;
    communeValue: string;
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
  }
>;

export const registerCorrigerCandidatureUseCase = () => {
  const handler: MessageHandler<CorrigerCandidatureUseCase> = async (payload) => {
    const {
      appelOffreValue,
      périodeValue,
      familleValue,
      numéroCREValue,
      statutValue,
      dateÉchéanceGfValue,
      technologieValue,
      historiqueAbandonValue,
      typeGarantiesFinancièresValue,
    } = payload;
    await mediator.send<CorrigerCandidatureCommand>({
      type: 'Candidature.Command.CorrigerCandidature',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(
          `${appelOffreValue}#${périodeValue}#${familleValue}#${numéroCREValue}`,
        ),
        appelOffre: appelOffreValue,
        période: périodeValue,
        famille: familleValue,
        numéroCRE: numéroCREValue,
        statut: StatutCandidature.convertirEnValueType(statutValue),
        dateÉchéanceGf: dateÉchéanceGfValue
          ? DateTime.convertirEnValueType(dateÉchéanceGfValue)
          : undefined,
        technologie: Technologie.convertirEnValueType(technologieValue),
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
      },
    });
  };

  mediator.register('Candidature.UseCase.CorrigerCandidature', handler);
};
