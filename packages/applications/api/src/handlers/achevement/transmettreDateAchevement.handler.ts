import { mediator } from 'mediateur';

import type { AchevementV1 } from '@potentiel-applications/api-documentation';
import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

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
