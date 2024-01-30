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

const csvSchema = zod
  .array(
    zod.object({
      referenceDossier: zod.string(),
      dateMiseEnService: zod.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
    }),
  )
  .nonempty();

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { fichierDatesMiseEnService },
) => {
  const parsed = parseCsv(fichierDatesMiseEnService.stream());
  const data = csvSchema.parse(parsed);

  await Promise.all(
    data.map(async ({ referenceDossier, dateMiseEnService }) => {
      try {
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

        const candidature = await mediator.send<ConsulterCandidatureQuery>({
          type: 'CONSULTER_CANDIDATURE_QUERY',
          data: {
            identifiantProjet: result.identifiantProjet.formatter(),
          },
        });

        return mediator.send<Raccordement.TransmettreDateMiseEnServiceUseCase>({
          type: 'TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE',
          data: {
            identifiantProjetValue: result.identifiantProjet.formatter(),
            dateDésignationValue: candidature.dateDésignation,
            référenceDossierValue: referenceDossier,
            dateMiseEnServiceValue: dateMiseEnService,
          },
        });
      } catch (error) {}
    }),
  );

  return previousState;
};

export const importerDatesMiseEnServiceAction = formAction(action, schema);
