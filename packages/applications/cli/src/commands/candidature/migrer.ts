import { Command, Flags } from '@oclif/core';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/projet';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { Option } from '@potentiel-libraries/monads';
import { executeSelect, killPool } from '@potentiel-libraries/pg-helpers';

type CandidatureEvents = {
  stream_id: string;
  fournisseurs: { type: string; nom: string }[];
  identifiantProjet: IdentifiantProjet.RawType;
};

const eventQuery = `
SELECT es.stream_id,
    payload->>'identifiantProjet' AS "identifiantProjet",
    json_agg(
        jsonb_build_object(
             'type', d.key,
             'nom', d.value
        )
    ) as fournisseurs
FROM event_store.event_stream es
    INNER JOIN projects p ON format(
        '%s#%s#%s#%s',
        p."appelOffreId",
        p."periodeId",
        p."familleId",
        p."numeroCRE"
    ) = payload->>'identifiantProjet'
    inner join json_each_text(p.details) d on d.key ilike '%nom du fabricant%' 
    and trim(lower(d.value)) not in ('','0','#n/a','n/a','na','n.a.','nx',  'nc','ne s''applique pas','non applicable', 'non concerné','-','--','/','sans objet','s/o','so', 'non pertinent', 'non applicable à ce projet','non disponible','aucun','non','non concern?','_','à définir ultérieurement','b','non défini','non renseigné','non précisé', 'non connu à ce jour', 'non connu a ce jour')
WHERE es.type = 'CandidatureImportée-V1'
group by es.stream_id,
    payload->>'identifiantProjet' ;
`;

export class Migrer extends Command {
  static flags = {
    dryRun: Flags.boolean(),
  };

  async finally() {
    await killPool();
  }

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
          fournisseurs: fournisseurs.map(({ nom, type }) => ({
            typeFournisseur: Option.match(
              Candidature.CandidatureMapperHelper.mapCsvLabelToTypeFournisseur(type),
            )
              .some((type) => type.formatter())
              .none(() => {
                throw new Error(`Type inconnu (${type})`);
              }),
            nomDuFabricant: nom,
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
    }
  }
}
