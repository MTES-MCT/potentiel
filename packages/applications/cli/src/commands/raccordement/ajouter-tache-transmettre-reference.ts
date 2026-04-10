import { Command } from '@oclif/core';
import z from 'zod';

import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';

import { dbSchema } from '#helpers';

const envSchema = z.object({
  ...dbSchema.shape,
});

export class AjouterTacheTransmettreReferenceCommand extends Command {
  static override description =
    'Insérer les tâches de transmission des références de raccordement pour les projets à qui on a attribué un gestionnaire de réseau';

  async run() {
    envSchema.parse(process.env);

    const query = `
      select 
        payload->>'identifiantProjet' as "identifiantProjet",
        created_at as "dateAttributionGrd"
      from event_store.event_stream es
      where es.type = 'GestionnaireRéseauAttribué-V1'
      -- On s'assure de ne pas prendre ceux qui ont déjà une tâcher ajoutée
      and not exists (
        select 1 
        from event_store.event_stream es4
        where es4.payload->>'identifiantProjet' = es.payload->>'identifiantProjet' 
        and es4.stream_id = format('tâche|raccordement.référence-non-transmise#$1', es.payload->>'identifiantProjet')
      )
      -- On exclue ceux qui ont déjà fais une transmission
      and not exists (
        select 1
        from event_store.event_stream es2
        where es2.stream_id = es.stream_id
          and es2.type like 'DemandeComplèteDeRaccordementTransmise-V%'
      )
      -- On exclue les projets abandonnés (qui ont supprimé le raccordement du coup)
      and not exists (
        select 1
        from event_store.event_stream es3 
        where es3.stream_id = es.stream_id 
        and es3.type = 'RaccordementSupprimé-V1'
      )
    `;

    const projets = await executeSelect<{
      identifiantProjet: IdentifiantProjet.RawType;
      dateAttributionGrd: DateTime.RawType;
    }>(query);

    if (!projets.length) {
      console.info('Aucun projet trouvé pour ajouter une tâche de transmission de référence');
      return;
    }

    const stats = {
      total: projets.length,
      index: 0,
      succès: 0,
      erreurs: 0,
    };

    const typeTâche = Lauréat.Tâche.TypeTâche.raccordementRéférenceNonTransmise.formatter();

    for (const { identifiantProjet, dateAttributionGrd } of projets) {
      stats.index++;

      console.info(
        `[${stats.index}/${stats.total}] Ajout de la tâche de transmission de référence pour le projet ${identifiantProjet}`,
      );

      try {
        const dateAttributionValueType = DateTime.convertirEnValueType(dateAttributionGrd).date;
        const ajoutéeLe = DateTime.convertirEnValueType(
          new Date(dateAttributionValueType.getTime() + 50),
        ).formatter();

        const event: Lauréat.Tâche.TâcheAjoutéeEvent = {
          type: 'TâcheAjoutée-V1',
          payload: {
            identifiantProjet,
            typeTâche,
            ajoutéeLe,
          },
        };

        await publish(`tâche|${typeTâche}#${identifiantProjet}`, {
          ...event,
          created_at: ajoutéeLe,
        });

        stats.succès++;
      } catch (error) {
        console.error(
          `Erreur lors de l'ajout de la tâche de transmission de référence pour le projet ${identifiantProjet} :`,
          error,
        );
        stats.erreurs++;
      }
    }

    console.log('Statistiques :');
    console.table(stats);
  }
}
