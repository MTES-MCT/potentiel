'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { DomainError } from '@potentiel-domain/core';
import { getDépôtCandidature } from '@potentiel-infrastructure/ds-api-client';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { parseCsv } from '@potentiel-libraries/csv';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';

import { ActionResult, FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';
import { dépôtSchema } from '@/utils/candidature/dépôt.schema';
import { instructionSchema } from '@/utils/candidature/instruction.schema';

import { getLocalité } from '../../_helpers';

const schema = zod.object({
  appelOffre: zod.string(),
  periode: zod.string(),
  famille: zod.string().optional(),

  demarcheId: zod.coerce.number(),

  fichierInstruction: singleDocument({ acceptedFileTypes: ['text/csv'] }),

  test: zod
    .enum(['', 'true', 'false'])
    .optional()
    .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
});

export type ImporterPériodeFormKeys = keyof zod.infer<typeof schema>;

const instructionCsvSchema = zod.object({
  numeroDossierDS: zod.coerce.number(),
  statut: instructionSchema.shape.statut,
  note: instructionSchema.shape.noteTotale,
  motifElimination: instructionSchema.shape.motifÉlimination,
});

const action: FormAction<FormState, typeof schema> = async (
  _,
  { appelOffre, periode, fichierInstruction, demarcheId, test },
) => {
  return withUtilisateur(async (utilisateur) => {
    const success: number = 0;
    const errors: ActionResult['errors'] = [];

    const { parsedData: instructions } = await parseCsv(
      fichierInstruction.content,
      instructionCsvSchema,
      { encoding: 'win1252', delimiter: ';' },
    );

    const candidatures: Omit<
      Candidature.ImporterCandidatureUseCase['data'],
      'importéLe' | 'importéPar'
    >[] = [];

    for (const { numeroDossierDS, statut, note, motifElimination } of instructions) {
      let key = `Dossier ${numeroDossierDS}`;

      try {
        const dossier = await getDépôtCandidature(numeroDossierDS);

        if (Option.isNone(dossier)) {
          errors.push({
            key,
            reason: `Une erreur inconnue empêche l'import des candidatures`,
          });
          continue;
        }

        key += ` - ${dossier.dépôt.nomProjet}`;
        const dépôt = dépôtSchema.parse(dossier);
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
            ...dépôt,
            fournisseurs: [],
            localité: getLocalité({
              adresse1: dépôt.adresse1,
              adresse2: dépôt.adresse2,
              codePostaux: [dépôt.codePostal],
              commune: dépôt.commune,
            }),
            typeGarantiesFinancières: dépôt.typeGarantiesFinancières,
            dateÉchéanceGf: dépôt.dateÉchéanceGf,
            dateDélibérationGf: dépôt.dateÉchéanceGf,

            // TODO les champs ci dessous sont à ajouter
            historiqueAbandon: Candidature.HistoriqueAbandon.premièreCandidature.formatter(),
            obligationDeSolarisation: undefined,
            territoireProjet: '',
            typeInstallationsAgrivoltaiques: undefined,
            typologieDeBâtiment: undefined,
            élémentsSousOmbrière: undefined,
            actionnariat: undefined,
            coefficientKChoisi: undefined,
          },
          détailsValue: {
            typeImport: 'démarches-simplifiées',
            demarcheId,
            pièceJustificativeGf: dossier.fichiers.garantiesFinancièresUrl ?? '',
          },
          instructionValue: instruction,
        });
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
    }

    if (test) {
      return {
        status: 'success',
        result: {
          successCount: 0,
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

export const importerPériodeAction = formAction(action, schema);
