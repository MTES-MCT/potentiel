import { mediator } from 'mediateur';

import { Raccordement } from '@potentiel-applications/api-documentation';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { getUtilisateur } from '#helpers';

export const modifierReferenceHandler: Raccordement['modifierReference'] = async (
  _,
  identifiantProjet,
  reference,
  { nouvelleReference },
) => {
  const utilisateur = getUtilisateur();

  await mediator.send<Lauréat.Raccordement.ModifierRéférenceDossierRaccordementUseCase>({
    type: 'Lauréat.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
    data: {
      identifiantProjetValue: decodeURIComponent(identifiantProjet),
      référenceDossierRaccordementActuelleValue: decodeURIComponent(reference),
      nouvelleRéférenceDossierRaccordementValue: nouvelleReference,
      modifiéeLeValue: DateTime.now().formatter(),
      modifiéeParValue: utilisateur.identifiantUtilisateur.formatter(),
      rôleValue: utilisateur.rôle.nom,
    },
  });

  return {};
};
