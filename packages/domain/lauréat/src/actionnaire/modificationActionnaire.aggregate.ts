// import {
//   Aggregate,
//   AggregateNotFoundError,
//   GetDefaultAggregateState,
//   LoadAggregate,
// } from '@potentiel-domain/core';
// import { IdentifiantProjet } from '@potentiel-domain/common';

// import { StatutModificationActionnaire } from '.';

// export type ActionnaireEvent;

// export type ActionnaireAggregate = Aggregate<ActionnaireEvent> & {
//   statut: StatutModificationActionnaire.ValueType;
// };

// export const getDefaultActionnaireAggregate: GetDefaultAggregateState<
//   ActionnaireAggregate,
//   ActionnaireEvent
// > = () => ({
//   apply,
//   statut: StatutModificationActionnaire.inconnu,
// });

// function apply(this: ActionnaireAggregate, event: ActionnaireEvent) {
//   switch (event.type) {
//   }
// }

// export const loadActionnaireFactory =
//   (loadAggregate: LoadAggregate) =>
//   (identifiantProjet: IdentifiantProjet.ValueType, throwOnNone = true) => {
//     return loadAggregate({
//       aggregateId: `modification-actionnaire|${identifiantProjet.formatter()}`,
//       getDefaultAggregate: getDefaultActionnaireAggregate,
//       onNone: throwOnNone
//         ? () => {
//             throw new AucunActionnaireError();
//           }
//         : undefined,
//     });
//   };

// class AucunActionnaireError extends AggregateNotFoundError {
//   constructor() {
//     super(`Aucun actionnaire n'est associé à ce projet`);
//   }
// }
