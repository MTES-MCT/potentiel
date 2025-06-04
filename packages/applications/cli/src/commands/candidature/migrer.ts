import { Command, Flags } from '@oclif/core';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { Option } from '@potentiel-libraries/monads';
import { executeSelect, killPool } from '@potentiel-libraries/pg-helpers';

type CandidatureEvents = {
  stream_id: string;
  fournisseurs: { type: string; nom: string }[];
  identifiantProjet: IdentifiantProjet.RawType;
  évaluationCarboneSimplifiée: number;
};

type LauréatEvents = {
  identifiantProjet: IdentifiantProjet.RawType;
  notifiéLe: DateTime.RawType;
  notifiéPar: Email.RawType;
};

const eventQuery = `
SELECT es.stream_id,
    payload->>'identifiantProjet' AS "identifiantProjet",
    payload->>'evaluationCarboneSimplifiée' AS "évaluationCarboneSimplifiée",
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

const lauréatEventQuery = `
SELECT
    payload->>'identifiantProjet' AS "identifiantProjet",
    payload->>'notifiéPar' AS "notifiéPar",
    payload->>'notifiéLe' AS "notifiéLe"
    FROM event_store.event_stream es
WHERE es.type = 'LauréatNotifié-V2'
OR es.type = 'LauréatNotifié-V1'
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
      const commonPayload = {
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
      };

      const event: Candidature.DétailsFournisseursCandidatureImportésEvent = {
        type: 'DétailsFournisseursCandidatureImportés-V1',
        payload: commonPayload,
      };

      if (flags.dryRun) {
        console.log(`[DRY-RUN] Publishing ${event.type} for ${stream_id}`);
      } else {
        await publish(stream_id, event);
        console.log(`Published ${event.type} for ${stream_id}`);
      }
    }

    const lauréatNotifiéEvents = await executeSelect<LauréatEvents>(lauréatEventQuery);

    console.log(`${lauréatNotifiéEvents.length} lauréats trouvés`);

    for (const { notifiéPar, notifiéLe, identifiantProjet } of lauréatNotifiéEvents) {
      const candidature = candidaturesImportéesEvent.find(
        (candidature) => candidature.identifiantProjet === identifiantProjet,
      );

      if (!candidature) {
        console.warn(`Pas de candidature trouvée pour l'identifiant ${identifiantProjet}`);
        continue;
      }

      // Le détail fournisseur n'a jamais été corrigé lors d'une correction de candidature
      // cf : select distinct json_object_keys(payload->'correctedData') from "eventStores" es where es.type='ProjectDataCorrected';
      // la valeur évaluationCarboneSimplifiée n'a jamais été corrigée donc on peut utiliser celle de l'import
      const event: Lauréat.Fournisseur.FournisseurImportéEvent = {
        type: 'FournisseurImporté-V1',
        payload: {
          fournisseurs: candidature.fournisseurs.map(({ nom, type }) => ({
            typeFournisseur: Option.match(
              Candidature.CandidatureMapperHelper.mapCsvLabelToTypeFournisseur(type),
            )
              .some((type) => type.formatter())
              .none(() => {
                throw new Error(`Type inconnu (${type})`);
              }),
            nomDuFabricant: nom,
          })),
          évaluationCarboneSimplifiée: candidature.évaluationCarboneSimplifiée,
          identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
          importéLe: notifiéLe,
          importéPar: notifiéPar,
        },
      };

      if (flags.dryRun) {
        console.log(`[DRY-RUN] Publishing ${event.type} for ${identifiantProjet}`);
      } else {
        await publish(`fournisseur|${identifiantProjet}`, event);
        console.log(`Published ${event.type} for ${identifiantProjet}`);
      }
    }
  }
}
