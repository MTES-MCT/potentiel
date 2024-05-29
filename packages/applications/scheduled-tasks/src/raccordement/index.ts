import { mediator } from 'mediateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { RaccordementProjector } from '@potentiel-applications/projectors';
import {
  GestionnaireRéseau,
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

RaccordementProjector.register();

(async () => {
  getLogger().info('[raccordement] Starting script');

  try {
    const classéProjects = await listerProjetForOreAdapter();

    const raccordements = await mediator.send<Raccordement.ListerRaccordementQuery>({
      type: 'Réseau.Raccordement.Query.ListerRaccordement',
      data: {
        where: { identifiantGestionnaireRéseau: { operator: 'notEqual', value: 'inconnu' } },
      },
    });

    const raccordementsProjectsIds = raccordements.items.map((raccordement) =>
      raccordement.identifiantProjet.formatter(),
    );

    const projectsWithNoAttributedGestionnaire = classéProjects.filter(
      (projet) => !raccordementsProjectsIds.includes(projet.identifiantProjet),
    );

    getLogger().info(
      `${projectsWithNoAttributedGestionnaire.length} projets sans gestionnaires ni raccordement trouvés`,
    );

    let projectsWithNoOreGestionnaireFoundCount = 0;

    for (const projet of projectsWithNoAttributedGestionnaire) {
      const gestionnaireByCity = await getGRDByCity({
        codePostal: projet.localité.codePostal,
        commune: projet.localité.commune,
      });

      if (Option.isNone(gestionnaireByCity)) {
        projectsWithNoOreGestionnaireFoundCount++;
        continue;
      }

      const gestionnaire = await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>(
        {
          type: 'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
          data: {
            identifiantGestionnaireRéseau: gestionnaireByCity.codeEIC,
          },
        },
      );

      if (Option.isNone(gestionnaire)) {
        continue;
      }

      try {
        await mediator.send<Raccordement.RaccordementUseCase>({
          type: 'Réseau.Raccordement.UseCase.AttribuerGestionnaireRéseauAuRaccordement',
          data: {
            identifiantGestionnaireRéseauValue:
              gestionnaire.identifiantGestionnaireRéseau.formatter(),
            identifiantProjetValue: projet.identifiantProjet,
          },
        });

        getLogger().info(
          `✅ Gestionnaire ${gestionnaire.identifiantGestionnaireRéseau.formatter()} atttribué pour le projet ${
            projet.identifiantProjet
          }`,
        );
      } catch (error) {
        getLogger().error(error as Error);
        continue;
      }
    }

    const notFoundinPercent = Math.round(
      (projectsWithNoOreGestionnaireFoundCount / projectsWithNoAttributedGestionnaire.length) * 100,
    );

    getLogger().info(
      `${projectsWithNoAttributedGestionnaire.length} projets classés sans raccordement, nous n'avons pas pu attribué de GRD à ${notFoundinPercent} % des projets sans raccordement`,
    );

    process.exit(0);
  } catch (error) {
    getLogger().error(error as Error);
  }
})();
