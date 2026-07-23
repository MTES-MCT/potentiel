'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import type { Candidature } from '@potentiel-domain/projet';

import { getCandidature } from '@/app/_helpers';
import {
  doitRegenererAttestationSchema,
  dépôtSchema,
  identifiantProjetSchema,
  instructionSchema,
} from '@/utils/candidature';
import {
  coordonnéesSchema,
  dateDAutorisationSchema,
  numéroDAutorisationSchema,
  siretSchema,
} from '@/utils/candidature/dépôt.schema';
import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

export type CorrigerCandidaturesState = FormState;

const schema = dépôtSchema
  .omit({
    autorisation: true,
    localité: true,
    typologieInstallation: true,
    historiqueAbandon: true,
    raccordements: true,
    coordonnées: true,
    numéroIdentification: true,
  })
  .extend({
    identifiantProjet: identifiantProjetSchema,
    doitRegenererAttestation: doitRegenererAttestationSchema,
    statut: instructionSchema.shape.statut.optional(),
    motifElimination: instructionSchema.shape.motifÉlimination,
    noteTotale: instructionSchema.shape.noteTotale,
    dateDAutorisation: dateDAutorisationSchema,
    numéroDAutorisation: numéroDAutorisationSchema,
    coordonnées: zod
      .object({ latitude: zod.coerce.number(), longitude: zod.coerce.number() })
      .pipe(coordonnéesSchema)
      .optional(),
    siret: siretSchema,
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
      volumeRéservé: previous.instruction.volumeRéservé,
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
      autorisation:
        data.numéroDAutorisation && data.dateDAutorisation
          ? {
              numéro: data.numéroDAutorisation,
              date: DateTime.convertirEnValueType(data.dateDAutorisation).formatter(),
            }
          : undefined,
      installateur: data.installateur,
      coordonnées: data.coordonnées,
      puissanceDuProjetInitial: data.puissanceDuProjetInitial,

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
            tauxPrévisionnelACC: previous.dépôt.natureDeLExploitation?.tauxPrévisionnelACC,
          }
        : undefined,
      raccordements: previous.dépôt.raccordements?.map((r) => ({
        dateQualification: r.dateQualification.formatter(),
        référence: r.référence.formatter(),
      })),
      numéroIdentification: data.siret
        ? { siret: data.siret, siren: data.siret.slice(0, 9) }
        : data.siret === undefined
          ? previous.dépôt.numéroIdentification
          : undefined,
    },

    détailsValue: undefined,

    doitRégénérerAttestation: data.doitRegenererAttestation ? true : undefined,
  };
};
