import { mediator } from 'mediateur';

import { bootstrap } from '@potentiel-applications/bootstrap';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

type ProjectRawDataImported = {
  type: 'ProjectRawDataImported';
  occurredAt: number;
  payload: {
    data: {
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
  };
};

type LegacyProjectSourced = {
  type: 'LegacyProjectSourced';
  occurredAt: number;
  payload: {
    projectId: string;
    appelOffreId: string;
    periodeId: string;
    familleId: string;
    numeroCRE: string;
    potentielIdentifier: string;
    content: {
      periodeId: string;
      appelOffreId: string;
      familleId: string;
      territoireProjet: string;
      numeroCRE: string;
      nomCandidat: string;
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
      fournisseur: string;
      actionnaire: string;
      classe: string;
      motifsElimination: string;
      notifiedOn: number;
      details: Record<string, string>;
    };
  };
};

type ProjectImported = {
  type: 'ProjectImported';
  occurredAt: number;
  payload: {
    projectId: string;
    appelOffreId: string;
    periodeId: string;
    familleId: string;
    numeroCRE: string;
    potentielIdentifier: string;
    importId: string;
    data: {
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
      soumisAuxGF?: true;
      désignationCatégorie?: 'volume-réservé' | 'hors-volume-réservé';
      historiqueAbandon?:
        | 'première-candidature'
        | 'abandon-classique'
        | 'abandon-avec-recandidature'
        | 'lauréat-autre-période';
    };
  };
};

type ProjectReimported = {
  type: 'ProjectReimported';
  occurredAt: number;
  payload: {
    projectId: string;
    periodeId: string;
    appelOffreId: string;
    familleId?: string;
    importId: string; // This field was added later
    data: Partial<{
      periodeId: string;
      appelOffreId: string;
      familleId: string;
      territoireProjet: string;
      numeroCRE: string;
      nomCandidat: string;
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
      actionnaire: string;
      classe: string;
      motifsElimination: string;
      notifiedOn: number;
      details: Record<string, string>;
      technologie: string;
      actionnariat: string;
    }>;
  };
};

(async () => {
  console.info(`ℹ️ Lancement du script [migrate-project-import-details] ...`);

  console.info(`ℹ️ Bootstrapping the app ...`);
  await bootstrap({ middlewares: [], sendEmail: () => Promise.resolve() });

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
    select p."appelOffreId" as "appel_offre", 
       p."periodeId" as "periode", 
       p."familleId" as "famille",
       p."numeroCRE" as "numero_cre", 
       count(es.id) as "total_import",
       array_agg(es.id) as "event_ids" 
    from "eventStores" es 
    inner join projects p on es.payload->>'projectId' = p.id::text
    where type = 'ProjectReimported'
    group by p."appelOffreId", 
            p."periodeId", 
            p."familleId",
            p."numeroCRE";
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

    let current = 0;
    for (const [identifiantProjet, eventIds] of allEventsPerProject.entries()) {
      console.info(`Processing project ${identifiantProjet}`);
      current++;

      const query = `
        select type, payload, "occurredAt"
        from "eventStores" es
        where id = any($1)
        order by "createdAt" asc;
      `;

      type Events =
        | ProjectRawDataImported
        | LegacyProjectSourced
        | ProjectImported
        | ProjectReimported;

      const events = await executeSelect<Events>(query, eventIds);

      const detailsAndDate = events.reduce(
        (acc, { type, payload, occurredAt }) => {
          switch (type) {
            case 'ProjectRawDataImported':
              return {
                details: {
                  ...acc.details,
                  ...payload.data.details,
                },
                importéLe: DateTime.convertirEnValueType(new Date(occurredAt)).formatter(),
              };

            case 'LegacyProjectSourced':
              return {
                details: {
                  ...acc.details,
                  ...payload.content.details,
                },
                importéLe: DateTime.convertirEnValueType(new Date(occurredAt)).formatter(),
              };

            case 'ProjectImported':
              return {
                details: {
                  ...acc.details,
                  ...payload.data.details,
                },
                importéLe: DateTime.convertirEnValueType(new Date(occurredAt)).formatter(),
              };

            case 'ProjectReimported':
              return {
                details: {
                  ...acc.details,
                  ...payload.data.details,
                },
                importéLe: DateTime.convertirEnValueType(new Date(occurredAt)).formatter(),
              };
          }
        },
        {} as { details: Record<string, string>; importéLe: DateTime.RawType },
      );

      console.info(`Saving details file for project ${identifiantProjet}...`);

      const buf = Buffer.from(JSON.stringify(detailsAndDate.details));
      const blob = new Blob([buf]);
      await mediator.send<EnregistrerDocumentProjetCommand>({
        type: 'Document.Command.EnregistrerDocumentProjet',
        data: {
          content: blob.stream(),
          documentProjet: DocumentProjet.convertirEnValueType(
            identifiantProjet,
            'candidature/import',
            detailsAndDate.importéLe,
            'application/json',
          ),
        },
      });
    }

    const getAllProjects = `
      select count(id) as "total_projects"
      from projects;
    `;

    const [{ total_projects }] = await executeSelect<{ total_projects: number }>(getAllProjects);
    console.info(`${current} details files were saved for ${total_projects} existant projects`);
    console.info('\nFin du script ✨');
  } catch (error) {
    console.error(error as Error);
  }

  process.exit(0);
})();
