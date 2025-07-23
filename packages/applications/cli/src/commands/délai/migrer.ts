import { Command, Flags } from '@oclif/core';
import { lookup } from 'mime-types';
import { PDFDocument, StandardFonts } from 'pdf-lib';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime, Email } from '@potentiel-domain/common';
import { copyFile, upload } from '@potentiel-libraries/file-storage';
import { DocumentProjet } from '@potentiel-domain/document';

type DélaiDemandéSurPotentiel = {
  legacyProjectId: string;
  identifiantProjet: string;
  nombreDeMois?: string;
  dateAchèvementDemandée?: string;
  dateDemande: string;
  identifiantUtilisateur: string;
  identifiantPièceJustificative?: string;
  raison?: string;
  identifiantInstructeur?: string;
  dateInstruction?: string;
  identifiantRéponseSignée?: string;
} & (
  | {
      statut: 'acceptée';
      accord:
        | {
            dateAchèvementAccordée: string;
          }
        | {
            delayInMonths: string;
          };
      identifiantInstructeur: string;
      dateInstruction: string;
    }
  | {
      statut: 'rejetée';
      identifiantInstructeur: string;
      dateInstruction: string;
    }
  | {
      statut: 'en instruction' | 'envoyée';
    }
  | {
      statut: 'annulée';
      identifiantAnnulateur: string;
      dateAnnulation: string;
    }
);

export class Migrer extends Command {
  static flags = {
    dryRun: Flags.boolean(),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Migrer);

    const subscriberCount = await executeSelect<{ count: number }>(
      "select count(*) as count from event_store.subscriber where stream_category='délai'",
    );

    if (subscriberCount[0].count > 0 && !flags.dryRun) {
      console.warn("Il existe des subscribers pour 'délai'");
      process.exit(1);
    }

    const eventsStats: Record<string, number> = {};

    const demandesDélaiQuery = `
      select 
		    p.id as "legacyProjectId",
        p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE" as "identifiantProjet",
        mr."delayInMonths" as "nombreDeMois",
        mr."dateAchèvementDemandée" as "dateAchèvementDemandée",
        mr."requestedOn" as "dateDemande",
        mr."userId" as "identifiantUtilisateur",
        mr."status" as "statut",
        mr."justification" as "raison",
        mr."fileId" as "identifiantPièceJustificative",
        mr."respondedBy" as "identifiantInstructeur",
        mr."respondedOn" as "dateInstruction",
        mr."responseFileId" as "identifiantRéponseSignée",
        mr."acceptanceParams" as "accord",
        mr."cancelledBy" as "identifiantAnnulateur",
        mr."cancelledOn" as "dateAnnulation"
      from "modificationRequests" mr 
      join "projects" p on p."id" = mr."projectId"
      where 
        mr.type = 'delai' 
        and mr.status <> 'accord-de-principe'
        and (mr."delayInMonths" is not null or mr."dateAchèvementDemandée" is not null)
      order by mr."createdAt"
    `;

    // type DélaiTraitéHorsPotentielEtImporté = {
    //   identifiantProjet: string;
    //   dateInstruction: string;
    //   dateDemande: undefined;
    //   statut: 'acceptée';
    //   accord: {
    //     ancienneDateLimiteAchevement: string;
    //     nouvelleDateLimiteAchevement: string;
    //   };
    // };

    const demandes = await executeSelect<DélaiDemandéSurPotentiel>(demandesDélaiQuery);

    const newEvents: Array<Lauréat.Délai.DélaiAccordéEvent> = [];

    for (const demande of demandes) {
      const délaiDemandéEvent: Lauréat.Délai.DélaiDemandéEvent = {
        type: 'DélaiDemandé-V1',
        payload: {
          demandéLe: DateTime.convertirEnValueType(
            new Date(Number(demande.dateDemande)),
          ).formatter(),
          demandéPar: await getIdentifiantUtilisateur(demande.identifiantUtilisateur),
          identifiantProjet: IdentifiantProjet.convertirEnValueType(
            demande.identifiantProjet,
          ).formatter(),
          nombreDeMois: await getDélaiDemandé(demande),
          pièceJustificative: await getDocumentProjet(demande),
          raison: demande.raison ?? 'Raison non spécifiée',
        },
      };

      await publish(`délai|${demande.identifiantProjet}`, délaiDemandéEvent);
    }

