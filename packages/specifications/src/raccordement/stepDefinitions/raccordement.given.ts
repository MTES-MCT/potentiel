import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { expect } from 'chai';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { ListerTâchesQuery } from '@potentiel-domain/tache';
import { Raccordement } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../potentiel.world';
import { RechercherTypeTâche } from '../../tâche/tâche.world';

EtantDonné(
  'le gestionnaire de réseau {string} attribué au raccordement du projet lauréat',
  async function (this: PotentielWorld, raisonSocialeGestionnaireRéseau: string) {
    const { codeEIC } = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
      raisonSocialeGestionnaireRéseau,
    );
    this.raccordementWorld.identifiantGestionnaireRéseau = codeEIC;
    await mediator.send<Raccordement.ModifierGestionnaireRéseauRaccordementUseCase>({
      type: 'Lauréat.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
      data: {
        identifiantGestionnaireRéseauValue: codeEIC,
        identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
        rôleValue: this.utilisateurWorld.adminFixture.role,
      },
    });
  },
);

EtantDonné(
  'le gestionnaire de réseau inconnu attribué au raccordement du projet lauréat',
  async function (this: PotentielWorld) {
    this.raccordementWorld.identifiantGestionnaireRéseau =
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu.formatter();
    await mediator.send<Raccordement.ModifierGestionnaireRéseauRaccordementUseCase>({
      type: 'Lauréat.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
      data: {
        identifiantGestionnaireRéseauValue:
          GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu.formatter(),
        identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
        rôleValue: this.utilisateurWorld.adminFixture.role,
      },
    });
  },
);

EtantDonné(
  'une tâche indiquant de {string} pour le projet lauréat avec gestionnaire inconnu',
  async function (this: PotentielWorld, tâche: RechercherTypeTâche) {
    const actualTypeTâche = this.tâcheWorld.rechercherTypeTâche(tâche);
    const { identifiantProjet } = this.lauréatWorld;

    await mediator.send<Raccordement.RaccordementUseCase>({
      type: 'Lauréat.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
      data: {
        identifiantGestionnaireRéseauValue: 'inconnu',
        identifiantProjetValue: identifiantProjet.formatter(),
        rôleValue: this.utilisateurWorld.porteurFixture.role,
      },
    });

    await waitForExpect(async () => {
      const tâches = await mediator.send<ListerTâchesQuery>({
        type: 'Tâche.Query.ListerTâches',
        data: {
          email: this.utilisateurWorld.porteurFixture.email,
        },
      });

      const tâche = tâches.items.find((t) => t.typeTâche.estÉgaleÀ(actualTypeTâche));
      expect(tâche).not.to.be.undefined;
    });
  },
);
