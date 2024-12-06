import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../../potentiel.world';
import { CréerDemandeChangementReprésentantLégalFixture } from '../fixtures/demanderChangementReprésentantLégal.fixture';

Quand(
  /le porteur demande le changement de réprésentant pour le projet lauréat(.*)/,
  async function (this: PotentielWorld, extra?: string) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const options: CréerDemandeChangementReprésentantLégalFixture = extra?.includes(
      'avec les mêmes valeurs',
    )
      ? {
          identifiantProjet,
          nomReprésentantLégal:
            this.lauréatWorld.représentantLégalWorld.importerReprésentantLégalFixture
              .nomReprésentantLégal,
          typeReprésentantLégal:
            this.lauréatWorld.représentantLégalWorld.importerReprésentantLégalFixture
              .typeReprésentantLégal,
          demandéPar: this.utilisateurWorld.porteurFixture.email,
        }
      : extra?.includes('avec un type inconnu')
        ? {
            identifiantProjet,
            typeReprésentantLégal:
              ReprésentantLégal.TypeReprésentantLégal.convertirEnValueType('inconnu'),
          }
        : extra?.includes('sans pièces justificatives')
          ? {
              identifiantProjet,
              demandéPar: this.utilisateurWorld.porteurFixture.email,
              pièceJustificative: undefined,
            }
          : {
              identifiantProjet,
              demandéPar: this.utilisateurWorld.porteurFixture.email,
            };

    const {
      nomReprésentantLégal,
      typeReprésentantLégal,
      pièceJustificative,
      demandéLe,
      demandéPar,
    } =
      this.lauréatWorld.représentantLégalWorld.demanderChangementReprésentantLégalFixture.créer(
        options,
      );

    try {
      await mediator.send<ReprésentantLégal.ReprésentantLégalUseCase>({
        type: 'Lauréat.ReprésentantLégal.UseCase.DemanderChangementReprésentantLégal',
        data: {
          identifiantProjetValue: options.identifiantProjet,
          nomReprésentantLégalValue: nomReprésentantLégal,
          typeReprésentantLégalValue: typeReprésentantLégal.formatter(),
          pièceJustificativeValue: extra?.includes('sans pièces justificatives')
            ? undefined
            : pièceJustificative,
          dateDemandeValue: demandéLe,
          identifiantUtilisateurValue: demandéPar,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
