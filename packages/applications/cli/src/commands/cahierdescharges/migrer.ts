import { Command, Flags } from '@oclif/core';

import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { DateTime, Email } from '@potentiel-domain/common';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';

type CahierDesChargesChoisi = {
  identifiantProjet: string;
  email: string | null;
  occurredAt: number;
} & (
  | {
      type: 'initial';
      paruLe: null;
      alternatif: null;
    }
  | {
      type: 'modifié';
      paruLe: AppelOffre.RéférenceCahierDesCharges.DateParutionCahierDesChargesModifié;
      alternatif: boolean;
    }
);
const eventsQuery = `
select format(
    '%s#%s#%s#%s',
    p."appelOffreId",
    p."periodeId",
    p."familleId",
    p."numeroCRE"
) as "identifiantProjet",
payload->>'type' as type,
payload->>'paruLe' as "paruLe",
payload->>'alternatif' as alternatif,
u.email,
es."occurredAt"
from "eventStores" es
inner join projects p on p.id::text = payload->>'projetId'
left join users u on u.id::text = payload->>'choisiPar'
where es.type = 'CahierDesChargesChoisi'
order by es.payload->>'projetId',
es."occurredAt";
`;

export class Migrer extends Command {
  static flags = {
    dryRun: Flags.boolean(),
    projet: Flags.string(),
    dataOnly: Flags.boolean(),
    filesOnly: Flags.boolean(),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Migrer);
    const events = await executeSelect<CahierDesChargesChoisi>(eventsQuery);

    const subscriberCount = await executeSelect<{ count: number }>(
      "select count(*) as count from event_store.subscriber where stream_category='lauréat'",
    );

    if (subscriberCount[0].count > 0 && !flags.dryRun) {
      console.warn("Il existe des subscribers pour 'lauréat'");
      console.log(`delete from event_store.subscriber where stream_category='lauréat'`);
      process.exit(1);
    }

    for (const { identifiantProjet, paruLe, type, alternatif, email, occurredAt } of events) {
      const event: Lauréat.CahierDesChargesChoisiEvent = {
        type: 'CahierDesChargesChoisi-V1',
        payload: {
          cahierDesCharges: AppelOffre.RéférenceCahierDesCharges.bind(
            type === 'initial'
              ? { type }
              : {
                  type,
                  paruLe: paruLe ?? undefined,
                  alternatif: alternatif || undefined,
                },
          ).formatter(),
          modifiéLe: DateTime.convertirEnValueType(new Date(occurredAt)).formatter(),
          identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
          modifiéPar: email
            ? Email.convertirEnValueType(email).formatter()
            : Email.système.formatter(),
        },
      };
      if (flags.dryRun) {
        console.log(event);
      } else {
        await publish(`lauréat|${identifiantProjet}`, event);
      }
    }
  }
}
