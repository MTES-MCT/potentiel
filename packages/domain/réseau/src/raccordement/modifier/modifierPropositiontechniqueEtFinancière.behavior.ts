import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { RaccordementAggregate } from '../raccordement.aggregate';
import { DateDansLeFuturError } from '../dateDansLeFutur.error';
import { DossierNonRéférencéPourLeRaccordementDuProjetError } from '../dossierNonRéférencéPourLeRaccordementDuProjet.error';

/**
 * @deprecated Utilisez PropositionTechniqueEtFinancièreModifiéeEvent à la place. Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type PropositionTechniqueEtFinancièreModifiéeEventV1 = DomainEvent<
  'PropositionTechniqueEtFinancièreModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateSignature: DateTime.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
  }
>;

export type PropositionTechniqueEtFinancièreModifiéeEvent = DomainEvent<
  'PropositionTechniqueEtFinancièreModifiée-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateSignature: DateTime.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    propositionTechniqueEtFinancièreSignée: {
      format: string;
    };
  }
>;

type ModifierPropositionTechniqueEtFinancièreOptions = {
  dateSignature: DateTime.ValueType;
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  formatPropositionTechniqueEtFinancièreSignée: string;
};

export async function modifierPropositionTechniqueEtFinancière(
  this: RaccordementAggregate,
  {
    dateSignature,
    référenceDossierRaccordement,
    identifiantProjet,
    formatPropositionTechniqueEtFinancièreSignée,
  }: ModifierPropositionTechniqueEtFinancièreOptions,
) {
  if (dateSignature.estDansLeFutur()) {
    throw new DateDansLeFuturError();
  }

  if (!this.contientLeDossier(référenceDossierRaccordement)) {
    throw new DossierNonRéférencéPourLeRaccordementDuProjetError();
  }

  const event: PropositionTechniqueEtFinancièreModifiéeEvent = {
    type: 'PropositionTechniqueEtFinancièreModifiée-V2',
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

export function applyPropositionTechniqueEtFinancièreModifiéeEventV1(
  this: RaccordementAggregate,
  {
    payload: { dateSignature, référenceDossierRaccordement },
  }: PropositionTechniqueEtFinancièreModifiéeEventV1,
) {
  const dossier = this.récupérerDossier(référenceDossierRaccordement);

  dossier.propositionTechniqueEtFinancière.dateSignature =
    DateTime.convertirEnValueType(dateSignature);
}

export function applyPropositionTechniqueEtFinancièreModifiéeEventV2(
  this: RaccordementAggregate,
  {
    payload: {
      dateSignature,
      propositionTechniqueEtFinancièreSignée: { format },
      référenceDossierRaccordement,
    },
  }: PropositionTechniqueEtFinancièreModifiéeEvent,
) {
  const dossier = this.récupérerDossier(référenceDossierRaccordement);

  dossier.propositionTechniqueEtFinancière.dateSignature =
    DateTime.convertirEnValueType(dateSignature);
  dossier.propositionTechniqueEtFinancière.format = format;
}
