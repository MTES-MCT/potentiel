import { Command, Flags } from '@oclif/core';
import { lookup } from 'mime-types';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import z from 'zod';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime, Email } from '@potentiel-domain/common';
import { copyFile, fileExists, upload } from '@potentiel-libraries/file-storage';
import { DocumentProjet } from '@potentiel-domain/document';

type DélaiTraitéHorsPotentielEtImporté = {
  type: 'demande-faite-hors-potentiel';
  legacyProjectId: string;
  legacyDemandeId: string;
  identifiantProjet: string;
  dateDemande: undefined;
  dateInstruction: string;
  statut: 'acceptée';
  accord: {
    ancienneDateLimiteAchevement: string;
    nouvelleDateLimiteAchevement: string;
  };
};

type DélaiDemandéSurPotentiel = {
  type: 'demande-faite-sur-potentiel';
  legacyProjectId: string;
  legacyDemandeId: string;
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

let migrateFileCount = 0;
let generateFileCount = 0;

const envSchema = z.object({
  DATABASE_CONNECTION_STRING: z.string().url(),
  AWS_REGION: z.string(),
  S3_BUCKET: z.string(),
  S3_ENDPOINT: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
});

export class Migrer extends Command {
  static flags = {
    dryRun: Flags.boolean(),
  };

  async init() {
    const { error } = envSchema.safeParse(process.env);

    if (error) {
      console.error(error.issues);
      process.exit(1);
    }
  }

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

    try {
      const demandesDélaiQuery = `
        select 
          'demande-faite-sur-potentiel' as "type",
          mr."createdAt" as "createdAt",
          p.id as "legacyProjectId",
          mr.id as "legacyDemandeId",
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

        union all

        select 
          'demande-faite-hors-potentiel' as "type",
          mr."createdAt" as "createdAt",
          p.id as "legacyProjectId",
          mr.id as "legacyDemandeId",
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
          and mr.status = 'acceptée'
          and mr."isLegacy" = true

      order by "createdAt"
    `;

      const demandes = await executeSelect<
        DélaiDemandéSurPotentiel | DélaiTraitéHorsPotentielEtImporté
      >(demandesDélaiQuery);

      const newEvents: Array<Lauréat.Délai.DélaiEvent> = [];
      let current = 0;

      for (const demande of demandes) {
        console.log(`${current++} / ${demandes.length}`);

        try {
          if (demande.type === 'demande-faite-sur-potentiel') {
            const demandéPar = await getIdentifiantUtilisateur(demande.identifiantUtilisateur);
            const nombreDeMois = await getDélaiDemandé(demande);

            const demandéLe = DateTime.convertirEnValueType(
              new Date(Number(demande.dateDemande)),
            ).formatter();

            const identifiantProjet = IdentifiantProjet.convertirEnValueType(
              demande.identifiantProjet,
            ).formatter();

            const pièceJustificative = await migrerDocumentProjet(
              {
                dateDocument: demandéLe,
                identifiantProjet,
                typeDocument: 'délai/pièce-justificative',
                fileId: demande.identifiantPièceJustificative,
              },
              flags.dryRun,
            );

            const raison = demande.raison ?? 'Raison non spécifiée';

            const délaiDemandéEvent: Lauréat.Délai.DélaiDemandéEvent = {
              type: 'DélaiDemandé-V1',
              payload: {
                demandéLe,
                demandéPar,
                identifiantProjet,
                nombreDeMois,
                pièceJustificative,
                raison,
              },
            };

            newEvents.push(délaiDemandéEvent);

            if (demande.statut === 'en instruction') {
              const passageEnInstruction = await getPassageEnInstruction(demande);

              if (passageEnInstruction) {
                const { passéeEnInstructionLe, passéeEnInstructionPar } = passageEnInstruction;
                const demandeDélaiPasséeEnInstructionEvent: Lauréat.Délai.DemandeDélaiPasséeEnInstructionEvent =
                  {
                    type: 'DemandeDélaiPasséeEnInstruction-V1',
                    payload: {
                      identifiantProjet,
                      dateDemande: demandéLe,
                      passéeEnInstructionLe,
                      passéeEnInstructionPar,
                    },
                  };

                newEvents.push(demandeDélaiPasséeEnInstructionEvent);
              }
            }

            if (demande.statut === 'annulée') {
              const annuléLe = DateTime.convertirEnValueType(
                new Date(Number(demande.dateAnnulation)),
              ).formatter();

              const annuléPar = demande.identifiantAnnulateur
                ? await getIdentifiantUtilisateur(demande.identifiantAnnulateur)
                : Email.inconnu.formatter();

              const demandeDélaiAnnuléeEvent: Lauréat.Délai.DemandeDélaiAnnuléeEvent = {
                type: 'DemandeDélaiAnnulée-V1',
                payload: {
                  identifiantProjet,
                  dateDemande: demandéLe,
                  annuléLe,
                  annuléPar,
                },
              };

              newEvents.push(demandeDélaiAnnuléeEvent);
            }

            if (demande.statut === 'rejetée') {
              const rejetéeLe = DateTime.convertirEnValueType(
                new Date(Number(demande.dateInstruction)),
              ).formatter();

              const rejetéePar = demande.identifiantInstructeur
                ? await getIdentifiantUtilisateur(demande.identifiantInstructeur)
                : Email.inconnu.formatter();

              const réponseSignée = await migrerDocumentProjet(
                {
                  dateDocument: rejetéeLe,
                  identifiantProjet,
                  typeDocument: 'délai/demande-rejetée',
                  fileId: demande.identifiantRéponseSignée,
                },
                flags.dryRun,
              );

              const demandeDélaiRejetéeEvent: Lauréat.Délai.DemandeDélaiRejetéeEvent = {
                type: 'DemandeDélaiRejetée-V1',
                payload: {
                  identifiantProjet,
                  dateDemande: demandéLe,
                  rejetéeLe,
                  rejetéePar,
                  réponseSignée,
                },
              };

              newEvents.push(demandeDélaiRejetéeEvent);
            }

            if (demande.statut === 'acceptée') {
              const accordéLe = DateTime.convertirEnValueType(
                new Date(Number(demande.dateInstruction)),
              ).formatter();

              const accordéPar = demande.identifiantInstructeur
                ? await getIdentifiantUtilisateur(demande.identifiantInstructeur)
                : Email.inconnu.formatter();

              const réponseSignée = await migrerDocumentProjet(
                {
                  dateDocument: accordéLe,
                  identifiantProjet,
                  typeDocument: 'délai/demande-accordée',
                  fileId: demande.identifiantRéponseSignée,
                },
                flags.dryRun,
              );

              const dateAchèvementPrévisionnelCalculée =
                await getDateAchèvementPrévisionnelAccordée({
                  legacyProjectId: demande.legacyProjectId,
                  dateAccord: accordéLe,
                });

              const demandeDélaiRejetéeEvent: Lauréat.Délai.DélaiAccordéEvent = {
                type: 'DélaiAccordé-V1',
                payload: {
                  identifiantProjet,
                  dateDemande: demandéLe,
                  nombreDeMois,
                  dateAchèvementPrévisionnelCalculée,
                  accordéLe,
                  accordéPar,
                  réponseSignée,
                },
              };

              newEvents.push(demandeDélaiRejetéeEvent);
            }
          } else {
            const demandéPar = Email.inconnu.formatter();
            const ancienneDate = new Date(
              Number.parseInt(demande.accord.ancienneDateLimiteAchevement),
            );
            const nouvelleDate = new Date(
              Number.parseInt(demande.accord.nouvelleDateLimiteAchevement),
            );

            const nombreDeMois =
              (nouvelleDate.getFullYear() - ancienneDate.getFullYear()) * 12 +
              (nouvelleDate.getMonth() - ancienneDate.getMonth());

            const demandéLe = DateTime.convertirEnValueType(
              new Date(Number(demande.dateDemande)),
            ).formatter();

            const identifiantProjet = IdentifiantProjet.convertirEnValueType(
              demande.identifiantProjet,
            ).formatter();

            const pièceJustificative = await uploadReplacementDoc({
              identifiantProjet,
              typeDocument: 'délai/pièce-justificative',
              dateDocument: demandéLe,
              dryRun: flags.dryRun,
            });

            const raison = 'Raison non spécifiée';

            const délaiDemandéEvent: Lauréat.Délai.DélaiDemandéEvent = {
              type: 'DélaiDemandé-V1',
              payload: {
                demandéLe,
                demandéPar,
                identifiantProjet,
                nombreDeMois,
                pièceJustificative,
                raison,
              },
            };

            newEvents.push(délaiDemandéEvent);

            const accordéLe = DateTime.convertirEnValueType(
              new Date(Number(demande.dateInstruction)),
            ).formatter();

            const accordéPar = Email.inconnu.formatter();

            const réponseSignée = await uploadReplacementDoc({
              identifiantProjet,
              typeDocument: 'délai/demande-accordée',
              dateDocument: accordéLe,
              dryRun: flags.dryRun,
            });

            const demandeDélaiRejetéeEvent: Lauréat.Délai.DélaiAccordéEvent = {
              type: 'DélaiAccordé-V1',
              payload: {
                identifiantProjet,
                dateDemande: demandéLe,
                nombreDeMois,
                dateAchèvementPrévisionnelCalculée: DateTime.convertirEnValueType(nouvelleDate)
                  .définirHeureÀMidi()
                  .formatter(),
                accordéLe,
                accordéPar,
                réponseSignée,
              },
            };

            newEvents.push(demandeDélaiRejetéeEvent);
          }
        } catch (error) {
          console.error(error);
        }
      }

      for (const newEvent of newEvents) {
        if (!flags.dryRun) {
          await publish(`délai|${newEvent.payload.identifiantProjet}`, newEvent);
        }

        eventsStats[newEvent.type] ??= 0;
        eventsStats[newEvent.type]++;
      }

      console.log(`${migrateFileCount} fichiers existants ont été déplacés`);
      console.log(`${generateFileCount} fichiers ont été générés`);

      console.log(eventsStats);
      console.log('All events published.');
    } catch (error) {
      console.error(error);
    }
    process.exit(0);
  }
}

