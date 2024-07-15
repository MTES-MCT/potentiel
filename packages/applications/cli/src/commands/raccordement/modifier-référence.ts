import { Args, Command, Flags } from '@oclif/core';
import { mediator } from 'mediateur';
import { z } from 'zod';

import { bootstrap } from '@potentiel-applications/bootstrap';
import { Raccordement } from '@potentiel-domain/reseau';

import { parseCsvFile } from '../../helpers/parse-file';

const schema = z.object({
  identifiantProjet: z.string(),
  referenceDossier: z.string(),
  'referenceDossier corrigé GRD': z.string(),
});

const isUpToDate = async (row: z.infer<typeof schema>) => {
  try {
    await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
      type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
      data: {
        identifiantProjetValue: row.identifiantProjet,
        référenceDossierRaccordementValue: row.referenceDossier,
      },
    });
    return 'pas à jour';
  } catch (e) {
    if (e instanceof Error && e.message === `Le dossier de raccordement n'est pas référencé`) {
      await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
        data: {
          identifiantProjetValue: row.identifiantProjet,
          référenceDossierRaccordementValue: row['referenceDossier corrigé GRD'],
        },
      });
      return 'à jour';
    }
    return 'non trouvé';
  }
};

export default class ModifierRéférence extends Command {
  static override description = 'Modifier Référence raccordement depuis un CSV';

  static override args = {
    path: Args.string({ required: true }),
  };

  static override flags = {
    delimiter: Flags.string({ default: ';', options: [',', ';'] }),
    rerun: Flags.boolean({
      default: false,
      description: 'Ré-executer le même fichier, avec des vérifications supplémentaires',
    }),
  };

  public async run(): Promise<void> {
    console.info('Lancement du script...');
    const { args, flags } = await this.parse(ModifierRéférence);
    await bootstrap({ middlewares: [] });

    console.info('Lancement du script...');
    const data = await parseCsvFile(args.path, schema, {
      delimiter: flags.delimiter,
      ltrim: false,
      rtrim: false,
    });
    console.info(`${data.length} références à mettre à jour`);

    let success = 0;
    let upToDate = 0;

    for (const row of data) {
      const identifiantProjet = row.identifiantProjet.replace(
        /(.*)-(\d*)-(.*)-(\d*)/,
        '$1#$2#$3#$4',
      );

      if (flags.rerun) {
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
      }
      try {
        await mediator.send<Raccordement.ModifierRéférenceDossierRaccordementUseCase>({
          type: 'Réseau.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet,
            référenceDossierRaccordementActuelleValue: row.referenceDossier,
            nouvelleRéférenceDossierRaccordementValue: row['referenceDossier corrigé GRD'],
            rôleValue: 'admin',
          },
        });
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
