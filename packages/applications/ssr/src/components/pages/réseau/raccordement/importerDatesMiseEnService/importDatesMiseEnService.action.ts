'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Raccordement } from '@potentiel-domain/reseau';
import { ConsulterProjetQuery } from '@potentiel-domain/candidature';
import { DomainError } from '@potentiel-domain/core';
import { parseCsv } from '@potentiel-libraries/csv';
import { Option } from '@potentiel-libraries/monads';

import { ActionResult, FormAction, FormState, formAction } from '@/utils/formAction';
export type ImporterDatesMiseEnServiceState = FormState;

const schema = zod.object({
  fichierDatesMiseEnService: zod.instanceof(Blob).refine((data) => data.size > 0),
});

const csvSchema = zod.object({
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
  const lines = await parseCsv(fichierDatesMiseEnService.stream(), csvSchema);

  if (lines.length === 0) {
    return {
      status: 'form-error',
      errors: ['fichierDatesMiseEnService'],
    };
  }

  let success: number = 0;
  const errors: ActionResult['errors'] = [];

  for (const { referenceDossier, dateMiseEnService } of lines) {
    const dossiers = await mediator.send<Raccordement.RechercherDossierRaccordementQuery>({
      type: 'Réseau.Raccordement.Query.RechercherDossierRaccordement',
      data: {
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
        const candidature = await mediator.send<ConsulterProjetQuery>({
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
