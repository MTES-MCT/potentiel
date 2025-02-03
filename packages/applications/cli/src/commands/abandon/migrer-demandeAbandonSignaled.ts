import { Command, Flags } from '@oclif/core';
import { S3 } from '@aws-sdk/client-s3';
// import { mediator } from 'mediateur';

import { executeSelect } from '@potentiel-libraries/pg-helpers';
// import { Abandon } from '@potentiel-domain/laureat';

export class MigrerDemandeAbandonSignaled extends Command {
  static flags = {
    dryRun: Flags.boolean(),
  };

  async run(): Promise<void> {
    try {
      // const { flags } = await this.parse(MigrerDemandeAbandonSignaled);

      const legacyEvents = await executeSelect<{
        legacyProjectId: string;
        identifiantProjet: string;
        dateAccord: string;
        pjIdDemandeAbandon: string;
      }>(
        `select
            payload->>'projectId' as "legacyProjectId", 	
            format(
              '%s#%s#%s#%s',
              p."appelOffreId",
              p."periodeId",
              p."familleId",
              p."numeroCRE"
            ) as "identifiantProjet", 
            payload->>'decidedOn' as "dateAccord",
            payload->>'attachments' as "pjIdDemandeAbandon"
          from "eventStores" es 
          join "projects" p on p.id::text = es.payload->>'projectId'
          where es."type" = 'DemandeAbandonSignaled';`,
      );

      if (!legacyEvents.length) {
        console.log('ℹ️ No legacy events found');
        process.exit(0);
      }

      const bucket = new S3({
        endpoint: process.env.S3_ENDPOINT as string,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
        },
        forcePathStyle: true,
      });

      console.log(`ℹ️ ${legacyEvents.length} legacy events to migrate`);

      for (const {
        // legacyProjectId,
        // identifiantProjet,
        // dateAccord,
        pjIdDemandeAbandon,
      } of legacyEvents) {
        const document = await executeSelect<{ storedAt: string }>(
          'select "storedAt" from "files" where id = $1',
          JSON.parse(pjIdDemandeAbandon)[0].id,
        );

        if (!document.length) {
          console.log('ℹ No document found');
          continue;
        }
        const { storedAt } = document[0];

        console.log('document', document[0]);

        // await mediator.send<Abandon.DemanderAbandonUseCase>({
        //   type: 'Lauréat.Abandon.UseCase.DemanderAbandon',
        //   data: {
        //     identifiantProjetValue,
        //     dateDemandeValue,
        //     identifiantUtilisateurValue,
        //     raisonValue,
        //   },
        // });
      }

      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}
