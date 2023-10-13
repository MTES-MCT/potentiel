import { When as Quand } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import { mediator } from 'mediateur';
import {
  DomainUseCase,
  RôleUtilisateur,
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
} from '@potentiel/domain-usecases';

Quand(
  `l'utilisateur avec le rôle {string} modifie la demande complète de raccordement {string} avec la référence {string}`,
  async function (
    this: PotentielWorld,
    rôleUtilisateur: RôleUtilisateur,
    référenceDossierRaccordementActuelle: string,
    nouvelleRéférenceDossierRaccordement: string,
  ) {
    this.raccordementWorld.référenceDossierRaccordement = nouvelleRéférenceDossierRaccordement;

    try {
      await mediator.send<DomainUseCase>({
        type: 'MODIFIER_RÉFÉRENCE_DOSSIER_RACCORDEMENT_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(this.lauréatWorld.identifiantProjet),
          nouvelleRéférenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
            nouvelleRéférenceDossierRaccordement,
          ),
          référenceDossierRaccordementActuelle: convertirEnRéférenceDossierRaccordement(
            référenceDossierRaccordementActuelle,
          ),
          rôleUtilisateur,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);
