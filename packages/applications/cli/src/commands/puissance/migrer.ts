import { extname } from 'node:path';

import { Command, Flags } from '@oclif/core';
import { contentType } from 'mime-types';
import { PDFDocument, StandardFonts } from 'pdf-lib';

import { Puissance, Lauréat } from '@potentiel-domain/laureat';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Candidature } from '@potentiel-domain/candidature';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { DateTime, Email } from '@potentiel-domain/common';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { upload, copyFile, fileExists } from '@potentiel-libraries/file-storage';
import { DocumentProjet } from '@potentiel-domain/document';
import { IdentifiantProjet } from '@potentiel-domain/projet';

type ModificationRequest = {
  identifiantProjet: string;
  status: 'en instruction' | 'acceptée' | 'rejetée' | 'envoyée' | 'annulée' | 'information validée';
  puissance: number;
  justification: string;
  requestedOn: number;
  email: string;
  cancelledOn: number;
  cancelledBy: string;
  respondedOn: number;
  respondedBy: string;
  requestFile: string;
  responseFile: string;
  abandonedOn: number;
  authority: 'dreal' | 'dgec';
};

const queryModifications = `
 select format(
        '%s#%s#%s#%s',
        p."appelOffreId",
        p."periodeId",
        p."familleId",
        p."numeroCRE"
    ) as "identifiantProjet",
    mr.status,
    mr.puissance,
    mr.justification,
    mr."requestedOn",
    u.email,
    mr."cancelledOn",
    mr."respondedOn",
    u_cancel.email as "cancelledBy",
    u_respond.email as "respondedBy",
    f."storedAt" as "requestFile",
    fr."storedAt" as "responseFile",
    p."abandonedOn",
    mr.authority
from "modificationRequests" mr
    inner join projects p on p.id = mr."projectId"
    left join users u on u.id = mr."userId"
    left join users u_cancel on u_cancel.id = mr."cancelledBy"
    left join users u_respond on u_respond.id = mr."respondedBy"
    left join files f on f.id = mr."fileId"
    left join files fr on fr.id = mr."responseFileId"
where 
        mr.type = 'puissance'
order by mr."requestedOn";
    `;

const queryModificationEvent = `
select format(
        '%s#%s#%s#%s',
        p."appelOffreId",
        p."periodeId",
        p."familleId",
        p."numeroCRE"
    ) as "identifiantProjet",
    es."occurredAt",
    u.email as "requestedBy",
    es.payload->'puissance' as "puissance",
    es.payload->'fileId' as "fileId",
    es.payload->'authority' as "authority"
from "eventStores" es
    inner join users u on u.id = (es."payload"->>'requestedBy')::uuid
    inner join projects p on p.id = (es.payload->>'projectId')::uuid
where es.type='ModificationReceived' and es.payload->>'type' = 'puissance'
and p.id = 'b6f43d4b-5fcb-4b43-9659-51fb27c5fd7c';
`;

const queryCorrectionsAdminEvents = `
select format(
        '%s#%s#%s#%s',
        p."appelOffreId",
        p."periodeId",
        p."familleId",
        p."numeroCRE"
    ) as "identifiantProjet",
    es.payload->'correctedData'->>'puissance' as "puissance",
    u.email as "correctedBy",
    es."createdAt" as "correctedOn"
from "eventStores" es
    inner join users u on u.id = (es."payload"->>'correctedBy')::uuid
    inner join projects p on p.id = (es.payload->>'projectId')::uuid
where es.type = 'ProjectDataCorrected'
    and es.payload->'correctedData'->>'puissance' is not null
    and p.id IN 
    (
    -- TODO POURQUOI PAS PLUS ?? 
    '4156905c-61ce-40d2-a4f0-9e826b083deb',
    'b06e9de0-8587-11ea-81a5-9d1e21fb9b29', 
    'b0696dc0-8587-11ea-81a5-9d1e21fb9b29', 
    '8c0a5516-2828-48e2-97ae-a162c7cf984f', 
    '870e2292-00f0-4629-8ba7-7c638620cec0', 
    'dde11849-0d79-4a37-8774-35f341767990' 
    )
order by es."createdAt";
`;

export class Migrer extends Command {
  static flags = {
    dryRun: Flags.boolean(),
  };

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

      const requestedOn = DateTime.convertirEnValueType(
        new Date(modification.requestedOn),
      ).formatter();
      const formatRequestFile =
        modification.requestFile && contentType(extname(modification.requestFile));
      const formatResponseFile =
        modification.responseFile && contentType(extname(modification.responseFile));
      const request: Puissance.ChangementPuissanceDemandéEvent = {
        type: 'ChangementPuissanceDemandé-V1',
        payload: {
          puissance: modification.puissance,
          demandéLe: requestedOn,
          demandéPar: modification.email,
          autoritéCompétente: modification.authority, //=== 'dgec' ? 'admin' : 'dreal',
          identifiantProjet,
          raison: cleanInput(modification.justification),
          pièceJustificative: { format: formatRequestFile || 'application/pdf' },
        },
      };

