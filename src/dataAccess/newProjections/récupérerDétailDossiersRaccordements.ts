import { Raccordement } from '@potentiel-domain/reseau';
import { mediator } from 'mediateur';
import { RécupérerDétailDossiersRaccordements } from '../../modules/project';
import { IdentifiantProjet } from '@potentiel-domain/common';

export const récupérerDétailDossiersRaccordements: RécupérerDétailDossiersRaccordements = async (
  identifiantProjet: IdentifiantProjet.ValueType,
) => {
  const { dossiers } = await mediator.send<Raccordement.ListerDossierRaccordementQuery>({
    type: 'LISTER_DOSSIER_RACCORDEMENT_QUERY',
    data: { identifiantProjetValue: identifiantProjet.formatter() },
  });
  return dossiers;
};
