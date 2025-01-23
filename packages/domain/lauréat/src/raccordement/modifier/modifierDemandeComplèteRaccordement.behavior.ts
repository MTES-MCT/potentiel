import { DateTime, ExpressionRegulière, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { Role } from '@potentiel-domain/utilisateur';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { DateDansLeFuturError } from '../dateDansLeFutur.error';
import { RaccordementAggregate } from '../raccordement.aggregate';
import { FormatRéférenceDossierRaccordementInvalideError } from '../formatRéférenceDossierRaccordementInvalide.error';

/**
 * @deprecated Utilisez DemandeComplèteRaccordementModifiéeEvent et RéférenceDossierRacordementModifiéeEvent à la place. Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type DemandeComplèteRaccordementModifiéeEventV1 = DomainEvent<
  'DemandeComplèteRaccordementModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateQualification: DateTime.RawType;
    referenceActuelle: RéférenceDossierRaccordement.RawType;
    nouvelleReference: RéférenceDossierRaccordement.RawType;
  }
>;

/**
 * @deprecated Utilisez DemandeComplèteRaccordementModifiéeEvent à la place. Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type DemandeComplèteRaccordementModifiéeEventV2 = DomainEvent<
  'DemandeComplèteRaccordementModifiée-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    dateQualification: DateTime.RawType;
  }
>;

export type DemandeComplèteRaccordementModifiéeEvent = DomainEvent<
  'DemandeComplèteRaccordementModifiée-V3',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    dateQualification: DateTime.RawType;
    accuséRéception: {
      format: string;
    };
  }
>;

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

  const demandeComplèteRaccordementModifiée: DemandeComplèteRaccordementModifiéeEvent = {
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
  }: DemandeComplèteRaccordementModifiéeEventV1,
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
  }: DemandeComplèteRaccordementModifiéeEventV2,
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
  }: DemandeComplèteRaccordementModifiéeEvent,
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
