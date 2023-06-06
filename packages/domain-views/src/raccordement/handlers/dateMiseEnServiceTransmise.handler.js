'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.dateMiseEnServiceTransmiseHandlerFactory = void 0;
const monads_1 = require('@potentiel/monads');
/**
 * @deprecated
 */
const dateMiseEnServiceTransmiseHandlerFactory =
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
          dateMiseEnService: event.payload.dateMiseEnService,
        },
      );
    } else {
      // TODO add a log here
    }
  };
exports.dateMiseEnServiceTransmiseHandlerFactory = dateMiseEnServiceTransmiseHandlerFactory;
//# sourceMappingURL=dateMiseEnServiceTransmise.handler.js.map
