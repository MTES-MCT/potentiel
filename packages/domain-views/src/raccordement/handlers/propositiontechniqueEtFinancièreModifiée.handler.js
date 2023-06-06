'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.propositionTechniqueEtFinancièreModifiéeHandlerFactory = void 0;
const monads_1 = require('@potentiel/monads');
/**
 * @deprecated
 */
const propositionTechniqueEtFinancièreModifiéeHandlerFactory =
  ({ find, update }) =>
  async (event) => {
    const dossierRaccordement = await find(
      `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
    );
    if ((0, monads_1.isNone)(dossierRaccordement)) {
      // TODO ajouter un log ici
      return;
    }
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
  };
exports.propositionTechniqueEtFinancièreModifiéeHandlerFactory =
  propositionTechniqueEtFinancièreModifiéeHandlerFactory;
//# sourceMappingURL=propositiontechniqueEtFinanci%C3%A8reModifi%C3%A9e.handler.js.map
