import type {
  DélaiAccordéEvent,
  DélaiAccordéEventV1,
} from './demande/accorder/accorderDélai.event.js';
import type { DemandeDélaiAnnuléeEvent } from './demande/annuler/annulerDemandeDélai.event.js';
import type {
  DemandeDélaiCorrigéeEvent,
  DemandeDélaiCorrigéeEventV1,
} from './demande/corriger/corrigerDemandeDélai.event.js';
import type {
  DélaiDemandéEvent,
  DélaiDemandéEventV1,
} from './demande/demander/demanderDélai.event.js';
import type { DemandeDélaiPasséeEnInstructionEvent } from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.event.js';
import type { DemandeDélaiRejetéeEvent } from './demande/rejeter/rejeterDemandeDélai.event.js';
import type { DemandeDélaiSuppriméeEvent } from './demande/supprimer/supprimerDemandeDélai.event.js';

export type DélaiEvent =
  | DélaiAccordéEvent
  | DélaiAccordéEventV1
  | DélaiDemandéEvent
  | DélaiDemandéEventV1
  | DemandeDélaiAnnuléeEvent
  | DemandeDélaiPasséeEnInstructionEvent
  | DemandeDélaiRejetéeEvent
  | DemandeDélaiCorrigéeEvent
  | DemandeDélaiCorrigéeEventV1
  | DemandeDélaiSuppriméeEvent;

export type {
  DemandeDélaiAnnuléeEvent,
  DemandeDélaiCorrigéeEvent,
  DemandeDélaiCorrigéeEventV1,
  DemandeDélaiPasséeEnInstructionEvent,
  DemandeDélaiRejetéeEvent,
  DemandeDélaiSuppriméeEvent,
  DélaiAccordéEvent,
  DélaiAccordéEventV1,
  DélaiDemandéEvent,
  DélaiDemandéEventV1,
};
