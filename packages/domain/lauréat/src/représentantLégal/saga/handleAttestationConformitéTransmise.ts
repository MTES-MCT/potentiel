import { mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { AnnulerTâchePlanifiéeCommand } from '@potentiel-domain/tache-planifiee';

import { SupprimerChangementReprésentantLégalCommand } from '../changement/supprimer/supprimerChangementReprésentantLégal.command';
import { ConsulterChangementReprésentantLégalQuery } from '../changement/consulter/consulterChangementReprésentantLégal.query';
import { TypeTâchePlanifiéeChangementReprésentantLégal } from '..';
import { AttestationConformitéTransmiseEvent } from '../../achèvement';

export const handleAttestationConformitéTransmise = async ({
  payload: { identifiantProjet },
}: AttestationConformitéTransmiseEvent) => {
  const demande = await mediator.send<ConsulterChangementReprésentantLégalQuery>({
    type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isSome(demande)) {
    await mediator.send<SupprimerChangementReprésentantLégalCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.SupprimerChangementReprésentantLégal',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
        identifiantUtilisateur: Email.system(),
        dateSuppression: DateTime.now(),
      },
    });
  }

  await mediator.send<AnnulerTâchePlanifiéeCommand>({
    type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      typeTâchePlanifiée:
        TypeTâchePlanifiéeChangementReprésentantLégal.gestionAutomatiqueDemandeChangement.type,
    },
  });

  await mediator.send<AnnulerTâchePlanifiéeCommand>({
    type: 'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      typeTâchePlanifiée:
        TypeTâchePlanifiéeChangementReprésentantLégal.rappelInstructionÀDeuxMois.type,
    },
  });
};
