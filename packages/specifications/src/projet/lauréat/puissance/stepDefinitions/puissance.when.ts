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
  'le DGEC validateur modifie la puissance pour le projet lauréat avec :',
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      await modifierPuissance.call(
        this,
        this.utilisateurWorld.adminFixture.email,
        'lauréat',
        exemple['ratio puissance'],
        exemple['ratio puissance de site'],
        exemple['puissance de site'],
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
  ratio?: string,
  ratioPuissanceDeSite?: string,
  puissanceDeSiteExemple?: string,
) {
  const { identifiantProjet } = statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

  const nouvellePuissanceDeSite =
    Number(puissanceDeSiteExemple) ||
    (this.candidatureWorld.importerCandidature.dépôtValue?.puissanceDeSite
      ? this.candidatureWorld.importerCandidature.dépôtValue?.puissanceDeSite *
        Number(ratioPuissanceDeSite)
      : undefined);

  const { puissance, puissanceDeSite, dateModification, raison } =
    this.lauréatWorld.puissanceWorld.modifierPuissanceFixture.créer({
      appelOffres: this.lauréatWorld.identifiantProjet.appelOffre,
      ...(ratio !== undefined
        ? {
            puissance:
              this.candidatureWorld.importerCandidature.dépôtValue.puissanceProductionAnnuelle *
              Number(ratio),
          }
        : {}),
      puissanceDeSite: nouvellePuissanceDeSite,
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
