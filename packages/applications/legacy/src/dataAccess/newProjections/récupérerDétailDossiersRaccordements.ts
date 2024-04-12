import { Raccordement } from '@potentiel-domain/reseau';
import { mediator } from 'mediateur';
import { RécupérerDétailDossiersRaccordements } from '../../modules/project';
import { IdentifiantProjet } from '@potentiel-domain/common';

export const récupérerDétailDossiersRaccordements: RécupérerDétailDossiersRaccordements = async (
  identifiantProjet: IdentifiantProjet.ValueType,
) => {
  const { dossiers } = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
    type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
    data: { identifiantProjetValue: identifiantProjet.formatter() },
  });
  return dossiers;
};
