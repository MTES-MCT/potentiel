import { DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { PropositionTechniqueEtFinancièreModifiéeEvent } from '../../../../domain/src/raccordement/propositionTechniqueEtFinancière/modifier/propositionTechniqueEtFinancièreModifiée.event';
import { DossierRaccordementReadModel } from '../../../dossierRaccordement/consulter/dossierRaccordement.readModel';

export type PropositionTechniqueEtFinancièreModifiéeDependencies = {
  find: Find;
  update: Update;
};

/**
 * @deprecated
 */
export const propositionTechniqueEtFinancièreModifiéeHandlerFactory: DomainEventHandlerFactory<
  PropositionTechniqueEtFinancièreModifiéeEvent,
  PropositionTechniqueEtFinancièreModifiéeDependencies
> =
  ({ find, update }) =>
  async (event) => {
    const dossierRaccordement = await find<DossierRaccordementReadModel>(
      `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
    );

    if (isNone(dossierRaccordement)) {
      // TODO ajouter un log ici
      return;
    }

    await update<DossierRaccordementReadModel>(
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
