import { Command, Flags } from '@oclif/core';

import { type Candidature, Lauréat } from '@potentiel-domain/projet';
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

    const { items } = await listProjection<
      Candidature.DétailCandidatureEntity,
      Candidature.CandidatureEntity
    >(`détail-candidature`, {
      join: {
        entity: 'candidature',
        on: 'identifiantProjet',
      },
    });

    const stats: {
      ok: number;
      okSIREN: number;
      okSIRET: number;
      nok: number;
    } = {
      ok: 0,
      okSIREN: 0,
      okSIRET: 0,
      nok: 0,
    };

    for (const item of items) {
      const identifiantProjet = item.identifiantProjet;

      try {
        const numéroSirenOuSiret = item.détail['Numéro SIREN ou SIRET*'];

        if (!numéroSirenOuSiret) {
          console.log(`⚠️  Pas de numéro d'identification pour le projet ${identifiantProjet}`);
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
             where stream_id in ('candidature|' || $1, 'lauréat|' || $1, 'producteur|' || $1)
             and type in (
             'CandidatureImportée-V1',
             'CandidatureImportée-V2',
             'CandidatureCorrigée-V1',
             'CandidatureCorrigée-V2',
             'LauréatNotifié-V1',
             'LauréatNotifié-V2',
             'ProducteurImporté-V1',
             'ProducteurModifié-V1'
             )`,
          identifiantProjet,
          JSON.stringify(numéroIdentificationValueType),
        );

        console.log(`✅ Mis à jour du projet ${identifiantProjet}`);

        stats.ok++;
        if (isSIREN) stats.okSIREN++;
        if (isSIRET) stats.okSIRET++;
      } catch (e) {
        console.error(`❌ Erreur pour le projet ${identifiantProjet}  : ${e}`);
        stats.nok++;
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      await executeQuery(`call event_store.rebuild('candidature')`);
      await executeQuery(`call event_store.rebuild('lauréat')`);
      await executeQuery(`call event_store.rebuild('producteur')`);
    } else {
      console.log('Now, rebuild candidature and lauréat :');
      console.log("call event_store.rebuild('candidature')");
      console.log("call event_store.rebuild('lauréat')");
      console.log("call event_store.rebuild('producteur')");
    }

    console.log(stats);
  }
}
