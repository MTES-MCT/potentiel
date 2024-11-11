import { mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { Option } from '@potentiel-libraries/monads';

export const getNomReprésentantLégal = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  legacyDefaultNomReprésentantLégal: string,
): Promise<string> => {
  try {
    const représentantLégal =
      await mediator.send<ReprésentantLégal.ConsulterReprésentantLégalQuery>({
        type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
        data: { identifiantProjetValue: identifiantProjet.formatter() },
      });

    if (Option.isNone(représentantLégal)) {
      return legacyDefaultNomReprésentantLégal;
    }

    return représentantLégal.nomReprésentantLégal;
  } catch (error) {
    return legacyDefaultNomReprésentantLégal;
  }
};
