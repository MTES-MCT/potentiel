import * as readline from 'readline';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Candidature } from '@potentiel-domain/candidature';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { GarantiesFinancières } from '@potentiel-domain/laureat';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ProjectRawDataImportedPayload = {
  periodeId: string;
  appelOffreId: string;
  familleId: string;
  territoireProjet: string;
  numeroCRE: string;
  nomCandidat: string;
  actionnaire: string;
  nomProjet: string;
  puissance: number;
  prixReference: number;
  evaluationCarbone: number;
  note: number;
  nomRepresentantLegal: string;
  isFinancementParticipatif: boolean;
  isInvestissementParticipatif: boolean;
  engagementFournitureDePuissanceAlaPointe: boolean;
  email: string;
  adresseProjet: string;
  codePostalProjet: string;
  communeProjet: string;
  departementProjet: string;
  regionProjet: string;
  classe: string;
  motifsElimination: string;
  notifiedOn: number;
  details: Record<string, string>;
  technologie: string;
  actionnariat?: string;
  garantiesFinancièresType?: string;
  garantiesFinancièresDateEchéance?: string;
  désignationCatégorie?: 'volume-réservé' | 'hors-volume-réservé';
  historiqueAbandon?:
    | 'première-candidature'
    | 'abandon-classique'
    | 'abandon-avec-recandidature'
    | 'lauréat-autre-période';
};

