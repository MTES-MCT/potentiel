'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Raccordement } from '@potentiel-domain/reseau';
import { Candidature } from '@potentiel-domain/candidature';
import { DomainError } from '@potentiel-domain/core';
import { parseCsv } from '@potentiel-libraries/csv';
import { Option } from '@potentiel-libraries/monads';

import { ActionResult, FormAction, FormState, formAction } from '@/utils/formAction';
import { validateDocumentSize } from '@/utils/zod/documentValidation';

import { fileKey } from './importerDatesMiseEnService.form';
export type ImporterDatesMiseEnServiceState = FormState;

const schema = zod.object({
  fichierDatesMiseEnService: validateDocumentSize({
    filePath: 'fichierDatesMiseEnService',
  }),
});

const csvSchema = zod.object({
  numeroCRE: zod.string().optional(),
  referenceDossier: zod.string().min(1, {
    message: 'La référence du dossier ne peut pas être vide',
  }),
  dateMiseEnService: zod.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: "Le format de la date n'est pas respecté (format attendu : JJ/MM/AAAA)",
  }),
});

const convertDateToCommonFormat = (date: string) => {
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`;
};

const action: FormAction<FormState, typeof schema> = async (_, { fichierDatesMiseEnService }) => {
  const { parsedData: lines } = await parseCsv(fichierDatesMiseEnService.stream(), csvSchema);

  if (lines.length === 0) {
    return {
      status: 'validation-error',
      errors: [fileKey],
    };
  }

  let success: number = 0;
  const errors: ActionResult['errors'] = [];

  for (const { numeroCRE, referenceDossier, dateMiseEnService } of lines) {
    const dossiers = await mediator.send<Raccordement.RechercherDossierRaccordementQuery>({
      type: 'Réseau.Raccordement.Query.RechercherDossierRaccordement',
      data: {
        numéroCRE: numeroCRE,
        référenceDossierRaccordement: referenceDossier,
      },
    });

    if (dossiers.length === 0) {
      errors.push({
        key: referenceDossier,
        reason: 'Aucun dossier correspondant',
      });

      continue;
    }

    for (const { identifiantProjet, référenceDossierRaccordement } of dossiers) {
      try {
        const candidature = await mediator.send<Candidature.ConsulterProjetQuery>({
          type: 'Candidature.Query.ConsulterProjet',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

        if (Option.isNone(candidature)) {
          return notFound();
        }

        await mediator.send<Raccordement.TransmettreDateMiseEnServiceUseCase>({
          type: 'Réseau.Raccordement.UseCase.TransmettreDateMiseEnService',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            dateDésignationValue: candidature.dateDésignation,
            référenceDossierValue: référenceDossierRaccordement.formatter(),
            dateMiseEnServiceValue: new Date(
              convertDateToCommonFormat(dateMiseEnService),
            ).toISOString(),
          },
        });

        success++;
      } catch (error) {
        if (error instanceof DomainError) {
          errors.push({
            key: référenceDossierRaccordement.formatter(),
            reason: error.message,
          });
          continue;
        }
        errors.push({
          key: référenceDossierRaccordement.formatter(),
          reason: 'Une erreur inconnue empêche la transmission de la date de mise en service',
        });
      }
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

export const importerDatesMiseEnServiceAction = formAction(action, schema);
