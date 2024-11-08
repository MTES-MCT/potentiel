import { ExpressionRegulière, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { RaccordementAggregate } from '../raccordement.aggregate';
import { FormatRéférenceDossierRaccordementInvalideError } from '../formatRéférenceDossierRaccordementInvalide.error';
import { RéférenceDossierRaccordementDéjàExistantePourLeProjetError } from '../référenceDossierRaccordementDéjàExistante.error';

export type RéférenceDossierRacordementModifiéeEvent = DomainEvent<
  'RéférenceDossierRacordementModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    référenceDossierRaccordementActuelle: RéférenceDossierRaccordement.RawType;
    nouvelleRéférenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
  }
>;

type ModifierDemandeOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  référenceDossierRaccordementActuelle: RéférenceDossierRaccordement.ValueType;
  nouvelleRéférenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  référenceDossierExpressionRegulière: ExpressionRegulière.ValueType;
  rôle: Role.ValueType;
};

export async function modifierRéférenceDossierRacordement(
  this: RaccordementAggregate,
  {
    identifiantProjet,
    nouvelleRéférenceDossierRaccordement,
    référenceDossierRaccordementActuelle,
    référenceDossierExpressionRegulière,
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
    type: 'RéférenceDossierRacordementModifiée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      nouvelleRéférenceDossierRaccordement: nouvelleRéférenceDossierRaccordement.formatter(),
      référenceDossierRaccordementActuelle: référenceDossierRaccordementActuelle.formatter(),
    },
  };

  await this.publish(référenceDossierRacordementModifiée);
}

export function applyRéférenceDossierRacordementModifiéeEventV1(
  this: RaccordementAggregate,
  {
    payload: { nouvelleRéférenceDossierRaccordement, référenceDossierRaccordementActuelle },
  }: RéférenceDossierRacordementModifiéeEvent,
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
