import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { AbandonAggregate } from '../abandon.aggregate';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';

const dateLégaleTransimissionPreuveRecandidature = DateTime.convertirEnValueType(
  new Date('2025-03-31'),
);

export type PreuveRecandidatureDemandéeEvent = DomainEvent<
  'PreuveRecandidatureDemandée-V1',
  {
    demandéeLe: DateTime.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

class DateLégaleTransmissionPreuveRecandidatureDépasséeError extends InvalidOperationError {
  constructor() {
    super(
      'Impossible de demander la preuve de recandidature au porteur après la date légale du 31/03/2025',
    );
  }
}

class DemandePreuveRecandidautreDéjàTransmise extends InvalidOperationError {
  constructor() {
    super('La preuve de recandidature a déjà été transmise');
  }
}

export type DemanderPreuveRecandidatureOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dateDemande: DateTime.ValueType;
};

export async function demanderPreuveRecandidature(
  this: AbandonAggregate,
  { identifiantProjet, dateDemande }: DemanderPreuveRecandidatureOptions,
) {
  if (dateDemande.estUltérieureÀ(dateLégaleTransimissionPreuveRecandidature)) {
    throw new DateLégaleTransmissionPreuveRecandidatureDépasséeError();
  }

  if (this.demande.preuveRecandidature) {
    throw new DemandePreuveRecandidautreDéjàTransmise();
  }

  const event: PreuveRecandidatureDemandéeEvent = {
    type: 'PreuveRecandidatureDemandée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      demandéeLe: dateDemande.formatter(),
    },
  };

  return this.publish(event);
}

export function applyPreuveRecandidatureDemandée(
  this: AbandonAggregate,
  { payload: { demandéeLe: relancéLe } }: PreuveRecandidatureDemandéeEvent,
) {
  this.demande.preuveRecandidatureDemandéeLe = DateTime.convertirEnValueType(relancéLe);
}
