'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { DomainError } from '@potentiel-domain/core';
import { parseCsv } from '@potentiel-libraries/csv';

import { ActionResult, FormAction, formAction, FormState } from '@/utils/formAction';

import { candidatureSchema } from './candidature.schema';

export type ImporterCandidaturesState = FormState;

const schema = zod.object({
  appelOffre: zod.string().min(1),
  periode: zod.string().min(1),
  fichierImport: zod.instanceof(Blob).refine((data) => data.size > 0),
});

const action: FormAction<FormState, typeof schema> = async (
  _,
  { fichierImport, appelOffre, periode: période },
) => {
  const lines = await parseCsv(fichierImport.stream(), candidatureSchema);

  if (lines.length === 0) {
    return {
      status: 'form-error',
      errors: ['fichierImport'],
    };
  }

  let success: number = 0;
  const errors: ActionResult['errors'] = [];

  for (const line of lines) {
    try {
      await mediator.send<Candidature.InstruireCandidature>({
        type: 'Candidature.UseCase.InstruireCandidature',
        data: {
          appelOffre,
          période,
        },
      });

      success++;
    } catch (error) {
      if (error instanceof DomainError) {
        errors.push({
          key: line.nom_projet,
          reason: error.message,
        });
        continue;
      }
      errors.push({
        key: line.nom_projet,
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
};

export const importerCandidaturesAction = formAction(action, schema);
