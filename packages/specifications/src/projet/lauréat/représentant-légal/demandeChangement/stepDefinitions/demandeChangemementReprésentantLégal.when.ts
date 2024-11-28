import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../../potentiel.world';

Quand(
  /le porteur demande le changement de réprésentant pour le projet lauréat/,
  async function (this: PotentielWorld) {
    try {
      const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

      const {
        nomReprésentantLégal,
        typeReprésentantLégal,
        piècesJustificative,
        demandéLe,
        demandéPar,
      } = this.lauréatWorld.représentantLégalWorld.demanderChangementReprésentantLégalFixture.créer(
        {
          identifiantProjet,
          demandéPar: this.utilisateurWorld.porteurFixture.email,
        },
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
