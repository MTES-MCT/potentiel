import { Args, Command, Flags } from '@oclif/core';
import { mediator } from 'mediateur';
import { z } from 'zod';

import {
  GestionnaireRéseau,
  registerRéseauQueries,
  registerRéseauUseCases,
} from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  countProjection,
  findProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projections';
import { Raccordement, registerLauréatQueries } from '@potentiel-domain/laureat';
import {
  consulterCahierDesChargesChoisiAdapter,
  récupérerIdentifiantsProjetParEmailPorteurAdapter,
} from '@potentiel-infrastructure/domain-adapters';

import { parseCsvFile } from '../../helpers/parse-file';
import { parseIdentifiantProjet } from '../../helpers/parse-identifiant-projet';

registerRéseauQueries({
  find: findProjection,
  list: listProjection,
});

registerRéseauUseCases({
  loadAggregate: loadAggregate,
});

registerLauréatQueries({
  find: findProjection,
  list: listProjection,
  count: countProjection,
  récupérerIdentifiantsProjetParEmailPorteur: récupérerIdentifiantsProjetParEmailPorteurAdapter,
  consulterCahierDesChargesAdapter: consulterCahierDesChargesChoisiAdapter,
});

const schema = z.object({
  identifiantProjet: z.string(),
  gestionnaireRéseau: z.string(),
});

const isUpToDate = async (row: z.infer<typeof schema>) => {
  const gestionnaire =
    await mediator.send<Raccordement.ConsulterGestionnaireRéseauRaccordementQuery>({
      type: 'Lauréat.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement',
      data: {
        identifiantProjetValue: row.identifiantProjet,
      },
    });

  if (Option.isSome(gestionnaire) && gestionnaire.raisonSociale === row.gestionnaireRéseau) {
    return 'à jour';
  }
  return 'pas à jour';
};

export default class ModifierGRD extends Command {
  static override description = 'Modifier GRD depuis un CSV';

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
    const { args, flags } = await this.parse(ModifierGRD);

    const { parsedData: data } = await parseCsvFile(args.path, schema, {
      delimiter: flags.delimiter,
      ltrim: false,
      rtrim: false,
    });
    console.info(`${data.length} GRD à mettre à jour`);

    let success = 0;
    let upToDate = 0;

    const codeEICGestionnaireParNom: Record<string, string> = {};
    const getIdentifiantGestionnaireRéseau = async (gestionnaireRéseau: string) => {
      if (!codeEICGestionnaireParNom[gestionnaireRéseau]) {
        const gestionnaire = await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
          type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
          data: {
            raisonSociale: gestionnaireRéseau,
          },
        });
        if (gestionnaire.items.length === 0) {
          throw new Error(`Aucun GRD trouvé avec le nom ${gestionnaireRéseau}`);
        }
        if (gestionnaire.items.length > 1) {
          throw new Error(`Plusieurs GRDs trouvés avec le nom ${gestionnaireRéseau}`);
        }
        codeEICGestionnaireParNom[gestionnaireRéseau] =
          gestionnaire.items[0].identifiantGestionnaireRéseau.codeEIC;
      }

      return codeEICGestionnaireParNom[gestionnaireRéseau];
    };

    for (const row of data) {
      const identifiantProjet = parseIdentifiantProjet(row.identifiantProjet);
      const identifiantGestionnaireRéseau = await getIdentifiantGestionnaireRéseau(
        row.gestionnaireRéseau,
      );

      switch (await isUpToDate({ ...row, identifiantProjet })) {
        case 'pas à jour':
          break;
        case 'à jour':
          console.info(`Déjà à jour ${row.identifiantProjet}`);
          upToDate++;
          continue;
      }

      try {
        if (flags.dryRun) {
          console.log(
            `[DRY-RUN] Mise à jour du GRD du projet ${identifiantProjet}: ${row.gestionnaireRéseau} (${identifiantGestionnaireRéseau})`,
          );
        } else {
          await mediator.send<Raccordement.ModifierGestionnaireRéseauRaccordementUseCase>({
            type: 'Lauréat.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
            data: {
              identifiantProjetValue: identifiantProjet,
              identifiantGestionnaireRéseauValue: identifiantGestionnaireRéseau,
              rôleValue: 'admin',
            },
          });
        }
        success++;
      } catch (e) {
        console.warn(`Erreur mise à jour ${row.identifiantProjet}`, e);
      }
    }

    console.log(`${success} GRD mis à jour, ${upToDate} déjà à jour`);
    console.info('Fin du script ✨');

    process.exit(0);
  }
}
