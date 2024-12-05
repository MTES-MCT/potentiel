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
  countProjection,
  findProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projections';
import { récupérerGRDParVille } from '@potentiel-infrastructure/ore-client';
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
  const logger = getLogger('ScheduledTasks.raccordement.attribuerGestionnaireRéseau');

  logger.info('Lancement du script...');

  try {
    const projetsClassé = await listerProjetForOreAdapter({});

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

    logger.info(`${projetsSansGestionnaire.length} projets sans raccordement`);

    let projetsSansGestionnaireTrouvés = 0;
    const codeEicInconnu = GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu.codeEIC;

    for (const projet of projetsSansGestionnaire) {
      const gestionnaireParVille = await récupérerGRDParVille({
        codePostal: projet.localité.codePostal,
        commune: projet.localité.commune,
      });

      const grdOuInconnu = Option.match(gestionnaireParVille)
        .some((grd) => grd)
        .none(() => {
          projetsSansGestionnaireTrouvés++;
          return {
            codeEIC: codeEicInconnu,
            raisonSociale: 'Inconnu',
          };
        });

      try {
        await mediator.send<Raccordement.RaccordementUseCase>({
          type: 'Réseau.Raccordement.UseCase.AttribuerGestionnaireRéseau',
          data: {
            identifiantGestionnaireRéseauValue: grdOuInconnu.codeEIC,
            identifiantProjetValue: projet.identifiantProjet,
          },
        });

        const emoji = grdOuInconnu.codeEIC === codeEicInconnu ? '⚠️' : '✅';
        logger.info(
          `${emoji} Gestionnaire ${grdOuInconnu.raisonSociale} attribué au projet ${projet.identifiantProjet}`,
        );
      } catch (error) {
        logger.error(error as Error);
        continue;
      }
    }

    if (projetsSansGestionnaire.length) {
      logger.info(
        `Sur ${projetsSansGestionnaire.length} projets classés sans raccordement, nous n'avons pas pu attribuer de GRD à ${projetsSansGestionnaireTrouvés} d'entre eux`,
      );
    }

    logger.info('Fin du script ✨');

    process.exit(0);
  } catch (error) {
    logger.error(error as Error);
  }
})();
