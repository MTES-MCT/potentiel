import {
  DossierRaccordementReadModel,
  IdentifiantProjet,
  transmettreDateMiseEnServiceCommandHandlerFactory,
} from '@potentiel/domain';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import { executeSelect } from '@potentiel/pg-helpers';
import { KeyValuePair } from '@potentiel/pg-projections/src/keyValuePair';
import { ImporterDatesMiseEnServiceUseCaseResult } from './importerDatesMiseEnserviceUseCaseResult';

type ImporterDatesMiseEnServiceUseCase = (
  données: ReadonlyArray<{ référenceDossier: string; dateMiseEnService: Date }>,
) => Promise<ImporterDatesMiseEnServiceUseCaseResult>;

export const importerDatesMiseEnServiceUseCase: ImporterDatesMiseEnServiceUseCase = async (
  données,
) => {
  const transmettreDateMiseEnService = transmettreDateMiseEnServiceCommandHandlerFactory({
    publish,
    loadAggregate,
  });

  const result: ImporterDatesMiseEnServiceUseCaseResult = [];

  for (const { référenceDossier, dateMiseEnService } of données) {
    const dossiers = await searchDossiersRaccordementParRéférence(référenceDossier);

    if (dossiers.length !== 1) {
      const raison = `Le dossier ${
        dossiers.length === 0 ? `ne correspond à aucun projet` : `correspond à plusieurs projets`
      }`;

      result.push({
        statut: 'échec',
        référenceDossier,
        raison,
        identifiantsProjet: dossiers.map((d) => d.identifiantProjet),
      });
      continue;
    }

    const identifiantProjet = dossiers[0].identifiantProjet;
    await transmettreDateMiseEnService({
      identifiantProjet,
      référenceDossierRaccordement: référenceDossier,
      dateMiseEnService: dateMiseEnService,
    });

    result.push({
      statut: 'réussi',
      référenceDossier,
      identifiantProjet,
    });
  }

  return result;
};

type DossiersRaccordementParRéférenceReadModel = DossierRaccordementReadModel & {
  identifiantProjet: IdentifiantProjet;
};

const searchDossiersRaccordementParRéférence = async (
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
