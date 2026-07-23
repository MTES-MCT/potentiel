import { Command } from '@oclif/core';
import { mediator } from 'mediateur';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Lauréat } from '@potentiel-domain/projet';
import { getScopeProjetUtilisateurAdapter } from '@potentiel-infrastructure/domain-adapters';
import {
  countProjection,
  findProjection,
  listHistoryProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';
import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { dbSchema } from '#helpers';

export class Migrer extends Command {
  async init() {
    dbSchema.parse(process.env);
    AppelOffre.registerAppelOffreQueries({ find: findProjection, list: listProjection });

    Lauréat.registerLauréatQueries({
      find: findProjection,
      count: countProjection,
      getScopeProjetUtilisateur: getScopeProjetUtilisateurAdapter,
      list: listProjection,
      listHistory: listHistoryProjection,
    });
  }
  async run() {
    const errors: Error[] = [];
    const appelsOffresAvecVolumeRéservé = ['PPE2 - Bâtiment', 'PPE2 - Sol'];

    await executeQuery(
      `DROP RULE IF EXISTS prevent_update_on_event_stream on event_store.event_stream;`,
    );

    for (const appelOffreId of appelsOffresAvecVolumeRéservé) {
      try {
        const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
          type: 'AppelOffre.Query.ConsulterAppelOffre',
          data: {
            identifiantAppelOffre: appelOffreId,
          },
        });
        if (Option.isNone(appelOffre)) {
          throw new Error(`appel d'offres ${appelOffreId} non trouvé`);
        }

        for (const période of appelOffre.periodes) {
          try {
            if (!période.volumeRéservé) continue;

            await executeQuery(
              `
              UPDATE event_store.event_stream e
              SET payload = jsonb_set(
                  e.payload,
                  '{volumeRéservé}',
                  to_jsonb(
                      CASE
                          WHEN (e.payload->>'puissance')::numeric <= $2
                          AND (e.payload->>'noteTotale')::numeric >= $3
                          AND e.payload->>'statut' = 'classé'
                          THEN true
                          ELSE false
                      END
                  )
              )
              WHERE e.stream_id LIKE $1
              AND e.type LIKE 'CandidatureImportée-V%';
      `,
              `candidature|${appelOffreId}#${période.id}#%`,
              période.volumeRéservé.puissanceMax,
              période.volumeRéservé.noteMin,
            );
          } catch (error) {
            errors.push(error as Error);
          }
        }
      } catch (error) {
        errors.push(error as Error);
      }
    }
    await executeQuery(
      `
        CREATE OR REPLACE RULE prevent_update_on_event_stream as on update to event_store.event_stream do instead
        select event_store.throw_when_trying_to_update_event();
      `,
    );

    console.info(`Périodes mises à jour`);
    if (errors.length) {
      console.error(`Erreurs : ${JSON.stringify(errors.map((e) => e.message))}`);
    }
  }
}
