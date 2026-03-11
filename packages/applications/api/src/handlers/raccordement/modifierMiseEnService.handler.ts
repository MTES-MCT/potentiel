import { mediator } from 'mediateur';

import { Raccordement } from '@potentiel-applications/api-documentation';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { getUtilisateur, validate } from '#helpers';

export const modifierDateMiseEnServiceHandler: Raccordement['modifierMiseEnService'] = async (
  _,
  identifiantProjet,
  reference,
  body,
) => {
  const utilisateur = getUtilisateur();

  const { dateMiseEnService } = validate('MiseEnServiceBody', body);

  await mediator.send<Lauréat.Raccordement.ModifierDateMiseEnServiceUseCase>({
    type: 'Lauréat.Raccordement.UseCase.ModifierDateMiseEnService',
    data: {
      identifiantProjetValue: decodeURIComponent(identifiantProjet),
      référenceDossierValue: decodeURIComponent(reference),
      dateMiseEnServiceValue: new Date(dateMiseEnService.toString()).toISOString(),
      modifiéeLeValue: DateTime.now().formatter(),
      modifiéeParValue: utilisateur.identifiantUtilisateur.formatter(),
    },
  });

  return {};
};
