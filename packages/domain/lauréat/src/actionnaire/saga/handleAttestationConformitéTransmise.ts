import { mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { AttestationConformitéTransmiseEvent } from '../../achèvement';
import { ConsulterChangementActionnaireQuery } from '../changement/consulter/consulterChangementActionnaire.query';
import { SupprimerChangementActionnaireCommand } from '../changement/supprimer/supprimerChangementActionnaire.command';

export const handleAttestationConformitéTransmise = async ({
  payload: { identifiantProjet },
}: AttestationConformitéTransmiseEvent) => {
  const demande = await mediator.send<ConsulterChangementActionnaireQuery>({
    type: 'Lauréat.Actionnaire.Query.ConsulterChangementActionnaire',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isSome(demande)) {
    await mediator.send<SupprimerChangementActionnaireCommand>({
      type: 'Lauréat.Actionnaire.Command.SupprimerChangementActionnaire',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
        identifiantUtilisateur: Email.system(),
        dateSuppression: DateTime.now(),
      },
    });
  }
};
