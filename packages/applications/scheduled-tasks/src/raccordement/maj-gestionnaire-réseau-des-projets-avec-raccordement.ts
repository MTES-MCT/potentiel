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
    const projetsClasséIdentifiants = projetsClassé.map((p) => p.identifiantProjet);

    const raccordements = await mediator.send<Raccordement.ListerRaccordementQuery>({
      type: 'Réseau.Raccordement.Query.ListerRaccordement',
      data: {},
    });

    const raccordementsDeProjetsClassés = raccordements.items.filter((raccordement) =>
      projetsClasséIdentifiants.includes(raccordement.identifiantProjet.formatter()),
    );

    getLogger().info(`${raccordementsDeProjetsClassés.length} raccordements à vérifier`);

    let nombreDeRaccordementsMisAJour = 0;
    let nombreDeRaccordementsDéjàAttribuésAuBonGRD = 0;

    for (const raccordement of raccordementsDeProjetsClassés) {
      const identifiantProjet = raccordement.identifiantProjet.formatter();
      const identifiantActuelGestionnaireRéseau =
        raccordement.identifiantGestionnaireRéseau.formatter();

      const relatedProjet = projetsClassé.find(
        (projet) => projet.identifiantProjet === identifiantProjet,
      );

      // ce cas est déjà vérifié ci dessus mais typescript est restrictif
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
          `Le gestionnaire réseau actuellement relié au projet ${identifiantProjet} est le même que celui de ORE`,
        );
        nombreDeRaccordementsDéjàAttribuésAuBonGRD++;
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

    getLogger().info(
      `💪${nombreDeRaccordementsDéjàAttribuésAuBonGRD} raccordements étaient attribué au bon gestionnaire`,
    );
    getLogger().info(
      `Sur ${
        raccordementsDeProjetsClassés.length - nombreDeRaccordementsDéjàAttribuésAuBonGRD
      } raccordements à mettre à jour, nous avons mis à jour ${nombreDeRaccordementsMisAJour} % d'entre eux`,
    );
    getLogger().info('Fin du script ✨');

    process.exit(0);
  } catch (error) {
    getLogger().error(error as Error);
  }
})();
