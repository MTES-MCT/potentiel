import { mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { AttestationConformitéTransmiseEvent } from '../../achèvement';
import { ConsulterDemandeChangementActionnaireQuery } from '../changement/consulter/consulterDemandeChangementActionnaire.query';
import { SupprimerDemandeChangementActionnaireCommand } from '../changement/supprimer/supprimerDemandeChangementActionnaire.command';

export const handleAttestationConformitéTransmise = async ({
  payload: { identifiantProjet },
}: AttestationConformitéTransmiseEvent) => {
  const demande = await mediator.send<ConsulterDemandeChangementActionnaireQuery>({
    type: 'Lauréat.Actionnaire.Query.ConsulterDemandeChangementActionnaire',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isSome(demande)) {
    await mediator.send<SupprimerDemandeChangementActionnaireCommand>({
      type: 'Lauréat.Actionnaire.Command.SupprimerDemandeChangementActionnaire',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
        identifiantUtilisateur: Email.system(),
        dateSuppression: DateTime.now(),
      },
    });
  }
};
