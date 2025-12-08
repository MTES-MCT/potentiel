import { mediator } from 'mediateur';

import { Raccordement } from '@potentiel-applications/api-documentation';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { getUtilisateur, validate } from '#helpers';

export const modifierReferenceHandler: Raccordement['modifierReference'] = async (
  _,
  identifiantProjet,
  reference,
  body,
) => {
  const utilisateur = getUtilisateur();

  const { nouvelleReference } = validate('ModifierReferenceBody', body);

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
