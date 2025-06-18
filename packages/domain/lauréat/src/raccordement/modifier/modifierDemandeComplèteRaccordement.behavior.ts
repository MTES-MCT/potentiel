import { DateTime, ExpressionRegulière, IdentifiantProjet } from '@potentiel-domain/common';
import { InvalidOperationError } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { Role } from '@potentiel-domain/utilisateur';
import { Raccordement } from '@potentiel-domain/projet';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { DateDansLeFuturError } from '../dateDansLeFutur.error';
import { RaccordementAggregate } from '../raccordement.aggregate';
import { FormatRéférenceDossierRaccordementInvalideError } from '../formatRéférenceDossierRaccordementInvalide.error';

type ModifierDemandeOptions = {
  dateQualification: DateTime.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  référenceDossierExpressionRegulière: ExpressionRegulière.ValueType;
  formatAccuséRéception: string;
  rôle: Role.ValueType;
};

export async function modifierDemandeComplèteRaccordement(
  this: RaccordementAggregate,
  {
    dateQualification,
    formatAccuséRéception,
    identifiantProjet,
    référenceDossierRaccordement,
    référenceDossierExpressionRegulière,
    rôle,
  }: ModifierDemandeOptions,
) {
  if (dateQualification.estDansLeFutur()) {
    throw new DateDansLeFuturError();
  }

  if (!référenceDossierExpressionRegulière.valider(référenceDossierRaccordement.référence)) {
    throw new FormatRéférenceDossierRaccordementInvalideError();
  }

  const dossier = this.récupérerDossier(référenceDossierRaccordement.formatter());

  if (
    (rôle.estÉgaleÀ(Role.porteur) || rôle.estÉgaleÀ(Role.dreal)) &&
    Option.isSome(dossier.miseEnService.dateMiseEnService)
  ) {
    throw new DemandeComplèteRaccordementNonModifiableCarDossierAvecDateDeMiseEnServiceError(
      référenceDossierRaccordement.formatter(),
    );
  }

  const demandeComplèteRaccordementModifiée: Raccordement.DemandeComplèteRaccordementModifiéeEvent =
    {
      type: 'DemandeComplèteRaccordementModifiée-V3',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
        dateQualification: dateQualification.formatter(),
        accuséRéception: {
          format: formatAccuséRéception,
        },
      },
    };

  await this.publish(demandeComplèteRaccordementModifiée);
}

export function applyDemandeComplèteRaccordementModifiéeEventV1(
  this: RaccordementAggregate,
  {
    payload: { dateQualification, nouvelleReference, referenceActuelle },
  }: Raccordement.DemandeComplèteRaccordementModifiéeEventV1,
) {
  const dossier = this.récupérerDossier(referenceActuelle);

  dossier.demandeComplèteRaccordement.dateQualification =
    DateTime.convertirEnValueType(dateQualification);
  dossier.référence = RéférenceDossierRaccordement.convertirEnValueType(nouvelleReference);

  this.dossiers.delete(referenceActuelle);
  this.dossiers.set(nouvelleReference, dossier);
}

export function applyDemandeComplèteRaccordementModifiéeEventV2(
  this: RaccordementAggregate,
  {
    payload: { dateQualification, référenceDossierRaccordement },
  }: Raccordement.DemandeComplèteRaccordementModifiéeEventV2,
) {
  const dossier = this.récupérerDossier(référenceDossierRaccordement);

  dossier.demandeComplèteRaccordement.dateQualification =
    DateTime.convertirEnValueType(dateQualification);
}

export function applyDemandeComplèteRaccordementModifiéeEventV3(
  this: RaccordementAggregate,
  {
    payload: {
      accuséRéception: { format },
      dateQualification,
      référenceDossierRaccordement,
    },
  }: Raccordement.DemandeComplèteRaccordementModifiéeEvent,
) {
  const dossier = this.récupérerDossier(référenceDossierRaccordement);

  dossier.demandeComplèteRaccordement.dateQualification =
    DateTime.convertirEnValueType(dateQualification);
  dossier.demandeComplèteRaccordement.format = format;
}

class DemandeComplèteRaccordementNonModifiableCarDossierAvecDateDeMiseEnServiceError extends InvalidOperationError {
  constructor(public référenceDossier: string) {
    super(
      `La demande complète de raccordement du dossier ne peut pas être modifiée car celui-ci dispose déjà d'une date de mise en service`,
    );
  }
}
