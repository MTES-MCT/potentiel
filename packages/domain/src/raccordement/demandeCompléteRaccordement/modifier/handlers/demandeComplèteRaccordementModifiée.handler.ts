import { Create, Remove, DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { DemandeComplèteRaccordementModifiéeEvent } from '../demandeComplèteRaccordementModifiée.event';
import { ListeDossiersRaccordementReadModel } from '../../../dossierRaccordement/lister/listeDossierRaccordement.readModel';
import { DossierRaccordementReadModel } from '../../../dossierRaccordement/consulter/dossierRaccordement.readModel';
import {
  EnregistrerPropositionTechniqueEtFinancièreSignéePort,
  RécupérerPropositionTechniqueEtFinancièreSignéePort,
  SupprimerPropositionTechniqueEtFinancièreSignéePort,
} from '../../../raccordement.ports';

export type DemandeComplèteRaccordementeModifiéeDependencies = {
  find: Find;
  create: Create;
  remove: Remove;
  update: Update;
  récupérerPropositionTechniqueEtFinancièreSignée: RécupérerPropositionTechniqueEtFinancièreSignéePort;
  enregistrerPropositionTechniqueEtFinancièreSignée: EnregistrerPropositionTechniqueEtFinancièreSignéePort;
  supprimerPropositionTechniqueEtFinancièreSignée: SupprimerPropositionTechniqueEtFinancièreSignéePort;
};

/**
 * @deprecated
 */
export const demandeComplèteRaccordementeModifiéeHandlerFactory: DomainEventHandlerFactory<
  DemandeComplèteRaccordementModifiéeEvent,
  DemandeComplèteRaccordementeModifiéeDependencies
> =
  ({
    find,
    create,
    remove,
    update,
    récupérerPropositionTechniqueEtFinancièreSignée:
      récupérerFichierPropositionTechniqueEtFinancière,
    enregistrerPropositionTechniqueEtFinancièreSignée,
    supprimerPropositionTechniqueEtFinancièreSignée,
  }) =>
  async (event) => {
    const dossierRaccordement = await find<DossierRaccordementReadModel>(
      `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.referenceActuelle}`,
    );

    if (isNone(dossierRaccordement)) {
      // TODO ajouter un log ici
      return;
    }

    await create<DossierRaccordementReadModel>(
      `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.nouvelleReference}`,
      {
        ...dossierRaccordement,
        dateQualification: event.payload.dateQualification,
        référence: event.payload.nouvelleReference,
      },
    );

    await remove<DossierRaccordementReadModel>(
      `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.referenceActuelle}`,
    );

    const listeDossierRaccordement = await find<ListeDossiersRaccordementReadModel>(
      `liste-dossiers-raccordement#${event.payload.identifiantProjet}`,
    );

    if (isNone(listeDossierRaccordement)) {
      // TODO ajouter un log ici
      return;
    }

    await update<ListeDossiersRaccordementReadModel>(
      `liste-dossiers-raccordement#${event.payload.identifiantProjet}`,
      {
        ...listeDossierRaccordement,
        références: [
          ...listeDossierRaccordement.références.filter(
            (référence) => référence !== event.payload.referenceActuelle,
          ),
          event.payload.nouvelleReference,
        ],
      },
    );

    // Renommer PTF
    // TODO: ce code doit être dans une saga quand on aura le publish

    if (
      dossierRaccordement.propositionTechniqueEtFinancière &&
      event.payload.nouvelleReference !== event.payload.referenceActuelle
    ) {
      // Charger PTF
      const content = await récupérerFichierPropositionTechniqueEtFinancière({
        identifiantProjet: event.payload.identifiantProjet,
        format: dossierRaccordement.propositionTechniqueEtFinancière.format,
        référenceDossierRaccordement: event.payload.referenceActuelle,
      });

      // Créer PTF avec nouvelleRéf
      enregistrerPropositionTechniqueEtFinancièreSignée({
        identifiantProjet: event.payload.identifiantProjet,
        format: dossierRaccordement.propositionTechniqueEtFinancière.format,
        référenceDossierRaccordement: event.payload.nouvelleReference,
        content,
      });

      // Supprimer PTF avec réf actuelle
      supprimerPropositionTechniqueEtFinancièreSignée({
        identifiantProjet: event.payload.identifiantProjet,
        format: dossierRaccordement.propositionTechniqueEtFinancière.format,
        référenceDossierRaccordement: event.payload.referenceActuelle,
      });
    }
  };
