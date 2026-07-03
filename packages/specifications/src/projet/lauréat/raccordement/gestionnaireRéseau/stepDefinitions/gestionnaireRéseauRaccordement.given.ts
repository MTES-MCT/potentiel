import { Given as EtantDonné } from '@cucumber/cucumber';
import { expect } from 'chai';
import { mediator } from 'mediateur';

import type { Lauréat } from '@potentiel-domain/projet';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { waitForExpect } from '#helpers';
import type { PotentielWorld } from '../../../../../potentiel.world.js';
import type { RechercherTypeTâche } from '../../../../../tâche/tâche.world.js';

EtantDonné(
  'le gestionnaire de réseau {string} attribué au raccordement du projet lauréat',
  async function (this: PotentielWorld, raisonSocialeGestionnaireRéseau: string) {
    const { codeEIC } = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
      raisonSocialeGestionnaireRéseau,
    );

    this.lauréatWorld.raccordementWorld.identifiantGestionnaireRéseau = codeEIC;

    await mediator.send<Lauréat.Raccordement.ModifierGestionnaireRéseauRaccordementUseCase>({
      type: 'Lauréat.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
      data: {
        identifiantGestionnaireRéseauValue: codeEIC,
        identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
        rôleValue: this.utilisateurWorld.dgecFixture.role,
        modifiéParValue: this.utilisateurWorld.dgecFixture.email,
        modifiéLeValue: this.lauréatWorld.notifierLauréatFixture.notifiéLe,
      },
    });
  },
);

EtantDonné(
  'le gestionnaire de réseau inconnu attribué au raccordement du projet lauréat',
  async function (this: PotentielWorld) {
    this.lauréatWorld.raccordementWorld.identifiantGestionnaireRéseau =
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu.formatter();

    await mediator.send<Lauréat.Raccordement.ModifierGestionnaireRéseauRaccordementUseCase>({
      type: 'Lauréat.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
      data: {
        identifiantGestionnaireRéseauValue:
          GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu.formatter(),
        identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
        rôleValue: this.utilisateurWorld.dgecFixture.role,
        modifiéParValue: this.utilisateurWorld.dgecFixture.email,
        modifiéLeValue: this.lauréatWorld.notifierLauréatFixture.notifiéLe,
      },
    });
  },
);

EtantDonné(
  'une tâche indiquant de {string} pour le projet lauréat avec gestionnaire inconnu',
  async function (this: PotentielWorld, tâche: RechercherTypeTâche) {
    const actualTypeTâche = this.tâcheWorld.rechercherTypeTâche(tâche);
    const { identifiantProjet } = this.lauréatWorld;

    await mediator.send<Lauréat.Raccordement.RaccordementUseCase>({
      type: 'Lauréat.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
      data: {
        identifiantGestionnaireRéseauValue: 'inconnu',
        identifiantProjetValue: identifiantProjet.formatter(),
        rôleValue: this.utilisateurWorld.porteurFixture.role,
        modifiéParValue: this.utilisateurWorld.dgecFixture.email,
        modifiéLeValue: this.lauréatWorld.notifierLauréatFixture.notifiéLe,
      },
    });

    await waitForExpect(async () => {
      const tâches = await mediator.send<Lauréat.Tâche.ListerTâchesQuery>({
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
