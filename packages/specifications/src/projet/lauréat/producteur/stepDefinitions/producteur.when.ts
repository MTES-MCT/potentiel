import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { Producteur } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../potentiel.world';

Quand('le producteur est importé pour le projet', async function (this: PotentielWorld) {
  try {
    await importerProducteur.call(this);
  } catch (error) {
    this.error = error as Error;
  }
});

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

async function importerProducteur(this: PotentielWorld) {
  const identifiantProjet = this.candidatureWorld.importerCandidature.identifiantProjet;
  const { importéLe } = this.lauréatWorld.producteurWorld.importerProducteurFixture.créer({
    producteur: this.candidatureWorld.importerCandidature.values.nomCandidatValue,
  });

  await mediator.send<Producteur.ProducteurCommand>({
    type: 'Lauréat.Producteur.Command.ImporterProducteur',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      importéLe: DateTime.convertirEnValueType(importéLe),
    },
  });
}

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

  await mediator.send<Producteur.EnregistrerChangementProducteurUseCase>({
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

  await mediator.send<Producteur.ModifierProducteurUseCase>({
    type: 'Lauréat.Producteur.UseCase.ModifierProducteur',
    data: {
      producteurValue: producteur,
      dateModificationValue: modifiéLe,
      identifiantUtilisateurValue: modifiéPar,
      identifiantProjetValue: identifiantProjet.formatter(),
    },
  });
}
