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

registerRéseauUseCases({
  loadAggregate,
});

registerRéseauQueries({
  list: listProjection,
  listV2: listProjectionV2,
  find: findProjection,
});

(async () => {
  getLogger().info('[newScript] Starting script');

  try {
    const classéProjects = await listerProjetForOreAdapter();
    console.log(classéProjects);

    // get every raccordement with known gestionnaire
    const raccordements = await mediator.send<Raccordement.ListerRaccordementQuery>({
      type: 'Réseau.Raccordement.Query.ListerRaccordement',
      data: {
        where: { identifiantGestionnaireRéseau: { operator: 'notEqual', value: 'inconnu' } },
      },
    });

    const raccordementsProjectsIds = raccordements.items.map((raccordement) =>
      raccordement.identifiantProjet.formatter(),
    );
    console.log(raccordementsProjectsIds);

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

    const projetWithNoAttributedGestionnaire = classéProjects.filter(
      (projet) => !raccordementsProjectsIds.includes(projet.identifiantProjet),
    );
    console.log('projetWithNoAttributedGestionnaire', projetWithNoAttributedGestionnaire);

    // créer affiliation gestionnaire
    // un nouvel évènement

    process.exit(0);
  } catch (error) {
    getLogger().error(error as Error);
  }
})();
