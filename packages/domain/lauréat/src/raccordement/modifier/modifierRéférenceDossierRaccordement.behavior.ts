import { DateTime, Email, ExpressionRegulière } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { RaccordementAggregate } from '../raccordement.aggregate';
import { FormatRéférenceDossierRaccordementInvalideError } from '../formatRéférenceDossierRaccordementInvalide.error';
import { RéférenceDossierRaccordementDéjàExistantePourLeProjetError } from '../référenceDossierRaccordementDéjàExistante.error';

/**
 * @deprecated Use RéférenceDossierRacordementModifiéeEvent.
 */
export type RéférenceDossierRacordementModifiéeEventV1 = DomainEvent<
  'RéférenceDossierRacordementModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    référenceDossierRaccordementActuelle: RéférenceDossierRaccordement.RawType;
    nouvelleRéférenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
  }
>;

export type RéférenceDossierRacordementModifiéeEvent = DomainEvent<
  'RéférenceDossierRacordementModifiée-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    référenceDossierRaccordementActuelle: RéférenceDossierRaccordement.RawType;
    nouvelleRéférenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    modifiéeLe: DateTime.RawType;
    modifiéePar: Email.RawType;
  }
>;

type ModifierDemandeOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  référenceDossierRaccordementActuelle: RéférenceDossierRaccordement.ValueType;
  nouvelleRéférenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  référenceDossierExpressionRegulière: ExpressionRegulière.ValueType;
  modifiéeLe: DateTime.ValueType;
  modifiéePar: Email.ValueType;
  rôle: Role.ValueType;
};

export async function modifierRéférenceDossierRacordement(
  this: RaccordementAggregate,
  {
    identifiantProjet,
    nouvelleRéférenceDossierRaccordement,
    référenceDossierRaccordementActuelle,
    référenceDossierExpressionRegulière,
    modifiéeLe,
    modifiéePar,
    rôle,
  }: ModifierDemandeOptions,
) {
  if (nouvelleRéférenceDossierRaccordement.estÉgaleÀ(référenceDossierRaccordementActuelle)) {
    throw new RéférencesDossierRaccordementIdentiquesError();
  }

  if (
    !référenceDossierExpressionRegulière.valider(nouvelleRéférenceDossierRaccordement.référence)
  ) {
    throw new FormatRéférenceDossierRaccordementInvalideError();
  }

  if (this.contientLeDossier(nouvelleRéférenceDossierRaccordement)) {
    throw new RéférenceDossierRaccordementDéjàExistantePourLeProjetError();
  }

  const dossier = this.récupérerDossier(référenceDossierRaccordementActuelle.formatter());

  if (
    (rôle.estÉgaleÀ(Role.porteur) || rôle.estÉgaleÀ(Role.dreal)) &&
    Option.isSome(dossier.miseEnService.dateMiseEnService)
  ) {
    throw new RéférenceDossierRaccordementNonModifiableCarDossierAvecDateDeMiseEnServiceError(
      référenceDossierRaccordementActuelle.formatter(),
    );
  }

  const référenceDossierRacordementModifiée: RéférenceDossierRacordementModifiéeEvent = {
    type: 'RéférenceDossierRacordementModifiée-V2',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      nouvelleRéférenceDossierRaccordement: nouvelleRéférenceDossierRaccordement.formatter(),
      référenceDossierRaccordementActuelle: référenceDossierRaccordementActuelle.formatter(),
      modifiéeLe: modifiéeLe.formatter(),
      modifiéePar: modifiéePar.formatter(),
    },
  };

  await this.publish(référenceDossierRacordementModifiée);
}

export function applyRéférenceDossierRacordementModifiéeEvent(
  this: RaccordementAggregate,
  {
    payload: { nouvelleRéférenceDossierRaccordement, référenceDossierRaccordementActuelle },
  }: RéférenceDossierRacordementModifiéeEvent | RéférenceDossierRacordementModifiéeEventV1,
) {
  const dossier = this.récupérerDossier(référenceDossierRaccordementActuelle);

  dossier.référence = RéférenceDossierRaccordement.convertirEnValueType(
    nouvelleRéférenceDossierRaccordement,
  );

  this.dossiers.delete(référenceDossierRaccordementActuelle);
  this.dossiers.set(nouvelleRéférenceDossierRaccordement, dossier);
}

class RéférenceDossierRaccordementNonModifiableCarDossierAvecDateDeMiseEnServiceError extends InvalidOperationError {
  constructor(référenceDossier: string) {
    super(
      `La référence du dossier de raccordement ${référenceDossier} ne peut pas être modifiée car le dossier dispose déjà d'une date de mise en service`,
    );
  }
}
class RéférencesDossierRaccordementIdentiquesError extends InvalidOperationError {
  constructor() {
    super(`Les références du dossier de raccordement sont identiques`);
  }
}
