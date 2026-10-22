import { mediator } from 'mediateur';

import type { DateTime } from '@potentiel-domain/common';
import type { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

export const getRéponseSignéeAbandonAccordé = async ({
  dateDemande,
  identifiantProjet,
}: {
  dateDemande: DateTime.RawType;
  identifiantProjet: IdentifiantProjet.RawType;
}) => {
  const demande = await mediator.send<Lauréat.Abandon.ConsulterDemandeAbandonQuery>({
    type: 'Lauréat.Abandon.Query.ConsulterDemandeAbandon',
    data: {
      demandéLeValue: dateDemande,
      identifiantProjetValue: identifiantProjet,
    },
  });

  return Option.isSome(demande) && demande.demande.accord?.réponseSignée;
};
