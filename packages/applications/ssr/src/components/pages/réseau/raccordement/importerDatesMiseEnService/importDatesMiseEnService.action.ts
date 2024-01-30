'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Raccordement } from '@potentiel-domain/reseau';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';

import { parseCsv } from '@/utils/parseCsv';
import { FormAction, FormState, formAction } from '@/utils/formAction';

export type ImporterDatesMiseEnServiceState = FormState;

const schema = zod.object({
  fichierDatesMiseEnService: zod.instanceof(Blob),
});

const csvSchema = zod.object({
  referenceDossier: zod.string().min(1, {
    message: 'La référence du dossier ne peut pas être vide',
  }),
  dateMiseEnService: zod.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: "Le format de la date n'est pas respecté (format attendu : JJ/MM/AAAA)",
  }),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { fichierDatesMiseEnService },
) => {
  const lines = await parseCsv(fichierDatesMiseEnService.stream(), csvSchema);

  await Promise.all(
    lines.map(async ({ referenceDossier, dateMiseEnService }) => {
      const result = await mediator.send<Raccordement.RechercherDossierRaccordementQuery>({
        type: 'RECHERCHER_DOSSIER_RACCORDEMENT_QUERY',
        data: {
          référenceDossierRaccordement: referenceDossier,
        },
      });

      return Promise.all(
        result.map(async ({ identifiantProjet, référenceDossierRaccordement }) => {
          const candidature = await mediator.send<ConsulterCandidatureQuery>({
            type: 'CONSULTER_CANDIDATURE_QUERY',
            data: {
              identifiantProjet: identifiantProjet.formatter(),
            },
          });

          return mediator.send<Raccordement.TransmettreDateMiseEnServiceUseCase>({
            type: 'TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE',
            data: {
              identifiantProjetValue: identifiantProjet.formatter(),
              dateDésignationValue: candidature.dateDésignation,
              référenceDossierValue: référenceDossierRaccordement.formatter(),
              dateMiseEnServiceValue: dateMiseEnService,
            },
          });
        }),
      );
    }),
  );
  return previousState;
};

export const importerDatesMiseEnServiceAction = formAction(action, schema);
