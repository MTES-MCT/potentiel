import { Command, Flags } from '@oclif/core';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/projet';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

type CandidatureEvents = {
  stream_id: string;
  fournisseurs: Record<string, string>;
  identifiantProjet: IdentifiantProjet.RawType;
};

const eventQuery = `
SELECT
    es.stream_id,
    payload->>'identifiantProjet' AS "identifiantProjet",
    (
        SELECT jsonb_object_agg(key, value)
        FROM jsonb_each_text(p.details::jsonb)
        WHERE key ILIKE '%Nom du fabricant%'
    ) AS "fournisseurs"
FROM
    event_store.event_stream es
INNER JOIN
    projects p
ON
    concat(p."appelOffreId", '#', p."periodeId", '#', p."familleId", '#', p."numeroCRE") = payload->>'identifiantProjet'
WHERE
    es.type = 'CandidatureImportée-V1'
AND
    EXISTS (
        SELECT 1
        FROM jsonb_each_text(p.details::jsonb)
        WHERE key ILIKE '%Nom du fabricant%'
    );
`;

export class Migrer extends Command {
  static flags = {
    dryRun: Flags.boolean(),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Migrer);

    const subscriberCount = await executeSelect<{ count: number }>(
      "select count(*) as count from event_store.subscriber where stream_category='candidature'",
    );

    if (subscriberCount[0].count > 0 && !flags.dryRun) {
      console.warn('Il existe des subscribers pour candidature');
      process.exit(1);
    }

    const candidaturesImportéesEvent = await executeSelect<CandidatureEvents>(eventQuery);

    console.log(`${candidaturesImportéesEvent.length} candidatures importées trouvées`);

    for (const { stream_id, identifiantProjet, fournisseurs } of candidaturesImportéesEvent) {
      const event: Candidature.FournisseursCandidatureImportésEvent = {
        type: 'FournisseursCandidatureImportés-V1',
        payload: {
          identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
          fournisseurs: Candidature.CandidatureMapperHelper.mapToDétailsCandidatureUseCaseData(
            fournisseurs,
          ).map((fournisseur) => ({
            typeFournisseur: fournisseur.typeFournisseur.formatter(),
            nomDuFabricant: fournisseur.nomDuFabricant,
          })),
        },
      };

      if (flags.dryRun) {
        console.log(`[DRY-RUN] Publishing ${event.type} for ${stream_id}`);
      } else {
        await publish(stream_id, event);
        console.log(`Published ${event.type} for ${stream_id}`);
      }

      // les données fournisseurs n'ont jamais été corrigées lors d'une correction de candidature
      // cf : select distinct json_object_keys(payload->'correctedData') from "eventStores" es where es.type='ProjectDataCorrected';

      process.exit(0);
    }
  }
}
