import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';

import {
  AttestationGarantiesFinancièresEnregistréeEvent,
  GarantiesFinancièresEnregistréesEvent,
  GarantiesFinancièresModifiéesEvent,
  MotifDemandeGarantiesFinancières,
  StatutGarantiesFinancières,
  StatutMainlevéeGarantiesFinancières,
  TypeGarantiesFinancièresImportéEvent,
} from '.';

import {
  DépôtGarantiesFinancièresSoumisEvent,
  applyDépôtGarantiesFinancièresSoumis,
  soumettreDépôt,
} from './dépôtEnCours/soumettreDépôt/soumettreDépôtGarantiesFinancières.behavior';
import {
  GarantiesFinancièresDemandéesEvent,
  applyDemanderGarantiesFinancières,
  demanderGarantiesFinancières,
} from './demander/demanderGarantiesFinancières.behavior';
import {
  DépôtGarantiesFinancièresEnCoursSuppriméEvent,
  DépôtGarantiesFinancièresEnCoursSuppriméEventV1,
  applyDépôtGarantiesFinancièresEnCoursSupprimé,
  supprimerDépôtGarantiesFinancièresEnCours,
} from './dépôtEnCours/supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.behavior';
import {
  DépôtGarantiesFinancièresEnCoursValidéEvent,
  DépôtGarantiesFinancièresEnCoursValidéEventV1,
  applyDépôtGarantiesFinancièresEnCoursValidé,
  applyDépôtGarantiesFinancièresEnCoursValidéV1,
  validerDépôtEnCours,
} from './dépôtEnCours/validerDépôtEnCours/validerDépôtGarantiesFinancièresEnCours.behavior';
import {
  DépôtGarantiesFinancièresEnCoursModifiéEvent,
  applyDépôtGarantiesFinancièresEnCoursModifié,
  modifierDépôtGarantiesFinancièresEnCours,
} from './dépôtEnCours/modifierDépôtEnCours/modifierDépôtGarantiesFinancièresEnCours.behavior';
import {
  HistoriqueGarantiesFinancièresEffacéEvent,
  applyEffacerHistoriqueGarantiesFinancières,
  effacerHistorique,
} from './effacerHistorique/effacerHistoriqueGarantiesFinancières.behavior';
import {
  applyTypeGarantiesFinancièresImporté,
  importerType,
} from './garantiesFinancièresActuelles/importer/importerTypeGarantiesFinancières.behavior';
import {
  enregistrer,
  applyEnregistrerGarantiesFinancières,
} from './garantiesFinancièresActuelles/enregistrer/enregistrerGarantiesFinancières.behavior';
import {
  applyModifierGarantiesFinancières,
  modifier,
} from './garantiesFinancièresActuelles/modifier/modifierGarantiesFinancières.behavior';
import {
  enregistrerAttestation,
  applyEnregistrerAttestationGarantiesFinancières,
} from './garantiesFinancièresActuelles/enregistrerAttestation/enregistrerAttestationGarantiesFinancières.behavior';
import {
  MainlevéeGarantiesFinancièresDemandéeEvent,
  applyMainlevéeGarantiesFinancièresDemandée,
  demanderMainlevée,
} from './mainlevée/demander/demanderMainlevéeGarantiesFinancières.behavior';
import {
  annulerDemandeMainlevée,
  applyDemandeMainlevéeGarantiesFinancièresAnnulée,
  DemandeMainlevéeGarantiesFinancièresAnnuléeEvent,
} from './mainlevée/annuler/annulerDemandeMainlevéeGarantiesFinancières.behavior';
import {
  InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent,
  applyInstructionDemandeMainlevéeGarantiesFinancièresDémarrée,
  démarrerInstructionDemandeMainlevée,
} from './mainlevée/démarrerInstruction/démarrerInstructionDemandeMainlevéeGarantiesFinancières.behavior';
import {
  DemandeMainlevéeGarantiesFinancièresRejetéeEvent,
  applyDemandeMainlevéeGarantiesFinancièresRejetée,
  rejeterDemandeMainlevéeGarantiesFinancières,
} from './mainlevée/rejeter/rejeterDemandeMainlevéeGarantiesFinancières.behavior';
import {
  DemandeMainlevéeGarantiesFinancièresAccordéeEvent,
  accorderDemandeMainlevéeGarantiesFinancières,
  applyDemandeMainlevéeGarantiesFinancièresAccordée,
} from './mainlevée/accorder/accorderDemandeMainlevéeGarantiesFinancières.behavior';
import {
  applyGarantiesFinancièresÉchues,
  GarantiesFinancièresÉchuesEvent,
  échoir,
} from './garantiesFinancièresActuelles/échoir/échoirGarantiesFinancières.behavior';
import { ajouterTâches } from './tâches-planifiées/ajouter/ajouterTâches.behavior';
import { annulerTâches } from './tâches-planifiées/annuler/annulerTâches.behavior';

