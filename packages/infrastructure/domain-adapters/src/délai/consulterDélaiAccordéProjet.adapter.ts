import { match } from 'ts-pattern';

import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

type RécupérerDélaiAccordéParRaison = (args: {
  identifiantProjet: IdentifiantProjet.ValueType;
  raison: Lauréat.Délai.HistoriqueDélaiProjetListItemReadModel['payload']['raison'];
}) => Promise<Lauréat.Délai.ListerHistoriqueDélaiProjetReadModel>;

const récupérerDélaiAccordéParRaison: RécupérerDélaiAccordéParRaison = async ({
  identifiantProjet,
  raison,
}) => {
  const query = match(raison)
    .with(
      'demande',
      () => `
        select (SELECT to_char (es."createdAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) as "dateCréation", 
        case 
          when es.payload->'params'->>'delayInMonths' is not null 
            then es.payload->'params'->>'delayInMonths' 
          else (
            select es2.payload->>'delayInMonths'
            from "eventStores" es2
            where es2.type = 'ModificationRequested' 
            and es2.payload->>'type' = 'delai'
            and es2."aggregateId" && es."aggregateId"
          )
        end as "durée"
        from "eventStores" es 
        join "modificationRequests" m on es.payload->>'modificationRequestId' = m."id"::text 
        join "projects" p on p."id" = m."projectId"
        where 
          es.type = 'ModificationRequestAccepted' 
          and es.payload->'params'->>'type' = 'delai'
          and p."appelOffreId" = $1 
          and p."periodeId" = $2 
          and p."familleId" = $3 
          and p."numeroCRE" = $4;
      `,
    )
    .with(
      'signalement',
      () => `
        select 
          to_char(
            to_timestamp((es.payload->>'decidedOn')::bigint / 1000) AT TIME ZONE 'UTC',
            'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
          ) AS "dateCréation",
          extract(
            MONTH FROM AGE(
              to_timestamp((payload->>'newCompletionDueOn')::bigint / 1000),
              to_timestamp((payload->>'oldCompletionDueOn')::bigint / 1000)
            )
          ) AS "durée"
        from "eventStores" es
        join "projects" p on p."id"::text = es.payload->>'projectId'
        where es.type = 'DemandeDelaiSignaled'
        and es.payload->>'status' = 'acceptée'
        and es.payload->>'oldCompletionDueOn' is not null
        and es.payload->>'newCompletionDueOn' is not null
        and p."appelOffreId" = $1 
        and p."periodeId" = $2 
        and p."familleId" = $3 
        and p."numeroCRE" = $4;
      `,
    )
    //TODO : vérifier nombre de mois pour le covid
    .with(
      'covid',
      () => `
      select 
        (SELECT to_char (es."createdAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) as "dateCréation", 
        // 
        ?????? as "durée"
      from "eventStores" es 
      join projects p on p.id::text = es.payload->>'projectId' 
      where 
        es.type = 'CovidDelayGranted'
        and p."appelOffreId" = $1 
        and p."periodeId" = $2 
        and p."familleId" = $3 
        and p."numeroCRE" = $4;
    `,
    )
    .with(
      'cdc-18-mois',
      () => `
      select 
	      (SELECT to_char (es."createdAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) as "dateCréation", 
	      18 as "durée"
      from "eventStores" es
      join projects p on p.id::text = es.payload->>'projectId'
      where 
        es.type = 'ProjectCompletionDueDateSet' 
        and es.payload->>'reason'='délaiCdc2022'
          and p."appelOffreId" = $1 
          and p."periodeId" = $2 
          and p."familleId" = $3 
          and p."numeroCRE" = $4;
    `,
    )
    .exhaustive();
  const items = await executeSelect<{ dateCréation: string; durée: number }>(
    query,
    identifiantProjet.appelOffre,
    identifiantProjet.période,
    identifiantProjet.famille,
    identifiantProjet.numéroCRE,
  );

  return items.map(({ dateCréation, durée }) => ({
    id: `${identifiantProjet}#${dateCréation}`,
    category: 'délai',
    createdAt: dateCréation,
    type: 'DélaiAccordé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      durée,
      raison,
      accordéLe: DateTime.convertirEnValueType(dateCréation).formatter(),
    },
  }));
};

/***
 * TODO : DélaiAccordé / CovidDelayGranted / LegacyModificationRawDataImported???
 */
export const consulterDélaiAccordéProjetAdapter: Lauréat.Délai.ConsulterDélaiAccordéProjetPort =
  async (identifiantProjet: string) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    return [
      ...(await récupérerDélaiAccordéParRaison({
        identifiantProjet: identifiantProjetValueType,
        raison: 'demande',
      })),
      ...(await récupérerDélaiAccordéParRaison({
        identifiantProjet: identifiantProjetValueType,
        raison: 'signalement',
      })),
      ...(await récupérerDélaiAccordéParRaison({
        identifiantProjet: identifiantProjetValueType,
        raison: 'covid',
      })),
      ...(await récupérerDélaiAccordéParRaison({
        identifiantProjet: identifiantProjetValueType,
        raison: 'cdc-18-mois',
      })),
    ];
  };
