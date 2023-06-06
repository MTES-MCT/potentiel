'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.demandeComplèteRaccordementTransmiseHandlerFactory = void 0;
const monads_1 = require('@potentiel/monads');
/**
 * @deprecated
 */
const demandeComplèteRaccordementTransmiseHandlerFactory =
  ({ create, update, find }) =>
  async (event) => {
    await create(
      `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
      {
        dateQualification: event.payload.dateQualification,
        référence: event.payload.référenceDossierRaccordement,
      },
    );
    const listeDossierRaccordement = await find(
      `liste-dossiers-raccordement#${event.payload.identifiantProjet}`,
    );
    if ((0, monads_1.isNone)(listeDossierRaccordement)) {
      await create(`liste-dossiers-raccordement#${event.payload.identifiantProjet}`, {
        références: [event.payload.référenceDossierRaccordement],
      });
    } else {
      await update(`liste-dossiers-raccordement#${event.payload.identifiantProjet}`, {
        ...listeDossierRaccordement,
        références: [
          ...listeDossierRaccordement.références,
          event.payload.référenceDossierRaccordement,
        ],
      });
    }
    const projetKey = `projet#${event.payload.identifiantProjet}`;
    const projet = await find(projetKey);
    // TODO : est-ce qu'on émettrait pas un event GestionnaireRéseauProjetModifiéEvent ici plutôt ?
    if ((0, monads_1.isNone)(projet)) {
      await create(projetKey, {
        identifiantGestionnaire: {
          codeEIC: event.payload.identifiantGestionnaireRéseau,
        },
      });
    } else {
      await update(projetKey, {
        identifiantGestionnaire: {
          codeEIC: event.payload.identifiantGestionnaireRéseau,
        },
      });
    }
  };
exports.demandeComplèteRaccordementTransmiseHandlerFactory =
  demandeComplèteRaccordementTransmiseHandlerFactory;
//# sourceMappingURL=demandeCompl%C3%A8teRaccordementTransmise.handler.js.map
