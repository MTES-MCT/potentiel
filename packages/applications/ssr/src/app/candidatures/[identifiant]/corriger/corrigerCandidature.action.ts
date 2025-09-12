'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCandidature } from '@/app/_helpers';
import {
  identifiantProjetSchema,
  dépôtSchema,
  instructionSchema,
  doitRegenererAttestationSchema,
  dateDAutorisationDUrbanismeSchema,
  numéroDAutorisationDUrbanismeSchema,
} from '@/utils/candidature';

export type CorrigerCandidaturesState = FormState;

// sans les accents, et avec les champs spécifiques à la correction
const schema = zod.object({
  identifiantProjet: identifiantProjetSchema,
  doitRegenererAttestation: doitRegenererAttestationSchema,

  nomProjet: dépôtSchema.shape.nomProjet,
  societeMere: dépôtSchema.shape.sociétéMère,
  nomCandidat: dépôtSchema.shape.nomCandidat,
  puissanceProductionAnnuelle: dépôtSchema.shape.puissanceProductionAnnuelle,
  prixReference: dépôtSchema.shape.prixReference,
  nomRepresentantLegal: dépôtSchema.shape.nomReprésentantLégal,
  emailContact: dépôtSchema.shape.emailContact,
  adresse1: dépôtSchema.shape.localité.shape.adresse1,
  adresse2: dépôtSchema.shape.localité.shape.adresse2,
  codePostal: dépôtSchema.shape.localité.shape.codePostal,
  commune: dépôtSchema.shape.localité.shape.commune,
  departement: dépôtSchema.shape.localité.shape.département,
  region: dépôtSchema.shape.localité.shape.région,
  puissanceALaPointe: dépôtSchema.shape.puissanceALaPointe,
  evaluationCarboneSimplifiee: dépôtSchema.shape.evaluationCarboneSimplifiée,
  actionnariat: dépôtSchema.shape.actionnariat,
  technologie: dépôtSchema.shape.technologie,
  typeGarantiesFinancieres: dépôtSchema.shape.typeGarantiesFinancières,
  dateEcheanceGf: dépôtSchema.shape.dateÉchéanceGf,
  dateDeliberationGf: dépôtSchema.shape.dateDélibérationGf,
  coefficientKChoisi: dépôtSchema.shape.coefficientKChoisi,
  puissanceDeSite: dépôtSchema.shape.puissanceDeSite,
  dateDAutorisationDUrbanisme: dateDAutorisationDUrbanismeSchema,
  numeroDAutorisationDUrbanisme: numéroDAutorisationDUrbanismeSchema,
  installateur: dépôtSchema.shape.installateur,
  installationAvecDispositifDeStockage: dépôtSchema.shape.installationAvecDispositifDeStockage,
  statut: instructionSchema.shape.statut.optional(),
  motifElimination: instructionSchema.shape.motifÉlimination,
  noteTotale: instructionSchema.shape.noteTotale,
});

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
      puissanceDeSite: data.puissanceDeSite,
      autorisationDUrbanisme:
        data.numeroDAutorisationDUrbanisme && data.dateDAutorisationDUrbanisme
          ? {
              numéro: data.numeroDAutorisationDUrbanisme,
              date: DateTime.convertirEnValueType(data.dateDAutorisationDUrbanisme).formatter(),
            }
          : undefined,
      installateur: data.installateur,
      installationAvecDispositifDeStockage: data.installationAvecDispositifDeStockage,

      // non-editable fields
      territoireProjet: previous.dépôt.territoireProjet,
      historiqueAbandon: previous.dépôt.historiqueAbandon.formatter(),
      fournisseurs: previous.dépôt.fournisseurs.map((fournisseur) => fournisseur.formatter()),
      obligationDeSolarisation: previous.dépôt.obligationDeSolarisation,
      typologieInstallation: previous.dépôt.typologieInstallation.map((installation) =>
        installation.formatter(),
      ),
    },

    détailsValue: undefined,

    doitRégénérerAttestation: data.doitRegenererAttestation ? true : undefined,
  };
};
