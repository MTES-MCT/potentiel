import { mediator } from 'mediateur';

import {
  Raccordement,
  registerRéseauQueries,
  registerRéseauUseCases,
} from '@potentiel-domain/reseau';
import { loadAggregate, publish } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  countProjection,
  findProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projections';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

registerRéseauUseCases({
  loadAggregate,
});

registerRéseauQueries({
  list: listProjection,
  find: findProjection,
  count: countProjection,
});

(async () => {
  const projetsAbandonnés = await executeSelect<{
    value: {
      appelOffre: string;
      période: string;
      famille: string;
      numéroCRE: string;
    };
  }>(`
  SELECT json_build_object(
    'appelOffre', "appelOffreId",
    'période', "periodeId",
    'famille', "familleId",
    'numéroCRE', "numeroCRE"
  ) as value
  FROM "projects"
  WHERE "classe" = 'Classé'
  AND "abandonedOn" <> '0'
`);

  let success = 0;
  const projetsSansRaccordement = [];
  const projetsEnErreurs = [];

  for (const { value } of projetsAbandonnés) {
    try {
      const identifiantProjet = IdentifiantProjet.bind(value).formatter();

      const raccordement = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

      if (Option.isNone(raccordement)) {
        projetsSansRaccordement.push(identifiantProjet);
        continue;
      }

      const event: Raccordement.RaccordementSuppriméEvent = {
        payload: {
          identifiantProjet,
        },
        type: 'RaccordementSupprimé-V1',
      };

      await publish(`raccordement|${identifiantProjet}`, event);

      success += 1;
    } catch (error) {
      projetsEnErreurs.push({
        identifiantProjet: value,
        message: error,
      });
    }
  }
  console.log(`${success} raccordements supprimés`);
  projetsSansRaccordement.forEach((projet) =>
    console.log(`Projet sans raccordement existant : ${projet}`),
  );
  projetsEnErreurs.forEach((projet) => console.table(projet));
})();
