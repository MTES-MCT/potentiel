'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime } from '@potentiel-domain/common';
import { DomainError, InvalidOperationError } from '@potentiel-domain/core';
import { type Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import {
  getDémarcheAvecDossiers,
  getDémarcheIdParDossier,
} from '@potentiel-infrastructure/ds-api-client';
import { ImportCSV } from '@potentiel-libraries/csv';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { cleanDétailsKeys } from '@/utils/candidature';
import { statutCsvSchema } from '@/utils/candidature/csv/candidatureCsvFields.schema';
import { dépôtSchema } from '@/utils/candidature/dépôt.schema';
import { instructionSchema } from '@/utils/candidature/instruction.schema';
import { type ActionResult, type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

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

const convertirKWcEnMWc = (value: number) => Number((value / 1000).toFixed(6));

const action: FormAction<FormState, typeof schema> = async (
  _,
  { appelOffre, periode, fichierInstruction, test },
) =>
  withUtilisateur(async (utilisateur) => {
    let success: number = 0;
    const errors: ActionResult['errors'] = [];

    const { parsedData: instructions } = await ImportCSV.fromCSV(
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
      throw new InvalidOperationError(
        `La démarche associée au dossier ${numeroDossierDS} est introuvable`,
      );
    }

    const détailAppelOffres = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: appelOffre },
    });

    if (Option.isNone(détailAppelOffres)) {
      throw new InvalidOperationError(`L'appel d'offres ${appelOffre} est introuvable`);
    }

    const candidatures: Omit<
      Candidature.ImporterCandidatureUseCase['data'],
      'importéLe' | 'importéPar'
    >[] = [];

    const dossiers = await getDémarcheAvecDossiers(demarcheId);

    if (Option.isNone(dossiers)) {
      throw new InvalidOperationError(`La démarche ${demarcheId} est introuvable`);
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
            coefficientKChoisi: undefined,
            obligationDeSolarisation: undefined,
            territoireProjet: '',
            fournisseurs: [],
            installateur: undefined,
            dispositifDeStockage: undefined,
            natureDeLExploitation: undefined,
            dateÉchéanceGf: undefined,
            puissanceDuProjetInitial: undefined,
            dateConstitutionGf: undefined,
            attestationConstitutionGf: undefined,
            raccordements: undefined,
            coordonnées: undefined,
            ...dépôt,
            puissance: détailAppelOffres.puissanceInitialeCandidatureEnKWc
              ? convertirKWcEnMWc(dépôt.puissance)
              : dépôt.puissance,
            puissanceDeSite:
              dépôt.puissanceDeSite !== undefined
                ? détailAppelOffres.puissanceInitialeCandidatureEnKWc
                  ? convertirKWcEnMWc(dépôt.puissanceDeSite)
                  : dépôt.puissanceDeSite
                : undefined,
            localité: {
              ...dépôt.localité,
              adresse2: dépôt.localité.adresse2 ?? '',
            },
          },
          détailsValue: {
            ...cleanDétailsKeys(dossier.détails),
            typeImport: 'démarches-simplifiées',
            demarcheId: demarcheId.toString(),
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
          getLogger(importerCandidaturesParDSAction.name).error(error as Error);
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
        if (DomainError.isDomainError(error)) {
          errors.push({
            key: identifiantProjetValue,
            reason: error.message,
          });
          continue;
        }

        if (error instanceof zod.ZodError) {
          error.issues.forEach((error) => {
            errors.push({
              key: identifiantProjetValue,
              reason: `${error.path.join('.')} : ${error.message}`,
            });
          });
          continue;
        }

        getLogger().error(error as Error);
        errors.push({
          key: identifiantProjetValue,
          reason: `Une erreur inconnue empêche l'import de la candidature`,
        });
      }
    }

    return {
      status: 'success',
      result: {
        successMessage: `${success} candidatures ont été importées avec succès.`,
        link:
          success > 0
            ? {
                url: Routes.Candidature.lister({
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