    for (const newEvent of newEvents) {
      if (!flags.dryRun) {
        await publish(`délai|${newEvent.payload.identifiantProjet}`, newEvent);
      }

      eventsStats[newEvent.type] ??= 0;
      eventsStats[newEvent.type]++;
    }

    console.log(eventsStats);
    console.log('All events published.');
    process.exit(0);
  }
}

const getDocumentProjet = async (demande: DélaiDemandéSurPotentiel) => {
  if (demande.identifiantPièceJustificative) {
    // récupérer fichier du legacy avec la table files
    const query = `
      select 
        "storedAt" 
      from "files"
      where "id" = '$1'
  `;

    const file = await executeSelect<{
      storedAt: string;
    }>(query, demande.identifiantPièceJustificative);

    if (file.length) {
      const format = lookup(file[0].storedAt);

      if (!format) {
        throw new Error(`Problème avec le format du fichier : ${file[0].storedAt}`);
      }

      const pièceJustificative = DocumentProjet.convertirEnValueType(
        demande.identifiantProjet,
        Lauréat.Délai.TypeDocumentDemandeDélai.pièceJustificative.formatter(),
        DateTime.convertirEnValueType(new Date(Number(demande.dateDemande))).formatter(),
        format,
      );

      const sourceKey = file[0].storedAt.replace('S3:potentiel-production:', '');

      try {
        await copyFile(sourceKey, pièceJustificative.formatter());

        return {
          format,
        };
      } catch (e) {
        throw new Error(
          `Impossible de copier le fichier de ${sourceKey} vers ${pièceJustificative.formatter()}`,
        );
      }
    }
  }

  const format = 'application/pdf';
  const pièceJustificative = DocumentProjet.convertirEnValueType(
    demande.identifiantProjet,
    Lauréat.Délai.TypeDocumentDemandeDélai.pièceJustificative.formatter(),
    DateTime.convertirEnValueType(new Date(Number(demande.dateDemande))).formatter(),
    format,
  );

  const doc = await getReplacementDoc(
    "Fichier généré automatiquement en l'absence de pièces justificatives",
  );
  await upload(pièceJustificative.formatter(), doc);

  return { format };
};

const getDélaiDemandé = async (demande: DélaiDemandéSurPotentiel): Promise<number> => {
  if (demande.nombreDeMois) {
    return Number(demande.nombreDeMois);
  }

  if (!demande.dateAchèvementDemandée) {
    throw new Error(`La demande n'a ni délai ni date d'achèvement demandée !!`);
  }

  const queryLastDueDateSet = `
    select 
      es.payload->>'completionDueOn' as "dateAchèvementPrévisionnel"
    from "eventStores" es 
    where es.type = 'ProjectCompletionDueDateSet' 
      and es."aggregateId" && '{$1}'
      and es."occurredAt" < to_timestamp($2/1000)::date
    order by es.payload->>'completionDueOn' desc
  `;

  const achèvement = await executeSelect<{ dateAchèvementPrévisionnel: string }>(
    queryLastDueDateSet,
    demande.legacyProjectId,
    demande.dateDemande,
  );

  if (achèvement.length > 0) {
    const ancienneDate = new Date(Number.parseInt(achèvement[0].dateAchèvementPrévisionnel));
    const nouvelleDate = new Date(Number.parseInt(demande.dateAchèvementDemandée));

    const nombreDeMois =
      (nouvelleDate.getFullYear() - ancienneDate.getFullYear()) * 12 +
      (nouvelleDate.getMonth() - ancienneDate.getMonth());

    return nombreDeMois;
  }

  throw new Error(`Aucune date d'achèvement prévisionnel récupérée !!`);
};

const getIdentifiantUtilisateur = async (
  identifiantUtilisateur: string,
): Promise<Email.RawType> => {
  const query = `
    select u.email as "email"
    from users
    where id = $1
  `;

  const user = await executeSelect<{ email: string }>(query, identifiantUtilisateur);

  if (!user.length) {
    return Email.inconnu.formatter();
  }

  return Email.convertirEnValueType(user[0].email).formatter();
};

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
