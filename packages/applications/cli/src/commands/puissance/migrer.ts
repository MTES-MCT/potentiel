import { extname } from 'node:path';
import assert from 'node:assert';

import { Command, Flags } from '@oclif/core';
import { contentType } from 'mime-types';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { match } from 'ts-pattern';

import { Puissance, Lauréat } from '@potentiel-domain/laureat';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Candidature } from '@potentiel-domain/candidature';
import { executeSelect, killPool } from '@potentiel-libraries/pg-helpers';
import { DateTime, Email } from '@potentiel-domain/common';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { upload, copyFile, fileExists } from '@potentiel-libraries/file-storage';
import { DocumentProjet } from '@potentiel-domain/document';
import { IdentifiantProjet } from '@potentiel-domain/projet';

type ModificationRequest = {
  identifiantProjet: string;
  puissance: number;
} & (
  | {
      type: 'ModificationRequested' | 'ModificationReceived';
      justification: string;
      authority: 'dreal' | 'dgec';
      requestedOn: number;
      requestedBy: string;
      cancelledOn?: number;
      cancelledBy?: string;
      acceptedOn?: number;
      acceptedBy?: string;
      rejectedOn?: number;
      rejectedBy?: string;
      abandonedOn: number;
      expectedStatus:
        | 'en instruction'
        | 'acceptée'
        | 'rejetée'
        | 'envoyée'
        | 'annulée'
        | 'information validée';
    }
  | {
      type: 'ProjectDataCorrected';
      correctedOn: number;
      correctedBy: string;
    }
);

const queryModifications = `
select format(
        '%s#%s#%s#%s',
        p."appelOffreId",
        p."periodeId",
        p."familleId",
        p."numeroCRE"
    ) as "identifiantProjet",
    COALESCE(
        es.payload->'correctedData'->>'puissance',
        es.payload->>'puissance'
    ) as "puissance",
    es.payload->>'justification' as "justification",
    es.payload->>'authority' as "authority",
    es.type,
    es."occurredAt" as "requestedOn",
    requester.email as "requestedBy",
    cancel."occurredAt" as "cancelledOn",
    canceller.email as "cancelledBy",
    accept."occurredAt" as "acceptedOn",
    accepter.email as "acceptedBy",
    reject."occurredAt" as "rejectedOn",
    rejecter.email as "rejectedBy",
    es."occurredAt" as "correctedOn",
    correcter.email as "correctedBy",
    mr.status "expectedStatus",
    p."abandonedOn"
from "eventStores" es
    inner join projects p on p.id::text = es.payload->>'projectId'
    left join users requester on requester.id::text = es.payload->>'requestedBy'
    
    left join "eventStores" cancel on cancel.type = 'ModificationRequestCancelled'
      and cancel.payload->>'modificationRequestId' = es.payload->>'modificationRequestId'
    left join users canceller on canceller.id::text = cancel.payload->>'cancelledBy'
    
    left join "eventStores" accept on accept.type = 'ModificationRequestAccepted'
      and accept.payload->>'modificationRequestId' = es.payload->>'modificationRequestId'
    left join users accepter on accepter.id::text = accept.payload->>'acceptedBy'
    
    left join "eventStores" reject on reject.type = 'ModificationRequestRejected'
      and reject.payload->>'modificationRequestId' = es.payload->>'modificationRequestId'
    left join users rejecter on rejecter.id::text = reject.payload->>'rejectedBy'
    
    left join "modificationRequests" mr on es.payload->>'modificationRequestId' is not null
      and mr.id::text = es.payload->>'modificationRequestId'
    
    left join users correcter on es.type = 'ProjectDataCorrected'
      and correcter.id::text = es.payload->>'correctedBy'
where ((
        es.type in ('ModificationRequested', 'ModificationReceived')
        and es.payload->>'type' = 'puissance'
          -- ignore data inconsistency
      AND es.payload->>'modificationRequestId' not in (
          'bc215b18-6c95-42be-b0eb-a2d7dde95162',
          '15db1d28-d9c7-4237-88fc-3fc00eb7cd65',
          '65594616-ac86-4ddd-84ce-bad1d352fadc'
      )
    )
    OR (
        es.type = 'ProjectDataCorrected'
        and es.payload->'correctedData'->>'puissance' is not null
    ))  
order by es."occurredAt";
`;

