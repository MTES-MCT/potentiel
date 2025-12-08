import { mediator } from 'mediateur';

import { AchevementV1 } from '@potentiel-applications/api-documentation';
import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { getUtilisateur, validate } from '#helpers';

export const transmettreDateAchevementHandler: AchevementV1['transmettreDateDAchevement'] = async (
  _,
  identifiantProjet,
  body,
) => {
  const utilisateur = getUtilisateur();

  const { dateAchevement } = validate('TransmettreDateAchevementBody', body);

  await mediator.send<Lauréat.Achèvement.TransmettreDateAchèvementUseCase>({
    type: 'Lauréat.Achèvement.UseCase.TransmettreDateAchèvement',
    data: {
      identifiantProjetValue: decodeURIComponent(identifiantProjet),
      dateAchèvementValue: new Date(dateAchevement.toString()).toISOString(),
      transmiseLeValue: DateTime.now().formatter(),
      transmiseParValue: utilisateur.identifiantUtilisateur.formatter(),
    },
  });

  return {};
};
