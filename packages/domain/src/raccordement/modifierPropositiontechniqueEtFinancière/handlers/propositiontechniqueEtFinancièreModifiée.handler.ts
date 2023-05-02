import { DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { DossierRaccordementReadModel } from '../../consulter/dossierRaccordement.readModel';
import { PropositionTechniqueEtFinancièreModifiéeEvent } from '../PropositionTechniqueEtFinancièreModifiée.event';

export const propositionTechniqueEtFinancièreModifiéeHandlerFactory: DomainEventHandlerFactory<
  PropositionTechniqueEtFinancièreModifiéeEvent,
  {
    find: Find;
    update: Update;
  }
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
        },
      },
    );
  };
