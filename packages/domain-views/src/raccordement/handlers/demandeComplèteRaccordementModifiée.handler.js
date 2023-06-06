'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.demandeComplèteRaccordementeModifiéeHandlerFactory = void 0;
const monads_1 = require('@potentiel/monads');
/**
 * @deprecated
 */
const demandeComplèteRaccordementeModifiéeHandlerFactory =
  ({
    find,
    create,
    remove,
    update,
    récupérerPropositionTechniqueEtFinancièreSignée:
      récupérerFichierPropositionTechniqueEtFinancière,
    enregistrerPropositionTechniqueEtFinancièreSignée,
  }) =>
  async (event) => {
    const dossierRaccordement = await find(
      `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.referenceActuelle}`,
    );
    if ((0, monads_1.isNone)(dossierRaccordement)) {
      // TODO ajouter un log ici
      return;
    }
    await remove(
      `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.referenceActuelle}`,
    );
    await create(
      `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.nouvelleReference}`,
      {
        ...dossierRaccordement,
        dateQualification: event.payload.dateQualification,
        référence: event.payload.nouvelleReference,
      },
    );
    const listeDossierRaccordement = await find(
      `liste-dossiers-raccordement#${event.payload.identifiantProjet}`,
    );
    if ((0, monads_1.isNone)(listeDossierRaccordement)) {
      // TODO ajouter un log ici
      return;
    }
    if (event.payload.nouvelleReference !== event.payload.referenceActuelle) {
      await update(`liste-dossiers-raccordement#${event.payload.identifiantProjet}`, {
        ...listeDossierRaccordement,
        références: [
          ...listeDossierRaccordement.références.filter(
            (référence) => référence !== event.payload.referenceActuelle,
          ),
          event.payload.nouvelleReference,
        ],
      });
      // Renommer PTF
      // TODO: ce code doit être dans une saga quand on aura le publish
      if (dossierRaccordement.propositionTechniqueEtFinancière) {
        // Charger PTF
        const content = await récupérerFichierPropositionTechniqueEtFinancière({
          identifiantProjet: event.payload.identifiantProjet,
          format: dossierRaccordement.propositionTechniqueEtFinancière.format,
          référenceDossierRaccordement: event.payload.referenceActuelle,
        });
        if (content) {
          // Créer PTF avec nouvelleRéf
          enregistrerPropositionTechniqueEtFinancièreSignée({
            opération: 'déplacement-fichier',
            identifiantProjet: event.payload.identifiantProjet,
            ancienFichier: {
              format: dossierRaccordement.propositionTechniqueEtFinancière.format,
              content,
            },
            nouveauFichier: {
              format: dossierRaccordement.propositionTechniqueEtFinancière.format,
              content,
            },
            ancienneRéférenceDossierRaccordement: event.payload.referenceActuelle,
            nouvelleRéférenceDossierRaccordement: event.payload.nouvelleReference,
          });
        }
      }
    }
  };
exports.demandeComplèteRaccordementeModifiéeHandlerFactory =
  demandeComplèteRaccordementeModifiéeHandlerFactory;
//# sourceMappingURL=demandeCompl%C3%A8teRaccordementModifi%C3%A9e.handler.js.map
