'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCandidature } from '@/app/_helpers';
import { candidatureSchema } from '@/utils/candidature';

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
        corrigéLe: DateTime.now().formatter(),
        corrigéPar: utilisateur.identifiantUtilisateur.formatter(),
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
): Omit<Candidature.CorrigerCandidatureUseCase['data'], 'corrigéLe' | 'corrigéPar'> => {
  return {
    identifiantProjetValue: previous.identifiantProjet.formatter(),
    instructionValue: {
      motifÉlimination: data.motifElimination,
      noteTotale: data.noteTotale,
      statut: data.statut ?? previous.instruction.statut.formatter(),
    },
    dépôtValue: {
      nomProjet: data.nomProjet,
      sociétéMère: data.societeMere,
      nomCandidat: data.nomCandidat,
      puissanceProductionAnnuelle: data.puissanceProductionAnnuelle,
      prixReference: data.prixReference,
      nomReprésentantLégal: data.nomRepresentantLegal,
      emailContact: data.emailContact,
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
      actionnariat: data.actionnariat,
      technologie: data.technologie,

      typeGarantiesFinancières: data.typeGarantiesFinancieres,
      dateÉchéanceGf: data.dateEcheanceGf
        ? DateTime.convertirEnValueType(data.dateEcheanceGf).formatter()
        : undefined,
      dateDélibérationGf: previous.dépôt.garantiesFinancières?.estExemption()
        ? previous.dépôt.garantiesFinancières.dateDélibération.formatter()
        : undefined,
      coefficientKChoisi: data.coefficientKChoisi,

      // non-editable fields
      territoireProjet: previous.dépôt.territoireProjet,
      historiqueAbandon: previous.dépôt.historiqueAbandon.formatter(),
      fournisseurs: previous.dépôt.fournisseurs.map((fournisseur) => fournisseur.formatter()),
      typeInstallationsAgrivoltaiques: previous.dépôt.typeInstallationsAgrivoltaiques?.formatter(),
      élémentsSousOmbrière: previous.dépôt.élémentsSousOmbrière,
      typologieDeBâtiment: previous.dépôt.typologieDeBâtiment?.formatter(),
      obligationDeSolarisation: previous.dépôt.obligationDeSolarisation,
    },

    détailsValue: undefined,

    doitRégénérerAttestation: data.doitRegenererAttestation ? true : undefined,
  };
};
