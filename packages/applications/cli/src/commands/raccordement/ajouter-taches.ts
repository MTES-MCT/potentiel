import { Command } from '@oclif/core';
import z from 'zod';

import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { ProjetAdapter } from '@potentiel-infrastructure/domain-adapters';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { dbSchema } from '#helpers';

const envSchema = z.object({
  ...dbSchema.shape,
});

export class AjouterTâchesRaccordementCommand extends Command {
  async init() {
    envSchema.parse(process.env);
  }

  async run() {
    await this.parse(AjouterTâchesRaccordementCommand);

    const lauréatsPPE2NonAbandonnéSaufPPA = await executeSelect<{
      identifiantProjet: Lauréat.LauréatEntity['identifiantProjet'];
    }>(`
    select laur.value->>'identifiantProjet' as "identifiantProjet"
    from domain_views.projection as laur
    left join domain_views.projection as abandon 
      on abandon.key = format('abandon|%s', laur.value->>'identifiantProjet') 
      and abandon.value->>'estAbandonné' = 'true'
    left join domain_views.projection ppa ON ppa.key = format(
      'power-purchase-agreement|%s',
      laur.value->>'identifiantProjet'
    )
    join domain_views.projection as ao
      on ao.value->>'id' = split_part(laur.value->>'identifiantProjet', '#', 1)
    where laur.key like 'lauréat|%'
      and ao.value->>'cycleAppelOffre' = 'PPE2'
      and (
      abandon.key IS NULL
      or ppa.key IS NOT NULL
    )
`);

    if (!lauréatsPPE2NonAbandonnéSaufPPA.length) {
      console.info('ℹ️ Aucun projet lauréat PPE2 \n\n');
      return;
    }

    let count = 0;

    for (const { identifiantProjet } of lauréatsPPE2NonAbandonnéSaufPPA) {
      count++;
      process.stdout.write(
        `\r⏳ [${count}/${lauréatsPPE2NonAbandonnéSaufPPA.length}] - ${identifiantProjet}`,
      );

      const aggregate = await ProjetAdapter.getProjetAggregateRootAdapter(
        IdentifiantProjet.convertirEnValueType(identifiantProjet),
      );
      await aggregate.lauréat.raccordement.mettreÀJourTâchesEtTâchesPlanifiées();

      process.stdout.write('\n');
    }
  }
}
