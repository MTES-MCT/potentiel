import { Command, Flags } from '@oclif/core';
import { PDFDocument, PDFFont, StandardFonts } from 'pdf-lib';
import z from 'zod';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Candidature, DocumentProjet, Lauréat, Éliminé } from '@potentiel-domain/projet';
import { fileExists, upload } from '@potentiel-libraries/file-storage';

import { appSchema, dbSchema, s3Schema } from '#helpers';

// Pour ces évènements, soit le document n'est pas pertinent, soit il s'agit d'un faux positif (ex: Raccordement)
const eventsToIgnore = [
  // document identique à CandidatureNotifiée-V1
  'LauréatNotifié-V1',
  'LauréatNotifié-V2',
  'ÉliminéNotifié-V1',
  // le champ "format" ne concerne pas un document
  'GestionnaireRéseauAjouté-V1',
  'GestionnaireRéseauAjouté-V2',
  'GestionnaireRéseauModifié-V1',
  'GestionnaireRéseauModifié-V2',
];

// Retrouver tous les évènements avec un champ "format"
const selectEventsWithFiles = `
select *
from event_store.event_stream
where payload::text ~ '"format"'
and type not in (${eventsToIgnore.map((s) => `'${s}'`).join(',')});`;

const envSchema = z.object({
  ...dbSchema.shape,
  ...appSchema.shape,
  ...s3Schema.shape,
});

export class SeedFilesCommand extends Command {
  static override description =
    'Génère un faux document PDF pour chaque document manquant, en se basant sur les événements présents en DB';
  static flags = {
    force: Flags.boolean(),
  };
  async run() {
    const { APPLICATION_STAGE } = envSchema.parse(process.env);

    const { flags } = await this.parse(SeedFilesCommand);
    if (APPLICATION_STAGE === 'production') {
      console.error('Cette commande ne doit pas être lancée en production');
      process.exit(1);
    }

    const events = await executeSelect<Event>(selectEventsWithFiles);
    const stats = {
      existant: 0,
      généré: 0,
      'event-non-géré': 0,
      'format-non-géré': 0,
    };

    const unhandledEvents = new Set<string>();
    for (const event of events) {
      if (!isEventWithDocument(event)) {
        console.log(`type ${event.type} non géré`);
        unhandledEvents.add(event.type);
        stats['event-non-géré']++;
        continue;
      }
      const documentOuArray = mapToDocumentProjet(event);

      const documents = Array.isArray(documentOuArray)
        ? documentOuArray
        : documentOuArray
          ? [documentOuArray]
          : [];

      if (documents.length === 0) {
        console.log(`document non défini pour ${event.type}`);
        stats['event-non-géré']++;
        continue;
      }

      for (const document of documents) {
        const key = document.formatter();
        const exists = await fileExists(key);

        if (exists && !flags.force) {
          console.log(`document ${key} déjà présent, pas de génération`);
          stats.existant++;
          continue;
        }

        if (document.format !== 'application/pdf') {
          console.warn(
            `Le format ${document.format} n'est pas supporté, pas de génération pour ${key}`,
          );
          stats['format-non-géré']++;
          continue;
        }

        console.log(`génération du document ${key} pour l'événement ${event.type}`);

        const stream = await générerDocumentPdf(event, document.typeDocument);
        await upload(key, stream);
        stats.généré++;
      }
    }
    if (unhandledEvents.size > 0) {
      console.warn(`Il reste ${unhandledEvents.size} types d'événements à gérer`);
      console.log(unhandledEvents);
    }
    console.log('Statistiques :');
    console.table(stats);
  }
}

