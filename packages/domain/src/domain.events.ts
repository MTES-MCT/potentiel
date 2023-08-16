import { ProjetEvent } from './projet/projet.event';
import { GestionnaireRéseauEvent } from './gestionnaireRéseau/gestionnaireRéseau.event';
import { RaccordementEvent } from './raccordement/raccordement.event';
import {
  DépôtGarantiesFinancièresEvent,
  EnregistrementGarantiesFinancièresEvent,
  GarantiesFinancièresEvent,
} from './garantiesFinancières/garantiesFinancières.event';
import {
  TypeGarantiesFinancièresEnregistréSnapshot,
  AttestationGarantiesFinancièresEnregistréeEvent,
} from './garantiesFinancières/actuelles/enregistrementGarantiesFinancières.event';
import { GarantiesFinancièresDéposéesSnapshot } from './garantiesFinancières/dépôt/dépôtGarantiesFinancières.event';

export type DomainEvents =
  | GestionnaireRéseauEvent
  | RaccordementEvent
  | ProjetEvent
  | GarantiesFinancièresEvent;

export {
  GestionnaireRéseauEvent,
  ProjetEvent,
  RaccordementEvent,
  GarantiesFinancièresEvent,
  DépôtGarantiesFinancièresEvent,
  EnregistrementGarantiesFinancièresEvent,
  TypeGarantiesFinancièresEnregistréSnapshot as TypeGarantiesFinancièresEnregistréSnapshotV1,
  AttestationGarantiesFinancièresEnregistréeEvent,
  GarantiesFinancièresDéposéesSnapshot as GarantiesFinancièresDéposéesSnapshotV1,
};
