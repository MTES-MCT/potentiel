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
import { récupérerGRDParVille } from '@potentiel-infrastructure/ore-client';
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
    const projetsClassé = await listerProjetForOreAdapter();
    const projetsClassé;

    const raccordements = await mediator.send<Raccordement.ListerRaccordementQuery>({
      type: 'Réseau.Raccordement.Query.ListerRaccordement',
      data: {},
    });

    const raccordements = raccordements.items.filter((raccordement) => projetsClassé.map(projet));

    getLogger().info(`${raccordements.items.length} raccordements à vérifier`);

    let nombreDeRaccordementsMisAJour = 0;

    for (const raccordement of raccordements.items) {
      const identifiantProjet = raccordement.identifiantProjet.formatter();
      const identifiantActuelGestionnaireRéseau =
        raccordement.identifiantGestionnaireRéseau.formatter();

      const relatedProjet = projetsClassé.find(
        (projet) => projet.identifiantProjet === identifiantProjet,
      );

      if (!relatedProjet) {
        getLogger().warn(`Il n'y a pas de projet classé lié à ce raccordement`);
        continue;
      }

      const nouveauGestionnaireRéseau = await récupérerGRDParVille({
        codePostal: relatedProjet.localité.codePostal,
        commune: relatedProjet.localité.commune,
      });

      if (Option.isNone(nouveauGestionnaireRéseau)) {
        continue;
      }

      if (nouveauGestionnaireRéseau.codeEIC === identifiantActuelGestionnaireRéseau) {
        getLogger().info(
          `Le gestionnaire réseau actuellement relié au projet ${raccordement.identifiantProjet.formatter} est le même que celui de ORE`,
        );
        continue;
      }

      // additional check
      const gestionnaireProjection =
        await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>({
          type: 'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
          data: {
            identifiantGestionnaireRéseau: nouveauGestionnaireRéseau.codeEIC,
          },
        });

      if (Option.isNone(gestionnaireProjection)) {
        getLogger().warn(
          `Le gestionnaire ${nouveauGestionnaireRéseau.raisonSociale} n'existe pas en base de données`,
        );
        continue;
      }

      try {
        await mediator.send<Raccordement.RaccordementUseCase>({
          type: 'Réseau.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet,
            identifiantGestionnaireRéseauValue: nouveauGestionnaireRéseau.codeEIC,
          },
        });

        nombreDeRaccordementsMisAJour++;

        getLogger().info(
          `✅ Gestionnaire ${nouveauGestionnaireRéseau.raisonSociale} attribué au projet ${identifiantProjet}`,
        );
      } catch (error) {
        getLogger().error(error as Error);
        continue;
      }
    }

    const pourcentageRaccordementMisAJour = Math.round(
      (nombreDeRaccordementsMisAJour / raccordements.items.length) * 100,
    );

    getLogger().info(
      `Sur ${raccordements.items.length} raccordements, nous avons mis à jour ${pourcentageRaccordementMisAJour} % d'entre eux`,
    );

    getLogger().info('Fin du script ✨');

    process.exit(0);
  } catch (error) {
    getLogger().error(error as Error);
  }
})();
