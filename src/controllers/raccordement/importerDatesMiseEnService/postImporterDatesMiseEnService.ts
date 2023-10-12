import asyncHandler from '../../helpers/asyncHandler';
import routes from '@potentiel/routes';
import { v1Router } from '../../v1Router';
import { upload } from '../../upload';
import * as yup from 'yup';
import { mapCsvYupValidationErrorToCsvErrors, vérifierPermissionUtilisateur } from '../../helpers';
import { ValidationError } from 'yup';
import fs from 'fs';
import { parse } from 'csv-parse';
import iconv from 'iconv-lite';
import { setApiResult } from '../../helpers/apiResult';
import {
  DomainUseCase,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
} from '@potentiel/domain-usecases';
import { PermissionTransmettreDateMiseEnService } from '@potentiel/legacy-permissions';
import { mediator } from 'mediateur';
import { ImporterDatesMiseEnServiceApiResult } from './importerDatesMiseEnServiceApiResult';
import { RechercherDossierRaccordementQuery } from '@potentiel/domain-views';
import { Project } from '../../../infra/sequelize/projectionsNext';
import { isSome } from '@potentiel/monads';

const csvDataSchema = yup
  .array()
  .ensure()
  .min(1, 'Le fichier ne doit pas être vide')
  .of(
    yup.object({
      referenceDossier: yup
        .string()
        .ensure()
        .required('La référence du dossier de raccordement est obligatoire'),
      dateMiseEnService: yup
        .string()
        .required('La date de mise en service est obligatoire')
        .matches(/^\d{2}\/\d{2}\/\d{4}$/, {
          message: `Format de date de mise en service attendu : JJ/MM/AAAA`,
          excludeEmptyString: true,
        }),
    }),
  )
  .defined();

const parseCsv = (fileStream: NodeJS.ReadableStream) => {
  return new Promise<Array<Record<string, string>>>((resolve, reject) => {
    const data: Array<Record<string, string>> = [];
    const decode = iconv.decodeStream('utf8');
    fileStream
      .pipe(decode)
      .pipe(
        parse({
          delimiter: ';',
          columns: true,
          ltrim: true,
          rtrim: true,
          skip_empty_lines: true,
          skip_records_with_empty_values: true,
        }),
      )
      .on('data', (row: Record<string, string>) => {
        data.push(row);
      })
      .on('error', (e) => {
        reject(e);
      })
      .on('end', () => {
        resolve(data);
      });
  });
};

v1Router.post(
  routes.POST_IMPORTER_DATES_MISE_EN_SERVICE,
  vérifierPermissionUtilisateur(PermissionTransmettreDateMiseEnService),
  upload.single('fichier-dates-mise-en-service'),
  asyncHandler(async (request, response) => {
    if (!request?.file?.path) {
      return response.redirect(routes.GET_IMPORTER_DATES_MISE_EN_SERVICE_PAGE);
    }

    try {
      const fileStream = fs.createReadStream(request.file.path);
      const csvData = await parseCsv(fileStream);
      const données = csvDataSchema.validateSync(csvData, { abortEarly: false });

      const result: ImporterDatesMiseEnServiceApiResult = [];

      for (const { referenceDossier, dateMiseEnService } of données) {
        const dossiers = await mediator.send<RechercherDossierRaccordementQuery>({
          type: 'RECHERCHER_DOSSIER_RACCORDEMENT_QUERY',
          data: {
            référenceDossierRaccordement: referenceDossier,
          },
        });

        if (dossiers.length === 0) {
          result.push({
            statut: 'échec',
            référenceDossier: referenceDossier,
            raison: 'Aucun dossier correspondant',
          });

          continue;
        }

        for (const { identifiantProjet, référenceDossierRaccordement } of dossiers) {
          try {
            const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);

            const projet = await Project.findOne({
              where: {
                appelOffreId: identifiantProjetValueType.appelOffre,
                periodeId: identifiantProjetValueType.période,
                familleId: isSome(identifiantProjetValueType.famille)
                  ? identifiantProjetValueType.famille
                  : '',
                numeroCRE: identifiantProjetValueType.numéroCRE,
              },
              attributes: ['notifiedOn'],
            });

            if (!projet) {
              result.push({
                statut: 'échec',
                référenceDossier: referenceDossier,
                raison: 'Aucun projet correspondant',
              });

              continue;
            }

            await mediator.send<DomainUseCase>({
              type: 'TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE',
              data: {
                identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
                référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
                  référenceDossierRaccordement,
                ),
                dateMiseEnService: convertirEnDateTime(
                  dateMiseEnService.split('/').reverse().join('-'),
                ),
                dateDésignation: convertirEnDateTime(new Date(projet.notifiedOn)),
              },
            });

            result.push({
              statut: 'réussi',
              référenceDossier: referenceDossier,
            });
          } catch (error) {
            result.push({
              statut: 'échec',
              référenceDossier: referenceDossier,
              raison: error.message,
            });
          }
        }
      }

      setApiResult(request, {
        route: routes.POST_IMPORTER_DATES_MISE_EN_SERVICE,
        status: 'OK',
        result,
      });

      return response.redirect(routes.GET_IMPORTER_DATES_MISE_EN_SERVICE_PAGE);
    } catch (error) {
      if (error instanceof ValidationError) {
        setApiResult(request, {
          route: routes.POST_IMPORTER_DATES_MISE_EN_SERVICE,
          status: 'BAD_REQUEST',
          message: `Le fichier CSV n'est pas valide`,
          formErrors: {
            'fichier-dates-mise-en-service': mapCsvYupValidationErrorToCsvErrors(error),
          },
        });
        return response.redirect(routes.GET_IMPORTER_DATES_MISE_EN_SERVICE_PAGE);
      }

      throw error;
    }
  }),
);
