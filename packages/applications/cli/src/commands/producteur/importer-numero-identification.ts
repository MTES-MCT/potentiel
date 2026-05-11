import { Command } from '@oclif/core';

import { executeSelect } from '@potentiel-libraries/pg-helpers';

const query = `
SELECT
    SPLIT_PART(key, '|', 2) AS identifiantProjet, value->>'détail.Numéro SIREN ou SIRET*' as value
FROM
    domain_views.projection dp
WHERE
    dp.key LIKE 'détail-candidature%'
    AND dp.value->>'détail.Numéro SIREN ou SIRET*' IS NOT NULL
    AND dp.value->>'détail.Numéro SIREN ou SIRET*' <> '';`;

export class ImporterSirenEtSiretCommand extends Command {
  async run() {
    const donnéeAValider = await executeSelect<{
      identifiantProjet: string;
      value: string;
    }>(query);

    const candidatsAvecNuméroValide = donnéeAValider
      .map((donnée) => {
        // supprime tous les caractères ou espace qui ne sont pas des chiffres
        const numéroAValider = donnée.value.trim().replace(/\D/g, '');

        // vérifier si il s'agit d'un SIREN ou d'un SIRET ou si la valeur est invalide
        const isSiret = numéroAValider.length === 14;
        const isSiren = numéroAValider.length === 9;

        if (!isSiret && !isSiren) {
          console.warn(
            `Le numéro d'identification ${donnée.value} pour le projet ${donnée.identifiantProjet} n'est pas valide et ne sera pas importé.`,
          );
          return null;
        }

        return {
          identifiantProjet: donnée.identifiantProjet,
          numéroIdentification: {
            siret: isSiret ? numéroAValider : undefined,
            siren: isSiren ? numéroAValider : undefined,
          },
        };
      })
      .filter(Boolean);

    let index = 0;

    console.log(`Mise à jour des ${candidatsAvecNuméroValide.length} candidats`);

    for (const candidat of candidatsAvecNuméroValide) {
      try {
        console.log(
          `Traitement du candidat n°${index} sur ${candidatsAvecNuméroValide.length} : ${candidat?.identifiantProjet}`,
        );

        // update des événements d'import de candidature

        // update des événement de correction de candidature (avec l'ancienne valeur)

        // Partir pour les lauréats
        // update des événements d'import des producteurs (lauréat)
        // update des événement de modification ou de changement des producteurs (remettre SIRET à undefined ? Décider avec le métier)

        index++;
      } catch (e) {
        console.error(`❌ Erreur pour le projet ${candidat?.identifiantProjet}  : ${e}`);
      }
    }

    console.log(`🥳 ${index} candidats mise à jour`);
    console.log('🥳 Publication des événements terminée');
  }
}
