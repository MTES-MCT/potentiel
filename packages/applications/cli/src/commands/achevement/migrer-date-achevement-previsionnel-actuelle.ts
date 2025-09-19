import { Command, Flags } from '@oclif/core';
import z from 'zod';
import { match } from 'ts-pattern';

import { DateTime } from '@potentiel-domain/common';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

const envSchema = z.object({
  DATABASE_CONNECTION_STRING: z.string().url(),
});

export class MigrerDateAchevementPrevisionnelActuelle extends Command {
  static flags = {
    dryRun: Flags.boolean(),
  };

  async init() {
    const { error } = envSchema.safeParse(process.env);

    if (error) {
      console.error(error.issues);
      process.exit(1);
    }
  }

  async run(): Promise<void> {
    const query = `
      select 
        es."occurredAt",
        es.payload->>'reason' as "raison",
        es.payload->>'completionDueOn' as "dateAchèvementPrévisionnelActuelle",
        p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE" as "identifiantProjet" 
      from "eventStores" es
      join projects p 
        on p.id::text = es.payload->>'projectId'
      where 
        es.type = 'ProjectCompletionDueDateSet'
        and es.payload->>'projectId' not in ('a1513e26-7ea2-4564-8012-ed13d60e878b', 'a835ea21-b273-49ce-bb1f-870c260dd907')

      union all

      select 
        es."occurredAt",
        'covid' as "raison",
        es.payload->>'completionDueOn' as "dateAchèvementPrévisionnelActuelle",
        p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE" as "identifiantProjet" 
      from "eventStores" es
      join projects p 
        on p.id::text = es.payload->>'projectId'
      where 
        es.type = 'CovidDelayGranted'
        and es.payload->>'projectId' not in ('a1513e26-7ea2-4564-8012-ed13d60e878b', 'a835ea21-b273-49ce-bb1f-870c260dd907')

      order by "occurredAt" asc;    
    `;

    type Stats = {
      total: number;
      sucess: number;
      error: number;
    };

    const stats: Stats = {
      total: 0,
      sucess: 0,
      error: 0,
    };

    const datesActuelles = await executeSelect<{
      dateAchèvementPrévisionnelActuelle: string;
      identifiantProjet: string;
      raison?: 'délaiCdc2022' | 'DemandeComplèteRaccordementTransmiseAnnuleDélaiCdc2022' | 'covid';
    }>(query);

    stats.total = datesActuelles.length;
    let current = 0;
    for (const {
      identifiantProjet,
      dateAchèvementPrévisionnelActuelle,
      raison,
    } of datesActuelles) {
      console.log(`${current++} / ${stats.total}`);

      try {
        const idProjet = IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter();

        const event: Lauréat.Achèvement.DateAchèvementPrévisionnelCalculéeEvent = {
          type: 'DateAchèvementPrévisionnelCalculée-V1',
          payload: {
            identifiantProjet: idProjet,
            date: DateTime.convertirEnValueType(
              new Date(Number(dateAchèvementPrévisionnelActuelle)),
            )
              .définirHeureÀMidi()
              .formatter(),
            raison: match(raison)
              .returnType<
                Lauréat.Achèvement.DateAchèvementPrévisionnelCalculéeEvent['payload']['raison']
              >()
              .with('délaiCdc2022', () => 'ajout-délai-cdc-30_08_2022')
              .with(
                'DemandeComplèteRaccordementTransmiseAnnuleDélaiCdc2022',
                () => 'retrait-délai-cdc-30_08_2022',
              )
              .with('covid', () => 'covid')
              .with(undefined, () => 'inconnue')
              .exhaustive(() => 'inconnue'),
          },
        };

        await publish(`achevement|${idProjet}`, event);

        await sleep(1);

        stats.sucess++;
      } catch (error) {
        console.log(error);
        stats.error++;
      }
    }

    console.log(stats);
  }
}

export const sleep = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};
