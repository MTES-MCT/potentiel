import { Args, Command, Flags } from '@oclif/core';
import { mediator } from 'mediateur';
import { z } from 'zod';

import { bootstrap } from '@potentiel-applications/bootstrap';
import { Raccordement } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';

import { parseCsvFile } from '../../helpers/parse-file';
import { parseIdentifiantProjet } from '../../helpers/parse-identifiant-projet';

const schema = z.object({
  identifiantProjet: z.string(),
  référenceDossierRaccordement: z.string(),
  dateMiseEnService: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, {
      message: "Le format de la date n'est pas respecté (format attendu : JJ/MM/AAAA)",
    })
    .transform((val) => {
      const [day, month, year] = val.split('/');
      return new Date(`${year}-${month}-${day}`);
    }),
});

const isUpToDate = async (row: z.infer<typeof schema>) => {
  const raccordement = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
    type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
    data: {
      identifiantProjetValue: row.identifiantProjet,
    },
  });

  if (Option.isNone(raccordement)) {
    return 'raccordement non trouvé';
  }

  const dossier = raccordement.dossiers.find((x) =>
    x.référence.estÉgaleÀ(
      Raccordement.RéférenceDossierRaccordement.convertirEnValueType(
        row.référenceDossierRaccordement,
      ),
    ),
  );
  if (!dossier) {
    return 'dossier non trouvé';
  }
  if (
    dossier.miseEnService?.dateMiseEnService?.estÉgaleÀ(
      DateTime.convertirEnValueType(row.dateMiseEnService),
    )
  ) {
    return 'à jour';
  }
  return 'pas à jour';
};

export default class ImporterDateMiseEnService extends Command {
  static override description = 'Importer dates MES depuis un CSV';

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
    const { args, flags } = await this.parse(ImporterDateMiseEnService);
    await bootstrap({ middlewares: [] });

    const { parsedData: data } = await parseCsvFile(args.path, schema, {
      delimiter: flags.delimiter,
    });
    console.info(`${data.length} raccordements à mettre à jour`);

    let success = 0;
    let upToDate = 0;

    for (const row of data) {
      const identifiantProjet = parseIdentifiantProjet(row.identifiantProjet);

      switch (await isUpToDate({ ...row, identifiantProjet })) {
        case 'pas à jour':
          break;
        case 'raccordement non trouvé':
          console.warn(`Raccordement non trouvé ${row.identifiantProjet}`);
          continue;
        case 'dossier non trouvé':
          console.warn(
            `Dossier non trouvé ${row.identifiantProjet}/${row.référenceDossierRaccordement}`,
          );
          continue;
        case 'à jour':
          console.info(`Déjà à jour ${row.identifiantProjet}`);
          upToDate++;
          continue;
      }

      try {
        if (flags.dryRun) {
          console.log(
            `[DRY-RUN] Mise à jour du raccordement du projet ${identifiantProjet}, dossier ${row.référenceDossierRaccordement}: ${row.dateMiseEnService})`,
          );
        } else {
          await mediator.send<Raccordement.TransmettreDateMiseEnServiceUseCase>({
            type: 'Réseau.Raccordement.UseCase.TransmettreDateMiseEnService',
            data: {
              identifiantProjetValue: identifiantProjet,
              référenceDossierValue: row.référenceDossierRaccordement,
              dateMiseEnServiceValue: row.dateMiseEnService.toISOString(),
            },
          });
        }
        success++;
      } catch (e) {
        console.warn(`Erreur mise à jour ${row.identifiantProjet}`, e);
      }
    }

    console.log(`${success} dates de MES mises à jour, ${upToDate} déjà à jour`);
    console.info('Fin du script ✨');

    process.exit(0);
  }
}