(async () => {
  console.info(`ℹ️ Lancement du script [migrate-project-import-events] ...`);

  const getProjectRawDataImportedEventsQuery = `
    select payload->'data'->>'appelOffreId' as "appel_offre", 
           payload->'data'->>'periodeId' as "periode", 
           payload->'data'->>'familleId' as "famille", 
           payload->'data'->>'numeroCRE' as "numero_cre", 
           count(id) as "total_import",
           array_agg(id) as "event_ids" 
    from "eventStores" es 
    where type = 'ProjectRawDataImported'
    group by payload->'data'->>'appelOffreId', 
             payload->'data'->>'periodeId', 
             payload->'data'->>'familleId', 
             payload->'data'->>'numeroCRE';
  `;

  const getLegacyProjectSourcedEventsQuery = `
    select payload->>'appelOffreId' as "appel_offre", 
           payload->>'periodeId' as "periode", 
           payload->>'familleId' as "famille",
           payload->>'numeroCRE' as "numero_cre", 
           count(id) as "total_import",
           array_agg(id) as "event_ids" 
    from "eventStores" es 
    where type = 'LegacyProjectSourced'
    group by payload->>'appelOffreId', 
             payload->>'periodeId', 
             payload->>'familleId', 
             payload->>'numeroCRE';
  `;

  const getProjectImportedEventsQuery = `
    select payload->>'appelOffreId' as "appel_offre", 
           payload->>'periodeId' as "periode", 
           payload->>'familleId' as "famille",
           payload->>'numeroCRE' as "numero_cre", 
           count(id) as "total_import",
           array_agg(id) as "event_ids" 
    from "eventStores" es 
    where type = 'ProjectImported'
    group by payload->>'appelOffreId', 
             payload->>'periodeId', 
             payload->>'familleId', 
             payload->>'numeroCRE';
  `;

  const getProjectReimportedEventsQuery = `
    select payload->'data'->>'appelOffreId' as "appel_offre", 
           payload->'data'->>'periodeId' as "periode", 
           payload->'data'->>'familleId' as "famille", 
           payload->'data'->>'numeroCRE' as "numero_cre", 
           count(id) as "total_import",
           array_agg(id) as "event_ids" 
    from "eventStores" es 
    where type = 'ProjectReimported'
    group by payload->'data'->>'appelOffreId', 
             payload->'data'->>'periodeId', 
             payload->'data'->>'familleId', 
             payload->'data'->>'numeroCRE';
  `;

  try {
    type EventIdsPerProject = {
      appel_offre: string;
      periode: string;
      famille: string;
      numero_cre: string;
      total_import: number;
      event_ids: string[];
    };

    const projectRawDataImportedEventsPerProjects = await executeSelect<EventIdsPerProject>(
      getProjectRawDataImportedEventsQuery,
    );
    const legacyProjectSourcedEventsPerProjects = await executeSelect<EventIdsPerProject>(
      getLegacyProjectSourcedEventsQuery,
    );
    const projectImportedEventsPerProjects = await executeSelect<EventIdsPerProject>(
      getProjectImportedEventsQuery,
    );
    const projectReimportedEventsPerProjects = await executeSelect<EventIdsPerProject>(
      getProjectReimportedEventsQuery,
    );

    const allEventsPerProject = projectRawDataImportedEventsPerProjects
      .concat(legacyProjectSourcedEventsPerProjects)
      .concat(projectImportedEventsPerProjects)
      .concat(projectReimportedEventsPerProjects)
      .reduce((acc, { appel_offre, periode, famille, numero_cre, event_ids }) => {
        const identifiantProjet: IdentifiantProjet.RawType = `${appel_offre}#${periode}#${famille}#${numero_cre}`;

        const alreadyAddedEventIds = acc.get(identifiantProjet);
        acc.set(identifiantProjet, [...(alreadyAddedEventIds ?? []), ...event_ids]);

        return acc;
      }, new Map<IdentifiantProjet.RawType, Array<string>>());

    console.info(`🧐 ${allEventsPerProject.size} projects found to migrate`);

    // let current = 0;
    // allEventsPerProject.forEach(async (eventIds, identifiantProjet) => {
    //   current++;

    //   const query = `
    //         select payload->'data' as data
    //         from "eventStores" es
    //         where id = any($1)
    //         order by "createdAt" asc;
    //       `;

    //   const events = await executeSelect<{
    //     data: ProjectRawDataImportedPayload;
    //   }>(query, eventIds);

    //   const payload = events.reduce(
    //     (acc, { data }) => {
    //       const result: Candidature.CandidatureImportéeEvent['payload'] = {
    //         ...acc,
    //         identifiantProjet:
    //           IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
    //         statut: data.classe === 'Classé' ? 'classé' : 'éliminé',
    //         typeGarantiesFinancières: (data.garantiesFinancièresType ??
    //           'type-inconnu') as GarantiesFinancières.TypeGarantiesFinancières.RawType,
    //         historiqueAbandon: data.historiqueAbandon,
    //         appelOffre: data.appelOffreId,
    //         période: data.periodeId,
    //         famille: data.familleId,
    //         numéroCRE: data.numeroCRE,
    //         nomProjet: data.nomProjet,
    //         sociétéMère: data.actionnaire,
    //         nomCandidat: data.nomCandidat,
    //         puissanceProductionAnnuelle: data.puissance,
    //         prixReference: data.prixReference,
    //         noteTotale: data.note,
    //         nomReprésentantLégal: data.nomRepresentantLegal,
    //         emailContact: data.email,
    //         adresse1: data.adresseProjet,
    //         adresse2: '',
    //         codePostal: data.codePostalProjet,
    //         commune: data.communeProjet,
    //         motifÉlimination: data.motifsElimination,
    //         puissanceALaPointe: data.engagementFournitureDePuissanceAlaPointe,
    //         evaluationCarboneSimplifiée: data.evaluationCarbone,
    //         valeurÉvaluationCarbone: data.evaluationCarbone,
    //         technologie:
    //           data.technologie as Candidature.CandidatureImportéeEvent['payload']['technologie'],
    //         financementCollectif: data.actionnariat === 'financement-collectif',
    //         financementParticipatif: data.isInvestissementParticipatif,
    //         gouvernancePartagée: data.actionnariat === 'gouvernance-partagée',
    //         dateÉchéanceGf: data.garantiesFinancièresDateEchéance
    //           ? DateTime.convertirEnValueType(
    //               new Date(data.garantiesFinancièresDateEchéance),
    //             ).formatter()
    //           : undefined,
    //         teritoireProjet: data.territoireProjet,
    //         détails: data.details,
    //       };

    //       return result;
    //     },
    //     {} as Candidature.CandidatureImportéeEvent['payload'],
    //   );

    //   await publish(`candidature|${identifiantProjet}`, {
    //     type: 'CandidatureImportée-V1',
    //     payload,
    //   });

    //   printProgress(`${current}/${projectRawDataImportedEventsPerProjects.length}`);
    // });

    const getAllProjects = `
      select count(id) as "total_projects"
      from projects;
    `;

    const [{ total_projects }] = await executeSelect<{ total_projects: number }>(getAllProjects);
    console.info(
      `${allEventsPerProject.size} events were created for ${total_projects} existant projects`,
    );

    console.info('\nFin du script ✨');
  } catch (error) {
    console.error(error as Error);
  }

  process.exit(0);
})();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function printProgress(progress: string) {
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(progress);
}
