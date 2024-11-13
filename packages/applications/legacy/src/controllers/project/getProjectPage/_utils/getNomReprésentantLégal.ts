import { mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/candidature';

export const getNomReprésentantLégal = async (
  identifiantProjet: IdentifiantProjet.ValueType,
): Promise<string | undefined> => {
  try {
    const représentantLégal =
      await mediator.send<ReprésentantLégal.ConsulterReprésentantLégalQuery>({
        type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
        data: { identifiantProjet: identifiantProjet.formatter() },
      });

    if (Option.isSome(représentantLégal)) {
      return représentantLégal.nomReprésentantLégal;
    }

    const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    if (Option.isSome(candidature)) {
      return candidature.nomReprésentantLégal;
    }

    return undefined;
  } catch (error) {
    return undefined;
  }
};
