import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

const selectDélaiAccordéSuiteÀUneDemandeQuery = `
  select 
    es."createdAt" as 'dateCréation'
    es.payload->'params'->>'delayInMonths' as 'durée'
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

export const consulterDélaiAccordéProjetAdapter: Lauréat.Délai.ConsulterABénéficiéDuDélaiCDC2022Port =
  async (identifiantProjet: string) => {
    const { appelOffre, période, famille, numéroCRE } =
      IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const délais: Array<Lauréat.Délai.HistoriqueDélaiProjetListItemReadModel> = [];

    const délaisAccordésParDemande = await executeSelect<{ dateCréation: string; durée?: string }>(
      selectDélaiAccordéSuiteÀUneDemandeQuery,
      appelOffre,
      période,
      famille,
      numéroCRE,
    );

    if (délaisAccordésParDemande.length > 0) {
      délaisAccordésParDemande.map(({ dateCréation, durée }) =>
        délais.push({
          id: `${identifiantProjet}#${dateCréation}`,
          category: 'délai',
          createdAt: dateCréation,
          type: 'DélaiAccordé-V1',
          payload: {
            identifiantProjet,
            durée: durée?.toString() ?? 'Non spécifiée',
            raison: 'demande',
          },
        }),
      );
    }

    return délais;
  };