      switch (modification.status) {
        case 'acceptée':
          const acceptation: Puissance.ChangementPuissanceAccordéEvent = {
            type: 'ChangementPuissanceAccordé-V1',
            payload: {
              identifiantProjet,
              accordéLe: DateTime.convertirEnValueType(
                new Date(modification.respondedOn),
              ).formatter(),
              accordéPar: modification.respondedBy,
              nouvellePuissance: modification.puissance,
              réponseSignée: { format: formatResponseFile || 'application/pdf' }, // ?
            },
          };
          eventsPerProjet[modification.identifiantProjet].push(request, acceptation);
          break;

        case 'rejetée':
          const rejet: Puissance.ChangementPuissanceRejetéEvent = {
            type: 'ChangementPuissanceRejeté-V1',
            payload: {
              identifiantProjet,
              rejetéLe: DateTime.convertirEnValueType(
                new Date(modification.respondedOn),
              ).formatter(),
              rejetéPar: modification.respondedBy,
              réponseSignée: {
                format: formatResponseFile || 'application/pdf', // ?
              },
            },
          };
          eventsPerProjet[modification.identifiantProjet].push(request, rejet);
          break;

        case 'annulée':
          eventsPerProjet[modification.identifiantProjet].push(request, {
            type: 'ChangementPuissanceAnnulé-V1',
            payload: {
              identifiantProjet,
              annuléLe: DateTime.convertirEnValueType(
                new Date(modification.cancelledOn),
              ).formatter(),
              annuléPar: modification.cancelledBy,
            },
          });
          break;
        case 'envoyée':
        case 'en instruction':
          eventsPerProjet[modification.identifiantProjet].push(request);

          if (modification.abandonedOn > 0) {
            eventsPerProjet[modification.identifiantProjet].push({
              type: 'ChangementPuissanceSupprimé-V1',
              payload: {
                identifiantProjet: IdentifiantProjet.convertirEnValueType(
                  modification.identifiantProjet,
                ).formatter(),
                suppriméLe: DateTime.convertirEnValueType(
                  new Date(modification.abandonedOn),
                ).formatter(),
                suppriméPar: Email.system().formatter(),
              },
            });
            console.log(`🚮 Demande automatiquement supprimée pour ${identifiantProjet}`);
          }
          break;
        case 'information validée':
          const informationEnregistrée: Puissance.ChangementPuissanceEnregistréEvent = {
            type: 'ChangementPuissanceEnregistré-V1',
            payload: {
              identifiantProjet,
              puissance: modification.puissance,
              enregistréLe: requestedOn,
              enregistréPar: modification.email,
              raison: cleanInput(modification.justification),
              pièceJustificative: { format: formatRequestFile || 'application/pdf' },
            },
          };
          eventsPerProjet[modification.identifiantProjet].push(informationEnregistrée);
          break;

        default: {
          throw new Error(`UNHANDLED STATUS ${modification.status}`);
        }
      }
    }

    /**
     * Cas particulier, events existants mais non répercutés dans la projection modificationRequests
     */

    const [modificationEvent] = await executeSelect<{
      identifiantProjet: string;
      occurredAt: string;
      requestedBy: string;
      puissance: number;
    }>(queryModificationEvent);

    eventsPerProjet[modificationEvent.identifiantProjet].push({
      type: 'ChangementPuissanceEnregistré-V1',
      payload: {
        enregistréLe: DateTime.convertirEnValueType(modificationEvent.occurredAt).formatter(),
        enregistréPar: Email.convertirEnValueType(modificationEvent.requestedBy).formatter(),
        identifiantProjet: IdentifiantProjet.convertirEnValueType(
          modificationEvent.identifiantProjet,
        ).formatter(),
        puissance: modificationEvent.puissance,
      },
    });

    /** Changements par admin - cherry pick car la majorité des changements sont liés au bug de correction candidature */

    const correctionEvents = await executeSelect<{
      identifiantProjet: string;
      correctedOn: string;
      correctedBy: string;
      puissance: number;
    }>(queryCorrectionsAdminEvents);

    for (const event of correctionEvents) {
      eventsPerProjet[event.identifiantProjet].push({
        type: 'PuissanceModifiée-V1',
        payload: {
          modifiéeLe: DateTime.convertirEnValueType(event.correctedOn).formatter(),
          modifiéePar: Email.convertirEnValueType(event.correctedBy).formatter(),
          identifiantProjet: IdentifiantProjet.convertirEnValueType(
            event.identifiantProjet,
          ).formatter(),
          puissance: event.puissance,
        },
      });
    }

    const eventsStats: Record<string, number> = {};

    for (const [identifiantProjet, events] of Object.entries(eventsPerProjet)) {
      // console.log(identifiantProjet, events.map((ev) => ev.type).join(', '));
      for (const event of events) {
        if (!flags.dryRun) {
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

    process.exit(0);
  }
}

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
