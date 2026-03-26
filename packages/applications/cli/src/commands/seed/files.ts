import { Command } from '@oclif/core';
import { PDFDocument, StandardFonts } from 'pdf-lib';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { DocumentProjet, Lauréat } from '@potentiel-domain/projet';
import { fileExists, upload } from '@potentiel-libraries/file-storage';

const selectEventsWithFiles = `
select *
from event_store.event_stream
where payload::text ~ '"format"'
and stream_id = 'abandon|PPE2 - Bâtiment#4##test-numero-cre-176'
and type not in ('GestionnaireRéseauAjouté-V1','GestionnaireRéseauAjouté-V2',
'LauréatNotifié-V1','LauréatNotifié-V2', 'ÉliminéNotifié-V1');`;

export class SeedFilesCommand extends Command {
  async run() {
    const events = await executeSelect<Event>(selectEventsWithFiles);

    for (const event of events) {
      if (!isEventWithDocument(event)) {
        console.log(`type ${event.type} non géré`);
        continue;
      }
      const document = mapToDocumentProjet(event);
      if (!document) {
        console.log(`document non défini pour ${event.type}`);
        continue;
      }
      const key = document.formatter();
      const exists = await fileExists(key);

      if (exists) {
        console.log(`document ${key} déjà présent, pas de génération`);
        continue;
      }
      console.log(`génération du document ${key} pour l'événement ${event.type}`);

      const stream = await générerDocumentPdf(event);
      await upload(key, stream);
    }
  }
}

type EventWithDocument =
  | Lauréat.Abandon.AbandonDemandéEventV1
  | Lauréat.Abandon.AbandonDemandéEvent
  | Lauréat.Abandon.AbandonAccordéEvent
  | Lauréat.Abandon.AbandonRejetéEvent
  | Lauréat.Abandon.ConfirmationAbandonDemandéeEvent
  | Lauréat.Producteur.ChangementProducteurEnregistréEvent
  | Lauréat.Producteur.ProducteurModifiéEvent;

type DocumentRecord<K extends EventWithDocument['type'] = EventWithDocument['type']> = {
  [P in K]: (
    payload: Extract<EventWithDocument, { type: P }>['payload'],
  ) => DocumentProjet.ValueType | undefined;
};

const map: DocumentRecord = {
  // Abandon
  'AbandonDemandé-V1': Lauréat.Abandon.DocumentAbandon.pièceJustificative,
  'AbandonDemandé-V2': Lauréat.Abandon.DocumentAbandon.pièceJustificative,
  'ConfirmationAbandonDemandée-V1': Lauréat.Abandon.DocumentAbandon.abandonAConfirmer,
  'AbandonAccordé-V1': Lauréat.Abandon.DocumentAbandon.abandonAccordé,
  'AbandonRejeté-V1': Lauréat.Abandon.DocumentAbandon.abandonRejeté,
  // Producteur
  'ChangementProducteurEnregistré-V1': Lauréat.Producteur.DocumentProducteur.pièceJustificative,
  'ProducteurModifié-V1': Lauréat.Producteur.DocumentProducteur.pièceJustificativeModification,
};

const isEventWithDocument = (event: Event): event is EventWithDocument & Event => event.type in map;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapToDocumentProjet = (event: EventWithDocument) => map[event.type](event.payload as any);

export const générerDocumentPdf = async (event: Event) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const textSize = 20;
  const marginX = 50;
  const marginTop = 200;

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Start drawing from the top with margin
  const startY = page.getHeight() - marginTop;

  const title = event.type.replace(/-V\d$/, '').replace(/([a-z])([A-Z])/g, '$1 $2');
  const textWidth = helveticaFont.widthOfTextAtSize(title, textSize);
  page.drawText(title, {
    x: Math.max(marginX, page.getWidth() / 2 - textWidth / 2),
    y: startY,
    size: textSize,
    font: helveticaFont,
  });

  const content = JSON.stringify(event, null, 2);
  content.split('\n').forEach((line, index) => {
    const textSize = 14;
    const lineHeight = textSize * 1.2;
    const x = marginX;
    const y = startY - (index + 2) * lineHeight;

    page.drawText(line, {
      x: Math.max(marginX, x),
      y,
      size: textSize,
      font: helveticaFont,
    });
  });

  page.drawText('Document automatiquement généré', { x: marginX, y: page.getHeight() });

  const pdfBytes = await pdfDoc.save();

  return new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' }).stream();
};
