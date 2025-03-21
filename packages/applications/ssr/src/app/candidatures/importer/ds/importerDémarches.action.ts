'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { DomainError } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/candidature';
import { DateTime } from '@potentiel-domain/common';
import { getDossier } from '@potentiel-infrastructure/ds-api-client';

import { ActionResult, FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  dateEchéanceGfSchema,
  emailContactSchema,
  statutSchema,
  typeGarantiesFinancieresSchema,
} from '@/utils/zod/candidature/candidatureFields.schema';

const schema = zod.object({
  appelOffre: zod.string(),
  periode: zod.coerce.number(),
  famille: zod.coerce.number().optional(),

  dossierId: zod.coerce.number(),
});

export type ImporterDémarchesFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { appelOffre, periode, famille, dossierId },
) => {
  return withUtilisateur(async (utilisateur) => {
    let success: number = 0;
    const errors: ActionResult['errors'] = [];

    let key = `Dossier ${dossierId}`;

    try {
      const dossier = await getDossier(dossierId);
      key += ` - ${dossier.numéroCRE} - ${dossier.nomProjet}`;
      const parsed = dossierSchema.parse(dossier);

      // const projectRawLine = rawData.find((data) => data['Nom projet'] === line.nomProjet) ?? {};
      await mediator.send<Candidature.ImporterCandidatureUseCase>({
        type: 'Candidature.UseCase.ImporterCandidature',
        data: {
          appelOffreValue: appelOffre.toString(),
          périodeValue: periode.toString(),
          familleValue: famille?.toString() ?? '',
          ...mapLineToUseCaseData(parsed),
          détailsValue: {
            pièceJustificativeGf: parsed.pièceJustificativeGf ?? '',
          },
          importéLe: DateTime.now().formatter(),
          importéPar: utilisateur.identifiantUtilisateur.formatter(),
        },
      });

      success++;
    } catch (error) {
      console.log(error);
      if (error instanceof DomainError) {
        errors.push({
          key,
          reason: error.message,
        });
      } else if (error instanceof zod.ZodError) {
        error.errors.forEach((error) => {
          errors.push({
            key,
            reason: `${error.path.join('.')} : ${error.message}`,
          });
        });
      } else {
        errors.push({
          key,
          reason: `Une erreur inconnue empêche l'import des candidatures`,
        });
      }
    }

    return {
      status: 'success',
      result: {
        successCount: success,
        errors,
      },
    };
  });
};

export const importerDémarchesAction = formAction(action, schema);

const dossierSchema = zod.object({
  nomProjet: zod.string(),
  localité: zod.object({
    adresse1: zod.string(),
    département: zod.string(),
    région: zod.string(),
    commune: zod.string(),
    codePostal: zod.string(),
  }),
  puissance: zod.number(),
  prix: zod.number(),
  evaluationCarbone: zod.number(),
  typeGarantiesFinancières: zod
    .enum([
      "Garantie financière jusqu'à 6 mois après la date d'achèvement",
      "Garantie financière avec date d'échéance et à renouveler",
      'Consignation',
    ] as const)
    .transform((val) =>
      match(val)
        .returnType<Candidature.TypeGarantiesFinancières.RawType>()
        .with(
          "Garantie financière jusqu'à 6 mois après la date d'achèvement",
          () => 'six-mois-après-achèvement',
        )
        .with(
          "Garantie financière avec date d'échéance et à renouveler",
          () => 'avec-date-échéance',
        )
        .with('Consignation', () => 'consignation')
        .exhaustive(),
    )
    .pipe(typeGarantiesFinancieresSchema),
  dateÉchéanceGf: dateEchéanceGfSchema,
  pièceJustificativeGf: zod.string().optional(),

  // Instruction
  numéroCRE: zod.number(),
  note: zod.number(),
  statut: zod.string().toLowerCase().pipe(statutSchema),
  email: emailContactSchema,
});

const mapLineToUseCaseData = (dossier: zod.infer<typeof dossierSchema>) => ({
  numéroCREValue: dossier.numéroCRE.toString(),
  typeGarantiesFinancièresValue: dossier.typeGarantiesFinancières,
  // TODO
  historiqueAbandonValue: 'première-candidature',
  nomProjetValue: dossier.nomProjet,
  sociétéMèreValue: 'TODO',
  nomCandidatValue: 'TODO',
  puissanceProductionAnnuelleValue: dossier.puissance,
  prixReferenceValue: dossier.prix,
  noteTotaleValue: dossier.note,
  nomReprésentantLégalValue: 'TODO',
  emailContactValue: dossier.email,
  localitéValue: { ...dossier.localité, adresse2: '' },
  statutValue: dossier.statut,
  motifÉliminationValue: 'TODO',
  // TODO
  puissanceALaPointeValue: false,
  evaluationCarboneSimplifiéeValue: dossier.evaluationCarbone,
  // TODO
  technologieValue: 'N/A',
  // TODO
  actionnariatValue: undefined,
  dateÉchéanceGfValue: dossier.dateÉchéanceGf?.toISOString(),
  // TODO
  territoireProjetValue: '',
});
