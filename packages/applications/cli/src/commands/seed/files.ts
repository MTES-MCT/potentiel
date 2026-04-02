import { Command } from '@oclif/core';
import { PDFDocument, StandardFonts } from 'pdf-lib';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { DocumentProjet, Lauréat, Éliminé } from '@potentiel-domain/projet';
import { fileExists, upload } from '@potentiel-libraries/file-storage';

// Pour ces évènements, soit le document n'est pas pertinent, soit il s'agit d'un faux positif (ex: Raccordement)
const eventsToIgnore = [
  'LauréatNotifié-V1',
  'LauréatNotifié-V2',
  'ÉliminéNotifié-V1',
  'CandidatureNotifiée-V1',
  'CandidatureNotifiée-V2',
  'CandidatureNotifiée-V3',
  'GestionnaireRéseauAjouté-V1',
  'GestionnaireRéseauAjouté-V2',
  'GestionnaireRéseauModifié-V1',
  'GestionnaireRéseauModifié-V2',
];

const selectEventsWithFiles = `
select *
from event_store.event_stream
where payload::text ~ '"format"'
and type not in (${eventsToIgnore.map((s) => `'${s}'`).join(',')});`;

export class SeedFilesCommand extends Command {
  async run() {
    const events = await executeSelect<Event>(selectEventsWithFiles);

    const todo = new Set<string>();
    for (const event of events) {
      if (!isEventWithDocument(event)) {
        console.log(`type ${event.type} non géré`);
        todo.add(event.type);
        continue;
      }
      const documentOuArray = mapToDocumentProjet(event);
      if (!documentOuArray) {
        console.log(`document non défini pour ${event.type}`);
        continue;
      }
      const documents = Array.isArray(documentOuArray) ? documentOuArray : [documentOuArray];

      for (const document of documents) {
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
    console.log(todo);
  }
}

type EventWithDocument =
  | Lauréat.Abandon.AbandonDemandéEventV1
  | Lauréat.Abandon.AbandonDemandéEvent
  | Lauréat.Abandon.AbandonAccordéEvent
  | Lauréat.Abandon.AbandonRejetéEvent
  | Lauréat.Abandon.ConfirmationAbandonDemandéeEvent
  | Lauréat.Producteur.ChangementProducteurEnregistréEvent
  | Lauréat.Producteur.ProducteurModifiéEvent
  | Lauréat.Actionnaire.ChangementActionnaireDemandéEvent
  | Lauréat.Actionnaire.ChangementActionnaireEnregistréEvent
  | Lauréat.Fournisseur.ChangementFournisseurEnregistréEvent
  | Lauréat.Puissance.ChangementPuissanceDemandéEvent
  | Lauréat.Puissance.ChangementPuissanceRejetéEvent
  | Lauréat.Puissance.ChangementPuissanceAccordéEvent
  | Lauréat.Puissance.ChangementPuissanceEnregistréEvent
  | Lauréat.Raccordement.DemandeComplèteRaccordementTransmiseEvent
  | Lauréat.Raccordement.DemandeComplèteRaccordementTransmiseEventV2
  | Lauréat.Raccordement.PropositionTechniqueEtFinancièreTransmiseEvent
  | Lauréat.Raccordement.PropositionTechniqueEtFinancièreTransmiseEventV1
  | Lauréat.Raccordement.PropositionTechniqueEtFinancièreTransmiseEventV2
  | Lauréat.Raccordement.PropositionTechniqueEtFinancièreModifiéeEventV2
  | Lauréat.Raccordement.PropositionTechniqueEtFinancièreModifiéeEvent
  | Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEventV3
  | Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEvent
  | Lauréat.Délai.DélaiDemandéEvent
  | Lauréat.Délai.DélaiAccordéEvent
  | Lauréat.Délai.DemandeDélaiCorrigéeEvent
  | Lauréat.ReprésentantLégal.ChangementReprésentantLégalDemandéEvent
  | Lauréat.ReprésentantLégal.ChangementReprésentantLégalCorrigéEvent
  | Lauréat.ReprésentantLégal.ChangementReprésentantLégalEnregistréEvent
  | Lauréat.Installation.ChangementDispositifDeStockageEnregistréEvent
  | Lauréat.Installation.ChangementInstallateurEnregistréEvent
  | Lauréat.Installation.TypologieInstallationModifiéeEvent
  | Lauréat.NatureDeLExploitation.ChangementNatureDeLExploitationEnregistréEvent
  | Lauréat.ChangementNomProjetEnregistréEvent
  | Lauréat.Achèvement.AttestationConformitéTransmiseEvent
  | Lauréat.Achèvement.AttestationConformitéEnregistréeEvent
  | Lauréat.Achèvement.AchèvementModifiéEvent
  | Éliminé.Recours.RecoursDemandéEvent
  | Éliminé.Recours.RecoursAccordéEvent;

type DocumentRecord<K extends EventWithDocument['type'] = EventWithDocument['type']> = {
  [P in K]: (
    payload: Extract<EventWithDocument, { type: P }>['payload'],
  ) => DocumentProjet.ValueType | DocumentProjet.ValueType[] | undefined;
};

const mapProperty =
  <TPayload extends object, TKey extends string>(
    cb: (event: TPayload) => DocumentProjet.ValueType | undefined,
    key1: keyof TPayload,
    key2: TKey,
  ) =>
  (payload: Record<TKey, string>) =>
    cb({ ...payload, [key1]: payload[key2] } as TPayload);

const map: DocumentRecord = {
  // Abandon
  'AbandonDemandé-V1': Lauréat.Abandon.DocumentAbandon.pièceJustificative,
  'AbandonDemandé-V2': Lauréat.Abandon.DocumentAbandon.pièceJustificative,
  'ConfirmationAbandonDemandée-V1': Lauréat.Abandon.DocumentAbandon.abandonAConfirmer,
  'AbandonAccordé-V1': Lauréat.Abandon.DocumentAbandon.abandonAccordé,
  'AbandonRejeté-V1': Lauréat.Abandon.DocumentAbandon.abandonRejeté,
  // Producteur
  'ChangementProducteurEnregistré-V1': Lauréat.Producteur.DocumentProducteur.pièceJustificative,
  'ProducteurModifié-V1': mapProperty(
    Lauréat.Producteur.DocumentProducteur.pièceJustificative,
    'enregistréLe',
    'modifiéLe',
  ),
  // Actionnaire
  'ChangementActionnaireDemandé-V1': Lauréat.Actionnaire.DocumentActionnaire.pièceJustificative,
  'ChangementActionnaireEnregistré-V1': mapProperty(
    Lauréat.Actionnaire.DocumentActionnaire.pièceJustificative,
    'demandéLe',
    'enregistréLe',
  ),
  // Fournisseur
  'ChangementFournisseurEnregistré-V1': Lauréat.Fournisseur.DocumentFournisseur.pièceJustificative,
  // Puissance
  'ChangementPuissanceDemandé-V1': Lauréat.Puissance.DocumentPuissance.pièceJustificative,
  'ChangementPuissanceRejeté-V1': Lauréat.Puissance.DocumentPuissance.changementRejeté,
  'ChangementPuissanceAccordé-V1': Lauréat.Puissance.DocumentPuissance.changementAccordé,
  'ChangementPuissanceEnregistré-V1': mapProperty(
    Lauréat.Puissance.DocumentPuissance.pièceJustificative,
    'demandéLe',
    'enregistréLe',
  ),

  // Achèvement
  'AttestationConformitéTransmise-V1': (event) => [
    Lauréat.Achèvement.DocumentAchèvement.attestationConformité({
      ...event,
      enregistréLe: event.date,
    }),
    Lauréat.Achèvement.DocumentAchèvement.preuveTransmissionAttestationConformité(event),
  ],
  'AchèvementModifié-V1': (event) => [
    Lauréat.Achèvement.DocumentAchèvement.attestationConformité({
      ...event,
      enregistréLe: event.date,
    }),
    Lauréat.Achèvement.DocumentAchèvement.preuveTransmissionAttestationConformité(event),
  ],
  'AttestationConformitéEnregistrée-V1': mapProperty(
    Lauréat.Achèvement.DocumentAchèvement.attestationConformité,
    'enregistréLe',
    'enregistréeLe',
  ),
  // Raccordement
  'DemandeComplèteDeRaccordementTransmise-V2': ({ dateQualification, ...event }) =>
    dateQualification &&
    Lauréat.Raccordement.DocumentRaccordement.accuséRéception({ ...event, dateQualification }),
  'DemandeComplèteDeRaccordementTransmise-V3': ({ dateQualification, ...event }) =>
    dateQualification &&
    Lauréat.Raccordement.DocumentRaccordement.accuséRéception({ ...event, dateQualification }),
  'DemandeComplèteRaccordementModifiée-V3':
    Lauréat.Raccordement.DocumentRaccordement.accuséRéception,
  'DemandeComplèteRaccordementModifiée-V4':
    Lauréat.Raccordement.DocumentRaccordement.accuséRéception,
  'PropositionTechniqueEtFinancièreTransmise-V1':
    Lauréat.Raccordement.DocumentRaccordement.propositionTechniqueEtFinancière,
  'PropositionTechniqueEtFinancièreTransmise-V2':
    Lauréat.Raccordement.DocumentRaccordement.propositionTechniqueEtFinancière,
  'PropositionTechniqueEtFinancièreTransmise-V3':
    Lauréat.Raccordement.DocumentRaccordement.propositionTechniqueEtFinancière,
  'PropositionTechniqueEtFinancièreModifiée-V2':
    Lauréat.Raccordement.DocumentRaccordement.propositionTechniqueEtFinancière,
  'PropositionTechniqueEtFinancièreModifiée-V3':
    Lauréat.Raccordement.DocumentRaccordement.propositionTechniqueEtFinancière,
  // Délai
  'DélaiDemandé-V1': Lauréat.Délai.DocumentDélai.pièceJustificative,
  'DélaiAccordé-V1': Lauréat.Délai.DocumentDélai.demandeAccordée,
  'DemandeDélaiCorrigée-V1': mapProperty(
    Lauréat.Délai.DocumentDélai.pièceJustificative,
    'demandéLe',
    'dateDemande',
  ),
  // Représentant légal
  'ChangementReprésentantLégalEnregistré-V1': mapProperty(
    Lauréat.ReprésentantLégal.DocumentChangementReprésentantLégal.pièceJustificative,
    'demandéLe',
    'enregistréLe',
  ),
  'ChangementReprésentantLégalDemandé-V1':
    Lauréat.ReprésentantLégal.DocumentChangementReprésentantLégal.pièceJustificative,
  'ChangementReprésentantLégalCorrigé-V1': mapProperty(
    Lauréat.ReprésentantLégal.DocumentChangementReprésentantLégal.pièceJustificative,
    'demandéLe',
    'corrigéLe',
  ),
  // Installation & Nature de l'exploitation
  'ChangementDispositifDeStockageEnregistré-V1':
    Lauréat.Installation.DocumentDispositifDeStockage.pièceJustificative,
  'ChangementInstallateurEnregistré-V1':
    Lauréat.Installation.DocumentInstallateur.pièceJustificative,
  'TypologieInstallationModifiée-V1':
    Lauréat.Installation.DocumentTypologieInstallation.pièceJustificative,
  'ChangementNatureDeLExploitationEnregistré-V1':
    Lauréat.NatureDeLExploitation.DocumentNatureDeLExploitation.pièceJustificative,
  'ChangementNomProjetEnregistré-V1': Lauréat.DocumentNomProjet.pièceJustificative,
  // Garanties Financières
  // 'AttestationGarantiesFinancièresEnregistrée-V1':,
  // 'DemandeMainlevéeGarantiesFinancièresAccordée-V1',
  // 'DépôtGarantiesFinancièresSoumis-V1',
  // 'DépôtGarantiesFinancièresEnCoursValidé-V2',
  // 'DateAchèvementTransmise-V1',
  // 'GarantiesFinancièresModifiées-V1',
  // 'DemandeMainlevéeGarantiesFinancièresRejetée-V1',
  // 'DépôtGarantiesFinancièresEnCoursModifié-V1',
  // 'GarantiesFinancièresEnregistrées-V1'
  // Recours
  'RecoursDemandé-V1': Éliminé.Recours.DocumentRecours.pièceJustificative,
  'RecoursAccordé-V1': Éliminé.Recours.DocumentRecours.recoursAccordé,
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
