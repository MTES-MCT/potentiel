import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';

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
  'le DGEC validateur modifie le producteur du projet lauréat',
  async function (this: PotentielWorld) {
    try {
      await modifierProducteur.call(this);
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

export async function modifierProducteur(this: PotentielWorld, producteurValue?: string) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet;

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
