'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { Routes } from '@potentiel-applications/routes';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Actionnaire } from '@potentiel-domain/laureat';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCandidature } from '@/app/candidatures/_helpers/getCandidature';

import { requiredStringSchema } from '../../candidature/importer/candidature.schema';

import { candidatureNotifiéeSchema, lauréatSchema } from './schema';

export type CorrigerCandidaturesState = FormState;

export type ModifierLauréatCandidatureFormEntries = zod.infer<typeof candidatureNotifiéeSchema>;

const modifierLauréatSchéma = candidatureNotifiéeSchema.merge(lauréatSchema);

export type ModifierLauréatFormEntries = zod.infer<typeof modifierLauréatSchéma>;

const identifiantProjetSchema = zod.object({
  identifiantProjet: requiredStringSchema,
});

const schema = modifierLauréatSchéma.partial().merge(identifiantProjetSchema);

// TODO: faire une transaction comme plusieurs usecase risque d'être appelés ?
const action: FormAction<FormState, typeof schema> = async (_, body) =>
  withUtilisateur(async (utilisateur) => {
    const shouldUpdateCandidature = candidatureNotifiéeSchema.safeParse(body);

    if (shouldUpdateCandidature.success) {
      const candidature = await getCandidature(body.identifiantProjet);

      await mediator.send<Candidature.CorrigerCandidatureUseCase>({
        type: 'Candidature.UseCase.CorrigerCandidature',
        data: {
          ...mapBodyToCandidatureUsecaseData(
            body.identifiantProjet,
            shouldUpdateCandidature.data,
            candidature,
          ),
          corrigéLe: DateTime.now().formatter(),
          corrigéPar: utilisateur.identifiantUtilisateur.formatter(),
        },
      });
    }

    const shouldUpdateLauréat = lauréatSchema.safeParse(body);

    if (shouldUpdateLauréat.success) {
      if (shouldUpdateLauréat.data.actionnaire) {
        await mediator.send<Actionnaire.ActionnaireUseCase>({
          type: 'Lauréat.Actionnaire.UseCase.ModifierActionnaire',
          data: {
            identifiantProjetValue: body.identifiantProjet,
            identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
            dateModificationValue: new Date().toISOString(),
            raisonValue: '',
            actionnaireValue: shouldUpdateLauréat.data.actionnaire,
          },
        });
      }
    }

    return {
      status: 'success',
      redirection: {
        url: Routes.Projet.details(body.identifiantProjet),
        message: 'Le lauréat a bien été modifié',
      },
    };
  });

export const modifierLauréatAction = formAction(action, schema);

const mapBodyToCandidatureUsecaseData = (
  identifiantProjet: string,
  data: zod.infer<typeof candidatureNotifiéeSchema>,
  previous: Candidature.ConsulterCandidatureReadModel,
): Omit<Candidature.CorrigerCandidatureUseCase['data'], 'corrigéLe' | 'corrigéPar'> => {
  const { appelOffre, période, famille, numéroCRE } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);

  return {
    appelOffreValue: appelOffre,
    périodeValue: période,
    familleValue: famille,
    numéroCREValue: numéroCRE,
    nomProjetValue: previous.nomProjet,
    sociétéMèreValue: data.societeMere ?? previous.sociétéMère,
    // à appliquer à ces champs
    nomCandidatValue: previous.nomCandidat,
    puissanceProductionAnnuelleValue: previous.puissanceProductionAnnuelle,
    prixReferenceValue: previous.prixReference,
    noteTotaleValue: previous.noteTotale,
    nomReprésentantLégalValue: previous.nomReprésentantLégal,
    emailContactValue: previous.emailContact.formatter(),
    localitéValue: previous.localité,
    motifÉliminationValue: previous.motifÉlimination,
    puissanceALaPointeValue: previous.puissanceALaPointe,
    evaluationCarboneSimplifiéeValue: previous.evaluationCarboneSimplifiée,
    actionnariatValue: previous.actionnariat?.formatter(),
    technologieValue: previous.technologie.formatter(),

    // non-editable fields
    statutValue: previous.statut.formatter(),
    typeGarantiesFinancièresValue: previous.typeGarantiesFinancières?.type,
    dateÉchéanceGfValue: previous.dateÉchéanceGf?.formatter(),
    territoireProjetValue: previous.territoireProjet,
    historiqueAbandonValue: previous.historiqueAbandon.formatter(),
  };
};
