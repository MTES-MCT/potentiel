import { Command, Flags } from '@oclif/core';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

const champsCsvFournisseur: Record<Lauréat.Fournisseur.TypeFournisseur.RawType, string> = {
  'module-ou-films': 'Nom du fabricant \n(Modules ou films)',
  cellules: 'Nom du fabricant (Cellules)',
  'plaquettes-silicium': 'Nom du fabricant \n(Plaquettes de silicium (wafers))',
  polysilicium: 'Nom du fabricant \n(Polysilicium)',
  'postes-conversion': 'Nom du fabricant \n(Postes de conversion)',
  structure: 'Nom du fabricant \n(Structure)',
  'dispositifs-stockage-energie': 'Nom du fabricant \n(Dispositifs de stockage de l’énergie *)',
  'dispositifs-suivi-course-soleil':
    'Nom du fabricant \n(Dispositifs de suivi de la course du soleil *)',
  'autres-technologies': 'Nom du fabricant \n(Autres technologies)',
  'dispositif-de-production': 'Nom du fabricant \n(dispositif de production)',
  'dispositif-de-stockage': 'Nom du fabricant \n(Dispositif de stockage)',
  'poste-conversion': 'Nom du fabricant \n(Poste de conversion)',
};

export const mapToDétailsCandidature = (
  payload: Record<string, string>,
): Array<{
  typeFournisseur: Lauréat.Fournisseur.TypeFournisseur.RawType;
  nomDuFabricant: string;
}> => {
  const result = [];

  for (const [key, value] of Object.entries(payload)) {
    for (const [mappedKey, mappedValue] of Object.entries(champsCsvFournisseur)) {
      // on est obligé d'utiliser startsWith car les champs du CSV peuvent prendre un 1, 2, 3...
      if (key.startsWith(mappedValue)) {
        result.push({
          typeFournisseur:
            Lauréat.Fournisseur.TypeFournisseur.convertirEnValueType(mappedKey).formatter(),
          nomDuFabricant: value,
        });
      }
    }
  }

  return result;
};

const récupérerCandidatureEventsEtDonnéesFournisseurs = `
SELECT
    es.stream_id,
    payload->>'identifiantProjet' AS identifiantProjet,
    (
        SELECT jsonb_object_agg(key, value)
        FROM jsonb_each_text(p.details::jsonb)
        WHERE key ILIKE '%Nom du fabricant%'
    ) AS fournisseurs
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

    const candidaturesImportéesEvent = await executeSelect<{
      stream_id: string;
      fournisseurs: Record<string, string>;
      identifiantProjet: string;
    }>(récupérerCandidatureEventsEtDonnéesFournisseurs);

    console.log(
      `${récupérerCandidatureEventsEtDonnéesFournisseurs.length} candidatures importées trouvées`,
    );

    for (const { stream_id, identifiantProjet, fournisseurs } of candidaturesImportéesEvent) {
      const event: Candidature.FournisseursCandidatureImportésEvent = {
        type: 'FournisseursCandidatureImportés-V1',
        payload: {
          identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
          fournisseurs: mapToDétailsCandidature(fournisseurs),
        },
      };

      if (flags.dryRun) {
        console.log(`[DRY-RUN] Publishing ${event.type} for ${stream_id}`);
      } else {
        await publish(stream_id, event);
      }
    }

    // les données fournisseurs n'ont jamais été corrigées lors d'une correction de candidature
    // cf : select distinct json_object_keys(payload->'correctedData') from "eventStores" es where es.type='ProjectDataCorrected';

    process.exit(0);
  }
}