export class Migrer extends Command {
  static flags = {
    dryRun: Flags.boolean(),
    projet: Flags.string(),
  };

  async finally() {
    await killPool();
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Migrer);
    const { items: lauréats } = await listProjection<Lauréat.LauréatEntity>('lauréat');
    const { items: candidatures } =
      await listProjection<Candidature.CandidatureEntity>('candidature');

    const subscriberCount = await executeSelect<{ count: number }>(
      "select count(*) as count from event_store.subscriber where stream_category='puissance'",
    );

    if (subscriberCount[0].count > 0 && !flags.dryRun) {
      console.warn("Il existe des subscribers pour 'puissance'");
      console.log(`delete from event_store.subscriber where stream_category='puissance'`);
      process.exit(1);
    }

    console.log(`${candidatures.length} candidatures à importer`);

    const eventsPerProjet: Record<string, Puissance.PuissanceEvent[]> = {};

    for (const lauréat of lauréats) {
      const candidature = candidatures.find(
        (candidature) => candidature.identifiantProjet === lauréat.identifiantProjet,
      );
      if (!candidature) {
        console.warn('candidature non trouvée', lauréat.identifiantProjet);
        continue;
      }
      const puissanceImportée: Puissance.PuissanceImportéeEvent = {
        type: 'PuissanceImportée-V1',
        payload: {
          puissance: candidature.puissanceProductionAnnuelle,
          identifiantProjet: candidature.identifiantProjet,
          importéeLe: candidature.notification!.notifiéeLe,
        },
      };
      eventsPerProjet[candidature.identifiantProjet] = [puissanceImportée];
    }

    const modifications = await executeSelect<ModificationRequest>(queryModifications);
    console.log(`${modifications.length} modifications trouvées`);
    for (const modification of modifications) {
      if (!eventsPerProjet[modification.identifiantProjet]) {
        console.warn(`Pas d'import trouvé pour ${modification.identifiantProjet}`);
        continue;
      }

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        modification.identifiantProjet,
      ).formatter();

      if (modification.type === 'ProjectDataCorrected') {
        const adminChange: Puissance.PuissanceModifiéeEvent = {
          type: 'PuissanceModifiée-V1',
          payload: {
            identifiantProjet,
            modifiéeLe: formatDate(modification.correctedOn),
            modifiéePar: Email.convertirEnValueType(modification.correctedBy).formatter(),
            puissance: Number(modification.puissance),
          },
        };
        eventsPerProjet[modification.identifiantProjet].push(adminChange);
        continue;
      }

      const requestedOn = formatDate(modification.requestedOn);

      const request: Puissance.ChangementPuissanceDemandéEvent = {
        type: 'ChangementPuissanceDemandé-V1',
        payload: {
          puissance: Number(modification.puissance),
          demandéLe: requestedOn,
          demandéPar: Email.convertirEnValueType(modification.requestedBy).formatter(),
          autoritéCompétente: modification.authority === 'dgec' ? 'dgec-admin' : 'dreal',
          identifiantProjet,
          raison: cleanInput(modification.justification),
          pièceJustificative: { format: 'application/pdf' }, // TODO
        },
      };

