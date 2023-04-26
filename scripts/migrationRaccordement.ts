import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import { findProjection } from '@potentiel/pg-projections';
import { executeSelect } from '@potentiel/pg-helpers';
import {
  consulterGestionnaireRéseauQueryHandlerFactory,
  transmettreDateMiseEnServiceCommandHandlerFactory,
  transmettrePropositionTechniqueEtFinancièreCommandHandlerFactory,
  transmettreDemandeComplèteRaccordementCommandHandlerFactory,
  transmettreDemandeComplèteRaccordementUseCaseFactory,
  formatIdentifiantProjet,
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
  const projets = await executeSelect<{
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

  console.log(`${projets.length} projets récupérés`);

  // TODO archiver event du projet
  const projetMigré: string[] = [];

  for (const projet of projets) {
    try {
      const identifiantProjet = {
        appelOffre: projet.appelOffreId,
        numéroCRE: projet.numeroCRE,
        période: projet.periodeId,
        famille: projet.familleId,
      };
      console.log(`Projet: ${formatIdentifiantProjet(identifiantProjet)}`);
      if (projet.identifiantGestionnaire && projet.dcrDate) {
        console.log('Projet avec identifiant Gestionnaire et avec DCR');
      } else if (!projet.identifiantGestionnaire && projet.dcrDate) {
        console.log('Projet sans identifiant Gestionnaire et avec DCR');
      } else if (projet.identifiantGestionnaire && !projet.dcrDate) {
        console.log('Projet avec identifiant Gestionnaire et sans DCR');
      } else {
        console.log('Projet sans identifiant Gestionnaire et sans DCR');
      }

      const référenceDossierRaccordement =
        projet.identifiantGestionnaire || 'Référence non transmise';
      const dateQualification = projet.dcrDate ?? projet.dateFileAttente ?? undefined;

      await transmettreDemandeComplèteRaccordementUseCase({
        identifiantGestionnaireRéseau: {
          codeEIC: '17X100A100A0001A',
        },
        référenceDossierRaccordement,
        dateQualification,
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

      // TODO: gérer les fichiers

      // TODO: archiver les events

      projetMigré.push(projet.id);
    } catch (e) {
      console.log('Erreur lors de la migration du projet');
      console.error(e);
    }
    console.log(`${projets.indexOf(projet) + 1}/${projets.length}`);
  }

  console.log(`nombre de projets migrés : ${projetMigré.length}/${projets.length}`);
})();
