'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { Routes } from '@potentiel-applications/routes';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCandidature } from '@/app/candidatures/_helpers/getCandidature';

import { candidatureSchema } from '../importer/candidature.schema';
import { getLocalité } from '../helpers';

export type CorrigerCandidaturesState = FormState;

const schema = candidatureSchema;
export type CorrigerCandidatureFormEntries = zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_, body) =>
  withUtilisateur(async (utilisateur) => {
    const candidature = await getCandidature(body.identifiantProjet);
    await mediator.send<Candidature.CorrigerCandidatureUseCase>({
      type: 'Candidature.UseCase.CorrigerCandidature',
      data: {
        ...mapBodyToUseCaseData(body),
        statutValue: candidature.statut.formatter(),
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
): Omit<
  Candidature.CorrigerCandidatureUseCase['data'],
  'corrigéLe' | 'corrigéPar' | 'statutValue'
> => {
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
      codePostaux: data.codePostal.split('/').map((x) => x.trim()),
      commune: data.commune,
      adresse1: data.adresse1,
      adresse2: data.adresse2,
    }),
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
