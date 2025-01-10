import { mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { AbandonAccordéEvent } from '../../abandon';
import { SupprimerChangementReprésentantLégalCommand } from '../changement/supprimer/supprimerChangementReprésentantLégal.command';

export const handleAbandonAccordé = async ({
  payload: { identifiantProjet },
}: AbandonAccordéEvent) =>
  mediator.send<SupprimerChangementReprésentantLégalCommand>({
    type: 'Lauréat.ReprésentantLégal.Command.SupprimerChangementReprésentantLégal',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      identifiantUtilisateur: Email.system(),
      dateSuppression: DateTime.now(),
    },
  });
