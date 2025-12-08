import { mediator } from 'mediateur';

import { Raccordement } from '@potentiel-applications/api-documentation';
import { Lauréat } from '@potentiel-domain/projet';

import { getUtilisateur, validate } from '#helpers';

export const transmettreDemandeComplèteHandler: Raccordement['transmettreDemandeComplète'] = async (
  _,
  identifiantProjet,
  body,
) => {
  const utilisateur = getUtilisateur();

  const { reference, dateAccuseReception } = validate(
    'TransmettreDemandeCompleteRaccordementBody',
    body,
  );

  await mediator.send<Lauréat.Raccordement.TransmettreDemandeComplèteRaccordementUseCase>({
    type: 'Lauréat.Raccordement.UseCase.TransmettreDemandeComplèteRaccordement',
    data: {
      identifiantProjetValue: decodeURIComponent(identifiantProjet),
      référenceDossierValue: reference,
      dateQualificationValue: new Date(dateAccuseReception.toString()).toISOString(),
      transmiseParValue: utilisateur.identifiantUtilisateur.formatter(),
    },
  });

  return {};
};
