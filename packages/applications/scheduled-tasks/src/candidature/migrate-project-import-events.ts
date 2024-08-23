import { Candidature } from '@potentiel-domain/candidature';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { getLocalité } from './helpers';

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

      const payload: Candidature.CandidatureImportéeEvent['payload'] = events.reduce(
        (acc, { type, payload, occurredAt }) => {
          switch (type) {
            case 'ProjectRawDataImported':
              const result1: Candidature.CandidatureImportéeEvent['payload'] = {
                ...acc,
                identifiantProjet:
                  IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
                statut: payload.data.classe === 'Classé' ? 'classé' : 'éliminé',
                typeGarantiesFinancières: normaliserTypeGarantiesFinancières(
                  payload.data.garantiesFinancièresType ?? acc.typeGarantiesFinancières,
                ),
                historiqueAbandon: normaliserHistoriqueAbandon(
                  payload.data.historiqueAbandon ?? acc.historiqueAbandon,
                ),
                appelOffre: payload.data.appelOffreId,
                période: payload.data.periodeId,
                famille: payload.data.familleId,
                numéroCRE: payload.data.numeroCRE,
                nomProjet: payload.data.nomProjet,
                sociétéMère: payload.data.actionnaire,
                nomCandidat: payload.data.nomCandidat,
                puissanceProductionAnnuelle: payload.data.puissance,
                prixReference: payload.data.prixReference,
                noteTotale: payload.data.note,
                nomReprésentantLégal: payload.data.nomRepresentantLegal,
                emailContact: payload.data.email,
                localité: getLocalité({
                  code_postaux: [payload.data.codePostalProjet],
                  adresse1: payload.data.adresseProjet,
                  adresse2: '',
                  commune: payload.data.communeProjet,
                }),
                motifÉlimination: payload.data.motifsElimination,
                puissanceALaPointe: payload.data.engagementFournitureDePuissanceAlaPointe,
                evaluationCarboneSimplifiée: payload.data.evaluationCarbone,
                valeurÉvaluationCarbone: payload.data.evaluationCarbone,
                technologie: normaliserTechnologie(payload.data.technologie ?? acc.technologie),
                financementCollectif: payload.data.actionnariat === 'financement-collectif',
                financementParticipatif: payload.data.isInvestissementParticipatif,
                gouvernancePartagée: payload.data.actionnariat === 'gouvernance-partagee',
                dateÉchéanceGf: payload.data.garantiesFinancièresDateEchéance
                  ? DateTime.convertirEnValueType(
                      new Date(payload.data.garantiesFinancièresDateEchéance),
                    ).formatter()
                  : undefined,
                territoireProjet: payload.data.territoireProjet,
                importéPar: 'team@potentiel.beta.gouv.fr',
                importéLe: DateTime.convertirEnValueType(new Date(occurredAt)).formatter(),
              };

              return result1;

            case 'LegacyProjectSourced':
              const result2: Candidature.CandidatureImportéeEvent['payload'] = {
                ...acc,
                identifiantProjet:
                  IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
                statut: payload.content.classe === 'Classé' ? 'classé' : 'éliminé',
                appelOffre: payload.appelOffreId,
                période: payload.periodeId,
                famille: payload.familleId,
                numéroCRE: payload.numeroCRE,
                nomProjet: payload.content.nomProjet,
                sociétéMère: payload.content.actionnaire,
                nomCandidat: payload.content.nomCandidat,
                puissanceProductionAnnuelle: payload.content.puissance,
                prixReference: payload.content.prixReference,
                noteTotale: payload.content.note,
                nomReprésentantLégal: payload.content.nomRepresentantLegal,
                emailContact: payload.content.email,
                localité: getLocalité({
                  code_postaux: [payload.content.codePostalProjet],
                  adresse1: payload.content.adresseProjet,
                  adresse2: '',
                  commune: payload.content.communeProjet,
                }),
                motifÉlimination: payload.content.motifsElimination,
                puissanceALaPointe: payload.content.engagementFournitureDePuissanceAlaPointe,
                evaluationCarboneSimplifiée: payload.content.evaluationCarbone,
                valeurÉvaluationCarbone: payload.content.evaluationCarbone,
                financementParticipatif: payload.content.isInvestissementParticipatif,
                territoireProjet: payload.content.territoireProjet,
                importéPar: 'team@potentiel.beta.gouv.fr',
                importéLe: DateTime.convertirEnValueType(new Date(occurredAt)).formatter(),
              };

              return result2;

            case 'ProjectImported':
              const result3: Candidature.CandidatureImportéeEvent['payload'] = {
                ...acc,
                identifiantProjet:
                  IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
                statut: payload.data.classe === 'Classé' ? 'classé' : 'éliminé',
                appelOffre: payload.appelOffreId,
                période: payload.periodeId,
                famille: payload.familleId,
                numéroCRE: payload.numeroCRE,
                nomProjet: payload.data.nomProjet,
                sociétéMère: payload.data.actionnaire,
                nomCandidat: payload.data.nomCandidat,
                puissanceProductionAnnuelle: payload.data.puissance,
                prixReference: payload.data.prixReference,
                noteTotale: payload.data.note,
                nomReprésentantLégal: payload.data.nomRepresentantLegal,
                emailContact: payload.data.email,
                localité: getLocalité({
                  code_postaux: [payload.data.codePostalProjet],
                  adresse1: payload.data.adresseProjet,
                  adresse2: '',
                  commune: payload.data.communeProjet,
                }),
                motifÉlimination: payload.data.motifsElimination,
                puissanceALaPointe: payload.data.engagementFournitureDePuissanceAlaPointe,
                evaluationCarboneSimplifiée: payload.data.evaluationCarbone,
                valeurÉvaluationCarbone: payload.data.evaluationCarbone,
                financementParticipatif: payload.data.isInvestissementParticipatif,
                territoireProjet: payload.data.territoireProjet,
                importéPar: 'team@potentiel.beta.gouv.fr',
                importéLe: DateTime.convertirEnValueType(new Date(occurredAt)).formatter(),
              };

              return result3;

            case 'ProjectReimported':
              const result4: Candidature.CandidatureImportéeEvent['payload'] = {
                ...acc,
                identifiantProjet:
                  IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
                statut: payload.data.classe === 'Classé' ? 'classé' : 'éliminé',
                appelOffre: payload.appelOffreId,
                période: payload.periodeId,
                ...(payload.familleId && { famille: payload.familleId }),
                ...(payload.data.numeroCRE && { numéroCRE: payload.data.numeroCRE }),
                ...(payload.data.nomProjet && { nomProjet: payload.data.nomProjet }),
                ...(payload.data.actionnaire && { sociétéMère: payload.data.actionnaire }),
                ...(payload.data.nomCandidat && { nomCandidat: payload.data.nomCandidat }),
                ...(payload.data.puissance && {
                  puissanceProductionAnnuelle: payload.data.puissance,
                }),
                ...(payload.data.prixReference && { prixReference: payload.data.prixReference }),
                ...(payload.data.note && { noteTotale: payload.data.note }),
                ...(payload.data.nomRepresentantLegal && {
                  nomReprésentantLégal: payload.data.nomRepresentantLegal,
                }),
                ...(payload.data.email && { emailContact: payload.data.email }),
                ...(payload.data.motifsElimination && {
                  motifÉlimination: payload.data.motifsElimination,
                }),
                ...(payload.data.engagementFournitureDePuissanceAlaPointe && {
                  puissanceALaPointe: payload.data.engagementFournitureDePuissanceAlaPointe,
                }),
                ...(payload.data.evaluationCarbone && {
                  evaluationCarboneSimplifiée: payload.data.evaluationCarbone,
                }),
                ...(payload.data.evaluationCarbone && {
                  valeurÉvaluationCarbone: payload.data.evaluationCarbone,
                }),
                ...(payload.data.isInvestissementParticipatif && {
                  financementParticipatif: payload.data.isInvestissementParticipatif,
                }),
                ...(payload.data.territoireProjet && {
                  territoireProjet: payload.data.territoireProjet,
                }),
                localité: getLocalité({
                  code_postaux: payload.data.codePostalProjet
                    ? [payload.data.codePostalProjet]
                    : [acc.localité?.codePostal ?? ''],
                  adresse1: payload.data.adresseProjet ?? acc.localité?.adresse1 ?? '',
                  adresse2: '',
                  commune: payload.data.communeProjet ?? acc.localité?.commune ?? '',
                }),
                importéPar: 'team@potentiel.beta.gouv.fr',
                importéLe: DateTime.convertirEnValueType(new Date(occurredAt)).formatter(),
              };

              return result4;
          }
        },
        {
          technologie: 'N/A',
          historiqueAbandon: 'première-candidature',
          typeGarantiesFinancières: 'type-inconnu',
          financementCollectif: false,
          gouvernancePartagée: false,
        } as Candidature.CandidatureImportéeEvent['payload'],
      );

      console.info(`Publishing event for project ${identifiantProjet}...`);

      await publish(`candidature|${identifiantProjet}`, {
        type: 'CandidatureImportée-V1',
        payload,
      });
    }

    const getAllProjects = `
      select count(id) as "total_projects"
      from projects;
    `;

    const [{ total_projects }] = await executeSelect<{ total_projects: number }>(getAllProjects);
    console.info(`${current} events were published for ${total_projects} existant projects`);
    console.info('\nFin du script ✨');
  } catch (error) {
    console.error(error as Error);
  }

  process.exit(0);
})();

const normaliserHistoriqueAbandon = (val: string | undefined) =>
  !val || val === 'N/A'
    ? Candidature.HistoriqueAbandon.premièreCandidature.type
    : Candidature.HistoriqueAbandon.convertirEnValueType(val).type;

const normaliserTypeGarantiesFinancières = (
  val: string | undefined,
): GarantiesFinancières.TypeGarantiesFinancières.RawType | undefined => {
  if (!val) return 'type-inconnu';
  switch (val) {
    case `Garantie financière jusqu'à 6 mois après la date d'achèvement`:
      return 'six-mois-après-achèvement';
    case 'Consignation':
      return 'consignation';
    case `Garantie financière avec date d'échéance et à renouveler`:
      return 'avec-date-échéance';
    default:
      try {
        return GarantiesFinancières.TypeGarantiesFinancières.convertirEnValueType(val).type;
      } catch {}
      return 'type-inconnu';
  }
};

const normaliserTechnologie = (technologie: string): Candidature.Technologie.RawType => {
  return technologie
    ? Candidature.Technologie.convertirEnValueType(technologie).type
    : Candidature.Technologie.nonApplicable.type;
};
