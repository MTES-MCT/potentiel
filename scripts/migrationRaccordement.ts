import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import { findProjection } from '@potentiel/pg-projections';
import { executeSelect } from '@potentiel/pg-helpers';
import {
  consulterGestionnaireRéseauQueryHandlerFactory,
  transmettreDateMiseEnServiceCommandHandlerFactory,
  transmettrePropositionTechniqueEtFinancièreCommandHandlerFactory,
  transmettreDemandeComplèteRaccordementCommandHandlerFactory,
  transmettreDemandeComplèteRaccordementUseCaseFactory,
} from '@potentiel/domain';

console.log('Début script migration raccordement');

const consulterGestionnaireRéseauQuery = consulterGestionnaireRéseauQueryHandlerFactory({
  find: findProjection,
});

const transmettreDemandeComplèteRaccordementUseCase =
  transmettreDemandeComplèteRaccordementUseCaseFactory({
    transmettreDemandeComplèteRaccordementCommand:
      transmettreDemandeComplèteRaccordementCommandHandlerFactory({
        loadAggregate,
        publish,
      }),
    consulterGestionnaireRéseauQuery,
  });

const transmettreDateMiseEnServiceCommand = transmettreDateMiseEnServiceCommandHandlerFactory({
  loadAggregate,
  publish,
});

const transmettrePropositionTechniqueEtFinancièreCommand =
  transmettrePropositionTechniqueEtFinancièreCommandHandlerFactory({
    loadAggregate,
    publish,
  });

export const sleep = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

(async () => {
  console.log('récupération en cours');
  const result = await executeSelect<{
    id: string;
    appelOffreId: string;
    periodeId: string;
    familleId: string;
    numeroCRE: string;
    identifiantGestionnaire: string | undefined;
    dateMiseEnService: Date | undefined;
    dcrDate: Date | undefined;
    dateFileAttente: Date | undefined;
    dcrFilePath: string | undefined;
    ptfFilePath: string | undefined;
    ptfDateDeSignature: Date | undefined;
  }>(`
    select
      p."id",
      p."appelOffreId", 
      p."periodeId", 
      p."familleId", 
      p."numeroCRE",
      r."identifiantGestionnaire", 
      p."dateMiseEnService", 
      p."dateFileAttente",
      "dcrFile"."storedAt" as "dcrFilePath", 
      CAST(to_timestamp((dcr."valueDate" / 1000)) AS date) as "dcrDate",
      "ptfFile"."storedAt" as "ptfFilePath", 
      r."ptfDateDeSignature"
    from projects p
    left join raccordements r on r."projetId" = p.id
    left join project_events dcr on dcr."projectId" = p.id and dcr.type = 'ProjectDCRSubmitted'
    left join files "dcrFile" on "dcrFile".id::text = dcr.payload->'file'->>'id' and "dcrFile".designation = 'dcr'
    left join files "ptfFile" on "ptfFile".id = r."ptfFichierId" and "ptfFile".designation = 'ptf'`);

  console.log(`${result.length} projets récupérés`);

  // TODO archiver event du projet
  const projetMigré: string[] = [];

  for (const projet of result) {
    try {
      if (projet.identifiantGestionnaire && projet.dcrDate) {
        const identifiantProjet = {
          appelOffre: projet.appelOffreId,
          numéroCRE: projet.numeroCRE,
          période: projet.periodeId,
          famille: projet.familleId,
        };
        const référenceDossierRaccordement = projet.identifiantGestionnaire;

        await transmettreDemandeComplèteRaccordementUseCase({
          identifiantGestionnaireRéseau: {
            codeEIC: '17X100A100A0001A',
          },
          référenceDossierRaccordement,
          dateQualification: projet.dcrDate,
          identifiantProjet,
        });

        await sleep(50);

        if (projet.ptfDateDeSignature) {
          await transmettrePropositionTechniqueEtFinancièreCommand({
            dateSignature: projet.ptfDateDeSignature,
            identifiantProjet,
            référenceDossierRaccordement,
          });
        }

        await sleep(50);

        if (projet.dateMiseEnService) {
          await transmettreDateMiseEnServiceCommand({
            dateMiseEnService: projet.dateMiseEnService,
            identifiantProjet,
            référenceDossierRaccordement,
          });

          await sleep(50);
        }

        projetMigré.push(projet.id);
      } else if (projet.identifiantGestionnaire && !projet.dcrDate) {
        // Step 2
        // Les projets qui ont un identifiant gestionnaire réseaux et pas de DCR
        // concerne les projets pour lesquels les porteurs ont renseigné leur identifiant pour permettre la récupération des dates de MeS
      } else if (projet.ptfDateDeSignature && !projet.dcrDate) {
        // Step 3
        // Les projets qui ont une PTF sans DCR avec ou sans identifiant
      } else {
        console.log('Projet ne rentrant pas dans les conditions');
        console.table(projet);
      }
    } catch (e) {
      console.log('Erreur lors de la migration du projet');
      console.error(e);
    }
    console.log(`${result.indexOf(projet) + 1}/${result.length}`);
  }
  console.log(`nombre de projets migrés : ${projetMigré.length}/${result.length}`);
})();
