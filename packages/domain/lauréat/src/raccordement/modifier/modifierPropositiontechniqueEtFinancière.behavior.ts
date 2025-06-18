import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Raccordement } from '@potentiel-domain/projet';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { RaccordementAggregate } from '../raccordement.aggregate';
import { DateDansLeFuturError } from '../dateDansLeFutur.error';
import { DossierNonRéférencéPourLeRaccordementDuProjetError } from '../dossierNonRéférencéPourLeRaccordementDuProjet.error';

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

  const event: Raccordement.PropositionTechniqueEtFinancièreModifiéeEvent = {
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
  }: Raccordement.PropositionTechniqueEtFinancièreModifiéeEventV1,
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
  }: Raccordement.PropositionTechniqueEtFinancièreModifiéeEvent,
) {
  const dossier = this.récupérerDossier(référenceDossierRaccordement);

  dossier.propositionTechniqueEtFinancière.dateSignature =
    DateTime.convertirEnValueType(dateSignature);
  dossier.propositionTechniqueEtFinancière.format = format;
}
