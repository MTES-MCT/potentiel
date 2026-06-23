import { Command } from '@oclif/core';

import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { ProjetAdapter } from '@potentiel-infrastructure/domain-adapters';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

export class AjouterTâchesRaccordementCommand extends Command {
  async run() {
    await this.parse(AjouterTâchesRaccordementCommand);

    const items = await executeSelect<{
      lauréat: Lauréat.LauréatEntity;
      tâche: boolean;
      tâchePlanifiée: boolean;
    }>(`
SELECT laur.value as "lauréat", tache.value is not null as "tâche", tache_planifiee.value is not null as "tâchePlanifiée"
from domain_views.projection as laur 
LEFT JOIN domain_views.projection as racc on racc.key like 'dossier-raccordement|%' and racc.value->>'identifiantProjet' = laur.value->>'identifiantProjet'
LEFT JOIN domain_views.projection as tache_planifiee on tache_planifiee.key=format('tâche-planifiée|demande-complète-raccordement.relance#%s', laur.value->>'identifiantProjet')
LEFT JOIN domain_views.projection as "tache" on tache.key like 'tâche|raccordement.#%s' and tache.value->>'identifiantProjet'=laur.value->>'identifiantProjet'
where laur.key like 'lauréat|PPE2 - %'  and racc.key is null and (tache_planifiee.key is null or tache.key is null);
`);

    for (const item of items) {
      const aggregate = await ProjetAdapter.getProjetAggregateRootAdapter(
        IdentifiantProjet.convertirEnValueType(item.lauréat.identifiantProjet),
      );
      await aggregate.lauréat.raccordement.ajouterTâchesEtTâchesPlanifiées();
    }
  }
}
