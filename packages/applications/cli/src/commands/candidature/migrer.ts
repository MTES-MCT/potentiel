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
INNER JOIN json_each_text(p.details) d ON d.key ILIKE '%nom du fabricant%'
    AND trim(lower(d.value)) NOT IN ('','0','#n/a','n/a','na','n.a.','nx','nc','ne s''applique pas','non applicable', 'non concerné','-','--','/','sans objet','s/o','so', 'non pertinent', 'non applicable à ce projet','non disponible','aucun','non','non concern?','_','à définir ultérieurement','b','non défini','non renseigné','non précisé', 'non connu à ce jour', 'non connu a ce jour')
WHERE es.type = 'CandidatureImportée-V1'
GROUP BY es.stream_id,
    payload->>'identifiantProjet', payload->>'evaluationCarboneSimplifiée'
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
          typeFournisseur: mapCsvLabelToTypeFournisseur(type).formatter(),
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
            typeFournisseur: Option.match(mapCsvLabelToTypeFournisseur(type))
              .some((type) => type.formatter())
              .none(() => {
                throw new Error(`Type inconnu (${type})`);
              }),
            nomDuFabricant: nom,
          })),
          évaluationCarboneSimplifiée: Number(candidature.évaluationCarboneSimplifiée),
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

// Etat actuel des colonnes du CSV
const champsCsvFournisseur: Record<Lauréat.Fournisseur.TypeFournisseur.RawType, string> = {
  'module-ou-films': 'Modules ou films',
  cellules: 'Cellules',
  'plaquettes-silicium': 'Plaquettes de silicium (wafers)',
  polysilicium: 'Polysilicium',
  'postes-conversion': 'Postes de conversion',
  structure: 'Structure',
  'dispositifs-stockage-energie': 'Dispositifs de stockage de l’énergie *',
  'dispositifs-suivi-course-soleil': 'Dispositifs de suivi de la course du soleil *',
  'autres-technologies': 'Autres technologies',
  'dispositif-de-production': 'dispositif de production',
  'dispositif-de-stockage': 'Dispositif de stockage',
  'poste-conversion': 'Poste de conversion',
};

// on garde le sens "type" -> "label CSV" ci-dessus pour bénéficier du typage exhaustif
// mais on l'inverse pour l'utilisation
const labelCsvToTypeFournisseur = Object.fromEntries(
  Object.entries(champsCsvFournisseur).map(([key, value]) => [value, key]),
) as Record<string, Lauréat.Fournisseur.TypeFournisseur.RawType>;

const regex = /Nom du fabricant\s?\s\((?<type>.*)\)\s?\d?/;
const mapCsvLabelToTypeFournisseur = (typeValue: string) => {
  const type = typeValue.match(regex)?.groups?.type;
  if (type && labelCsvToTypeFournisseur[type]) {
    return Lauréat.Fournisseur.TypeFournisseur.convertirEnValueType(
      labelCsvToTypeFournisseur[type],
    );
  }
  throw new Error(`Type inconnu (${type})`);
};