type EventWithDocument =
  | Candidature.CandidatureNotifiéeEvent
  | Candidature.CandidatureNotifiéeEventV1
  | Candidature.CandidatureNotifiéeEventV2
  | Lauréat.Abandon.AbandonDemandéEventV1
  | Lauréat.Abandon.AbandonDemandéEvent
  | Lauréat.Abandon.AbandonAccordéEvent
  | Lauréat.Abandon.AbandonRejetéEvent
  | Lauréat.Abandon.ConfirmationAbandonDemandéeEvent
  | Lauréat.Actionnaire.ChangementActionnaireDemandéEvent
  | Lauréat.Actionnaire.ChangementActionnaireEnregistréEvent
  | Lauréat.Délai.DélaiDemandéEvent
  | Lauréat.Délai.DélaiAccordéEvent
  | Lauréat.Délai.DemandeDélaiCorrigéeEvent
  | Lauréat.Fournisseur.ChangementFournisseurEnregistréEvent
  | Lauréat.Producteur.ChangementProducteurEnregistréEvent
  | Lauréat.Producteur.ProducteurModifiéEvent
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
  | Lauréat.ReprésentantLégal.ChangementReprésentantLégalDemandéEvent
  | Lauréat.ReprésentantLégal.ChangementReprésentantLégalCorrigéEvent
  | Lauréat.ReprésentantLégal.ChangementReprésentantLégalEnregistréEvent
  | Lauréat.Installation.ChangementDispositifDeStockageEnregistréEvent
  | Lauréat.Installation.ChangementInstallateurEnregistréEvent
  | Lauréat.Installation.TypologieInstallationModifiéeEvent
  | Lauréat.NatureDeLExploitation.ChangementNatureDeLExploitationEnregistréEvent
  | Lauréat.ChangementNomProjetEnregistréEvent
  | Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAccordéeEvent
  | Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresRejetéeEvent
  | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresSoumisEvent
  | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEvent
  | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursModifiéEvent
  | Lauréat.GarantiesFinancières.GarantiesFinancièresModifiéesEvent
  | Lauréat.GarantiesFinancières.GarantiesFinancièresEnregistréesEvent
  | Lauréat.GarantiesFinancières.AttestationGarantiesFinancièresEnregistréeEvent
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
  // Candidature
  'CandidatureNotifiée-V1': mapProperty(
    Candidature.DocumentCandidature.attestationDésignation,
    'généréeLe',
    'notifiéeLe',
  ),
  'CandidatureNotifiée-V2': mapProperty(
    Candidature.DocumentCandidature.attestationDésignation,
    'généréeLe',
    'notifiéeLe',
  ),
  'CandidatureNotifiée-V3': mapProperty(
    Candidature.DocumentCandidature.attestationDésignation,
    'généréeLe',
    'notifiéeLe',
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
  'AttestationGarantiesFinancièresEnregistrée-V1':
    Lauréat.GarantiesFinancières.DocumentGarantiesFinancières.attestationActuelle,
  'GarantiesFinancièresEnregistrées-V1':
    Lauréat.GarantiesFinancières.DocumentGarantiesFinancières.attestationActuelle,
  'GarantiesFinancièresModifiées-V1':
    Lauréat.GarantiesFinancières.DocumentGarantiesFinancières.attestationActuelle,
  'DépôtGarantiesFinancièresEnCoursModifié-V1':
    Lauréat.GarantiesFinancières.DocumentGarantiesFinancières.attestationSoumise,
  'DépôtGarantiesFinancièresSoumis-V1':
    Lauréat.GarantiesFinancières.DocumentGarantiesFinancières.attestationSoumise,
  'DépôtGarantiesFinancièresEnCoursValidé-V2':
    Lauréat.GarantiesFinancières.DocumentGarantiesFinancières.attestationActuelle,
  'DemandeMainlevéeGarantiesFinancièresAccordée-V1':
    Lauréat.GarantiesFinancières.DocumentMainlevée.demandeAccordée,
  'DemandeMainlevéeGarantiesFinancièresRejetée-V1':
    Lauréat.GarantiesFinancières.DocumentMainlevée.demandeRejetée,
  // Recours
  'RecoursDemandé-V1': Éliminé.Recours.DocumentRecours.pièceJustificative,
  'RecoursAccordé-V1': Éliminé.Recours.DocumentRecours.recoursAccordé,
};

const isEventWithDocument = (event: Event): event is EventWithDocument & Event => event.type in map;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapToDocumentProjet = (event: EventWithDocument) => map[event.type](event.payload as any);

export const générerDocumentPdf = async (event: Event, typeDocument: string) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const textSize = 14;
  const titleTextSize = 20;
  const marginX = 50;
  const marginTop = 160;

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaObliqueFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Start drawing from the top with margin
  let startY = page.getHeight() - marginTop;

  type DrawProps = { font?: PDFFont; size?: number; position?: 'left' | 'center' };
  const drawText = (
    text: string,
    { font = helveticaFont, size = textSize, position = 'left' }: DrawProps = {},
  ) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: position === 'center' ? Math.max(marginX, page.getWidth() / 2 - textWidth / 2) : marginX,
      y: startY,
      size,
      font,
    });
    // Move down for the next line
    startY -= size + 10;
  };

  drawText('Document automatiquement généré', {
    position: 'center',
    font: helveticaObliqueFont,
    size: titleTextSize * 0.6,
  });
  drawText(event.type.replace(/-V\d$/, '').replace(/([a-z])([A-Z])/g, '$1 $2'), {
    position: 'center',
    size: titleTextSize,
  });
  drawText(typeDocument.replace(/-V\d$/, '').replace(/([a-z])([A-Z])/g, '$1 $2'), {
    position: 'center',
    size: titleTextSize * 0.8,
  });

  const content = JSON.stringify(event, null, 2);
  content.split('\n').forEach((l) => drawText(l));

  const pdfBytes = await pdfDoc.save();
  return new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' }).stream();
};
