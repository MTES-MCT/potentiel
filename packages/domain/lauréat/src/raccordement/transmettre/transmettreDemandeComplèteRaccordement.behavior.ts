import { DateTime, ExpressionRegulière, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, OperationRejectedError } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { RaccordementAggregate } from '../raccordement.aggregate';
import { DateDansLeFuturError } from '../dateDansLeFutur.error';
import { FormatRéférenceDossierRaccordementInvalideError } from '../formatRéférenceDossierRaccordementInvalide.error';
import { RéférenceDossierRaccordementDéjàExistantePourLeProjetError } from '../référenceDossierRaccordementDéjàExistante.error';

/**
 * @deprecated Utilisez DemandeComplèteRaccordementTransmiseEvent à la place.
 * Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type DemandeComplèteRaccordementTransmiseEventV1 = DomainEvent<
  'DemandeComplèteDeRaccordementTransmise-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.RawType;
    dateQualification?: DateTime.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
  }
>;

/**
 * @deprecated Utilisez DemandeComplèteRaccordementTransmiseEventV2 à la place.
 * Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1 = DomainEvent<
  'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    format: string;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
  }
>;

export type DemandeComplèteRaccordementTransmiseEvent = DomainEvent<
  'DemandeComplèteDeRaccordementTransmise-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.RawType;
    dateQualification?: DateTime.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    accuséRéception: {
      format: string;
    };
  }
>;

type TransmettreDemandeOptions = {
  dateQualification: DateTime.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  référenceDossierExpressionRegulière: ExpressionRegulière.ValueType;
  formatAccuséRéception: string;
  aUnAbandonAccordé: boolean;
};

export async function transmettreDemande(
  this: RaccordementAggregate,
  {
    dateQualification,
    identifiantGestionnaireRéseau,
    identifiantProjet,
    référenceDossier,
    référenceDossierExpressionRegulière,
    formatAccuséRéception,
    aUnAbandonAccordé,
  }: TransmettreDemandeOptions,
) {
  if (aUnAbandonAccordé) {
    throw new ImpossibleTransmettreDCRProjetAbandonnéError();
  }

  if (
    !this.identifiantGestionnaireRéseau.estÉgaleÀ(
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu,
    ) &&
    !this.identifiantGestionnaireRéseau.estÉgaleÀ(identifiantGestionnaireRéseau)
  ) {
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

  const event: DemandeComplèteRaccordementTransmiseEvent = {
    type: 'DemandeComplèteDeRaccordementTransmise-V2',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      dateQualification: dateQualification?.formatter(),
      identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
      référenceDossierRaccordement: référenceDossier.formatter(),
      accuséRéception: {
        format: formatAccuséRéception,
      },
    },
  };

  await this.publish(event);
}

export function applyAccuséRéceptionDemandeComplèteRaccordementTransmisEventV1(
  this: RaccordementAggregate,
  {
    payload: { référenceDossierRaccordement, format },
  }: AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1,
) {
  const dossier = this.récupérerDossier(référenceDossierRaccordement);

  dossier.demandeComplèteRaccordement.format = format;
}

export function applyDemandeComplèteDeRaccordementTransmiseEventV1(
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
  if (
    this.identifiantGestionnaireRéseau.estÉgaleÀ(
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu,
    )
  ) {
    this.identifiantGestionnaireRéseau =
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
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
        : Option.none,
      format: Option.none,
    },
    miseEnService: {
      dateMiseEnService: Option.none,
    },
    propositionTechniqueEtFinancière: {
      dateSignature: Option.none,
      format: Option.none,
    },
    référence: référenceDossierRaccordement
      ? RéférenceDossierRaccordement.convertirEnValueType(référenceDossierRaccordement)
      : RéférenceDossierRaccordement.référenceNonTransmise,
  });
}

export function applyDemandeComplèteDeRaccordementTransmiseEventV2(
  this: RaccordementAggregate,
  {
    payload: {
      accuséRéception: { format },
      identifiantGestionnaireRéseau,
      identifiantProjet,
      référenceDossierRaccordement,
      dateQualification,
    },
  }: DemandeComplèteRaccordementTransmiseEvent,
) {
  applyDemandeComplèteDeRaccordementTransmiseEventV1.bind(this)({
    type: 'DemandeComplèteDeRaccordementTransmise-V1',
    payload: {
      identifiantGestionnaireRéseau,
      identifiantProjet,
      référenceDossierRaccordement,
      dateQualification,
    },
  });
  applyAccuséRéceptionDemandeComplèteRaccordementTransmisEventV1.bind(this)({
    type: 'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1',
    payload: {
      format,
      identifiantProjet,
      référenceDossierRaccordement,
    },
  });
}

class ImpossibleTransmettreDCRProjetAbandonnéError extends OperationRejectedError {
  constructor() {
    super(
      `Il est impossible de transmettre une demande complète de raccordement pour un projet abandonné`,
    );
  }
}

class PlusieursGestionnairesRéseauPourUnProjetError extends OperationRejectedError {
  constructor() {
    super(
      `Il est impossible de transmettre une demande complète de raccordement auprès de plusieurs gestionnaires de réseau`,
    );
  }
}
