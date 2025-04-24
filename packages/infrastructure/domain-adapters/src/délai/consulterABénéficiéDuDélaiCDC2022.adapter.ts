import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

const selectProjectQuery = `
  select 1
  from "project_events" pe
  inner join projects p on pe."projectId"=p."id"
  where 
        p."appelOffreId" = $1 and p."periodeId" = $2 and p."familleId" = $3 and p."numeroCRE" = $4
    and pe.type='ProjectCompletionDueDateSet' and payload->>'reason'='délaiCdc2022'
`;

export const consulterABénéficiéDuDélaiCDC2022Adapter: Lauréat.Délai.ConsulterABénéficiéDuDélaiCDC2022Port =
  async (identifiantProjet: string) => {
    const { appelOffre, période, famille, numéroCRE } =
      IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const events = await executeSelect(selectProjectQuery, appelOffre, période, famille, numéroCRE);

    return events.length > 0;
  };
