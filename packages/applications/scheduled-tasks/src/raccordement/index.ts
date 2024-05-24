import { mediator } from 'mediateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import {
  Raccordement,
  registerRéseauQueries,
  registerRéseauUseCases,
} from '@potentiel-domain/reseau';
import { listerProjetForOreAdapter } from '@potentiel-infrastructure/domain-adapters';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  findProjection,
  listProjection,
  listProjectionV2,
} from '@potentiel-infrastructure/pg-projections';
import { getGRDByCity } from '@potentiel-infrastructure/ore-client';

registerRéseauUseCases({
  loadAggregate,
});

registerRéseauQueries({
  list: listProjection,
  listV2: listProjectionV2,
  find: findProjection,
});

(async () => {
  getLogger().info('[raccordement] Starting script');

  try {
    const classéProjects = await listerProjetForOreAdapter();

    const raccordements = await mediator.send<Raccordement.ListerRaccordementQuery>({
      type: 'Réseau.Raccordement.Query.ListerRaccordement',
      data: {
        // TODO: see if we keep this condition
        where: { identifiantGestionnaireRéseau: { operator: 'notEqual', value: 'inconnu' } },
      },
    });

    const raccordementsProjectsIds = raccordements.items.map((raccordement) =>
      raccordement.identifiantProjet.formatter(),
    );

    // TODO: see what to do with raccordementWithUnknownGestionnaire
    // const raccordementsWithUnknownGestionnaire =
    //   await mediator.send<Raccordement.ListerRaccordementQuery>({
    //     type: 'Réseau.Raccordement.Query.ListerRaccordement',
    //     data: { where: { identifiantGestionnaireRéseau: { operator: 'equal', value: 'inconnu' } } },
    //   });

    // const raccordementsWithUnknownGestionnaireProjectsIds =
    //   raccordementsWithUnknownGestionnaire.items.map(
    //     (raccordement) => raccordement.identifiantProjet,
    //   );

    const projestWithNoAttributedGestionnaire = classéProjects.filter(
      (projet) => !raccordementsProjectsIds.includes(projet.identifiantProjet),
    );
    let count = 0;
    for (const projet of projestWithNoAttributedGestionnaire) {
      // setTimeout(async () => {
      const gestionnaire = await getGRDByCity({
        count,
        codePostal: projet.localité.codePostal,
        commune: projet.localité.commune,
      });

      // if (!gestionnaire) {
      //   continue;
      // }

      count = gestionnaire.count;
      // }, 100);
    }

    console.log(`☠️ DONE !! ${count} / ${projestWithNoAttributedGestionnaire.length}`);

    process.exit(0);
  } catch (error) {
    getLogger().error(error as Error);
  }
})();
