import type {
  DélaiAccordéEvent,
  DélaiAccordéEventV1,
} from './demande/accorder/accorderDélai.event.js';
import type {
  DemandeDélaiAnnuléeEvent,
  DemandeDélaiAnnuléeEventV1,
} from './demande/annuler/annulerDemandeDélai.event.js';
import type {
  DemandeDélaiCorrigéeEvent,
  DemandeDélaiCorrigéeEventV1,
} from './demande/corriger/corrigerDemandeDélai.event.js';
import type {
  DélaiDemandéEvent,
  DélaiDemandéEventV1,
} from './demande/demander/demanderDélai.event.js';
import type {
  DemandeDélaiPasséeEnInstructionEvent,
  DemandeDélaiPasséeEnInstructionEventV1,
} from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.event.js';
import type {
  DemandeDélaiRejetéeEvent,
  DemandeDélaiRejetéeEventV1,
} from './demande/rejeter/rejeterDemandeDélai.event.js';
import type {
  DemandeDélaiSuppriméeEvent,
  DemandeDélaiSuppriméeEventV1,
} from './demande/supprimer/supprimerDemandeDélai.event.js';

export type DélaiEvent =
  | DélaiAccordéEvent
  | DélaiDemandéEvent
  | DélaiAccordéEvent
  | DélaiDemandéEvent
  | DemandeDélaiAnnuléeEvent
  | DemandeDélaiPasséeEnInstructionEvent
  | DemandeDélaiRejetéeEvent
  | DemandeDélaiCorrigéeEvent
  | DemandeDélaiCorrigéeEvent
  | DemandeDélaiSuppriméeEvent
  | DélaiAccordéEventV1
  | DélaiDemandéEventV1
  | DemandeDélaiAnnuléeEventV1
  | DemandeDélaiPasséeEnInstructionEventV1
  | DemandeDélaiRejetéeEventV1
  | DemandeDélaiCorrigéeEventV1
  | DemandeDélaiCorrigéeEventV1
  | DemandeDélaiSuppriméeEventV1;

export type {
  DemandeDélaiAnnuléeEvent,
  DemandeDélaiAnnuléeEventV1,
  DemandeDélaiCorrigéeEvent,
  DemandeDélaiCorrigéeEventV1,
  DemandeDélaiPasséeEnInstructionEvent,
  DemandeDélaiPasséeEnInstructionEventV1,
  DemandeDélaiRejetéeEvent,
  DemandeDélaiRejetéeEventV1,
  DemandeDélaiSuppriméeEvent,
  DemandeDélaiSuppriméeEventV1,
  DélaiAccordéEvent,
  DélaiAccordéEventV1,
  DélaiDemandéEvent,
  DélaiDemandéEventV1,
};
