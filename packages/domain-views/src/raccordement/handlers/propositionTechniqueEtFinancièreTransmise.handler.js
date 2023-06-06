'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.propositionTechniqueEtFinancièreTransmiseHandlerFactory = void 0;
const monads_1 = require('@potentiel/monads');
/**
 * @deprecated
 */
const propositionTechniqueEtFinancièreTransmiseHandlerFactory =
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
          propositionTechniqueEtFinancière: {
            dateSignature: event.payload.dateSignature,
            format: 'none',
          },
        },
      );
    } else {
      // TODO add a log here
    }
  };
exports.propositionTechniqueEtFinancièreTransmiseHandlerFactory =
  propositionTechniqueEtFinancièreTransmiseHandlerFactory;
//# sourceMappingURL=propositionTechniqueEtFinanci%C3%A8reTransmise.handler.js.map
