import { Command } from '@oclif/core';
import z from 'zod';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { ProjetAdapter } from '@potentiel-infrastructure/domain-adapters';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { dbSchema } from '#helpers';

const envSchema = z.object({
  ...dbSchema.shape,
});

export class SupprimerTâchesRaccordementCommand extends Command {
  async init() {
    envSchema.parse(process.env);
  }

  async run() {
    await this.parse(SupprimerTâchesRaccordementCommand);

    const projetsAvecTâcheEnTrop = await executeSelect<{
      id: IdentifiantProjet.RawType;
    }>(`
SELECT racc.value->>'identifiantProjet' as id
FROM domain_views.projection racc
JOIN domain_views.projection t
  ON racc.value->>'identifiantProjet'
   = t.value->>'identifiantProjet'
WHERE racc.key LIKE 'dossier-raccordement|%'
  AND (racc.value->>'conventionDeRaccordementDirecte.dateSignature' IS NOT NULL OR (racc.value->>'propositionTechniqueEtFinancière.dateSignature' IS NOT NULL AND racc.value->>'conventionDeRaccordement.dateSignature' IS NOT NULL))
  AND t.key LIKE 'tâche|%'
  AND t.value->>'typeTâche' IN (
    'raccordement.transmettre-convention-de-raccordement',
    'raccordement.transmettre-proposition-technique-et-financière',
    'raccordement.transmettre-un-document'
  );
`);

    if (!projetsAvecTâcheEnTrop.length) {
      console.info('ℹ️ Aucun projet avec une tâche en trop \n\n');
      return;
    }

    const stats = {
      total: projetsAvecTâcheEnTrop.length,
      succès: 0,
      échec: 0,
    };

    for (const { id } of projetsAvecTâcheEnTrop) {
      try {
        const aggregate = await ProjetAdapter.getProjetAggregateRootAdapter(
          IdentifiantProjet.convertirEnValueType(id),
        );

        await aggregate.lauréat.raccordement.mettreÀJourTâchesEtTâchesPlanifiées({
          inclureTâcheGestionnaireRéseauInconnu: true,
        });

        console.log(`✅ Projet ${id} corrigé`);

        stats.succès++;
      } catch (error) {
        console.error(`❌ Erreur pour le projet ${id}  : ${error}`);
        stats.échec++;
      }
    }
    console.log(
      `\r\nStatistiques : ${stats.succès} succès, ${stats.échec} échec sur ${stats.total} projets`,
    );
  }
}
