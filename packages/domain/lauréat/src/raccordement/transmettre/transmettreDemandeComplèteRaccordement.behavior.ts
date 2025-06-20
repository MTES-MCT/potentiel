import { DateTime, Email, ExpressionRegulière } from '@potentiel-domain/common';
import { OperationRejectedError } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { IdentifiantProjet, Raccordement } from '@potentiel-domain/projet';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { RaccordementAggregate } from '../raccordement.aggregate';
import { DateDansLeFuturError } from '../dateDansLeFutur.error';
import { FormatRéférenceDossierRaccordementInvalideError } from '../formatRéférenceDossierRaccordementInvalide.error';
import { RéférenceDossierRaccordementDéjàExistantePourLeProjetError } from '../référenceDossierRaccordementDéjàExistante.error';

type TransmettreDemandeOptions = {
  dateQualification: DateTime.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  référenceDossierExpressionRegulière: ExpressionRegulière.ValueType;
  transmisePar: Email.ValueType;
  transmiseLe: DateTime.ValueType;
  formatAccuséRéception?: string;
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
    transmisePar,
    transmiseLe,
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

  const event: Raccordement.DemandeComplèteRaccordementTransmiseEvent = {
    type: 'DemandeComplèteDeRaccordementTransmise-V3',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      dateQualification: dateQualification?.formatter(),
      identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
      référenceDossierRaccordement: référenceDossier.formatter(),
      accuséRéception: formatAccuséRéception
        ? {
            format: formatAccuséRéception,
          }
        : undefined,
      transmisePar: transmisePar.formatter(),
      transmiseLe: transmiseLe.formatter(),
    },
  };

  await this.publish(event);
}

export function applyAccuséRéceptionDemandeComplèteRaccordementTransmisEventV1(
  this: RaccordementAggregate,
  {
    payload: { référenceDossierRaccordement, format },
  }: Raccordement.AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1,
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
  }: Raccordement.DemandeComplèteRaccordementTransmiseEventV1,
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
  }: Raccordement.DemandeComplèteRaccordementTransmiseEventV2,
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

export function applyDemandeComplèteDeRaccordementTransmiseEventV3(
  this: RaccordementAggregate,
  {
    payload: {
      accuséRéception,
      identifiantGestionnaireRéseau,
      identifiantProjet,
      référenceDossierRaccordement,
      dateQualification,
    },
  }: Raccordement.DemandeComplèteRaccordementTransmiseEvent,
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

  if (accuséRéception) {
    applyAccuséRéceptionDemandeComplèteRaccordementTransmisEventV1.bind(this)({
      type: 'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1',
      payload: {
        format: accuséRéception.format,
        identifiantProjet,
        référenceDossierRaccordement,
      },
    });
  }
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
