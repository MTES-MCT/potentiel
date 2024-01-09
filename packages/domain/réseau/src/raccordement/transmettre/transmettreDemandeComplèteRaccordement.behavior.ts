import { DateTime, ExpressionRegulière, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError, OperationRejectedError } from '@potentiel-domain/core';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { RaccordementAggregate } from '../raccordement.aggregate';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import { none } from '@potentiel/monads';
import { DateDansLeFuturError } from '../dateDansLeFutur.error';

export type DemandeComplèteRaccordementTransmiseEventV1 = DomainEvent<
  'DemandeComplèteDeRaccordementTransmise-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.RawType;
    dateQualification?: DateTime.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
  }
>;

type TransmettreDemandeOptions = {
  dateQualification: DateTime.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  référenceDossierExpressionRegulière: ExpressionRegulière.ValueType;
};

export async function transmettreDemande(
  this: RaccordementAggregate,
  {
    dateQualification,
    identifiantGestionnaireRéseau,
    identifiantProjet,
    référenceDossier,
    référenceDossierExpressionRegulière,
  }: TransmettreDemandeOptions,
) {
  if (!this.identifiantGestionnaireRéseau.estÉgaleÀ(identifiantGestionnaireRéseau)) {
    throw new PlusieursGestionnairesRéseauPourUnProjetError();
  }

  if (!référenceDossierExpressionRegulière.valider(référenceDossier.référence)) {
    throw new FormatRéférenceDossierRaccordementInvalideError();
  }

  if (this.contientLeDossier(référenceDossier)) {
    throw new RéférenceDossierRaccordementDéjàExistantePourLeProjetError();
  }

  if (dateQualification.estDansLeFutur()) {
    throw new DateDansLeFuturError();
  }

  const event: DemandeComplèteRaccordementTransmiseEventV1 = {
    type: 'DemandeComplèteDeRaccordementTransmise-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      dateQualification: dateQualification?.formatter(),
      identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
      référenceDossierRaccordement: référenceDossier.formatter(),
    },
  };

  await this.publish(event);
}

export function applyDemandeComplèteDeRaccordementTransmiseV1(
  this: RaccordementAggregate,
  {
    payload: {
      identifiantGestionnaireRéseau,
      identifiantProjet,
      référenceDossierRaccordement,
      dateQualification,
    },
  }: DemandeComplèteRaccordementTransmiseEventV1,
) {
  if (this.identifiantGestionnaireRéseau.estÉgaleÀ(IdentifiantGestionnaireRéseau.inconnu)) {
    this.identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(
      identifiantGestionnaireRéseau,
    );
  }

  if (this.identifiantProjet.estÉgaleÀ(IdentifiantProjet.inconnu)) {
    this.identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjet);
  }

  this.dossiers.set(référenceDossierRaccordement, {
    demandeComplèteRaccordement: {
      dateQualification: dateQualification
        ? DateTime.convertirEnValueType(dateQualification)
        : none,
      format: none,
    },
    miseEnService: {
      dateMiseEnService: none,
    },
    propositionTechniqueEtFinancière: {
      dateSignature: none,
      format: none,
    },
    référence: RéférenceDossierRaccordement.convertirEnValueType(référenceDossierRaccordement),
  });
}

export class RéférenceDossierRaccordementDéjàExistantePourLeProjetError extends InvalidOperationError {
  constructor() {
    super(
      `Il impossible d'avoir plusieurs dossiers de raccordement avec la même référence pour un projet`,
    );
  }
}

export class FormatRéférenceDossierRaccordementInvalideError extends InvalidOperationError {
  constructor() {
    super(`Le format de la référence du dossier de raccordement est invalide`);
  }
}

export class PlusieursGestionnairesRéseauPourUnProjetError extends OperationRejectedError {
  constructor() {
    super(
      `Il est impossible de transmettre une demande complète de raccordement auprès de plusieurs gestionnaires de réseau`,
    );
  }
}
