'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.propositionTechniqueEtFinancièreSignéeTransmiseHandlerFactory = void 0;
const monads_1 = require('@potentiel/monads');
/**
 * @deprecated
 */
const propositionTechniqueEtFinancièreSignéeTransmiseHandlerFactory =
  ({ find, update }) =>
  async (event) => {
    const dossierRaccordement = await find(
      `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
    );
    if ((0, monads_1.isSome)(dossierRaccordement)) {
      await update(
        `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
        {
          ...dossierRaccordement,
          ...(dossierRaccordement.propositionTechniqueEtFinancière && {
            propositionTechniqueEtFinancière: {
              ...dossierRaccordement.propositionTechniqueEtFinancière,
              format: event.payload.format,
            },
          }),
        },
      );
    } else {
      // TODO add a log here
    }
  };
exports.propositionTechniqueEtFinancièreSignéeTransmiseHandlerFactory =
  propositionTechniqueEtFinancièreSignéeTransmiseHandlerFactory;
//# sourceMappingURL=propositionTechniqueEtFinanci%C3%A8reSign%C3%A9eTransmise.handler.js.map
