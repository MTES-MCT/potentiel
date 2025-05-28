import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { Lauréat } from '@potentiel-domain/projet';

import { AbandonAggregate } from '../abandon.aggregate';

export function applyPreuveRecandidatureTransmise(
  this: AbandonAggregate,
  {
    payload: { preuveRecandidature, transmisePar, transmiseLe },
  }: Lauréat.Abandon.PreuveRecandidatureTransmiseEvent,
) {
  this.demande.preuveRecandidature = IdentifiantProjet.convertirEnValueType(preuveRecandidature);
  this.demande.preuveRecandidatureTransmiseLe = DateTime.convertirEnValueType(transmiseLe);
  this.demande.preuveRecandidatureTransmisePar =
    IdentifiantUtilisateur.convertirEnValueType(transmisePar);
}
