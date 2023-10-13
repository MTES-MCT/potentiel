import {
  ConsulterDossierRaccordementQuery,
  DossierRaccordementReadModel,
  ListerDossiersRaccordementQuery,
} from '@potentiel/domain-views';
import { isSome } from '@potentiel/monads';
import {
  IdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
} from '@potentiel/domain-usecases';
import { mediator } from 'mediateur';
import { RécupérerDétailDossiersRaccordements } from '../../modules/project';

export const récupérerDétailDossiersRaccordements: RécupérerDétailDossiersRaccordements = async (
  identifiantProjet: IdentifiantProjet,
) => {
  const { références } = await mediator.send<ListerDossiersRaccordementQuery>({
    type: 'LISTER_DOSSIER_RACCORDEMENT_QUERY',
    data: { identifiantProjet },
  });

  if (références.length > 0) {
    const dossiers: Array<DossierRaccordementReadModel> = (
      await Promise.all(
        références.map(async (référence) => {
          const dossier = await mediator.send<ConsulterDossierRaccordementQuery>({
            type: 'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
            data: {
              identifiantProjet,
              référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(référence),
            },
          });

          return dossier;
        }),
      )
    ).filter(isSome);
    return dossiers;
  }
};
