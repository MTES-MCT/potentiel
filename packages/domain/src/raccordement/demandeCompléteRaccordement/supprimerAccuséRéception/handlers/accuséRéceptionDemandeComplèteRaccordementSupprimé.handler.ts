import { DomainEventHandlerFactory } from '@potentiel/core-domain';
import { AccuséRéceptionDemandeComplèteRaccordementSuppriméEvent } from '../accuséRéceptionDemandeComplèteRaccordementSupprimé.event';

export type SupprimerAccuséRéceptionDemandeComplèteRaccordementPort = (args: {
  identifiantProjet: string;
  référenceDossierRaccordement: string;
  format: string;
}) => Promise<void>;

export type AccuséRéceptionDemandeComplèteRaccordementSuppriméDependencies = {
  supprimerAccuséRéceptionDemandeComplèteRaccordement: SupprimerAccuséRéceptionDemandeComplèteRaccordementPort;
};

/**
 * @deprecated
 */
export const accuséRéceptionDemandeComplèteRaccordementSuppriméHandlerFactory: DomainEventHandlerFactory<
  AccuséRéceptionDemandeComplèteRaccordementSuppriméEvent,
  AccuséRéceptionDemandeComplèteRaccordementSuppriméDependencies
> =
  ({ supprimerAccuséRéceptionDemandeComplèteRaccordement }) =>
  async ({ payload: { format, référenceDossierRaccordement, identifiantProjet } }) => {
    await supprimerAccuséRéceptionDemandeComplèteRaccordement({
      identifiantProjet,
      référenceDossierRaccordement,
      format,
    });
  };
