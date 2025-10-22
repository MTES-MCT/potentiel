import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';

Quand(
  `le DGEC validateur modifie la puissance pour le projet {lauréat-éliminé}`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    try {
      await modifierPuissance.call(
        this,
        this.utilisateurWorld.validateurFixture.email,
        statutProjet,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le DGEC validateur modifie la puissance avec la même valeur pour le projet lauréat',
  async function (this: PotentielWorld) {
    try {
      await modifierPuissance.call(this, this.utilisateurWorld.adminFixture.email, 'lauréat', 1);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le DGEC validateur modifie la puissance pour le projet lauréat avec :',
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      await modifierPuissance.call(
        this,
        this.utilisateurWorld.adminFixture.email,
        'lauréat',
        Number(exemple['ratio puissance']),
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

async function modifierPuissance(
  this: PotentielWorld,
  modifiéPar: string,
  statutProjet?: 'lauréat' | 'éliminé',
  ratio?: number,
  ratioPuissanceDeSite?: number,
) {
  const { identifiantProjet } = statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

  const { puissance, puissanceDeSite, dateModification, raison } =
    this.lauréatWorld.puissanceWorld.modifierPuissanceFixture.créer({
      appelOffres: this.lauréatWorld.identifiantProjet.appelOffre,
      ...(ratio !== undefined
        ? {
            puissance:
              this.candidatureWorld.importerCandidature.dépôtValue.puissanceProductionAnnuelle *
              ratio,
          }
        : {}),
      ...(ratioPuissanceDeSite !== undefined
        ? {
            puissanceDeSite:
              (this.candidatureWorld.importerCandidature.dépôtValue?.puissanceDeSite ?? 0) *
              ratioPuissanceDeSite,
          }
        : {}),
    });

  await mediator.send<Lauréat.Puissance.PuissanceUseCase>({
    type: 'Lauréat.Puissance.UseCase.ModifierPuissance',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
      identifiantUtilisateurValue: modifiéPar,
      puissanceValue: puissance,
      puissanceDeSiteValue: puissanceDeSite,
      dateModificationValue: dateModification,
      raisonValue: raison,
    },
  });
}
