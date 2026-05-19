import { Command, Flags } from '@oclif/core';

import { Where } from '@potentiel-domain/entity';
import { type Candidature, type IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { executeQuery } from '@potentiel-libraries/pg-helpers';

export class ImporterSirenEtSiretCommand extends Command {
  static flags = {
    projet: Flags.string(),
  };

  async run() {
    // à exécuter manuellement en production
    if (process.env.NODE_ENV !== 'production') {
      await executeQuery(
        `DROP RULE IF EXISTS prevent_update_on_event_stream on event_store.event_stream;`,
      );
    }

    const { flags } = await this.parse(ImporterSirenEtSiretCommand);

    const { items } = await listProjection<
      Candidature.DétailCandidatureEntity,
      Candidature.CandidatureEntity
    >(`détail-candidature`, {
      where: {
        identifiantProjet: Where.equal(flags.projet as IdentifiantProjet.RawType),
      },
      join: {
        entity: 'candidature',
        on: 'identifiantProjet',
      },
    });

    const stats = {
      ok: 0,
      nok: 0,
    };

    for (const item of items) {
      const identifiantProjet = item.identifiantProjet;

      try {
        const numéroSirenOuSiret = item.détail['Numéro SIREN ou SIRET*'];

        if (!numéroSirenOuSiret) {
          stats.nok++;
          continue;
        }

        const numéro = numéroSirenOuSiret.trim().replace(/\D/g, '');

        const isSIRET = numéro.length === 14;
        const isSIREN = numéro.length === 9;

        const numéroIdentification = {
          siret: isSIRET ? numéro : undefined,
          siren: isSIRET ? numéro.slice(0, 9) : isSIREN ? numéro : undefined,
        };

        if (!isSIRET && !isSIREN) {
          console.warn(
            `Le numéro d'identification ${numéroSirenOuSiret} pour le projet ${identifiantProjet} n'est pas valide et ne sera pas importé.`,
          );
          stats.nok++;
          continue;
        }

        const numéroIdentificationValueType =
          Lauréat.Producteur.NuméroIdentification.convertirEnValueType(numéroIdentification);

        await executeQuery(
          `update event_store.event_stream
             set payload=jsonb_set(payload, '{numéroIdentification}', $2::jsonb)
             where stream_id in ('candidature|' || $1, 'lauréat|' || $1)
             and type in (
             'CandidatureImportée-V1',
             'CandidatureImportée-V2',
             'CandidatureCorrigée-V1',
             'CandidatureCorrigée-V2',
             'LauréatNotifié-V1',
             'LauréatNotifié-V2',
             'ProducteurModifié-V1'
             )`,
          identifiantProjet,
          JSON.stringify(numéroIdentificationValueType),
        );
        stats.ok++;
      } catch (e) {
        console.error(`❌ Erreur pour le projet ${identifiantProjet}  : ${e}`);
        stats.nok++;
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      await executeQuery(`call event_store.rebuild('candidature')`);
      await executeQuery(`call event_store.rebuild('lauréat')`);
    } else {
      console.log('Now, rebuild candidature and lauréat :');
      console.log("call event_store.rebuild('candidature')");
      console.log("call event_store.rebuild('lauréat')");
    }
  }
}
