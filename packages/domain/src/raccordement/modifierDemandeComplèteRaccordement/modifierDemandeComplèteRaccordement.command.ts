import { Publish, LoadAggregate, CommandHandlerFactory } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import {
  loadRaccordementAggregateFactory,
  createRaccordementAggregateId,
} from '../raccordement.aggregate';
import { DemandeComplèteRaccordementModifiéeEvent } from './DemandeComplèteRaccordementModifiée.event';
import { DossierRaccordementNonRéférencéError } from '../raccordement.errors';
import { Readable } from 'stream';
import { RemplacerAccuséRéceptionDemandeComplèteRaccordement } from './remplacerAccuséRéceptionDemandeComplèteRaccordement';

type ModifierDemandeComplèteRaccordementCommand = {
  identifiantProjet: IdentifiantProjet;
  dateQualification: Date;
  referenceActuelle: string;
  nouvelleReference: string;
  fichierASupprimerPath: string;
  nouveauFichier: {
    format: string;
    path: string;
    content: Readable;
  };
};

type ModifierDemandeComplèteRaccordementDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  remplacerAccuséRéceptionDemandeComplèteRaccordement: RemplacerAccuséRéceptionDemandeComplèteRaccordement;
};

export const modifierDemandeComplèteRaccordementCommandHandlerFactory: CommandHandlerFactory<
  ModifierDemandeComplèteRaccordementCommand,
  ModifierDemandeComplèteRaccordementDependencies
> =
  ({ publish, loadAggregate, remplacerAccuséRéceptionDemandeComplèteRaccordement }) =>
  async ({
    identifiantProjet,
    dateQualification,
    referenceActuelle,
    nouvelleReference,
    fichierASupprimerPath,
    nouveauFichier,
  }) => {
    const loadRaccordementAggregate = loadRaccordementAggregateFactory({
      loadAggregate,
    });

    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement) || !raccordement.références.includes(referenceActuelle)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const event: DemandeComplèteRaccordementModifiéeEvent = {
      type: 'DemandeComplèteRaccordementModifiée',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        dateQualification: dateQualification.toISOString(),
        referenceActuelle,
        nouvelleReference,
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), event);

    // await remplacerAccuséRéceptionDemandeComplèteRaccordement({
    //   identifiantProjet,
    //   référenceDossierRaccordement,
    //   fichierASupprimerPath,
    //   nouveauFichier,
    // });
  };
