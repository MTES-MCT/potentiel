import { mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { RécupérerDétailDossiersRaccordements } from '../../modules/project';
import { Lauréat } from '@potentiel-domain/projet';

export const récupérerDétailDossiersRaccordements: RécupérerDétailDossiersRaccordements = async (
  identifiantProjet: IdentifiantProjet.ValueType,
) => {
  const result = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
    type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
    data: { identifiantProjetValue: identifiantProjet.formatter() },
  });
  return Option.match(result)
    .some((value) => value.dossiers)
    .none(() => []);
};
