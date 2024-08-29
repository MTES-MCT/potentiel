import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { RaccordementAggregate } from '../raccordement.aggregate';
import { DateDansLeFuturError } from '../dateDansLeFutur.error';
import { DossierNonRéférencéPourLeRaccordementDuProjetError } from '../dossierNonRéférencéPourLeRaccordementDuProjet.error';

/**
 * @deprecated Utilisez PropositionTechniqueEtFinancièreTransmiseEvent à la place.
 * Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type PropositionTechniqueEtFinancièreTransmiseEventV1 = DomainEvent<
  'PropositionTechniqueEtFinancièreTransmise-V1',
  {
    dateSignature: DateTime.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

/**
 * @deprecated Utilisez PropositionTechniqueEtFinancièreTransmiseEvent à la place.
 * Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type PropositionTechniqueEtFinancièreSignéeTransmiseEventV1 = DomainEvent<
  'PropositionTechniqueEtFinancièreSignéeTransmise-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    format: string;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
  }
>;

export type PropositionTechniqueEtFinancièreTransmiseEvent = DomainEvent<
  'PropositionTechniqueEtFinancièreTransmise-V2',
  {
    dateSignature: DateTime.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    propositionTechniqueEtFinancièreSignée: {
      format: string;
    };
  }
>;

type TransmettrePropositionTechniqueEtFinancièreOptions = {
  dateSignature: DateTime.ValueType;
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  formatPropositionTechniqueEtFinancièreSignée: string;
};

export async function transmettrePropositionTechniqueEtFinancière(
  this: RaccordementAggregate,
  {
    dateSignature,
    référenceDossierRaccordement,
    identifiantProjet,
    formatPropositionTechniqueEtFinancièreSignée,
  }: TransmettrePropositionTechniqueEtFinancièreOptions,
) {
  if (dateSignature.estDansLeFutur()) {
    throw new DateDansLeFuturError();
  }

  if (!this.contientLeDossier(référenceDossierRaccordement)) {
    throw new DossierNonRéférencéPourLeRaccordementDuProjetError();
  }

  const event: PropositionTechniqueEtFinancièreTransmiseEvent = {
    type: 'PropositionTechniqueEtFinancièreTransmise-V2',
    payload: {
      dateSignature: dateSignature.formatter(),
      référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
      identifiantProjet: identifiantProjet.formatter(),
      propositionTechniqueEtFinancièreSignée: {
        format: formatPropositionTechniqueEtFinancièreSignée,
      },
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

export function applyPropositionTechniqueEtFinancièreSignéeTransmiseEventV1(
  this: RaccordementAggregate,
  {
    payload: { référenceDossierRaccordement, format },
  }: PropositionTechniqueEtFinancièreSignéeTransmiseEventV1,
) {
  const dossier = this.récupérerDossier(référenceDossierRaccordement);
  dossier.propositionTechniqueEtFinancière.format = format;
}

export function applyPropositionTechniqueEtFinancièreTransmiseEventV2(
  this: RaccordementAggregate,
  {
    payload: {
      identifiantProjet,
      dateSignature,
      référenceDossierRaccordement,
      propositionTechniqueEtFinancièreSignée: { format },
    },
  }: PropositionTechniqueEtFinancièreTransmiseEvent,
) {
  applyPropositionTechniqueEtFinancièreTransmiseEventV1.bind(this)({
    type: 'PropositionTechniqueEtFinancièreTransmise-V1',
    payload: {
      dateSignature,
      identifiantProjet,
      référenceDossierRaccordement,
    },
  });
  applyPropositionTechniqueEtFinancièreSignéeTransmiseEventV1.bind(this)({
    type: 'PropositionTechniqueEtFinancièreSignéeTransmise-V1',
    payload: {
      format,
      identifiantProjet,
      référenceDossierRaccordement,
    },
  });
}
