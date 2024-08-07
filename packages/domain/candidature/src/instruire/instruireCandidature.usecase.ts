import { Message, MessageHandler, mediator } from 'mediateur';

export type InstruireCandidatureUseCase = Message<
  'Candidature.UseCase.InstruireCandidature',
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
    dateÉchéanceGfValue?: Date;
  }
>;

export const registerInstruireCandidatureUseCase = () => {
  const handler: MessageHandler<InstruireCandidatureUseCase> = async () => {
    throw new Error('Not implemented');
  };

  mediator.register('Candidature.UseCase.InstruireCandidature', handler);
};
