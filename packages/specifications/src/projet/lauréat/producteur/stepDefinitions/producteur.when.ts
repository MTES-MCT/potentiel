import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';

Quand(
  'le porteur enregistre un changement de producteur pour le projet {lauréat-éliminé}',
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    try {
      await enregistrerChangementProducteur.call(this, statutProjet);
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
        'lauréat',
        this.lauréatWorld.producteurWorld.importerProducteurFixture.producteur,
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
      await modifierProducteur.call(this, statutProjet);
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
        'lauréat',
        this.lauréatWorld.producteurWorld.importerProducteurFixture.producteur,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

export async function enregistrerChangementProducteur(
  this: PotentielWorld,
  statutProjet: 'lauréat' | 'éliminé',
  producteurValue?: string,
) {
  const identifiantProjet =
    statutProjet === 'lauréat'
      ? this.lauréatWorld.identifiantProjet
      : this.eliminéWorld.identifiantProjet;

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
  statutProjet: 'lauréat' | 'éliminé',
  producteurValue?: string,
) {
  const identifiantProjet =
    statutProjet === 'lauréat'
      ? this.lauréatWorld.identifiantProjet
      : this.eliminéWorld.identifiantProjet;

  const { modifiéLe, modifiéPar, producteur } =
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
    },
  });
}
