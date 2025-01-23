import { mediator } from 'mediateur';

import { Raccordement } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { RécupérerDétailDossiersRaccordements } from '../../modules/project';

export const récupérerDétailDossiersRaccordements: RécupérerDétailDossiersRaccordements = async (
  identifiantProjet: IdentifiantProjet.ValueType,
) => {
  const result = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
    type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
    data: { identifiantProjetValue: identifiantProjet.formatter() },
  });
  return Option
    .match(result)
    .some((value) => value.dossiers)
    .none(() => []);
};
