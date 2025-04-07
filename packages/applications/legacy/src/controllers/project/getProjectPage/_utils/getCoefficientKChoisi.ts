import { IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/projet';
import { mediator } from 'mediateur';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

export const getCoefficientKChoisi = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  { choixCoefficientKDisponible }: { choixCoefficientKDisponible?: boolean },
) => {
  if (!choixCoefficientKDisponible) {
    return undefined;
  }
  try {
    const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    return Option.match(candidature)
      .some((c) => c.coefficientKChoisi)
      .none(() => undefined);
  } catch (error) {
    getLogger('getCoefficientKChoisi').error(
      new Error('Impossible de consulter le coefficient K choisi', {
        cause: error,
      }),
    );
    return undefined;
  }
};
