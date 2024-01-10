import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { RaccordementAggregate } from '../raccordement.aggregate';
import { DateDansLeFuturError } from '../dateDansLeFutur.error';
import { DossierRaccordementNonRéférencéError } from '../dossierRaccordementNonRéférencé.error';

export type PropositionTechniqueEtFinancièreTransmiseEventV1 = DomainEvent<
  'PropositionTechniqueEtFinancièreTransmise-V1',
  {
    dateSignature: DateTime.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

type TransmettrePropositionTechniqueEtFinancièreOptions = {
  dateSignature: DateTime.ValueType;
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export async function transmettrePropositionTechniqueEtFinancière(
  this: RaccordementAggregate,
  {
    dateSignature,
    référenceDossierRaccordement,
    identifiantProjet,
  }: TransmettrePropositionTechniqueEtFinancièreOptions,
) {
  if (dateSignature.estDansLeFutur()) {
    throw new DateDansLeFuturError();
  }

  if (this.contientLeDossier(référenceDossierRaccordement)) {
    throw new DossierRaccordementNonRéférencéError();
  }

  const event: PropositionTechniqueEtFinancièreTransmiseEventV1 = {
    type: 'PropositionTechniqueEtFinancièreTransmise-V1',
    payload: {
      dateSignature: dateSignature.formatter(),
      référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
      identifiantProjet: identifiantProjet.formatter(),
    },
  };

  await this.publish(event);
}

export function applyPropositionTechniqueEtFinancièreTransmiseEventV1(
  this: RaccordementAggregate,
  {
    payload: { dateSignature, référenceDossierRaccordement },
  }: PropositionTechniqueEtFinancièreTransmiseEventV1,
) {
  const dossier = this.récupérerDossier(référenceDossierRaccordement);
  dossier.propositionTechniqueEtFinancière.dateSignature =
    DateTime.convertirEnValueType(dateSignature);
}
