import { Command, Flags } from '@oclif/core';
import { mediator } from 'mediateur';
import { PDFDocument, StandardFonts } from 'pdf-lib';

import { Abandon } from '@potentiel-domain/laureat/';
import {
  DocumentAdapter,
  récupérerIdentifiantsProjetParEmailPorteurAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { executeSelect, killPool } from '@potentiel-libraries/pg-helpers';
import { Email } from '@potentiel-domain/common';
import { registerDocumentProjetCommand } from '@potentiel-domain/document';
import { registerTâchePlanifiéeUseCases } from '@potentiel-domain/tache-planifiee';

type QueryResult = {
  identifiantProjet: string;
  abandonedOn: number;
};

const getAbandonsLegacy = `
select format(
  '%s#%s#%s#%s',
  p."appelOffreId",
  p."periodeId",
  p."familleId",
  p."numeroCRE"
) as "identifiantProjet",p."abandonedOn"
from projects p
left join domain_views.projection ab on ab.key = format(
  'abandon|%s#%s#%s#%s',
  p."appelOffreId",
  p."periodeId",
  p."familleId",
  p."numeroCRE"
)
where p."abandonedOn" != '0'
and ab.key is null;
`;

export default class FixLegacyAbandon extends Command {
  static override description = '';

  static override args = {};

  static override flags = {
    dryRun: Flags.boolean({
      default: false,
      description: 'Exécution test, sans mise à jour',
    }),
  };

  public async init() {
    registerDocumentProjetCommand({
      enregistrerDocumentProjet: DocumentAdapter.téléverserDocumentProjet,
      déplacerDossierProjet: DocumentAdapter.déplacerDossierProjet,
      archiverDocumentProjet: DocumentAdapter.archiverDocumentProjet,
    });
    registerTâchePlanifiéeUseCases({ loadAggregate });
    Abandon.registerAbandonQueries({
      find: findProjection,
      list: listProjection,
      récupérerIdentifiantsProjetParEmailPorteur: récupérerIdentifiantsProjetParEmailPorteurAdapter,
    });
    Abandon.registerAbandonUseCases({ loadAggregate });
  }

  protected async finally(_: Error | undefined) {
    await killPool();
  }

  public async run(): Promise<void> {
    console.info('Lancement du script...');

    const subscriberCount = await executeSelect<{ count: number }>(
      "select count(*) as count from event_store.subscriber where stream_category='abandon'",
    );
    if (subscriberCount[0].count > 0) {
      console.warn("Il existe des subscribers pour 'abandon'");
      process.exit(1);
    }

    const results = await executeSelect<QueryResult>(getAbandonsLegacy);

    for (const { identifiantProjet, abandonedOn } of results) {
      console.log(identifiantProjet);
      await mediator.send<Abandon.DemanderAbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.DemanderAbandon',
        data: {
          identifiantProjetValue: identifiantProjet,
          dateDemandeValue: new Date(abandonedOn).toISOString(),
          identifiantUtilisateurValue: Email.system().email,
          pièceJustificativeValue: buildDocument(),
          raisonValue: 'Rapatriement des abandons accordés hors Potentiel',
        },
      });
      await mediator.send<Abandon.AccorderAbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.AccorderAbandon',
        data: {
          identifiantProjetValue: identifiantProjet,
          dateAccordValue: new Date(abandonedOn).toISOString(),
          identifiantUtilisateurValue: Email.system().email,
          réponseSignéeValue: buildDocument(),
        },
      });
    }
  }
}

function buildDocument() {
  return {
    content: new ReadableStream({
      start: async (controller) => {
        controller.enqueue(await buildPdf('Document manquant - Abandon traité hors Potentiel'));
        controller.close();
      },
    }),
    format: 'application/pdf',
  };
}

const buildPdf = async (text: string) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const textSize = 24;

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
  const textHeight = helveticaFont.heightAtSize(textSize);

  const x = page.getWidth() / 2 - textWidth / 2;

  page.drawText(text, {
    x: x > 0 ? x : 0,
    y: page.getHeight() / 2 - textHeight / 2,
    size: textSize,
    font: helveticaFont,
    maxWidth: page.getWidth(),
  });

  return await pdfDoc.save();
};
