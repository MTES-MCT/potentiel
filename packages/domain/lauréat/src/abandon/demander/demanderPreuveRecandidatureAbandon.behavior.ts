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
      'Impossible de transmettre une preuve de recandidature après la date légale du 31/03/2025',
    );
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

  // si pas de preuve de recandidure et diff entre la date du jour et la date d'accord de l'abandon est à 3 mois
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
