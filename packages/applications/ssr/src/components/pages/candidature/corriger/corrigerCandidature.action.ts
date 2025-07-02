'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCandidature } from '@/app/candidatures/_helpers/getCandidature';
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
    prixRéférenceValue: data.prixReference,
    noteTotaleValue: data.noteTotale,
    nomReprésentantLégalValue: data.nomRepresentantLegal,
    emailContactValue: data.emailContact,
    localitéValue: {
      codePostal: data.codePostal,
      adresse1: data.adresse1,
      adresse2: data.adresse2,
      commune: data.commune,
      département: data.departement,
      région: data.region,
    },
    motifÉliminationValue: data.motifElimination,
    puissanceALaPointeValue: data.puissanceALaPointe,
    evaluationCarboneSimplifiéeValue: data.evaluationCarboneSimplifiee,
    actionnariatValue: data.actionnariat,
    technologieValue: data.technologie,
    statutValue: data.statut ?? previous.statut.formatter(),

    typeGarantiesFinancièresValue: data.typeGarantiesFinancieres,
    dateÉchéanceGfValue: data.dateEcheanceGf
      ? DateTime.convertirEnValueType(data.dateEcheanceGf).formatter()
      : undefined,
    coefficientKChoisiValue: data.coefficientKChoisi,

    // non-editable fields
    territoireProjetValue: previous.territoireProjet,
    historiqueAbandonValue: previous.historiqueAbandon.formatter(),
    fournisseursValue: previous.fournisseurs.map((fournisseur) => fournisseur.formatter()),
    typeInstallationsAgrivoltaiquesValue: previous.typeInstallationsAgrivoltaiques?.formatter(),
    élémentsSousOmbrièreValue: previous.élémentsSousOmbrière,
    typologieDeBâtimentValue: previous.typologieDeBâtiment?.formatter(),
    obligationDeSolarisationValue: previous.obligationDeSolarisation,

    détailsValue: undefined,

    doitRégénérerAttestation: data.doitRegenererAttestation ? true : undefined,
  };
};