      if (modification.type === 'ModificationReceived') {
        if (modification.expectedStatus !== 'information validée') {
          console.log('modification non enregistrée', modification);
        }
        const informationEnregistrée: Puissance.ChangementPuissanceEnregistréEvent = {
          type: 'ChangementPuissanceEnregistré-V1',
          payload: {
            identifiantProjet,
            puissance: Number(modification.puissance),
            enregistréLe: requestedOn,
            enregistréPar: Email.convertirEnValueType(modification.requestedBy).formatter(),
            raison: cleanInput(modification.justification),
            pièceJustificative: { format: 'application/pdf' }, // TODO
          },
        };
        eventsPerProjet[modification.identifiantProjet].push(informationEnregistrée);
      } else if (modification.acceptedBy && modification.acceptedOn) {
        assert(modification.expectedStatus === 'acceptée', 'modification non acceptée');

        const acceptation: Puissance.ChangementPuissanceAccordéEvent = {
          type: 'ChangementPuissanceAccordé-V1',
          payload: {
            identifiantProjet,
            accordéLe: formatDate(modification.acceptedOn),
            accordéPar: Email.convertirEnValueType(modification.acceptedBy).formatter(),
            nouvellePuissance: Number(modification.puissance),
            réponseSignée: { format: 'application/pdf' }, // TODO
          },
        };
        eventsPerProjet[modification.identifiantProjet].push(request, acceptation);
      } else if (modification.rejectedBy && modification.rejectedOn) {
        assert(modification.expectedStatus === 'rejetée', 'modification non rejetée');
        const rejet: Puissance.ChangementPuissanceRejetéEvent = {
          type: 'ChangementPuissanceRejeté-V1',
          payload: {
            identifiantProjet,
            rejetéLe: formatDate(modification.rejectedOn),
            rejetéPar: Email.convertirEnValueType(modification.rejectedBy).formatter(),
            réponseSignée: {
              format: 'application/pdf', // TODO
            },
          },
        };
        eventsPerProjet[modification.identifiantProjet].push(request, rejet);
      } else if (modification.cancelledBy && modification.cancelledOn) {
        assert(modification.expectedStatus === 'annulée', 'modification non annulée');
        eventsPerProjet[modification.identifiantProjet].push(request, {
          type: 'ChangementPuissanceAnnulé-V1',
          payload: {
            identifiantProjet,
            annuléLe: formatDate(modification.cancelledOn),
            annuléPar: Email.convertirEnValueType(modification.cancelledBy).formatter(),
          },
        });
      } else {
        assert(
          modification.expectedStatus === 'envoyée' ||
            modification.expectedStatus === 'en instruction',
          'modification non envoyé/en instruction',
        );
        eventsPerProjet[modification.identifiantProjet].push(request);

        if (modification.abandonedOn > 0) {
          eventsPerProjet[modification.identifiantProjet].push({
            type: 'ChangementPuissanceSupprimé-V1',
            payload: {
              identifiantProjet: IdentifiantProjet.convertirEnValueType(
                modification.identifiantProjet,
              ).formatter(),
              suppriméLe: formatDate(modification.abandonedOn),
              suppriméPar: Email.system().formatter(),
            },
          });
          console.log(`🚮 Demande automatiquement supprimée pour ${identifiantProjet}`);
        }
      }
    }

    if (flags.projet && flags.dryRun) {
      console.log(
        eventsPerProjet[flags.projet].sort((a, b) =>
          getEventDate(a).localeCompare(getEventDate(b)),
        ),
      );
      return;
    }

    const eventsStats: Record<string, number> = {};

    for (const [identifiantProjet, events] of Object.entries(eventsPerProjet)) {
      console.log();
      console.log(identifiantProjet);
      // console.log(identifiantProjet, events.map((ev) => ev.type).join(', '));
      for (const event of events.sort((a, b) => getEventDate(a).localeCompare(getEventDate(b)))) {
        if (flags.dryRun) {
          console.log(event);
        } else {
          await publish(`puissance|${identifiantProjet}`, event);
        }
        eventsStats[event.type] ??= 0;
        eventsStats[event.type]++;
      }
    }
    console.log(eventsStats);

    console.log('All events published.');
    console.log('Migrating files...');

    // TODO décision de justice à migrer

    // fichiers obligatoires:
    // - refus toujours
    // - accord obligatoire si pas une décision de justice
    // - demander toujours obligatoire

    // TODO migration fichiers
    // for (const modification of modifications) {
    //   await migrateFile(
    //     modification.identifiantProjet,
    //     modification.requestFile,
    //     Puissance.TypeDocumentPuissance.pièceJustificative,
    //     DateTime.convertirEnValueType(new Date(modification.requestedOn)),
    //     modification.status !== 'information validée', // ?
    //     flags.dryRun,
    //   );
    //   if (modification.status === 'acceptée') {
    //     await migrateFile(
    //       modification.identifiantProjet,
    //       modification.responseFile,
    //       Puissance.TypeDocumentPuissance.changementAccordé,
    //       DateTime.convertirEnValueType(new Date(modification.respondedOn)),
    //       true, // ?
    //       flags.dryRun,
    //     );
    //   }
    //   if (modification.status === 'rejetée') {
    //     await migrateFile(
    //       modification.identifiantProjet,
    //       modification.responseFile,
    //       Puissance.TypeDocumentPuissance.changementRejeté,
    //       DateTime.convertirEnValueType(new Date(modification.respondedOn)),
    //       true, // ?
    //       flags.dryRun,
    //     );
    //   }
    // }
  }
}