const migrerDocumentProjet = async (
  {
    dateDocument,
    identifiantProjet,
    typeDocument,
    fileId,
  }: {
    fileId?: string;
    identifiantProjet: IdentifiantProjet.RawType;
    dateDocument: DateTime.RawType;
    typeDocument: Lauréat.Délai.TypeDocumentDemandeDélai.RawType;
  },
  dryRun: boolean,
): Promise<{ format: string }> => {
  if (fileId) {
    try {
      const query = `
      select
        "storedAt"
      from "files"
      where "id" = $1
  `;

      const file = await executeSelect<{
        storedAt: string;
      }>(query, fileId);

      if (file.length) {
        const format = lookup(file[0].storedAt);

        if (!format) {
          throw new Error(`Problème avec le format du fichier : ${file[0].storedAt}`);
        }

        const pièceJustificative = DocumentProjet.convertirEnValueType(
          identifiantProjet,
          typeDocument,
          dateDocument,
          format,
        );

        const sourceKey = file[0].storedAt
          .replace('S3:potentiel-production:', '')
          .replace('S3:production-potentiel:', '');

        const doesExist = await fileExists(sourceKey);
        if (!doesExist) {
          throw new Error(`Le fichier source ${sourceKey} n'existe pas`);
        }

        try {
          if (!dryRun) {
            await copyFile(sourceKey, pièceJustificative.formatter());
            migrateFileCount++;
          }

          return {
            format,
          };
        } catch (e) {
          throw new Error(
            `Impossible de copier le fichier de ${sourceKey} vers ${pièceJustificative.formatter()}`,
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return uploadReplacementDoc({
    identifiantProjet,
    typeDocument,
    dateDocument,
    dryRun,
  });
};

type UploadReplacementDoc = (infosDemande: {
  identifiantProjet: IdentifiantProjet.RawType;
  typeDocument: Lauréat.Délai.TypeDocumentDemandeDélai.RawType;
  dateDocument: DateTime.RawType;
  dryRun: boolean;
}) => Promise<{ format: string }>;
const uploadReplacementDoc: UploadReplacementDoc = async ({
  identifiantProjet,
  typeDocument,
  dateDocument,
  dryRun,
}) => {
  const format = 'application/pdf';
  const pièceJustificative = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    typeDocument,
    dateDocument,
    format,
  );

  const doc = await getReplacementDoc(
    "Fichier généré automatiquement en l'absence de pièces justificatives",
  );

  if (!dryRun) {
    try {
      await upload(pièceJustificative.formatter(), doc);
      generateFileCount++;
    } catch (error) {
      throw new Error(
        `Impossible de créer le fichier de remplacement vers ${pièceJustificative.formatter()}`,
      );
    }
  }

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
      and es.payload->>'projectId' = $1
      and es."occurredAt" < to_timestamp($2)::date
    order by es.payload->>'completionDueOn' desc
  `;

  const achèvement = await executeSelect<{ dateAchèvementPrévisionnel: string }>(
    queryLastDueDateSet,
    demande.legacyProjectId,
    Number(demande.dateDemande) / 1000,
  );

  if (achèvement.length > 0) {
    const ancienneDate = new Date(Number.parseInt(achèvement[0].dateAchèvementPrévisionnel));
    const nouvelleDate = new Date(demande.dateAchèvementDemandée);

    const nombreDeMois =
      (nouvelleDate.getFullYear() - ancienneDate.getFullYear()) * 12 +
      (nouvelleDate.getMonth() - ancienneDate.getMonth());

    return nombreDeMois;
  }

  throw new Error(`Aucune date d'achèvement prévisionnel récupérée !!`);
};

const getDateAchèvementPrévisionnelAccordée = async ({
  dateAccord,
  legacyProjectId,
}: {
  legacyProjectId: string;
  dateAccord: DateTime.RawType;
}): Promise<DateTime.RawType> => {
  const query = `
    select 
      es."occurredAt" ,
      es.payload->>'completionDueOn' as "dateAchèvementPrévisionnel"
    from "eventStores" es 
    where es.type = 'ProjectCompletionDueDateSet' 
      and es.payload->>'projectId' = $1
      and es."occurredAt" >= $2::date
    order by es.payload->>'completionDueOn' asc;
  `;

  const achèvement = await executeSelect<{ dateAchèvementPrévisionnel: string }>(
    query,
    legacyProjectId,
    dateAccord,
  );

  if (achèvement.length > 0) {
    return DateTime.convertirEnValueType(new Date(Number(achèvement[0].dateAchèvementPrévisionnel)))
      .définirHeureÀMidi()
      .formatter();
  }

  throw new Error(`Aucune date d'achèvement prévisionnel accordée récupérée !!`);
};

type GetPassageEnInstruction = (demande: DélaiDemandéSurPotentiel) => Promise<
  | {
      passéeEnInstructionLe: DateTime.RawType;
      passéeEnInstructionPar: Email.RawType;
    }
  | undefined
>;

const getPassageEnInstruction: GetPassageEnInstruction = async (demande) => {
  const query = `
    select 
      to_char(es."occurredAt", 'YYYY-MM-DD') as "datePassageEnInstruction",
      es."payload"->>'modifiéPar' as "passéEnInstructionPar"
    from "eventStores" es 
    where es.type = 'DélaiEnInstruction' 
      and es.payload->>'projetId' = $1
      and es.payload->>'demandeDélaiId' = $2
    order by es.payload->>'completionDueOn' desc
  `;

  const events = await executeSelect<{
    datePassageEnInstruction: string;
    passéEnInstructionPar: string;
  }>(query, demande.legacyProjectId, demande.legacyDemandeId);

  if (events.length > 0) {
    return {
      passéeEnInstructionLe: DateTime.convertirEnValueType(
        new Date(events[0].datePassageEnInstruction),
      ).formatter(),
      passéeEnInstructionPar: await getIdentifiantUtilisateur(events[0].passéEnInstructionPar),
    };
  }

  return undefined;
};

const getIdentifiantUtilisateur = async (
  identifiantUtilisateur: string,
): Promise<Email.RawType> => {
  const query = `
    select email as "email"
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
