import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

const selectDélaiAccordéSuiteÀUneDemandeQuery = `
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
`;

/***
 * TODO : DemandeDelaiSignaled / DélaiAccordé / CovidDelayGranted / LegacyModificationRawDataImported???
 */

export const consulterDélaiAccordéProjetAdapter: Lauréat.Délai.ConsulterDélaiAccordéProjetPort =
  async (identifiantProjet: string) => {
    const { appelOffre, période, famille, numéroCRE } =
      IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const délaisAccordésParDemande = await executeSelect<{ dateCréation: string; durée: number }>(
      selectDélaiAccordéSuiteÀUneDemandeQuery,
      appelOffre,
      période,
      famille,
      numéroCRE,
    );

    if (délaisAccordésParDemande.length === 0) {
      return [];
    }

    return délaisAccordésParDemande.map(({ dateCréation, durée }) => ({
      id: `${identifiantProjet}#${dateCréation}`,
      category: 'délai',
      createdAt: dateCréation,
      type: 'DélaiAccordé-V1',
      payload: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
        durée,
        raison: 'demande',
        accordéLe: DateTime.convertirEnValueType(dateCréation).formatter(),
      },
    }));
  };
