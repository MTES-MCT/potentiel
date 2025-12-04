import { mediator } from 'mediateur';

import { Raccordement } from '@potentiel-applications/api-documentation';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { getUtilisateur, validate } from '#helpers';

export const transmettreDateMiseEnServiceHandler: Raccordement['transmettreDateMiseEnService'] =
  async (_, identifiantProjet, reference, body) => {
    const utilisateur = getUtilisateur();

    const { dateMiseEnService } = validate('TransmettreDateMiseEnServiceBody', body);

    await mediator.send<Lauréat.Raccordement.TransmettreDateMiseEnServiceUseCase>({
      type: 'Lauréat.Raccordement.UseCase.TransmettreDateMiseEnService',
      data: {
        identifiantProjetValue: decodeURIComponent(identifiantProjet),
        référenceDossierValue: decodeURIComponent(reference),
        dateMiseEnServiceValue: new Date(dateMiseEnService.toString()).toISOString(),
        transmiseLeValue: DateTime.now().formatter(),
        transmiseParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {};
  };
