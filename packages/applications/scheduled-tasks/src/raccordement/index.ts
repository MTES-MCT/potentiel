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
import { Option } from '@potentiel-libraries/monads';

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

    const projectsWithNoAttributedGestionnaire = classéProjects.filter(
      (projet) => !raccordementsProjectsIds.includes(projet.identifiantProjet),
    );

    getLogger().info(`Looking for ${projectsWithNoAttributedGestionnaire.length} gestionnaires`);

    let projetWithNoOreGestionnaireFoundCount = 0;

    for (const projet of projectsWithNoAttributedGestionnaire) {
      const gestionnaire = await getGRDByCity({
        codePostal: projet.localité.codePostal,
        commune: projet.localité.commune,
      });

      if (Option.isNone(gestionnaire)) {
        projetWithNoOreGestionnaireFoundCount++;
      }
    }

    const notFoundinPercent = Math.round(
      (projetWithNoOreGestionnaireFoundCount / projectsWithNoAttributedGestionnaire.length) * 100,
    );

    console.log(
      `Out of ${projectsWithNoAttributedGestionnaire.length} projets classés with no raccordement, we were unable to assign GRD for ${notFoundinPercent} % of them`,
    );
    getLogger().info(
      `Out of ${projectsWithNoAttributedGestionnaire.length} projets classés with no raccordement, we were unable to assign GRD for ${notFoundinPercent} % of them`,
    );

    process.exit(0);
  } catch (error) {
    getLogger().error(error as Error);
  }
})();
