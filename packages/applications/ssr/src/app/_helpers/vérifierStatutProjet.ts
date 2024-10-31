import { mediator } from 'mediateur';

import { InvalidOperationError } from '@potentiel-domain/core';
import { Abandon, Lauréat } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';

type VérifierStatutProjetProps = {
  identifiantProjet: string;
  message?: string;
};

// TODO ceci devrait être une query de type Gateway
export const vérifierQueLeProjetEstClassé = async ({
  identifiantProjet,
  message = `Vous ne pouvez pas accèder à cette page car le projet n'est pas classé`,
}: VérifierStatutProjetProps) => {
  const lauréatPromise = mediator.send<Lauréat.ConsulterLauréatQuery>({
    type: 'Lauréat.Query.ConsulterLauréat',
    data: { identifiantProjet },
  });
  const abandonPromise = mediator.send<Abandon.ConsulterAbandonQuery>({
    type: 'Lauréat.Abandon.Query.ConsulterAbandon',
    data: { identifiantProjetValue: identifiantProjet },
  });

  const [lauréat, abandon] = await Promise.all([lauréatPromise, abandonPromise]);
  if (Option.isNone(lauréat)) {
    // TODO throw notFound instead ?
    throw new InvalidOperationError(message);
  }
  if (Option.isSome(abandon) && abandon.statut.estAccordé()) {
    throw new InvalidOperationError(message);
  }
  return lauréat;
};

// TODO ceci devrait être une query de type Gateway
export const vérifierQueLeProjetEstÉliminé = async ({
  identifiantProjet,
  message = `Vous ne pouvez pas accèder à cette page car le projet n'est pas éliminé`,
}: VérifierStatutProjetProps) => {
  const éliminé = await mediator.send<Lauréat.ConsulterLauréatQuery>({
    type: 'Lauréat.Query.ConsulterLauréat',
    data: { identifiantProjet },
  });
  if (Option.isNone(éliminé)) {
    // TODO throw notFound instead ?
    throw new InvalidOperationError(message);
  }
};
