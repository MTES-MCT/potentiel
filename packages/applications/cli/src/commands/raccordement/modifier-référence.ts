import { Args, Command, Flags } from '@oclif/core';
import { mediator } from 'mediateur';
import { z } from 'zod';

import { bootstrap } from '@potentiel-applications/bootstrap';
import { Raccordement } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';

import { parseCsvFile } from '../../helpers/parse-file';
import { parseIdentifiantProjet } from '../../helpers/parse-identifiant-projet';

const schema = z.object({
  identifiantProjet: z.string(),
  referenceDossier: z.string(),
  'referenceDossier corrigé GRD': z.string(),
});

const isUpToDate = async (row: z.infer<typeof schema>) => {
  const raccordementRefOrigine =
    await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
      type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
      data: {
        identifiantProjetValue: row.identifiantProjet,
        référenceDossierRaccordementValue: row.referenceDossier,
      },
    });
  if (Option.isNone(raccordementRefOrigine)) {
    const raccordementRefCorrigée =
      await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
        data: {
          identifiantProjetValue: row.identifiantProjet,
          référenceDossierRaccordementValue: row['referenceDossier corrigé GRD'],
        },
      });
    if (Option.isSome(raccordementRefCorrigée)) {
      return 'à jour';
    } else {
      return 'non trouvé';
    }
  }
  return 'pas à jour';
};

export default class ModifierRéférence extends Command {
  static override description = 'Modifier Référence raccordement depuis un CSV';

  static override args = {
    path: Args.string({ required: true }),
  };

  static override flags = {
    delimiter: Flags.string({ default: ';', options: [',', ';'] }),

    dryRun: Flags.boolean({
      default: false,
      description: 'Exécution test, sans mise à jour',
    }),
  };

  public async run(): Promise<void> {
    console.info('Lancement du script...');
    const { args, flags } = await this.parse(ModifierRéférence);
    await bootstrap({ middlewares: [] });

    const { parsedData: data } = await parseCsvFile(args.path, schema, {
      delimiter: flags.delimiter,
      ltrim: false,
      rtrim: false,
    });
    console.info(`${data.length} références à mettre à jour`);

    let success = 0;
    let upToDate = 0;

    for (const row of data) {
      const identifiantProjet = parseIdentifiantProjet(row.identifiantProjet);

      switch (await isUpToDate({ ...row, identifiantProjet })) {
        case 'pas à jour':
          break;
        case 'non trouvé':
          console.warn(`Non trouvé ${row.identifiantProjet}`);
          continue;
        case 'à jour':
          console.info(`Déjà à jour ${row.identifiantProjet}`);
          upToDate++;
          continue;
      }
      try {
        if (flags.dryRun) {
          console.log(
            `[DRY-RUN] Mise à jour de la référence du projet ${identifiantProjet}: ${row.referenceDossier}=>${row['referenceDossier corrigé GRD']}`,
          );
        } else {
          await mediator.send<Raccordement.ModifierRéférenceDossierRaccordementUseCase>({
            type: 'Réseau.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
            data: {
              identifiantProjetValue: identifiantProjet,
              référenceDossierRaccordementActuelleValue: row.referenceDossier,
              nouvelleRéférenceDossierRaccordementValue: row['referenceDossier corrigé GRD'],
              rôleValue: 'admin',
            },
          });
        }
        success++;
      } catch (e) {
        console.warn(`Erreur mise à jour ${row.identifiantProjet}`, e);
      }
    }

    console.log(`${success} références mises à jour, ${upToDate} déjà à jour`);
    console.info('Fin du script ✨');

    process.exit(0);
  }
}
