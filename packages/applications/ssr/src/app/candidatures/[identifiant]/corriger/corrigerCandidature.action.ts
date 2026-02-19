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
} from '@/utils/candidature';
import {
  dateDAutorisationDUrbanismeOuEnvironnementaleSchema,
  numéroDAutorisationDUrbanismeOuEnvironnementaleSchema,
} from '@/utils/candidature/dépôt.schema';

export type CorrigerCandidaturesState = FormState;

const schema = dépôtSchema
  .omit({
    autorisationDUrbanisme: true,
    localité: true,
    typologieInstallation: true,
    historiqueAbandon: true,
  })
  .extend({
    identifiantProjet: identifiantProjetSchema,
    doitRegenererAttestation: doitRegenererAttestationSchema,
    statut: instructionSchema.shape.statut.optional(),
    motifElimination: instructionSchema.shape.motifÉlimination,
    noteTotale: instructionSchema.shape.noteTotale,
    dateDAutorisationDUrbanisme: dateDAutorisationDUrbanismeOuEnvironnementaleSchema,
    numéroDAutorisationDUrbanisme: numéroDAutorisationDUrbanismeOuEnvironnementaleSchema,
    dateDAutorisationEnvironnementale: dateDAutorisationDUrbanismeOuEnvironnementaleSchema,
    numéroDAutorisationEnvironnementale: numéroDAutorisationDUrbanismeOuEnvironnementaleSchema,
  })
  .extend(dépôtSchema.shape.localité.shape);

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
      sociétéMère: data.sociétéMère,
      nomCandidat: data.nomCandidat,
      puissance: data.puissance,
      prixReference: data.prixReference,
      nomReprésentantLégal: data.nomReprésentantLégal,
      emailContact: data.emailContact,
      localité: {
        codePostal: data.codePostal,
        adresse1: data.adresse1,
        adresse2: data.adresse2 ?? '',
        commune: data.commune,
        département: data.département,
        région: data.région,
      },
      puissanceALaPointe: data.puissanceALaPointe,
      evaluationCarboneSimplifiée: data.evaluationCarboneSimplifiée,
      actionnariat: data.actionnariat,
      technologie: data.technologie,

      typeGarantiesFinancières: data.typeGarantiesFinancières,
      dateÉchéanceGf: data.dateÉchéanceGf
        ? DateTime.convertirEnValueType(data.dateÉchéanceGf).formatter()
        : undefined,
      dateConstitutionGf: data.dateConstitutionGf
        ? DateTime.convertirEnValueType(data.dateConstitutionGf).formatter()
        : undefined,
      coefficientKChoisi: data.coefficientKChoisi,
      puissanceDeSite: data.puissanceDeSite,
      autorisationDUrbanisme:
        data.numéroDAutorisationDUrbanisme && data.dateDAutorisationDUrbanisme
          ? {
              numéro: data.numéroDAutorisationDUrbanisme,
              date: DateTime.convertirEnValueType(data.dateDAutorisationDUrbanisme).formatter(),
            }
          : undefined,
      autorisationEnvironnementale:
        data.numéroDAutorisationEnvironnementale && data.dateDAutorisationEnvironnementale
          ? {
              numéro: data.numéroDAutorisationEnvironnementale,
              date: DateTime.convertirEnValueType(
                data.dateDAutorisationEnvironnementale,
              ).formatter(),
            }
          : undefined,
      installateur: data.installateur,
      puissanceProjetInitial: data.puissanceProjetInitial,

      // non-editable fields
      territoireProjet: previous.dépôt.territoireProjet,
      historiqueAbandon: previous.dépôt.historiqueAbandon.formatter(),
      fournisseurs: previous.dépôt.fournisseurs.map((fournisseur) => fournisseur.formatter()),
      obligationDeSolarisation: previous.dépôt.obligationDeSolarisation,
      typologieInstallation: previous.dépôt.typologieInstallation.map((installation) =>
        installation.formatter(),
      ),
      attestationConstitutionGf: previous.dépôt.garantiesFinancières?.constitution?.attestation,
      dispositifDeStockage: previous.dépôt.dispositifDeStockage,
      natureDeLExploitation: previous.dépôt.natureDeLExploitation
        ? {
            typeNatureDeLExploitation:
              previous.dépôt.natureDeLExploitation?.typeNatureDeLExploitation.formatter(),
            tauxPrévisionnelACI: previous.dépôt.natureDeLExploitation?.tauxPrévisionnelACI,
          }
        : undefined,
    },

    détailsValue: undefined,

    doitRégénérerAttestation: data.doitRegenererAttestation ? true : undefined,
  };
};
