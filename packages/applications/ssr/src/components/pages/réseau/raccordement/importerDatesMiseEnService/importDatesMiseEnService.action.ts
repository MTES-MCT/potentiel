'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Raccordement } from '@potentiel-domain/reseau';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';

import { parseCsv } from '@/utils/parseCsv';
import { CsvValidationError, FormAction, FormState, formAction } from '@/utils/formAction';

export type ImporterDatesMiseEnServiceState = FormState;

const schema = zod.object({
  fichierDatesMiseEnService: zod.instanceof(Blob),
});

const csvSchema = zod
  .array(
    zod.object({
      referenceDossier: zod.string().min(1, {
        message: 'La référence du dossier ne peut pas être vide',
      }),
      dateMiseEnService: zod.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, {
        message: "Le format de la date n'est pas respecté (format attendu : JJ/MM/AAAA)",
      }),
    }),
  )
  .nonempty();

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { fichierDatesMiseEnService },
) => {
  try {
    const parsed = await parseCsv(fichierDatesMiseEnService.stream());
    const data = csvSchema.parse(parsed);

    await Promise.all(
      data.map(async ({ referenceDossier, dateMiseEnService }) => {
        // Problème : certaines références n'ont pas été entrées correctement par les porteurs.
        // Il faut donc :
        //   - soit rechercher avec un like ici
        //   - soit donner accès à une liste aux admins pour qu'ils puissent y faire une recherche
        //     par référence et corriger celle-ci pour refaire l'import
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
    return {
      success: true,
      validationErrors: [],
      csvValidationErrors: [],
    };
  } catch (error) {
    if (error instanceof zod.ZodError) {
      const csvValidationErrors = error.errors.map(({ path: [ligne, key], message }) => {
        return {
          ligne: (Number(ligne) + 1).toString(),
          champ: key.toString(),
          message,
        };
      });

      throw new CsvValidationError(csvValidationErrors);
    }

    throw error;
  }
};

export const importerDatesMiseEnServiceAction = formAction(action, schema);