export type GarantiesFinancièresEvent =
  | DépôtGarantiesFinancièresSoumisEvent
  | GarantiesFinancièresDemandéesEvent
  | DépôtGarantiesFinancièresEnCoursSuppriméEventV1
  | DépôtGarantiesFinancièresEnCoursSuppriméEvent
  | DépôtGarantiesFinancièresEnCoursValidéEventV1
  | DépôtGarantiesFinancièresEnCoursValidéEvent
  | DépôtGarantiesFinancièresEnCoursModifiéEvent
  | TypeGarantiesFinancièresImportéEvent
  | GarantiesFinancièresModifiéesEvent
  | AttestationGarantiesFinancièresEnregistréeEvent
  | GarantiesFinancièresEnregistréesEvent
  | HistoriqueGarantiesFinancièresEffacéEvent
  | MainlevéeGarantiesFinancièresDemandéeEvent
  | DemandeMainlevéeGarantiesFinancièresAnnuléeEvent
  | InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent
  | DemandeMainlevéeGarantiesFinancièresRejetéeEvent
  | DemandeMainlevéeGarantiesFinancièresAccordéeEvent
  | GarantiesFinancièresÉchuesEvent;

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
  motifDemandeGarantiesFinancières: MotifDemandeGarantiesFinancières.ValueType;
  dateLimiteSoumission?: DateTime.ValueType;
  demandeMainlevéeEnCours?: {
    statut: StatutMainlevéeGarantiesFinancières.ValueType;
  };
  readonly soumettreDépôt: typeof soumettreDépôt;
  readonly demanderGarantiesFinancières: typeof demanderGarantiesFinancières;
  readonly supprimerDépôtGarantiesFinancièresEnCours: typeof supprimerDépôtGarantiesFinancièresEnCours;
  readonly validerDépôtEnCours: typeof validerDépôtEnCours;
  readonly modifierDépôtGarantiesFinancièresEnCours: typeof modifierDépôtGarantiesFinancièresEnCours;
  readonly importerType: typeof importerType;
  readonly modifier: typeof modifier;
  readonly enregistrerAttestation: typeof enregistrerAttestation;
  readonly enregistrer: typeof enregistrer;
  readonly échoir: typeof échoir;
  readonly effacerHistorique: typeof effacerHistorique;
  readonly demanderMainlevée: typeof demanderMainlevée;
  readonly annulerDemandeMainlevée: typeof annulerDemandeMainlevée;
  readonly démarrerInstructionDemandeMainlevée: typeof démarrerInstructionDemandeMainlevée;
  readonly rejeterDemandeMainlevéeGarantiesFinancières: typeof rejeterDemandeMainlevéeGarantiesFinancières;
  readonly accorderDemandeMainlevéeGarantiesFinancières: typeof accorderDemandeMainlevéeGarantiesFinancières;
  readonly ajouterTâches: typeof ajouterTâches;
  readonly annulerTâches: typeof annulerTâches;
};

export const getDefaultGarantiesFinancièresAggregate: GetDefaultAggregateState<
  GarantiesFinancièresAggregate,
  GarantiesFinancièresEvent
> = () => ({
  apply,
  soumettreDépôt,
  demanderGarantiesFinancières,
  supprimerDépôtGarantiesFinancièresEnCours,
  validerDépôtEnCours,
  modifierDépôtGarantiesFinancièresEnCours,
  importerType,
  modifier,
  enregistrerAttestation,
  enregistrer,
  effacerHistorique,
  motifDemandeGarantiesFinancières: MotifDemandeGarantiesFinancières.motifInconnu,
  demanderMainlevée,
  annulerDemandeMainlevée,
  démarrerInstructionDemandeMainlevée,
  rejeterDemandeMainlevéeGarantiesFinancières,
  accorderDemandeMainlevéeGarantiesFinancières,
  échoir,
  ajouterTâches,
  annulerTâches,
});

function apply(this: GarantiesFinancièresAggregate, event: GarantiesFinancièresEvent) {
  switch (event.type) {
    case 'GarantiesFinancièresDemandées-V1':
      applyDemanderGarantiesFinancières.bind(this)(event);
      break;
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
