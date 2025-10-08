'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { DomainError } from '@potentiel-domain/core';
import { getDossiersDemarche } from '@potentiel-infrastructure/ds-api-client';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { parseCsv } from '@potentiel-libraries/csv';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';

import { ActionResult, FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';
import { dépôtSchema } from '@/utils/candidature/dépôt.schema';
import { instructionSchema } from '@/utils/candidature/instruction.schema';
import { statutCsvSchema } from '@/utils/candidature/csv/candidatureCsvFields.schema';
import { numberSchema } from '@/utils/candidature/schemaBase';

const schema = zod.object({
  appelOffre: zod.string(),
  periode: zod.string(),
  famille: zod.string().optional(),

  fichierInstruction: singleDocument({ acceptedFileTypes: ['text/csv'] }),
  identifiantDemarcheDS: numberSchema,

  test: zod.stringbool().optional(),
});

export type ImporterPériodeFormKeys = keyof zod.infer<typeof schema>;

const instructionCsvSchema = zod.object({
  numeroDossierDS: zod.coerce.number(),
  statut: statutCsvSchema,
  note: instructionSchema.shape.noteTotale,
  motifElimination: instructionSchema.shape.motifÉlimination,
});

const action: FormAction<FormState, typeof schema> = async (
  _,
  { appelOffre, periode, fichierInstruction, test, identifiantDemarcheDS },
) =>
  withUtilisateur(async (utilisateur) => {
    let success: number = 0;
    const errors: ActionResult['errors'] = [];

    const { parsedData: instructions } = await parseCsv(
      fichierInstruction.content,
      instructionCsvSchema,
      { delimiter: ';' },
    );

    const candidatures: Omit<
      Candidature.ImporterCandidatureUseCase['data'],
      'importéLe' | 'importéPar'
    >[] = [];

    const démarche = await getDossiersDemarche(identifiantDemarcheDS);

    if (Option.isNone(démarche)) {
      throw new Error(`La démarche ${identifiantDemarcheDS} est introuvable`);
    }

    for (const { numeroDossierDS, statut, note, motifElimination } of instructions) {
      let key = `Dossier ${numeroDossierDS}`;

      const dossier = démarche.find((d) => d.numeroDS === numeroDossierDS);

      if (!dossier) {
        errors.push({
          key,
          reason: `Le dossier n'a pas été trouvé`,
        });
        continue;
      }
      try {
        key += ` - ${dossier.dépôt.nomProjet}`;
        const dépôt = dépôtSchema.parse(dossier.dépôt);
        const instruction = instructionSchema.parse({
          statut,
          noteTotale: note,
          motifÉlimination: motifElimination,
        } satisfies Record<keyof Candidature.Instruction.RawType, unknown>);

        candidatures.push({
          identifiantProjetValue: IdentifiantProjet.bind({
            appelOffre,
            période: periode,
            famille: '',
            numéroCRE: String(numeroDossierDS),
          }).formatter(),
          dépôtValue: {
            actionnariat: undefined,
            coefficientKChoisi: undefined,
            obligationDeSolarisation: undefined,
            territoireProjet: '',
            fournisseurs: [],
            typeGarantiesFinancières: undefined,
            dateÉchéanceGf: undefined,
            puissanceDeSite: undefined,
            installateur: undefined,
            dispositifDeStockage: undefined,
            natureDeLExploitation: undefined,
            attestationConstitutionGf: undefined,
            dateConstitutionGf: undefined,
            ...dépôt,
            localité: {
              ...dépôt.localité,
              adresse2: dépôt.localité.adresse2 ?? '',
            },
          },
          détailsValue: {
            typeImport: 'démarches-simplifiées',
            demarcheId: identifiantDemarcheDS,
            pièceJustificativeGf: dossier.fichiers.garantiesFinancières?.url ?? '',
          },
          instructionValue: instruction,
        });
      } catch (error) {
        if (error instanceof zod.ZodError) {
          error.issues.forEach((error) => {
            errors.push({
              key,
              reason: `${error.path.join('.')} : ${error.message}`,
            });
          });
        } else {
          errors.push({
            key,
            reason: `Une erreur inconnue empêche l'import de la candidature`,
          });
        }
      }
    }

    if (test) {
      return {
        status: 'success',
        result: {
          successMessage: `${candidatures.length} candidatures seront importées`,
          errors,
        },
      };
    }

    if (errors.length) {
      return {
        status: 'success',
        result: {
          successMessage: ``,
          errors,
        },
      };
    }

    for (const {
      identifiantProjetValue,
      dépôtValue,
      instructionValue,
      détailsValue,
    } of candidatures) {
      try {
        await mediator.send<Candidature.ImporterCandidatureUseCase>({
          type: 'Candidature.UseCase.ImporterCandidature',
          data: {
            identifiantProjetValue,
            dépôtValue,
            instructionValue,
            détailsValue,
            importéLe: DateTime.now().formatter(),
            importéPar: utilisateur.identifiantUtilisateur.email,
          },
        });
        success++;
      } catch (error) {
        if (error instanceof DomainError) {
          errors.push({
            key: identifiantProjetValue,
            reason: error.message,
          });
        } else if (error instanceof zod.ZodError) {
          error.issues.forEach((error) => {
            errors.push({
              key: identifiantProjetValue,
              reason: `${error.path.join('.')} : ${error.message}`,
            });
          });
        } else {
          errors.push({
            key: identifiantProjetValue,
            reason: `Une erreur inconnue empêche l'import de la candidature`,
          });
        }
      }
    }

    return {
      status: 'success',
      result: {
        successMessage: `${success} candidatures ont été importées avec succès.`,
        link:
          success > 0
            ? {
                href: Routes.Candidature.lister({
                  appelOffre,
                  période: periode,
                  estNotifié: false,
                }),
                label: 'Voir les candidatures importées',
              }
            : undefined,
        errors,
      },
    };
  });

export const importerPériodeAction = formAction(action, schema);
