'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { DomainError } from '@potentiel-domain/core';
import {
  getDémarcheAvecDossiers,
  getDémarcheIdParDossier,
} from '@potentiel-infrastructure/ds-api-client';
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

const schema = zod.object({
  appelOffre: zod.string(),
  periode: zod.string(),
  famille: zod.string().optional(),
  fichierInstruction: singleDocument({ acceptedFileTypes: ['text/csv'] }),
  test: zod.stringbool().optional(),
});

export type ImporterCandidaturesParDSFormKeys = keyof zod.infer<typeof schema>;

const instructionCsvSchema = zod.object({
  numeroDossierDS: zod.coerce.number(),
  statut: statutCsvSchema,
  note: instructionSchema.shape.noteTotale,
  motifElimination: instructionSchema.shape.motifÉlimination,
});

/**
 * Cette méthode s'applique uniquement à l'appel d'offres PPE2 - Petit PV Bâtiment car la puissance initiale sur Démarches Simplifiées est renseignées en kWc
 */
const convertirKWcEnMWc = (value: number) => Number((value / 1000).toFixed(6));

const action: FormAction<FormState, typeof schema> = async (
  _,
  { appelOffre, periode, fichierInstruction, test },
) =>
  withUtilisateur(async (utilisateur) => {
    let success: number = 0;
    const errors: ActionResult['errors'] = [];

    const { parsedData: instructions } = await parseCsv(
      fichierInstruction.content,
      instructionCsvSchema,
      { delimiter: ';' },
    );

    if (instructions.length === 0) {
      return {
        status: 'validation-error',
        errors: { fichierInstruction: 'Le fichier est vide' },
      };
    }

    const [{ numeroDossierDS }] = instructions;

    const demarcheId = await getDémarcheIdParDossier(numeroDossierDS);

    if (Option.isNone(demarcheId)) {
      throw new Error(`La démarche associée au dossier ${numeroDossierDS} est introuvable`);
    }

    const candidatures: Omit<
      Candidature.ImporterCandidatureUseCase['data'],
      'importéLe' | 'importéPar'
    >[] = [];

    const dossiers = await getDémarcheAvecDossiers(demarcheId);

    if (Option.isNone(dossiers)) {
      throw new Error(`La démarche ${demarcheId} est introuvable`);
    }

    for (const { numeroDossierDS, statut, note, motifElimination } of instructions) {
      let key = `Dossier ${numeroDossierDS}`;

      const dossier = dossiers.find((d) => d.numeroDS === numeroDossierDS);

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
            installateur: undefined,
            dispositifDeStockage: undefined,
            natureDeLExploitation: undefined,
            typeGarantiesFinancières: undefined,
            dateÉchéanceGf: undefined,
            puissanceProjetInitial: undefined,
            ...dépôt,
            // On force ces valeurs à undefined puisqu'elles
            // seront récupérées lors de la désignation lauréate de la candidature
            attestationConstitutionGf: undefined,
            dateConstitutionGf: undefined,
            puissanceProductionAnnuelle: convertirKWcEnMWc(dépôt.puissanceProductionAnnuelle),
            puissanceDeSite:
              dépôt.puissanceDeSite !== undefined
                ? convertirKWcEnMWc(dépôt.puissanceDeSite)
                : undefined,
            localité: {
              ...dépôt.localité,
              adresse2: dépôt.localité.adresse2 ?? '',
            },
          },
          détailsValue: {
            typeImport: 'démarches-simplifiées',
            demarcheId: demarcheId.toString(),
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

export const importerCandidaturesParDSAction = formAction(action, schema);
