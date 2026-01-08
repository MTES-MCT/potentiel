import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';

Quand(
  /le DGEC validateur modifie le nom et le type du représentant légal(.*) pour le projet lauréat/,
  async function (this: PotentielWorld, avecLesMêmesValeurs?: string) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet;
    const { nomReprésentantLégal, typeReprésentantLégal } =
      this.lauréatWorld.représentantLégalWorld.mapToExpected(
        identifiantProjet,
        this.candidatureWorld.importerCandidature.aÉtéCréé
          ? this.candidatureWorld.importerCandidature.values.nomReprésentantLégalValue
          : '',
      );
    try {
      const options = avecLesMêmesValeurs?.includes('avec les mêmes valeurs')
        ? {
            nom: nomReprésentantLégal,
            type: typeReprésentantLégal,
          }
        : {
            nom: nomReprésentantLégal,
            type: Lauréat.ReprésentantLégal.TypeReprésentantLégal.personnePhysique,
          };

      await modifierReprésentantLégal.call(this, options);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

type ModifierReprésentantLégalOptions = {
  nom?: string;
  type?: Lauréat.ReprésentantLégal.TypeReprésentantLégal.ValueType;
};
async function modifierReprésentantLégal(
  this: PotentielWorld,
  { nom, type }: ModifierReprésentantLégalOptions,
) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { nomReprésentantLégal, typeReprésentantLégal, dateModification, raison } =
    this.lauréatWorld.représentantLégalWorld.modifierReprésentantLégalFixture.créer(
      nom && type
        ? {
            nomReprésentantLégal: nom,
            typeReprésentantLégal: type,
          }
        : {},
    );

  await mediator.send<Lauréat.ReprésentantLégal.ModifierReprésentantLégalUseCase>({
    type: 'Lauréat.ReprésentantLégal.UseCase.ModifierReprésentantLégal',
    data: {
      identifiantProjetValue: identifiantProjet,
      identifiantUtilisateurValue: this.utilisateurWorld.adminFixture.email,
      nomReprésentantLégalValue: nomReprésentantLégal,
      typeReprésentantLégalValue: typeReprésentantLégal.formatter(),
      dateModificationValue: dateModification,
      raisonValue: raison,
    },
  });
}