const getEventDate = (event: Puissance.PuissanceEvent) =>
  match(event)
    .with({ type: 'PuissanceImportée-V1' }, ({ payload }) => payload.importéeLe)
    .with({ type: 'PuissanceModifiée-V1' }, ({ payload }) => payload.modifiéeLe)
    .with({ type: 'ChangementPuissanceEnregistré-V1' }, ({ payload }) => payload.enregistréLe)
    .with({ type: 'ChangementPuissanceDemandé-V1' }, ({ payload }) => payload.demandéLe)
    .with({ type: 'ChangementPuissanceAnnulé-V1' }, ({ payload }) => payload.annuléLe)
    .with({ type: 'ChangementPuissanceAccordé-V1' }, ({ payload }) => payload.accordéLe)
    .with({ type: 'ChangementPuissanceRejeté-V1' }, ({ payload }) => payload.rejetéLe)
    .with({ type: 'ChangementPuissanceSupprimé-V1' }, ({ payload }) => payload.suppriméLe)
    .exhaustive();

const formatDate = (date: number) => DateTime.convertirEnValueType(new Date(date)).formatter();
const cleanInput = (str: string) =>
  str?.replaceAll(/\t/g, ' ').replaceAll(/\r\n/g, '\\n').replaceAll('"', '\\"');

const getReplacementDoc = async (text: string) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const textSize = 14;

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
  const textHeight = helveticaFont.heightAtSize(textSize);

  page.drawText(text, {
    x: page.getWidth() / 2 - textWidth / 2,
    y: (2 / 3) * page.getHeight() - textHeight / 2,
    size: textSize,
    font: helveticaFont,
  });

  const pdfBytes = await pdfDoc.save();

  return new Blob([pdfBytes], { type: 'application/pdf' }).stream();
};

const migrateFile = async (
  identifiantProjet: string,
  file: string | undefined,
  typeDocument: Puissance.TypeDocumentPuissance.ValueType,
  date: DateTime.ValueType,
  createOnMissing: boolean,
  dryRun: boolean,
) => {
  const format = file ? contentType(extname(file)) : 'application/pdf';
  if (!format) {
    throw new Error('Unknown format', { cause: file });
  }
  const key = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    typeDocument.formatter(),
    date.formatter(),
    format,
  ).formatter();

  if (file) {
    if (dryRun) {
      const exists = await fileExists(
        file.replace('S3:potentiel-production:', '').replace('S3:production-potentiel:', ''),
      );
      if (!exists) {
        console.warn(
          `📁 Fichier non trouvé pour ${identifiantProjet} - ${typeDocument.formatter()}`,
        );
      }
    } else {
      try {
        await copyFile(
          file.replace('S3:potentiel-production:', '').replace('S3:production-potentiel:', ''),
          key,
        );
      } catch (e) {
        console.warn(
          `📁 La copie du fichier a échouée pour ${identifiantProjet} - ${typeDocument.formatter()}`,
        );
      }
    }
  } else if (createOnMissing) {
    console.warn(
      `📁 Pas de fichier trouvé pour ${identifiantProjet} - ${typeDocument.formatter()}`,
    );
    if (!dryRun) {
      await upload(
        key,
        await getReplacementDoc(
          "Fichier généré automatiquement en l'absence de pièces justificatives",
        ),
      );
    }
  }
};
