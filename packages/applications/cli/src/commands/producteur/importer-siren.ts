import { Command } from '@oclif/core';

import { executeSelect } from '@potentiel-libraries/pg-helpers';

const querySIREN = `
SELECT
    SPLIT_PART(key, '|', 2) AS identifiantProjet,    REGEXP_REPLACE(TRIM(value->>'détail.Numéro SIREN ou SIRET*'), '[^0-9]', '', 'g') as SIREN
FROM
    domain_views.projection
INNER JOIN
    domain_views.projection lau ON SPLIT_PART(dp.key, '|', 2) = SPLIT_PART(lau.key, '|', 2)
WHERE
    dp.key LIKE 'détail-candidature%'
    AND lau.key LIKE 'lauréat|%'
    AND dp.value->>'détail.Numéro SIREN ou SIRET*' IS NOT NULL
    AND dp.value->>'détail.Numéro SIREN ou SIRET*' != '';`;

// 9185 projets a date sur 9400 lauréat

export class ImporterSIRENCommand extends Command {
  async run() {
    const donnéeAValider = await executeSelect<{
      identifiantProjet: string;
      SIREN: string;
    }>(querySIREN);

    const lauréatsAvecSIRENValide = donnéeAValider
      .map((donnée) => {
        const sirenAValider = donnée.SIREN.trim().slice(0, 9);
        const isSIRENValide = /^\d{9}$/.test(sirenAValider);
        if (!isSIRENValide) {
          console.warn(
            `Le SIREN ${donnée.SIREN} pour le projet ${donnée.identifiantProjet} n'est pas valide et ne sera pas importé.`,
          );
        }
        return isSIRENValide
          ? { identifiantProjet: donnée.identifiantProjet, SIREN: sirenAValider }
          : null;
      })
      .filter(Boolean);

    let index = 0;

    for (const lauréat of lauréatsAvecSIRENValide) {
      try {
        console.log(
          `Traitement du lauréat ${index} sur ${lauréatsAvecSIRENValide.length} : ${lauréat?.identifiantProjet}`,
        );

        // evenement d'import ? Ou directement update des événement d'import du producteur
        // const event ==
        // await publish...

        index++;
      } catch (e) {
        console.error(`Erreur pour le projet abandonné ${lauréat?.identifiantProjet}  : ${e}`);
      }
    }

    console.log('Publication des événements terminée');
  }
}
