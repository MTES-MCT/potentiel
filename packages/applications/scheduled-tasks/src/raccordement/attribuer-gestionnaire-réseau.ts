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

    const raccordements = await mediator.send<Raccordement.ListerRaccordementQuery>({
      type: 'Réseau.Raccordement.Query.ListerRaccordement',
      data: {},
    });

    const raccordementsProjetsIds = raccordements.items.map((raccordement) =>
      raccordement.identifiantProjet.formatter(),
    );

    const projetsSansGestionnaire = projetsClassé.filter(
      (projet) => !raccordementsProjetsIds.includes(projet.identifiantProjet),
    );

    getLogger().info(`${projetsSansGestionnaire.length} projets sans raccordement`);

    let projetsSansGestionnaireTrouvés = 0;

    for (const projet of projetsSansGestionnaire) {
      const gestionnaireParVille = await récupérerGRDParVille({
        codePostal: projet.localité.codePostal,
        commune: projet.localité.commune,
      });

      if (Option.isNone(gestionnaireParVille)) {
        projetsSansGestionnaireTrouvés++;
        continue;
      }

      const gestionnaire = await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>(
        {
          type: 'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
          data: {
            identifiantGestionnaireRéseau: gestionnaireParVille.codeEIC,
          },
        },
      );

      if (Option.isNone(gestionnaire)) {
        continue;
      }

      try {
        await mediator.send<Raccordement.RaccordementUseCase>({
          type: 'Réseau.Raccordement.UseCase.AttribuerGestionnaireRéseau',
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

    if (projetsSansGestionnaire.length) {
      const pourcentageProjetsNonTrouvés = Math.round(
        (projetsSansGestionnaireTrouvés / projetsSansGestionnaire.length) * 100,
      );
      getLogger().info(
        `Sur ${projetsSansGestionnaire.length} projets classés sans raccordement, nous n'avons pas pu attribuer de GRD à ${pourcentageProjetsNonTrouvés} % d'entre eux`,
      );
    }

    getLogger().info('Fin du script ✨');

    process.exit(0);
  } catch (error) {
    getLogger().error(error as Error);
  }
})();
