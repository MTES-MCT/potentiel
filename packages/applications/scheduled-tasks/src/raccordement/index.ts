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
import { killPool } from '@potentiel-libraries/pg-helpers';

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
    // get every Projects
    const projects = await listerProjetForOreAdapter();
    console.log(projects);

    // get every raccordement with known gestionnaire
    const raccordements = await mediator.send<Raccordement.ListerRaccordementQuery>({
      type: 'Réseau.Raccordement.Query.ListerRaccordement',
      data: {
        where: { identifiantGestionnaireRéseau: { operator: 'notEqual', value: 'inconnu' } },
      },
    });

    console.log(raccordements);

    // get every raccordement with unknown gestionnaire
    const raccordementsWithUnknownGestionnaire =
      await mediator.send<Raccordement.ListerRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ListerRaccordement',
        data: { where: { identifiantGestionnaireRéseau: { operator: 'equal', value: 'inconnu' } } },
      });

    console.log(raccordementsWithUnknownGestionnaire);

    // les inconnus
    // les non inconnus

    // compare both and select projects without raccordement
    // sûrement prendre que les projets classé (pas abandonné ou élimité) ?

    // créer affiliation gestionnaire
    // un raccordement vide ?

    await killPool();

    process.exit(0);
  } catch (error) {
    getLogger().error(error as Error);
  }
})();
