import { Command, Flags } from '@oclif/core';
import z from 'zod';

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
      console.error(error.errors);
      process.exit(1);
    }
  }

  async run(): Promise<void> {
    const query = `
    select 
      es.payload->>'completionDueOn' as "dateAchèvementPrévisionnelActuelle",
      p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE" as "identifiantProjet" 
    from "eventStores" es
    join projects p 
      on p.id::text = es.payload->>'projectId'
    where 
      es.type = 'ProjectCompletionDueDateSet'
      and es.payload->>'projectId' not in ('a1513e26-7ea2-4564-8012-ed13d60e878b', 'a835ea21-b273-49ce-bb1f-870c260dd907');
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
    }>(query);

    stats.total = datesActuelles.length;
    let current = 0;
    for (const { identifiantProjet, dateAchèvementPrévisionnelActuelle } of datesActuelles) {
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

    process.exit(0);
  }
}

export const sleep = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};
