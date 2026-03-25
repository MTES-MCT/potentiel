import { Command } from '@oclif/core';

import { executeQuery, executeSelect } from '@potentiel-libraries/pg-helpers';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { getDémarcheAvecDossiers } from '@potentiel-infrastructure/ds-api-client';
import { Option } from '@potentiel-libraries/monads';

export class RattraperDetailsPetitPVBatP1 extends Command {
  async run() {
    try {
      const existingDétails = await executeSelect<{
        identifiantProjet: IdentifiantProjet.RawType;
        détail: Record<string, string>;
      }>(
        `select 
          payload->>'identifiantProjet' as "identifiantProjet", 
          payload->'détail' as "détail"
        from event_store.event_stream 
        where type = 'DétailCandidatureImporté-V1' and payload->>'identifiantProjet' like 'PPE2 - Petit PV Bâtiment#%';`,
      );

      if (existingDétails.length === 0) {
        console.log('Aucun détail trouvé');
        return;
      }

      const démarcheId = existingDétails[0].détail['demarcheId'];

      const dossiers = await getDémarcheAvecDossiers(Number(démarcheId));

      if (Option.isNone(dossiers)) {
        console.log(`La démarche ${démarcheId} est introuvable`);
        return;
      }

      await executeQuery(
        'DROP RULE IF EXISTS prevent_update_on_event_stream on event_store.event_stream',
      );

      for (const dossier of dossiers) {
        console.log(`Traitement du dossier ${dossier.numeroDS}`);
        const formattedDétails = cleanDétailsKeys(dossier.détails);
        const identifiantProjet = `PPE2 - Petit PV Bâtiment#1##${dossier.numeroDS}`;

        const existing = existingDétails.filter((d) => d.identifiantProjet === identifiantProjet);

        if (existing.length === 0) {
          console.log(`Le dossier n'a pas de détail existant pour le projet ${identifiantProjet}`);
          continue;
        }

        const existingDétail = existing[0];

        try {
          await executeQuery(
            `update event_store.event_stream 
            set payload = jsonb_set(payload, '{détail}', $1)
            where type = 'DétailCandidatureImporté-V1' and payload->>'identifiantProjet' = $2;`,
            {
              ...formattedDétails,
              ...existingDétail.détail,
            },
            identifiantProjet,
          );
        } catch (error) {
          console.error(
            `Erreur lors de la mise à jour du projet PPE2 - Petit PV Bâtiment#1##${dossier.numeroDS}:`,
            error,
          );
        }
      }

      await executeQuery(
        `create or replace rule prevent_update_on_event_stream as on update to event_store.event_stream do instead select event_store.throw_when_trying_to_update_event();`,
      );
    } catch (e) {
      console.log(e);
    }
  }
}

const valuesToStrip = ['', 'N/A', '#N/A', '0'];

const removeEmptyValues = (obj: Record<string, string | undefined>): Record<string, string> =>
  Object.fromEntries(
    Object.entries(obj)
      .filter(([key, value]) => !!key && value !== undefined && !valuesToStrip.includes(value))
      .map(([key, value]) => [key, value as string]),
  );

const cleanDétailsKeys = (obj: Record<string, string>): Record<string, string> =>
  removeEmptyValues(
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key
          .replace(/\n/g, ' ') // Remplace les retours à la ligne restants par un espace simple
          .replace(/ {2,}/g, ' ') // Remplace deux espaces ou plus par un seul espace
          .trim(), // Supprime les espaces en début et fin de chaîne
        value,
      ]),
    ),
  );
