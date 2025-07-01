import { match } from 'ts-pattern';

import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

type RécupérerDélaiAccordéParRaison = (args: {
  identifiantProjet: IdentifiantProjet.ValueType;
  raison: Lauréat.Délai.HistoriqueDélaiProjetListItemReadModel['payload']['raison'] | 'signalement';
}) => Promise<Lauréat.Délai.ListerHistoriqueDélaiProjetReadModel>;

const récupérerDélaiAccordéParRaison: RécupérerDélaiAccordéParRaison = async ({
  identifiantProjet,
  raison,
}) => {
  const query = match(raison)
    .with(
      'demande',
      () =>
        // Ici on se base sur ModificationRequestAccepted (257) mais en fait il y a aussi DélaiAccordé (289)
        // Entre les deux y en a 99 qui parlent du même projet
        `

          select  
            (to_char (es."createdAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) as "dateCréation",
            round(((payload->>'dateAchèvementAccordée')::date - (payload->>'ancienneDateThéoriqueAchèvement')::date)::float / 30) as "durée"
          from "eventStores" es
          join "projects" p on p."id"::text = es.payload->>'projetId'
          where 
            es.type = 'DélaiAccordé'
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
          round(
            (
              to_timestamp((payload->>'newCompletionDueOn')::bigint / 1000)::date - 
              to_timestamp((payload->>'oldCompletionDueOn')::bigint / 1000)::date
            )::float / 30) as "durée"
        from "eventStores" es
        join "projects" p on p."id"::text = es.payload->>'projectId'
        where 
          es.type = 'DemandeDelaiSignaled'
          and es.payload->>'status' = 'acceptée'
		      and es.payload->>'newCompletionDueOn' is not null
		      and es.payload->>'oldCompletionDueOn' is not null
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
        
        7 as "durée"
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
      raison: raison === 'signalement' ? 'demande' : raison,
      accordéLe: DateTime.convertirEnValueType(dateCréation).formatter(),
    },
  }));
};

/***
 * TODO :  LegacyModificationRawDataImported???
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
