import { DomainEventHandlerFactory } from '@potentiel/core-domain';
import { AccuséRéceptionDemandeComplèteRaccordementSuppriméEvent } from '../accuséRéceptionDemandeComplèteRaccordementSupprimé.event';

export type SupprimerAccuséRéceptionDemandeComplèteRaccordementPort = (args: {
  identifiantProjet: string;
  référence: string;
  format: string;
}) => Promise<void>;

export type AccuséRéceptionDemandeComplèteRaccordementSuppriméDependencies = {
  supprimerAccuséRéceptionDemandeComplèteRaccordementPort: SupprimerAccuséRéceptionDemandeComplèteRaccordementPort;
};

/**
 * @deprecated
 */
export const accuséRéceptionDemandeComplèteRaccordementSuppriméHandlerFactory: DomainEventHandlerFactory<
  AccuséRéceptionDemandeComplèteRaccordementSuppriméEvent,
  AccuséRéceptionDemandeComplèteRaccordementSuppriméDependencies
> =
  ({ supprimerAccuséRéceptionDemandeComplèteRaccordementPort }) =>
  async ({ payload: { format, référence, identifiantProjet } }) => {
    await supprimerAccuséRéceptionDemandeComplèteRaccordementPort({
      identifiantProjet,
      référence,
      format,
    });
  };
