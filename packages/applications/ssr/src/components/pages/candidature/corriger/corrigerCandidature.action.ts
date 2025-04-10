'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCandidature } from '@/app/candidatures/_helpers/getCandidature';
import { candidatureSchema } from '@/utils/zod/candidature';

export type CorrigerCandidaturesState = FormState;

const schema = candidatureSchema;

export type CorrigerCandidatureFormEntries = zod.infer<typeof candidatureSchema>;

const action: FormAction<FormState, typeof schema> = async (_, body) =>
  withUtilisateur(async (utilisateur) => {
    const candidature = await getCandidature(body.identifiantProjet);

    await mediator.send<Candidature.CorrigerCandidatureUseCase>({
      type: 'Candidature.UseCase.CorrigerCandidature',
      data: {
        ...mapBodyToUseCaseData(body, candidature),
        corrigéLeValue: DateTime.now().formatter(),
        corrigéParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Candidature.détails(body.identifiantProjet),
        message: 'La candidature a bien été corrigée',
      },
    };
  });

export const corrigerCandidatureAction = formAction(action, schema);

const mapBodyToUseCaseData = (
  data: zod.infer<typeof schema>,
  previous: Candidature.ConsulterCandidatureReadModel,
): Omit<Candidature.CorrigerCandidatureUseCase['data'], 'corrigéLeValue' | 'corrigéParValue'> => {
  const { appelOffre, période, famille, numéroCRE } = IdentifiantProjet.convertirEnValueType(
    data.identifiantProjet,
  );
  return {
    appelOffreValue: appelOffre,
    périodeValue: période,
    familleValue: famille,
    numéroCREValue: numéroCRE,
    dépôtCandidatureValue: {
      nomProjet: data.nomProjet,
      sociétéMère: data.societeMere,
      nomCandidat: data.nomCandidat,
      puissanceProductionAnnuelle: data.puissanceProductionAnnuelle,
      prixRéférence: data.prixReference,
      nomReprésentantLégal: data.nomRepresentantLegal,
      emailContact: { email: data.emailContact },
      localité: {
        codePostal: data.codePostal,
        adresse1: data.adresse1,
        adresse2: data.adresse2,
        commune: data.commune,
        département: data.departement,
        région: data.region,
      },
      puissanceALaPointe: data.puissanceALaPointe,
      evaluationCarboneSimplifiée: data.evaluationCarboneSimplifiee,
      actionnariat: data.actionnariat ? { type: data.actionnariat } : undefined,
      technologie: { type: data.technologie },
      typeGarantiesFinancières: data.typeGarantiesFinancieres
        ? { type: data.typeGarantiesFinancieres }
        : undefined,
      dateÉchéanceGf: data.dateEcheanceGf ? { date: data.dateEcheanceGf.toISOString() } : undefined,
      coefficientKChoisi: data.coefficientKChoisi,
      territoireProjet: previous.territoireProjet,
      historiqueAbandon: previous.historiqueAbandon,
    },
    instructionCandidatureValue: {
      noteTotale: data.noteTotale,
      statut: data.statut ? { statut: data.statut } : previous.statut,
      motifÉlimination: data.motifElimination,
    },
    doitRégénérerAttestationValue: data.doitRegenererAttestation ? true : undefined,
  };
};
