import { writeFile } from 'node:fs/promises';

import { Args, Command } from '@oclif/core';
import { mediator } from 'mediateur';
import z from 'zod';

import { DateTime } from '@potentiel-domain/common';
import { Candidature, Document, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DocumentAdapter, ProjetAdapter } from '@potentiel-infrastructure/domain-adapters';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { ExportCSV } from '@potentiel-libraries/csv';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { dbSchema, dsSchema, s3Schema } from '#helpers';

const envSchema = z.object({
  ...dbSchema.shape,
  ...dsSchema.shape,
  ...s3Schema.shape,
});
export class importerGarantiesFinancièresManquantesDepuisDN extends Command {
  static override description =
    `Importer les garanties financières manquantes suite à désignation de projets importés depuis DN`;
  static args = {
    appelOffre: Args.string({ required: true }),
    periode: Args.string({ required: true }),
  };
  async init() {
    envSchema.parse(process.env);

    Document.registerDocumentProjetCommand({
      enregistrerDocumentProjet: DocumentAdapter.téléverserDocumentProjet,
      déplacerDossierProjet: DocumentAdapter.déplacerDossierProjet,
      archiverDocumentProjet: DocumentAdapter.archiverDocumentProjet,
      enregistrerDocumentSubstitut: DocumentAdapter.enregistrerDocumentSubstitutAdapter,
    });
  }

