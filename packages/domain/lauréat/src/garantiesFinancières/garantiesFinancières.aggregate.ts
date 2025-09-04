import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature, Lauréat } from '@potentiel-domain/projet';

import { StatutGarantiesFinancières, StatutMainlevéeGarantiesFinancières } from '.';

import { applyDépôtGarantiesFinancièresSoumis } from './dépôtEnCours/soumettreDépôt/soumettreDépôtGarantiesFinancières.behavior';
import { applyDépôtGarantiesFinancièresEnCoursSupprimé } from './dépôtEnCours/supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.behavior';
import {
  applyDépôtGarantiesFinancièresEnCoursValidé,
  applyDépôtGarantiesFinancièresEnCoursValidéV1,
} from './dépôtEnCours/validerDépôtEnCours/validerDépôtGarantiesFinancièresEnCours.behavior';
import { applyDépôtGarantiesFinancièresEnCoursModifié } from './dépôtEnCours/modifierDépôtEnCours/modifierDépôtGarantiesFinancièresEnCours.behavior';
import { applyEffacerHistoriqueGarantiesFinancières } from './effacerHistorique/effacerHistoriqueGarantiesFinancières.behavior';
import { applyTypeGarantiesFinancièresImporté } from './garantiesFinancièresActuelles/importer/importerTypeGarantiesFinancières.behavior';
import { applyEnregistrerGarantiesFinancières } from './garantiesFinancièresActuelles/enregistrer/enregistrerGarantiesFinancières.behavior';
import { applyModifierGarantiesFinancières } from './garantiesFinancièresActuelles/modifier/modifierGarantiesFinancières.behavior';
import { applyEnregistrerAttestationGarantiesFinancières } from './garantiesFinancièresActuelles/enregistrerAttestation/enregistrerAttestationGarantiesFinancières.behavior';
import {
  applyMainlevéeGarantiesFinancièresDemandée,
  demanderMainlevée,
} from './mainlevée/demander/demanderMainlevéeGarantiesFinancières.behavior';
import {
  annulerDemandeMainlevée,
  applyDemandeMainlevéeGarantiesFinancièresAnnulée,
} from './mainlevée/annuler/annulerDemandeMainlevéeGarantiesFinancières.behavior';
import {
  applyInstructionDemandeMainlevéeGarantiesFinancièresDémarrée,
  démarrerInstructionDemandeMainlevée,
} from './mainlevée/démarrerInstruction/démarrerInstructionDemandeMainlevéeGarantiesFinancières.behavior';
import {
  applyDemandeMainlevéeGarantiesFinancièresRejetée,
  rejeterDemandeMainlevéeGarantiesFinancières,
} from './mainlevée/rejeter/rejeterDemandeMainlevéeGarantiesFinancières.behavior';
import {
  accorderDemandeMainlevéeGarantiesFinancières,
  applyDemandeMainlevéeGarantiesFinancièresAccordée,
} from './mainlevée/accorder/accorderDemandeMainlevéeGarantiesFinancières.behavior';
import { applyGarantiesFinancièresÉchues } from './garantiesFinancièresActuelles/échoir/échoirGarantiesFinancières.behavior';

export type GarantiesFinancièresEvent =
  | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresSoumisEvent
  | Lauréat.GarantiesFinancières.GarantiesFinancièresDemandéesEvent
  | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEventV1
  | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEvent
  | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEventV1
  | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEvent
  | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursModifiéEvent
  | Lauréat.GarantiesFinancières.TypeGarantiesFinancièresImportéEvent
  | Lauréat.GarantiesFinancières.GarantiesFinancièresModifiéesEvent
  | Lauréat.GarantiesFinancières.AttestationGarantiesFinancièresEnregistréeEvent
  | Lauréat.GarantiesFinancières.GarantiesFinancièresEnregistréesEvent
  | Lauréat.GarantiesFinancières.HistoriqueGarantiesFinancièresEffacéEvent
  | Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresDemandéeEvent
  | Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAnnuléeEvent
  | Lauréat.GarantiesFinancières.InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent
  | Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresRejetéeEvent
  | Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAccordéeEvent
  | Lauréat.GarantiesFinancières.GarantiesFinancièresÉchuesEvent;

