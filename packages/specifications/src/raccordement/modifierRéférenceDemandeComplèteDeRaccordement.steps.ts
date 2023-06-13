import { When as Quand } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import { mediator } from 'mediateur';
import {
  DomainUseCase,
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
} from '@potentiel/domain';

Quand(
  `le porteur modifie la demande complète de raccordement {string} avec la référence {string}`,
  async function (
    this: PotentielWorld,
    référenceDossierRaccordementActuelle: string,
    nouvelleRéférenceDossierRaccordement: string,
  ) {
    this.raccordementWorld.référenceDossierRaccordement = nouvelleRéférenceDossierRaccordement;

    try {
      await mediator.send<DomainUseCase>({
        type: 'MODIFIER_RÉFÉRENCE_DOSSIER_RACCORDEMENT_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(this.projetWorld.identifiantProjet),
          nouvelleRéférenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
            nouvelleRéférenceDossierRaccordement,
          ),
          référenceDossierRaccordementActuelle: convertirEnRéférenceDossierRaccordement(
            référenceDossierRaccordementActuelle,
          ),
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);
