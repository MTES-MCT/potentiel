import { mediator } from 'mediateur';

import { Raccordement } from '@potentiel-applications/api-documentation';
import { Lauréat } from '@potentiel-domain/projet';

import { getUtilisateur } from '#helpers';

export const transmettreDemandeComplèteHandler: Raccordement['transmettreDemandeComplète'] = async (
  _,
  identifiantProjet,
  { dateAccuseReception, reference },
) => {
  const utilisateur = getUtilisateur();

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