  async run() {
    const { args } = await this.parse(importerGarantiesFinancièresManquantesDepuisDN);
    const APPEL_OFFRES = args.appelOffre;
    const PERIODE = args.periode;

    type Stats = {
      total: number;
      succès: Array<{
        identifiantProjet: IdentifiantProjet.RawType;
      }>;
      erreurs: Array<{
        identifiantProjet: IdentifiantProjet.RawType;
        cause: string;
      }>;
    };

    const stats: Stats = {
      total: 0,
      succès: [],
      erreurs: [],
    };

    try {
      const projetsAvecGFManquantes = await executeSelect<{
        id_projet: IdentifiantProjet.RawType;
        date_notification: string;
      }>(
        `
      select 
        l.payload->>'identifiantProjet' as id_projet,
        l.payload->>'notifiéLe' as date_notification
      from event_store.event_stream l
      where l.type = 'LauréatNotifié-V2'
        and l.stream_id like format('lauréat|%s#%s#%%', $1::text, $2::text)
        and not exists (
          select 1
          from event_store.event_stream gf
          where gf.stream_id = format(
            'garanties-financieres|%s',
            l.payload->>'identifiantProjet'
          )
            and gf.type = 'GarantiesFinancièresImportées-V1'
        );
    `,
        APPEL_OFFRES,
        PERIODE,
      );

      if (!projetsAvecGFManquantes.length) {
        console.info('✅ Aucun projet lauréat sans garanties financières importées');
        return;
      }

      await executeSelect(
        `DROP RULE IF EXISTS prevent_update_on_event_stream on event_store.event_stream;`,
      );

      stats.total = projetsAvecGFManquantes.length;

      console.log(`🗃️ ${stats.total} projets lauréat n'ont pas de garanties financières importées`);

      let counter = 1;
      for (const { id_projet, date_notification } of projetsAvecGFManquantes) {
        try {
          counter++;
          process.stdout.clearLine(0);
          process.stdout.write(`\r⏳ [${counter}/${stats.total}]`);

          const identifiantProjet = IdentifiantProjet.convertirEnValueType(id_projet);

          const attestationGarantiesFinancières =
            await ProjetAdapter.récupererConstitutionGarantiesFinancièresAdapter(identifiantProjet);

          if (!attestationGarantiesFinancières) {
            stats.erreurs.push({
              identifiantProjet: id_projet,
              cause: 'Aucune attestation de garanties financières trouvée dans DN pour le projet',
            });

            continue;
          }

          const dépôtGarantiesFinancières = await executeSelect<{
            type_garanties_financieres: string;
            date_echeance_gf: string | null;
          }>(
            `
            select
              payload->>'typeGarantiesFinancières' as type_garanties_financieres,
              payload->>'dateÉchéanceGf' as date_echeance_gf
            from event_store.event_stream d
            where d.type = 'CandidatureImportée-V2'
            and stream_id = format('candidature|%s', $1::text);
          `,
            id_projet,
          );

          if (!dépôtGarantiesFinancières.length) {
            stats.erreurs.push({
              identifiantProjet: id_projet,
              cause: 'Aucun dépôt de garanties financières trouvé pour le projet',
            });

            continue;
          }

          const type = dépôtGarantiesFinancières[0].type_garanties_financieres;

          if (!type) {
            stats.erreurs.push({
              identifiantProjet: id_projet,
              cause: 'Aucun type de garanties financières trouvé pour le projet',
            });
            continue;
          }

          const dateÉchéanceGF = dépôtGarantiesFinancières[0].date_echeance_gf;

          await mediator.send<Document.EnregistrerDocumentProjetCommand>({
            type: 'Document.Command.EnregistrerDocumentProjet',
            data: {
              documentProjet:
                Lauréat.GarantiesFinancières.DocumentGarantiesFinancières.attestationActuelle({
                  identifiantProjet: identifiantProjet.formatter(),
                  dateConstitution: attestationGarantiesFinancières.dateConstitution,
                  attestation: attestationGarantiesFinancières.attestation,
                }),
              content: attestationGarantiesFinancières.attestation.content,
            },
          });

          const event: Lauréat.GarantiesFinancières.GarantiesFinancièresImportéesEvent = {
            type: 'GarantiesFinancièresImportées-V1',
            payload: {
              identifiantProjet: identifiantProjet.formatter(),
              dateÉchéance: dateÉchéanceGF
                ? DateTime.convertirEnValueType(dateÉchéanceGF).formatter()
                : undefined,
              type: Candidature.TypeGarantiesFinancières.convertirEnValueType(type).formatter(),
              dateConstitution: DateTime.convertirEnValueType(
                attestationGarantiesFinancières.dateConstitution,
              ).formatter(),
              attestation: {
                format: attestationGarantiesFinancières.attestation.format,
              },
              importéLe: DateTime.convertirEnValueType(date_notification).formatter(),
            },
          };

          await publish(`garanties-financieres|${id_projet}`, {
            ...event,
            version: 1,
            created_at: date_notification,
          });

          stats.succès.push({
            identifiantProjet: id_projet,
          });
        } catch (error) {
          stats.erreurs.push({
            identifiantProjet: id_projet,
            cause: `Une erreur est survenue lors de l'import des GF : ${(error as Error).message}`,
          });
        }
      }
    } catch (error) {
      console.error(`Erreur globale : ${(error as Error).message}`);
    } finally {
      await executeSelect(`
        CREATE OR REPLACE RULE prevent_update_on_event_stream as on update to event_store.event_stream do instead
        select event_store.throw_when_trying_to_update_event();
      `);

      console.info('📊 Résultats :');
      console.info(`  ✅ ${stats.succès.length} GFs ont été récupérées sur DN`);
      console.info(`  ❌ ${stats.erreurs.length} erreurs lors de la récupération des GFs`);

      if (!stats.succès.length && !stats.erreurs.length) {
        console.info('ℹ️ Aucun fichier de résultat à générer');
        process.exit(0);
      }

      if (stats.succès.length) {
        const SUCCESS_FILE = 'importer-gf-manquantes-depuis-dn-SUCCESS.csv';
        await writeFile(
          SUCCESS_FILE,
          await ExportCSV.toCSV({
            data: stats.succès,
            fields: [
              {
                label: 'identifiantProjet',
                value: 'identifiantProjet',
              },
            ],
          }),
          'utf-8',
        );

        console.log(`✍️ Un fichier de succès a été généré (${SUCCESS_FILE})`);
      }

      if (stats.erreurs.length) {
        const ERRORS_FILE = 'importer-gf-manquantes-depuis-dn-ERRORS.csv';
        await writeFile(
          ERRORS_FILE,
          await ExportCSV.toCSV({
            data: stats.erreurs,
            fields: [
              {
                label: 'identifiantProjet',
                value: 'identifiantProjet',
              },
              {
                label: 'Erreur',
                value: 'cause',
              },
            ],
          }),
          'utf-8',
        );

        console.log(`✍️ Un fichier d'erreurs a été généré (${ERRORS_FILE})`);
      }

      console.table(stats);
    }
  }
}
