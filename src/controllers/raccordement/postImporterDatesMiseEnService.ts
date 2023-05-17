import asyncHandler from '../helpers/asyncHandler';
import routes from '@routes';
import { v1Router } from '../v1Router';
import { upload } from '../upload';
import * as yup from 'yup';
import { CsvValidationError, mapYupValidationErrorToCsvValidationError } from '../helpers';
import { ValidationError } from 'yup';
import fs from 'fs';
import { parse } from 'csv-parse';
import iconv from 'iconv-lite';
import { executeSelect } from '@potentiel/pg-helpers';
import { KeyValuePair } from '@potentiel/pg-projections/src/keyValuePair';
import {
  DossierRaccordementReadModel,
  IdentifiantProjet,
  transmettreDateMiseEnServiceCommandHandlerFactory,
} from '@potentiel/domain';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';

const transmettreDateMiseEnService = transmettreDateMiseEnServiceCommandHandlerFactory({
  publish,
  loadAggregate,
});

const csvDataSchema = yup
  .array()
  .ensure()
  .min(1, 'Le fichier ne doit pas être vide')
  .of(
    yup.object({
      référenceDossier: yup
        .string()
        .ensure()
        .required('La référence du dossier de raccordement est obligatoire'),
      dateMiseEnService: yup
        .string()
        .required()
        .matches(/^\d{2}\/\d{2}\/\d{4}$/, {
          message: `Format de date de mise en service attendu : JJ/MM/AAAA`,
          excludeEmptyString: true,
        }),
    }),
  );

const validerLesDonnéesDuFichierCsv = (données: Record<string, string>[]) => {
  try {
    const donnéesValidées = csvDataSchema.validateSync(données, { abortEarly: false });

    if (!donnéesValidées) {
      return null;
    }

    return donnéesValidées;
  } catch (error) {
    if (error instanceof ValidationError) {
      return mapYupValidationErrorToCsvValidationError(error);
    }

    throw new CsvValidationError();
  }
};

v1Router.post(
  routes.POST_IMPORTER_DATES_MISE_EN_SERVICE,
  upload.single('fichier-dates-mise-en-service'),
  asyncHandler(async (request, response) => {
    if (!request.file || !request.file.path) {
      return response.redirect(routes.GET_IMPORTER_DATES_MISE_EN_SERVICE_PAGE);
    }

    const fileStream = fs.createReadStream(request.file.path);
    const données = validerLesDonnéesDuFichierCsv(await parseCsv(fileStream));

    if (!données || données instanceof CsvValidationError) {
      return response.redirect(routes.GET_IMPORTER_DATES_MISE_EN_SERVICE_PAGE);
    }

    for (const { référenceDossier: référenceDossierRaccordement, dateMiseEnService } of données) {
      const dossiers = await searchDossiersRaccordementParRéférence(référenceDossierRaccordement);

      if (dossiers.length === 1) {
        await transmettreDateMiseEnService({
          identifiantProjet: dossiers[0].identifiantProjet,
          référenceDossierRaccordement,
          dateMiseEnService: new Date(dateMiseEnService),
        });
      }
    }

    return response.redirect(routes.GET_IMPORTER_DATES_MISE_EN_SERVICE_PAGE);
  }),
);

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

type DossiersRaccordementParRéférenceReadModel = DossierRaccordementReadModel & {
  identifiantProjet: IdentifiantProjet;
};

export const searchDossiersRaccordementParRéférence = async (
  référence: string,
): Promise<ReadonlyArray<DossiersRaccordementParRéférenceReadModel>> => {
  const result = await executeSelect<
    KeyValuePair<DossierRaccordementReadModel['type'], DossierRaccordementReadModel>
  >(
    `SELECT "key", "value" FROM "PROJECTION" where "key" like $1`,
    `dossier-raccordement#%#%${référence}%`,
  );

  return result.map(({ key, value }) => {
    const parsedKey = key.split('#');
    const identifiantProjet = {
      appelOffre: parsedKey[1],
      période: parsedKey[2],
      famille: parsedKey[3],
      numéroCRE: parsedKey[4],
    };
    return {
      type: key.split('#')[0],
      identifiantProjet,
      ...value,
    } as DossiersRaccordementParRéférenceReadModel;
  });
};
