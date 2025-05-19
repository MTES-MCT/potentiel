import { mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { SupprimerChangementPuissanceCommand } from '../changement/supprimer/supprimerChangementPuissance.command';
import { Lauréat } from '../../..';

export const abandonAccordéSaga = async ({
  payload: { identifiantProjet },
}: Lauréat.Abandon.AbandonAccordéEvent) => {
  await mediator.send<SupprimerChangementPuissanceCommand>({
    type: 'Lauréat.Puissance.Command.SupprimerChangementPuissance',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      identifiantUtilisateur: Email.system(),
      dateSuppression: DateTime.now(),
    },
  });
};
