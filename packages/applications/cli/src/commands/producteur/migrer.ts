import { extname } from 'node:path';

import { contentType } from 'mime-types';
import { Command, Flags } from '@oclif/core';

import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { DocumentProjet } from '@potentiel-domain/document';
import { copyFile } from '@potentiel-libraries/file-storage';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';

export class Migrer extends Command {
  static flags = {
    dryRun: Flags.boolean(),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Migrer);

    const subscriberCount = await executeSelect<{ count: number }>(
      "select count(*) as count from event_store.subscriber where stream_category='producteur'",
    );

    if (subscriberCount[0].count > 0 && !flags.dryRun) {
      console.warn("Il existe des subscribers pour 'producteur'");
      process.exit(1);
    }

    const eventsPerProjet: Map<
      string,
      Array<
        | Lauréat.Producteur.ChangementProducteurEnregistréEvent
        | Lauréat.Producteur.ProducteurImportéEvent
      >
    > = new Map();

    const { items: lauréats } = await listProjection<
      Lauréat.LauréatEntity,
      Candidature.CandidatureEntity
    >('lauréat', {
      join: {
        entity: 'candidature',
        on: 'identifiantProjet',
      },
    });

    lauréats.reduce(
      (
        eventsPerProjet,
        { identifiantProjet, candidature: { nomCandidat }, notifiéLe, notifiéPar },
      ) => {
        const producteurImporté: Lauréat.Producteur.ProducteurImportéEvent = {
          type: 'ProducteurImporté-V1',
          payload: {
            producteur: nomCandidat,
            identifiantProjet,
            importéLe: notifiéLe,
            importéPar: notifiéPar,
          },
        };

        eventsPerProjet.set(identifiantProjet, [
          ...(eventsPerProjet.get(identifiantProjet) ?? []),
          producteurImporté,
        ]);

        return eventsPerProjet;
      },
      eventsPerProjet,
    );

    const queryPayloads = `
      select concat(p."appelOffreId", '#', p."periodeId", '#', p."familleId", '#', p."numeroCRE") as "identifiantProjet",
             es.payload->>'producteur' as "producteur",
             (SELECT to_char (es."occurredAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) as "enregistréLe",
             u."email" as "enregistréPar",
             es.payload->>'justification' as "raison",
             replace(replace(f."storedAt", 'S3:potentiel-production:', ''), 'S3:production-potentiel:', '') as "filePath"
      from "eventStores" es
      inner join projects p on es.payload->>'projectId' = p.id::text
      inner join users u on es.payload->>'requestedBy' = u.id::text
      inner join files f on es.payload->>'fileId' = f.id::text
      where es.type like 'Modification%'
      and   payload->>'type' = 'producteur'
      order by es."occurredAt" asc
    `;

    type Payload = Lauréat.Producteur.ChangementProducteurEnregistréEvent['payload'];

    const payloads = await executeSelect<
      Omit<Payload, 'pièceJustificative'> & { filePath: string }
    >(queryPayloads);

    payloads.reduce((eventsPerProjet, { filePath, ...payload }) => {
      const changementProducteurEnregistré: Lauréat.Producteur.ChangementProducteurEnregistréEvent =
        {
          type: 'ChangementProducteurEnregistré-V1',
          payload: {
            ...payload,
            pièceJustificative: {
              format: contentType(extname(filePath)) || 'application/pdf',
            },
          },
        };

      eventsPerProjet.set(payload.identifiantProjet, [
        ...(eventsPerProjet.get(payload.identifiantProjet) ?? []),
        changementProducteurEnregistré,
      ]);

      return eventsPerProjet;
    }, eventsPerProjet);

    const eventsStats: Record<string, number> = {};

    for (const [identifiantProjet, events] of eventsPerProjet) {
      for (const event of events) {
        if (!flags.dryRun) {
          await publish(`producteur|${identifiantProjet}`, event);
        }
        eventsStats[event.type] ??= 0;
        eventsStats[event.type]++;
      }
    }
    console.log(eventsStats);

    console.log('All events published.');

    const filesPerProjet: Map<
      string,
      Array<{ from: string; to: DocumentProjet.ValueType }>
    > = payloads.reduce((filesPerProjet, { identifiantProjet, filePath, enregistréLe }) => {
      filesPerProjet.set(identifiantProjet, [
        ...(filesPerProjet.get(identifiantProjet) ?? []),
        {
          from: filePath,
          to: DocumentProjet.convertirEnValueType(
            identifiantProjet,
            Lauréat.Producteur.TypeDocumentProducteur.pièceJustificative.formatter(),
            enregistréLe,
            contentType(extname(filePath)) || 'application/pdf',
          ),
        },
      ]);

      return filesPerProjet;
    }, new Map());

    const filesStats: Record<string, number> = {};

    for (const [identifiantProjet, files] of filesPerProjet) {
      for (const { from, to } of files) {
        if (!flags.dryRun) {
          try {
            await copyFile(from, to.formatter());
          } catch (error) {
            console.error(error);
          }
        }
        filesStats[identifiantProjet] ??= 0;
        filesStats[identifiantProjet]++;
      }
    }
    console.log(filesStats);

    console.log('All files copied.');
  }
}
