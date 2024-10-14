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
        ...mapBodyToUseCaseData(body, candidature),
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
  previous: Candidature.ConsulterCandidatureReadModel,
): Omit<Candidature.CorrigerCandidatureUseCase['data'], 'corrigéLe' | 'corrigéPar'> => {
  const { appelOffre, période, famille, numéroCRE } = IdentifiantProjet.convertirEnValueType(
    data.identifiantProjet,
  );
  return {
    appelOffreValue: appelOffre,
    périodeValue: période,
    familleValue: famille,
    numéroCREValue: numéroCRE,
    nomProjetValue: data.nomProjet,
    sociétéMèreValue: data.societeMere,
    nomCandidatValue: data.nomCandidat,
    puissanceProductionAnnuelleValue: data.puissanceProductionAnnuelle,
    prixReferenceValue: data.prixReference,
    noteTotaleValue: data.noteTotale,
    nomReprésentantLégalValue: data.nomRepresentantLegal,
    emailContactValue: data.emailContact,
    localitéValue: getLocalité({
      codePostaux: data.codePostal.split('/').map((x) => x.trim()),
      commune: data.commune,
      adresse1: data.adresse1,
      adresse2: data.adresse2,
    }),
    motifÉliminationValue: data.motifElimination,
    puissanceALaPointeValue: data.puissanceALaPointe,
    evaluationCarboneSimplifiéeValue: data.evaluationCarboneSimplifiee,
    actionnariatValue: data.actionnariat,
    statutValue: data.statut ?? previous.statut.formatter(),

    // non-editable fields
    typeGarantiesFinancièresValue: previous.typeGarantiesFinancières?.type,
    dateÉchéanceGfValue: previous.dateÉchéanceGf?.formatter(),
    territoireProjetValue: previous.territoireProjet,
    historiqueAbandonValue: previous.historiqueAbandon.formatter(),
    technologieValue: previous.technologie.formatter(),

    doitRégénérerAttestation: data.doitRegenererAttestation === 'true' ? true : undefined,
  };
};