export type GarantiesFinancièresAggregate = Aggregate<GarantiesFinancièresEvent> & {
  actuelles?: {
    statut: StatutGarantiesFinancières.ValueType;
    type: Candidature.TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    dateConstitution?: DateTime.ValueType;
    attestation?: { format: string };
    validéLe?: DateTime.ValueType;
    importéLe?: DateTime.ValueType;
  };
  dépôtsEnCours?: {
    type: Candidature.TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    dateConstitution: DateTime.ValueType;
    soumisLe: DateTime.ValueType;
    attestation?: { format: string };
  };
  demandeMainlevéeEnCours?: {
    statut: StatutMainlevéeGarantiesFinancières.ValueType;
  };
  readonly demanderMainlevée: typeof demanderMainlevée;
  readonly annulerDemandeMainlevée: typeof annulerDemandeMainlevée;
  readonly démarrerInstructionDemandeMainlevée: typeof démarrerInstructionDemandeMainlevée;
  readonly rejeterDemandeMainlevéeGarantiesFinancières: typeof rejeterDemandeMainlevéeGarantiesFinancières;
  readonly accorderDemandeMainlevéeGarantiesFinancières: typeof accorderDemandeMainlevéeGarantiesFinancières;
};

export const getDefaultGarantiesFinancièresAggregate: GetDefaultAggregateState<
  GarantiesFinancièresAggregate,
  GarantiesFinancièresEvent
> = () => ({
  apply,

  demanderMainlevée,
  annulerDemandeMainlevée,
  démarrerInstructionDemandeMainlevée,
  rejeterDemandeMainlevéeGarantiesFinancières,
  accorderDemandeMainlevéeGarantiesFinancières,
});

function apply(this: GarantiesFinancièresAggregate, event: GarantiesFinancièresEvent) {
  switch (event.type) {
    case 'DépôtGarantiesFinancièresSoumis-V1':
      applyDépôtGarantiesFinancièresSoumis.bind(this)(event);
      break;
    case 'DépôtGarantiesFinancièresEnCoursSupprimé-V1':
    case 'DépôtGarantiesFinancièresEnCoursSupprimé-V2':
      applyDépôtGarantiesFinancièresEnCoursSupprimé.bind(this)(event);
      break;
    case 'DépôtGarantiesFinancièresEnCoursValidé-V1':
      applyDépôtGarantiesFinancièresEnCoursValidéV1.bind(this)(event);
      break;
    case 'DépôtGarantiesFinancièresEnCoursValidé-V2':
      applyDépôtGarantiesFinancièresEnCoursValidé.bind(this)(event);
      break;
    case 'DépôtGarantiesFinancièresEnCoursModifié-V1':
      applyDépôtGarantiesFinancièresEnCoursModifié.bind(this)(event);
      break;
    case 'TypeGarantiesFinancièresImporté-V1':
      applyTypeGarantiesFinancièresImporté.bind(this)(event);
      break;
    case 'GarantiesFinancièresModifiées-V1':
      applyModifierGarantiesFinancières.bind(this)(event);
      break;
    case 'AttestationGarantiesFinancièresEnregistrée-V1':
      applyEnregistrerAttestationGarantiesFinancières.bind(this)(event);
      break;
    case 'GarantiesFinancièresEnregistrées-V1':
      applyEnregistrerGarantiesFinancières.bind(this)(event);
      break;
    case 'HistoriqueGarantiesFinancièresEffacé-V1':
      applyEffacerHistoriqueGarantiesFinancières.bind(this)(event);
      break;
    case 'MainlevéeGarantiesFinancièresDemandée-V1':
      applyMainlevéeGarantiesFinancièresDemandée.bind(this)(event);
      break;
    case 'DemandeMainlevéeGarantiesFinancièresAnnulée-V1':
      applyDemandeMainlevéeGarantiesFinancièresAnnulée.bind(this)(event);
      break;
    case 'InstructionDemandeMainlevéeGarantiesFinancièresDémarrée-V1':
      applyInstructionDemandeMainlevéeGarantiesFinancièresDémarrée.bind(this)(event);
      break;
    case 'DemandeMainlevéeGarantiesFinancièresRejetée-V1':
      applyDemandeMainlevéeGarantiesFinancièresRejetée.bind(this)(event);
      break;
    case 'DemandeMainlevéeGarantiesFinancièresAccordée-V1':
      applyDemandeMainlevéeGarantiesFinancièresAccordée.bind(this)(event);
      break;
    case 'GarantiesFinancièresÉchues-V1':
      applyGarantiesFinancièresÉchues.bind(this)(event);
      break;
  }
}

export const loadGarantiesFinancièresFactory =
  (loadAggregate: LoadAggregate) =>
  (identifiantProjet: IdentifiantProjet.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `garanties-financieres|${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultGarantiesFinancièresAggregate,
      onNone: throwOnNone
        ? () => {
            throw new AucunesGarantiesFinancièresPourLeProjetError();
          }
        : undefined,
    });
  };

class AucunesGarantiesFinancièresPourLeProjetError extends AggregateNotFoundError {
  constructor() {
    super(`Il n'y a aucunes garanties financières sur le projet`);
  }
}
