'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { Routes } from '@potentiel-applications/routes';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { candidatureSchema } from '../importer/candidature.schema';
import { getLocalité } from '../helpers';

export type CorrigerCandidaturesState = FormState;

const schema = candidatureSchema;
export type CorrigerCandidatureFormEntries = zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_, body) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Candidature.CorrigerCandidatureUseCase>({
      type: 'Candidature.UseCase.CorrigerCandidature',
      data: {
        ...mapBodyToUseCaseData(body),
        corrigéLe: DateTime.now().formatter(),
        corrigéPar: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirectUrl: Routes.Candidature.détails(body.identifiantProjet),
    };
  });

export const corrigerCandidatureAction = formAction(action, schema);

const mapBodyToUseCaseData = (
  data: zod.infer<typeof schema>,
): Omit<Candidature.CorrigerCandidatureUseCase['data'], 'corrigéLe' | 'corrigéPar'> => {
  const { appelOffre, période, famille, numéroCRE } = IdentifiantProjet.convertirEnValueType(
    data.identifiantProjet,
  );
  return {
    appelOffreValue: appelOffre,
    périodeValue: période,
    familleValue: famille,
    numéroCREValue: numéroCRE,
    historiqueAbandonValue: data.historiqueAbandon,
    nomProjetValue: data.nomProjet,
    sociétéMèreValue: data.sociétéMère,
    nomCandidatValue: data.nomCandidat,
    puissanceProductionAnnuelleValue: data.puissanceProductionAnnuelle,
    prixReferenceValue: data.prixRéference,
    noteTotaleValue: data.noteTotale,
    nomReprésentantLégalValue: data.nomReprésentantLégal,
    emailContactValue: data.emailContact,
    localitéValue: getLocalité({
      codePostaux: data.localité.codePostal.split('/').map((x) => x.trim()),
      ...data.localité,
    }),
    statutValue: data.statut,
    motifÉliminationValue: data.motifÉlimination,
    puissanceALaPointeValue: data.puissanceÀLaPointe,
    evaluationCarboneSimplifiéeValue: data.evaluationCarboneSimplifiée,
    technologieValue: data.technologie,
    typeGarantiesFinancièresValue: data.typeGarantiesFinancières,
    dateÉchéanceGfValue: data.dateÉchéanceGf?.toISOString(),
    actionnariatValue: data.actionnariat,

    // TODO
    détailsValue: {},
    territoireProjetValue: '',
  };
};
