'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Raccordement } from '@potentiel-domain/reseau';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { DomainError } from '@potentiel-domain/core';

import { parseCsv } from '@/utils/parseCsv';
import { FormAction, FormState, formAction } from '@/utils/formAction';

export type ImporterDatesMiseEnServiceState = FormState;

const schema = zod.object({
  fichierDatesMiseEnService: zod
    .instanceof(Blob)
    .refine((data) => data.size > 0, { message: 'Vous devez joindre un fichier non vide.' }),
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

export type CsvResult = {
  success: {
    length: number;
    référenceDossier: Array<string>;
  };
  error: {
    length: number;
    details: Array<
      Record<string, string> & {
        reason: string;
      }
    >;
  };
};

const csvResult: CsvResult = {
  success: {
    length: 0,
    référenceDossier: [],
  },
  error: {
    length: 0,
    details: [],
  },
};

const action: FormAction<FormState, typeof schema> = async (_, { fichierDatesMiseEnService }) => {
  const lines = await parseCsv(fichierDatesMiseEnService.stream(), csvSchema);

  if (lines.length === 0) {
    return {
      status: 'form-error',
      errors: ['fichierDatesMiseEnService'],
    };
  }

  for (const { referenceDossier, dateMiseEnService } of lines) {
    const dossiers = await mediator.send<Raccordement.RechercherDossierRaccordementQuery>({
      type: 'RECHERCHER_DOSSIER_RACCORDEMENT_QUERY',
      data: {
        référenceDossierRaccordement: referenceDossier,
      },
    });

    if (dossiers.length === 0) {
      csvResult.error.length++;
      csvResult.error.details.push({
        référenceDossier: referenceDossier,
        reason: 'Aucun dossier correspondant',
      });

      continue;
    }

    for (const { identifiantProjet, référenceDossierRaccordement } of dossiers) {
      try {
        const candidature = await mediator.send<ConsulterCandidatureQuery>({
          type: 'CONSULTER_CANDIDATURE_QUERY',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

        await mediator.send<Raccordement.TransmettreDateMiseEnServiceUseCase>({
          type: 'TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            dateDésignationValue: candidature.dateDésignation,
            référenceDossierValue: référenceDossierRaccordement.formatter(),
            dateMiseEnServiceValue: new Date(
              convertDateToCommonFormat(dateMiseEnService),
            ).toISOString(),
          },
        });

        csvResult.success.length++;
        csvResult.success.référenceDossier.push(référenceDossierRaccordement.formatter());
      } catch (error) {
        csvResult.error.length++;

        if (error instanceof DomainError) {
          csvResult.error.details.push({
            référenceDossier: référenceDossierRaccordement.formatter(),
            reason: error.message,
          });
          continue;
        }
        csvResult.error.details.push({
          référenceDossier: référenceDossierRaccordement.formatter(),
          reason: 'Une erreur inconnue empêche la transmission de la date de mise en service',
        });
      }
    }
  }

  return {
    status: 'success',
  };
};

export const importerDatesMiseEnServiceAction = formAction(action, schema);
