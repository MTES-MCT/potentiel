import { mediator } from 'mediateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { listerProjetsForGRDScript } from '@potentiel-applications/legacy/src/infra/sequelize/queries/project/lister';
import { Raccordement } from '@potentiel-domain/reseau';

(async () => {
  getLogger().info('[newScript] Starting script');

  try {
    // get every Projects
    const projects = await listerProjetsForGRDScript();
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

    process.exit(0);
  } catch (error) {
    getLogger().error(error as Error);
  }
})();
