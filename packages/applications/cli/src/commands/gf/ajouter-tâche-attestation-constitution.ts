import { Command } from '@oclif/core';

import { DateTime } from '@potentiel-domain/common';
import { type IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { dbSchema } from '#helpers';

export class AjouterTâcheAttestationConstitution extends Command {
  static override description =
    `Ajout d'une tâche transmettre attestation de constitution pour les projets sans attestation de constitution`;
  async init() {
    dbSchema.parse(process.env);
  }

  async run() {
    const stats = {
      total: 0,
      succès: 0,
      erreurs: 0,
    };

    try {
      const projetsAvecAttestationDeConstitutionManquante = await executeSelect<{
        identifiantProjet: IdentifiantProjet.RawType;
      }>(`
SELECT 
value->>'identifiantProjet' as "identifiantProjet" 
FROM domain_views.projection
WHERE key like 'garanties-financieres%'
AND value->>'actuelles.type' IS NOT NULL
AND value->>'actuelles.constitution.attestation.format' IS NULL
    `);

      await executeSelect(
        `DROP RULE IF EXISTS prevent_update_on_event_stream on event_store.event_stream;`,
      );

      stats.total = projetsAvecAttestationDeConstitutionManquante.length;

      process.stdout.write(`\r⏳ ${stats.total} projets à traiter`);

      for (const { identifiantProjet } of projetsAvecAttestationDeConstitutionManquante) {
        const event: Lauréat.Tâche.TâcheAjoutéeEvent = {
          type: 'TâcheAjoutée-V1',
          payload: {
            identifiantProjet: identifiantProjet,
            typeTâche: Lauréat.Tâche.TypeTâche.garantiesFinancièresAttestationTransmettre.type,
            ajoutéeLe: DateTime.now().formatter(),
          },
        };

        await publish(
          `tâche|${Lauréat.Tâche.TypeTâche.garantiesFinancièresAttestationTransmettre.type}#${identifiantProjet}`,
          {
            ...event,
            created_at: DateTime.now().formatter(),
          },
        );

        stats.succès += 1;
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche :", error);
      stats.erreurs += 1;
    }

    await executeSelect(`
        CREATE OR REPLACE RULE prevent_update_on_event_stream as on update to event_store.event_stream do instead
        select event_store.throw_when_trying_to_update_event();
      `);

    process.stdout.write('\n');
    console.log(stats);
  }
}
