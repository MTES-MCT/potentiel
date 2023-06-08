import { When as Quand } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import { mediator } from 'mediateur';
import { Readable } from 'stream';
import {
  DomainUseCase,
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
} from '@potentiel/domain';

Quand(
  `le porteur modifie une demande complète de raccordement avec une référence ne correspondant pas au format défini par le gestionnaire de réseau`,
  async function (this: PotentielWorld) {
    const dateQualification = new Date('2023-01-01');
    const accuséRéception = {
      format: 'text/plain',
      content: Readable.from("Contenu d'un nouveau fichier", {
        encoding: 'utf-8',
      }),
    };

    try {
      await mediator.send<DomainUseCase>({
        type: 'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(this.raccordementWorld.identifiantProjet),
          dateQualification,
          référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement('123456789'),
          accuséRéception: accuséRéception,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }

    this.raccordementWorld.dateQualification = dateQualification;
    this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement = accuséRéception;
  },
);

Quand(
  `un administrateur modifie la date de qualification pour un dossier de raccordement non connu`,
  async function (this: PotentielWorld) {
    try {
      await mediator.send<DomainUseCase>({
        type: 'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(this.raccordementWorld.identifiantProjet),
          dateQualification: new Date('2023-01-01'),
          référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement('123456789'),
          accuséRéception: this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
