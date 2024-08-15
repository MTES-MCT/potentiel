'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { DomainError } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/candidature';
import { parseCsv } from '@potentiel-libraries/csv';

import { ActionResult, FormAction, formAction, FormState } from '@/utils/formAction';

import { candidatureSchema } from '../importer/candidature.schema';
import { mapLineToUseCaseData } from '../importer/importerCandidatures.action';

export type CorrigerCandidaturesState = FormState;

const schema = zod.object({
  fichierImport: zod.instanceof(Blob).refine((data) => data.size > 0),
});

const action: FormAction<FormState, typeof schema> = async (_, { fichierImport }) => {
  const { parsedData, rawData } = await parseCsv(fichierImport.stream(), candidatureSchema);

  if (parsedData.length === 0) {
    return {
      status: 'form-error',
      errors: ['fichierImport'],
    };
  }

  let success: number = 0;
  const errors: ActionResult['errors'] = [];

  for (const line of parsedData) {
    try {
      const projectRawLine = rawData.find((data) => data['Nom projet'] === line.nom_projet) ?? {};

      // TODO Corriger
      await mediator.send<Candidature.ImporterCandidatureUseCase>({
        type: 'Candidature.UseCase.ImporterCandidature',
        data: mapLineToUseCaseData(line, removeEmptyValues(projectRawLine)),
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
        reason: `Une erreur inconnue empêche la correction des candidatures`,
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

const removeEmptyValues = (projectRawLine: Record<string, string>) => {
  return Object.fromEntries(Object.entries(projectRawLine).filter(([, value]) => value !== ''));
};
