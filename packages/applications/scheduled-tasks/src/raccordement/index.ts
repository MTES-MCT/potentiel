// type DossierRaccordement = {
//   référence: string;
//   demandeComplèteRaccordement?: {
//     dateQualification?: string;
//     accuséRéception?: { format: string };
//   };
//   propositionTechniqueEtFinancière?: {
//     dateSignature: string;
//     propositionTechniqueEtFinancièreSignée?: {
//       format: string;
//     };
//   };
//   miseEnService?: {
//     dateMiseEnService: string;
//   };
//   misÀJourLe: string;
// };
import { mediator } from 'mediateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { listerProjetsForGRDScript } from '@potentiel-applications/legacy/src/infra/sequelize/queries/project/lister';
import { Raccordement } from '@potentiel-domain/reseau';

// export type RaccordementEntity = Entity<
//   'raccordement',
//   {
//     identifiantProjet: string;
//     identifiantGestionnaireRéseau: string;
//     nomProjet: string;

//     appelOffre: string;
//     période: string;
//     famille?: string;
//     numéroCRE: string;

//     dossiers: Array<DossierRaccordement>;
//   }
// >;

(async () => {
  getLogger().info('[newScript] Starting script');

  try {
    // get every Projects
    const projects = await listerProjetsForGRDScript();
    console.log(projects);

    // pour chaque projet voir si il y a un raccordement
    for (const project of projects) {
      const raccordement = await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
        type: 'Réseau.Réseau.Raccordement.Query.ConsulterDossierRaccordement',
        where: { identifiantGestionnaireRéseau: { operator: 'notInclude', value: ['inconnu'] } },
      });
    }

    // les inconnus
    // les non inconnus

    // compare both and select projects without raccordement
    // sûrement prendre que les projets classé (pas abandonné ou élimité) ?
    const gestionnairesFromORE = await getAllGRDs();

    // créer affiliation gestionnaire
    // un raccordement vide ?
    const gestionnairesRéseau =
      await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
        data: {},
      });

    await updateExistingGestionnairesDeRéseauContactEmail({
      gestionnairesFromORE,
      gestionnairesRéseau,
    });

    await addNewGestionnairesDeRéseau({
      gestionnairesFromORE,
      gestionnairesRéseau,
    });

    process.exit(0);
  } catch (error) {
    getLogger().error(error as Error);
  }
})();
