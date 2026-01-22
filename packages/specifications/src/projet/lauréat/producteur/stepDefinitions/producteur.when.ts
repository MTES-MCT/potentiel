import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world.js';

Quand(
  'le porteur enregistre un changement de producteur pour le projet lauréat',
  async function (this: PotentielWorld) {
    try {
      await enregistrerChangementProducteur.call(this);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur enregistre un changement de producteur avec une valeur identique pour le projet lauréat',
  async function (this: PotentielWorld) {
    try {
      await enregistrerChangementProducteur.call(
        this,
        this.candidatureWorld.importerCandidature.values['nomCandidatValue'],
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le DGEC validateur modifie le producteur du projet {lauréat-éliminé}',
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    try {
      const { identifiantProjet } =
        statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

      await modifierProducteur.call(this, identifiantProjet);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le DGEC validateur modifie le producteur avec une valeur identique pour le projet lauréat',
  async function (this: PotentielWorld) {
    try {
      await modifierProducteur.call(
        this,
        this.lauréatWorld.identifiantProjet,
        this.candidatureWorld.importerCandidature.values['nomCandidatValue'],
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

export async function enregistrerChangementProducteur(
  this: PotentielWorld,
  producteurValue?: string,
) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet;

  const { pièceJustificative, enregistréLe, enregistréPar, producteur } =
    this.lauréatWorld.producteurWorld.enregistrerChangementProducteurFixture.créer({
      enregistréPar: this.utilisateurWorld.porteurFixture.email,
      ...(producteurValue && { producteur: producteurValue }),
    });

  await mediator.send<Lauréat.Producteur.EnregistrerChangementProducteurUseCase>({
    type: 'Lauréat.Producteur.UseCase.EnregistrerChangement',
    data: {
      producteurValue: producteur,
      dateChangementValue: enregistréLe,
      identifiantUtilisateurValue: enregistréPar,
      identifiantProjetValue: identifiantProjet.formatter(),
      pièceJustificativeValue: pièceJustificative,
    },
  });
}

export async function modifierProducteur(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  producteurValue?: string,
) {
  const { modifiéLe, modifiéPar, producteur, raison } =
    this.lauréatWorld.producteurWorld.modifierProducteurFixture.créer({
      modifiéPar: this.utilisateurWorld.adminFixture.email,
      ...(producteurValue && { producteur: producteurValue }),
    });

  await mediator.send<Lauréat.Producteur.ModifierProducteurUseCase>({
    type: 'Lauréat.Producteur.UseCase.ModifierProducteur',
    data: {
      producteurValue: producteur,
      dateModificationValue: modifiéLe,
      identifiantUtilisateurValue: modifiéPar,
      identifiantProjetValue: identifiantProjet.formatter(),
      raisonValue: raison,
    },
  });
}
