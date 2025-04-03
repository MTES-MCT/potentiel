import { mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { AbandonAccordéEvent } from '../../abandon';
import { SupprimerChangementPuissanceCommand } from '../changement/supprimer/supprimerChangementPuissance.command';

export const abandonAccordéSaga = async ({
  payload: { identifiantProjet },
}: AbandonAccordéEvent) => {
  await mediator.send<SupprimerChangementPuissanceCommand>({
    type: 'Lauréat.Puissance.Command.SupprimerChangementPuissance',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      identifiantUtilisateur: Email.system(),
      dateSuppression: DateTime.now(),
    },
  });
};
