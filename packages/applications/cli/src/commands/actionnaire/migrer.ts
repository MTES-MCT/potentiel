import { extname } from 'node:path';

import { Command, Flags } from '@oclif/core';
import { contentType } from 'mime-types';
import { PDFDocument, StandardFonts } from 'pdf-lib';

import { Actionnaire, Lauréat } from '@potentiel-domain/laureat';
import { listProjection } from '@potentiel-infrastructure/pg-projections';
import { Candidature } from '@potentiel-domain/candidature';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { upload, copyFile } from '@potentiel-libraries/file-storage';
import { DocumentProjet } from '@potentiel-domain/document';

type ModificationRequest = {
  identifiantProjet: string;
  status: 'en instruction' | 'acceptée' | 'envoyée' | 'information validée';
  actionnaire: string;
  justification: string;
  requestedOn: number;
  email: string;
  cancelledOn: number;
  cancelledBy: string;
  respondedOn: number;
  respondedBy: string;
  requestFile: string;
  responseFile: string;
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
    mr.actionnaire,
    mr.justification,
    mr."requestedOn",
    u.email,
    mr."cancelledOn",
    mr."respondedOn",
    u_cancel.email as "cancelledBy",
    u_respond.email as "respondedBy",
    f."storedAt" as "requestFile",
    fr."storedAt" as "responseFile"
from "modificationRequests" mr
    inner join projects p on p.id = mr."projectId"
    left join users u on u.id = mr."userId"
    left join users u_cancel on u_cancel.id = mr."cancelledBy"
    left join users u_respond on u_respond.id = mr."respondedBy"
    left join files f on f.id = mr."fileId"
    left join files fr on fr.id = mr."responseFileId"
where 
        mr.type = 'actionnaire'
      and mr.actionnaire is not null
      and mr.actionnaire <> ''
      and mr.status <> 'annulée'
order by mr."requestedOn";
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
      "select count(*) as count from event_store.subscriber where stream_category='actionnaire'",
    );

    const stats: Record<string, string[]> = {};

    if (subscriberCount[0].count > 0 && !flags.dryRun) {
      console.warn("Il existe des subscribers pour 'actionnaire'");
      process.exit(1);
    }

    console.log(`${candidatures.length} candidatures à importer`);

    const eventsPerProjet: Record<string, Actionnaire.ActionnaireEvent[]> = {};

    // todo changer en lauréat
    for (const lauréat of lauréats) {
      const candidature = candidatures.find(
        (candidature) => candidature.identifiantProjet === lauréat.identifiantProjet,
      );
      if (!candidature) {
        stats['candidature non trouvée'] ??= [];
        stats['candidature non trouvée'].push(lauréat.identifiantProjet);
        continue;
      }
      const actionnaireImporté: Actionnaire.ActionnaireImportéEvent = {
        type: 'ActionnaireImporté-V1',
        payload: {
          actionnaire: candidature.sociétéMère,
          identifiantProjet: candidature.identifiantProjet,
          importéLe: candidature.notification!.notifiéeLe,
        },
      };
      eventsPerProjet[candidature.identifiantProjet] = [actionnaireImporté];
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
      const request: Actionnaire.ChangementActionnaireDemandéEvent = {
        type: 'ChangementActionnaireDemandé-V1',
        payload: {
          actionnaire: cleanInput(modification.actionnaire),
          demandéLe: requestedOn,
          demandéPar: modification.email,
          identifiantProjet,
          raison: cleanInput(modification.justification),
          pièceJustificative: { format: formatRequestFile || 'application/pdf' },
        },
      };

      switch (modification.status) {
        case 'acceptée':
          const acceptation: Actionnaire.ActionnaireEvent = {
            type: 'ChangementActionnaireAccordé-V1',
            payload: {
              identifiantProjet,
              accordéLe: DateTime.convertirEnValueType(
                new Date(modification.respondedOn),
              ).formatter(),
              accordéPar: modification.respondedBy,
              nouvelActionnaire: cleanInput(modification.actionnaire),
              réponseSignée: { format: formatResponseFile || 'application/pdf' },
            },
          };
          eventsPerProjet[modification.identifiantProjet].push(request, acceptation);
          break;

        case 'envoyée':
        case 'en instruction':
          eventsPerProjet[modification.identifiantProjet].push(request);
          break;
        case 'information validée':
          eventsPerProjet[modification.identifiantProjet].push({
            type: 'ActionnaireModifié-V1',
            payload: {
              actionnaire: cleanInput(modification.actionnaire),
              identifiantProjet,
              modifiéLe: requestedOn,
              modifiéPar: modification.email,
              raison: cleanInput(modification.justification),
              pièceJustificative: formatRequestFile ? { format: formatRequestFile } : undefined,
            },
          });
      }
    }

    for (const [identifiantProjet, events] of Object.entries(eventsPerProjet)) {
      console.log(identifiantProjet, events.map((ev) => ev.type).join(', '));
      if (!flags.dryRun) {
        for (const event of events) {
          await publish(`actionnaire|${identifiantProjet}`, event);
        }
      }
    }

    console.log('All events published.');
    console.log('Migrating files...');

    for (const modification of modifications) {
      await migrateFile(
        modification.identifiantProjet,
        modification.requestFile,
        Actionnaire.TypeDocumentActionnaire.pièceJustificative,
        DateTime.convertirEnValueType(new Date(modification.requestedOn)),
        modification.status !== 'information validée',
      );
      if (modification.status === 'acceptée') {
        await migrateFile(
          modification.identifiantProjet,
          modification.responseFile,
          Actionnaire.TypeDocumentActionnaire.changementAccordé,
          DateTime.convertirEnValueType(new Date(modification.respondedOn)),
          true,
        );
      }
    }

    process.exit(0);
  }
}

const cleanInput = (str: string) =>
  str.replaceAll(/\t/g, ' ').replaceAll(/\r\n/g, '\\n').replaceAll('"', '\\"');

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
  typeDocument: Actionnaire.TypeDocumentActionnaire.ValueType,
  date: DateTime.ValueType,
  createOnMissing: boolean,
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
    await copyFile(
      file.replace('S3:potentiel-production:', '').replace('S3:production-potentiel:', ''),
      key,
    );
  } else if (createOnMissing) {
    console.warn(
      `📁 Pas de fichier trouvé pour ${identifiantProjet} - ${typeDocument.formatter()}`,
    );
    await upload(
      key,
      await getReplacementDoc(
        "Fichier généré automatiquement en l'absence de pièces justificatives",
      ),
    );
  }
};
