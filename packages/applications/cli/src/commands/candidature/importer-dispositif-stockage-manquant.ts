import { Command } from '@oclif/core';
import zod from 'zod';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { getDémarcheAvecDossiers } from '@potentiel-infrastructure/dn-api-client';
import { Option } from '@potentiel-libraries/monads';
import { executeQuery, executeSelect } from '@potentiel-libraries/pg-helpers';

import { dbSchema, dnOptionalSchema, dnSchema } from '#helpers';

export class ImporterDispositifStockageManquantCommand extends Command {
  async init() {
    const envSchema = zod.object({
      ...dbSchema.shape,
      ...dnSchema.shape,
      ...dnOptionalSchema.shape,
    });
    envSchema.parse(process.env);
  }

  async run() {
    try {
      // Lister Lauréats sans dispositif de stockage

      const lauréatsPPE2PetitPVP2SansStockage = await executeSelect<{ id_projet: string }>(`     
        select l.value->>'identifiantProjet' as id_projet
        from domain_views.projection l
        join domain_views.projection i on l.value->>'identifiantProjet' = i.value->>'identifiantProjet'
        where l.key like 'lauréat|PPE2 - Petit PV#2#%'
        and i.key like 'installation|%'
        and i.value->>'dispositifDeStockage.installationAvecDispositifDeStockage' = 'false';
      ;`);

      const numerosCRE = lauréatsPPE2PetitPVP2SansStockage.map(({ id_projet }) =>
        Number(IdentifiantProjet.convertirEnValueType(id_projet).numéroCRE),
      );

      // Fetch dossiers DN

      console.log(
        `Récupération des dossiers DN pour les ${numerosCRE.length} projets lauréats sans dispositif de stockage`,
      );

      const BATCH_SIZE = 300;

      const dossiersDN = [];

      for (let i = 0; i < numerosCRE.length; i += BATCH_SIZE) {
        const batch = numerosCRE.slice(i, i + BATCH_SIZE);

        console.log(
          `Récupération du batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(numerosCRE.length / BATCH_SIZE)}`,
        );

        const dossiers = await getDémarcheAvecDossiers({
          démarcheId: 149492,
          dossiersIds: batch,
        });

        if (Option.isSome(dossiers)) {
          dossiersDN.push(...dossiers);
        }
        await new Promise((resolve) => setTimeout(resolve, 45000));
      }

      if (!dossiersDN.length) {
        throw new Error(`Impossible de récupérer les dossiers`);
      }

      console.log(`${dossiersDN.length} dossiers récupérés depuis DN`);

      const dossiersÀCorriger = dossiersDN.filter(
        (dossier) =>
          dossier.dépôt.dispositifDeStockage?.installationAvecDispositifDeStockage === true &&
          dossier.dépôt.dispositifDeStockage?.capacitéDuDispositifDeStockageEnKWh !== undefined &&
          dossier.dépôt.dispositifDeStockage?.puissanceDuDispositifDeStockageEnKW !== undefined,
      );
      console.log(
        `${dossiersÀCorriger.length} projets à corriger (dispositif de stockage manquant)`,
      );

      await executeSelect(
        `DROP RULE IF EXISTS prevent_update_on_event_stream on event_store.event_stream;`,
      );

      // 3. Si dispositif de stockage corriger l'installation du lauréat

      let count = 0;

      for (const dossierDN of dossiersÀCorriger) {
        await executeQuery(
          `
            update event_store.event_stream
            set payload = jsonb_set(
                payload,
                '{dispositifDeStockage}',
                jsonb_build_object(
                    'installationAvecDispositifDeStockage', true,
                    'puissanceDuDispositifDeStockageEnKW', $1::numeric,
                    'capacitéDuDispositifDeStockageEnKWh', $2::numeric
                ),
                true
            )
            where stream_id = 'installation|' || $3
            and type = 'InstallationImportée-V1';
            `,
          dossierDN.dépôt.dispositifDeStockage?.puissanceDuDispositifDeStockageEnKW,
          dossierDN.dépôt.dispositifDeStockage?.capacitéDuDispositifDeStockageEnKWh,
          IdentifiantProjet.convertirEnValueType(
            `PPE2 - Petit PV#2##${dossierDN.numeroDN}`,
          ).formatter(),
        );
        count++;
        process.stdout.write(`\r⏳ [${count}/${dossiersÀCorriger.length}] projets corrigés`);
      }
      console.log(`\n✅ ${count} projets corrigés`);
    } catch (error) {
      console.log(error);
    } finally {
      await executeSelect(`
        CREATE OR REPLACE RULE prevent_update_on_event_stream as on update to event_store.event_stream do instead
        select event_store.throw_when_trying_to_update_event();
      `);
    }
  }
}
