import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';

Quand(
  "un administrateur modifie l'évaluation carbone du projet",
  async function (this: PotentielWorld) {
    const { modifiéLe, modifiéPar, évaluationCarbone } =
      this.lauréatWorld.fournisseurWorld.modifierÉvaluationCarbone.créer({
        modifiéPar: this.utilisateurWorld.adminFixture.email,
      });
    await mediator.send<Lauréat.Fournisseur.ModifierÉvaluationCarboneUseCase>({
      type: 'Lauréat.Fournisseur.UseCase.ModifierÉvaluationCarbone',
      data: {
        identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
        modifiéLeValue: modifiéLe,
        modifiéParValue: modifiéPar,
        évaluationCarboneSimplifiéeValue: évaluationCarbone,
      },
    });
  },
);
