import { mediator } from 'mediateur';
import { getLogger } from '@potentiel-libraries/monitoring';
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

(async () => {
  getLogger().info('Lancement du script...');

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
      `${projectsWithNoAttributedGestionnaire.length} projets sans gestionnaire ou raccordement`,
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
          `✅ Gestionnaire ${gestionnaire.raisonSociale} attribué au projet ${projet.identifiantProjet}`,
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
      `Sur ${projectsWithNoAttributedGestionnaire.length} projets classés sans raccordement, nous n'avons pas pu attribuer de GRD à ${notFoundinPercent} % d'entre eux`,
    );
    getLogger().info('Fin du script ✨');

    process.exit(0);
  } catch (error) {
    getLogger().error(error as Error);
  }
})();
