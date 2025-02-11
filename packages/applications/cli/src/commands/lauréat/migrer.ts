import { Command, Flags } from '@oclif/core';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/laureat';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

const récupérerLauréatNotifiéEvents = `
select es.stream_id,
    jsonb_set(
        jsonb_set(
            es.payload,
            '{nomProjet}',
            to_jsonb(cand.value->>'nomProjet')
        ),
        '{localité}',
        jsonb_build_object(
            'adresse1',
            cand.value->>'localité.adresse1',
            'adresse2',
            cand.value->>'localité.adresse2',
            'commune',
            cand.value->>'localité.commune',
            'département',
            cand.value->>'localité.département',
            'région',
            cand.value->>'localité.région',
            'codePostal',
            cand.value->>'localité.codePostal'
        )
    ) as payload
from event_store.event_stream es
    inner join domain_views.projection cand on REPLACE(es.stream_id, 'lauréat', 'candidature') = cand.key
where es.type = 'LauréatNotifié-V1';
`;

type ModificationProjet = {
  identifiantProjet: string;
  correctedData: Partial<
    Record<'nomProjet' | 'adresseProjet' | 'communeProjet' | 'codePostal', string>
  >;
  occurredAt: string;
  correctedBy: string;
};

const récupérerModificationsProjetEvent = `
select format(
  '%s#%s#%s#%s',
  p."appelOffreId",
  p."periodeId",
  p."familleId",
  p."numeroCRE"
) as "identifiantProjet",
payload->'correctedData' as "correctedData",
es."occurredAt",
u.email as "correctedBy"
from "eventStores" es
inner join projects p on p.id =(payload->>'projectId')::uuid
inner join users u on u.id =(es.payload->>'correctedBy')::uuid
where type = 'ProjectDataCorrected' and p.classe='Classé'
  and (
     payload->'correctedData'->>'nomProjet' is not null
  OR payload->'correctedData'->>'adresseProjet' is not null
  OR payload->'correctedData'->>'communeProjet' is not null
  OR payload->'correctedData'->>'codePostal' is not null
);
`;

export class Migrer extends Command {
  static flags = {
    dryRun: Flags.boolean(),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Migrer);

    const subscriberCount = await executeSelect<{ count: number }>(
      "select count(*) as count from event_store.subscriber where stream_category='lauréat'",
    );
    if (subscriberCount[0].count > 0 && !flags.dryRun) {
      console.warn("Il existe des subscribers pour 'lauréat'");
      process.exit(1);
    }

    // Récupérer les valeurs à la candidature.
    // NB:  on ignore les corrections de candidature, on insère la donnée telle qu'elle est actuellement
    const lauréatNotifiéEvents = await executeSelect<
      Pick<Lauréat.NomEtLocalitéLauréatImportésEvent, 'payload'> & { stream_id: string }
    >(récupérerLauréatNotifiéEvents);

    console.log(`${lauréatNotifiéEvents.length} lauréats trouvés`);

    for (const { payload, stream_id } of lauréatNotifiéEvents) {
      const event: Lauréat.NomEtLocalitéLauréatImportésEvent = {
        type: 'NomEtLocalitéLauréatImportés-V1',
        payload,
      };
      if (flags.dryRun) {
        console.log(`[DRY-RUN] Publishing ${event.type} for ${stream_id}`);
      } else {
        await publish(stream_id, event);
      }
    }

    // Récupérer les modifications de projet
    const modifications = await executeSelect<ModificationProjet>(
      récupérerModificationsProjetEvent,
    );

    console.log(`${modifications.length} modifications trouvées`);

    for (const { identifiantProjet, correctedData, correctedBy, occurredAt } of modifications) {
      const valeurCandidature = lauréatNotifiéEvents.find(
        (l) => l.stream_id === `lauréat|${identifiantProjet}`,
      );
      if (!valeurCandidature) {
        console.log('Valeur candidature non trouvée ' + identifiantProjet, correctedData);
        continue;
      }
      const event: Lauréat.LauréatModifiéEvent = {
        type: 'LauréatModifié-V1',
        payload: {
          identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
          localité: valeurCandidature.payload.localité,
          nomProjet: valeurCandidature.payload.nomProjet,
          modifiéLe: DateTime.convertirEnValueType(occurredAt).formatter(),
          modifiéPar: Email.convertirEnValueType(correctedBy).formatter(),
        },
      };
      if (correctedData.nomProjet) {
        event.payload.nomProjet = correctedData.nomProjet;
      }
      if (correctedData.adresseProjet) {
        const [adresse1, ...adresse2] = correctedData.adresseProjet.split('\n');
        event.payload.localité.adresse1 = adresse1;
        event.payload.localité.adresse2 = adresse2.join('\n');
      }
      if (correctedData.codePostal) {
        event.payload.localité.codePostal = correctedData.codePostal;
      }
      if (correctedData.communeProjet) {
        event.payload.localité.commune = correctedData.communeProjet;
      }

      if (flags.dryRun) {
        console.log(`[DRY-RUN] Publishing ${event.type} for ${identifiantProjet}`);
      } else {
        await publish(`lauréat|${identifiantProjet}`, event);
      }
    }
    process.exit(0);
  }
}
