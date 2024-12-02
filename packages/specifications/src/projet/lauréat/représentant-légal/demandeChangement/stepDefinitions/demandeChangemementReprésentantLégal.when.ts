import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../../potentiel.world';
import { CréerDemandeChangementReprésentantLégalFixture } from '../fixtures/demanderChangementReprésentantLégal.fixture';

Quand(
  /le porteur demande le changement de réprésentant pour le projet lauréat(.*)/,
  async function (this: PotentielWorld, avecLesMêmesValeurs?: string) {
    try {
      const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

      const options: CréerDemandeChangementReprésentantLégalFixture = avecLesMêmesValeurs?.includes(
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
        : {
            identifiantProjet,
            demandéPar: this.utilisateurWorld.porteurFixture.email,
          };

      const {
        nomReprésentantLégal,
        typeReprésentantLégal,
        piècesJustificative,
        demandéLe,
        demandéPar,
      } =
        this.lauréatWorld.représentantLégalWorld.demanderChangementReprésentantLégalFixture.créer(
          options,
        );

      await mediator.send<ReprésentantLégal.ReprésentantLégalUseCase>({
        type: 'Lauréat.ReprésentantLégal.UseCase.DemanderChangementReprésentantLégal',
        data: {
          identifiantProjetValue: identifiantProjet,
          nomReprésentantLégalValue: nomReprésentantLégal,
          typeReprésentantLégalValue: typeReprésentantLégal.formatter(),
          piècesJustificativeValue: piècesJustificative,
          dateDemandeValue: demandéLe,
          identifiantUtilisateurValue: demandéPar,
        },
      });

      this.lauréatWorld.représentantLégalWorld.demanderChangementReprésentantLégalFixture.créer({
        identifiantProjet,
        nomReprésentantLégal,
        typeReprésentantLégal,
        piècesJustificative,
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
