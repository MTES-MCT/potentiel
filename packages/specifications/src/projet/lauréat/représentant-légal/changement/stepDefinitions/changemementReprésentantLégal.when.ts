import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../../../potentiel.world';
import { CréerDemandeChangementReprésentantLégalFixture } from '../fixtures/demanderChangementReprésentantLégal.fixture';

Quand(
  /le porteur demande le changement de réprésentant pour le projet lauréat(.*)/,
  async function (this: PotentielWorld, extra?: string) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet;

    const options = getOptions({
      potentielWorld: this,
      identifiantProjet: identifiantProjet.formatter(),
      extra,
    });

    const {
      nomReprésentantLégal,
      typeReprésentantLégal,
      pièceJustificative,
      demandéLe,
      demandéPar,
    } =
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.demanderChangementReprésentantLégalFixture.créer(
        options,
      );

    try {
      await mediator.send<ReprésentantLégal.DemanderChangementReprésentantLégalUseCase>({
        type: 'Lauréat.ReprésentantLégal.UseCase.DemanderChangementReprésentantLégal',
        data: {
          identifiantProjetValue: options.identifiantProjet,
          nomReprésentantLégalValue: nomReprésentantLégal,
          typeReprésentantLégalValue: typeReprésentantLégal.formatter(),
          pièceJustificativeValue: pièceJustificative,
          dateDemandeValue: demandéLe,
          identifiantUtilisateurValue: demandéPar,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

type GetOptions = (args: {
  potentielWorld: PotentielWorld;
  identifiantProjet: IdentifiantProjet.RawType;
  extra?: string;
}) => CréerDemandeChangementReprésentantLégalFixture;
const getOptions: GetOptions = ({ potentielWorld, identifiantProjet, extra }) => {
  if (extra?.includes('avec un type inconnu')) {
    return {
      identifiantProjet,
      typeReprésentantLégal:
        ReprésentantLégal.TypeReprésentantLégal.convertirEnValueType('inconnu'),
    };
  }

  if (extra?.includes('avec les mêmes valeurs')) {
    return {
      identifiantProjet,
      nomReprésentantLégal:
        potentielWorld.lauréatWorld.représentantLégalWorld.importerReprésentantLégalFixture
          .nomReprésentantLégal,
      typeReprésentantLégal:
        potentielWorld.lauréatWorld.représentantLégalWorld.importerReprésentantLégalFixture
          .typeReprésentantLégal,
      demandéPar: potentielWorld.utilisateurWorld.porteurFixture.email,
    };
  }

  return {
    identifiantProjet,
    demandéPar: potentielWorld.utilisateurWorld.porteurFixture.email,
  };
};

Quand(
  /(le DGEC validateur|la DREAL associée au projet|le système) accorde la demande de changement de représentant légal pour le projet lauréat/,
  async function (
    this: PotentielWorld,
    rôle: 'le DGEC validateur' | 'la DREAL associée au projet' | 'le système',
  ) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const { accordéeLe, accordéePar, nomReprésentantLégal, typeReprésentantLégal } =
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.accorderChangementReprésentantLégalFixture.créer();

    try {
      await mediator.send<ReprésentantLégal.ReprésentantLégalUseCase>({
        type: 'Lauréat.ReprésentantLégal.UseCase.AccorderChangementReprésentantLégal',
        data: {
          identifiantProjetValue: identifiantProjet,
          identifiantUtilisateurValue: accordéePar,
          nomReprésentantLégalValue: nomReprésentantLégal,
          typeReprésentantLégalValue: typeReprésentantLégal.formatter(),
          dateAccordValue: accordéeLe,
          accordAutomatiqueValue: rôle === 'le système',
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  /(le DGEC validateur|la DREAL associée au projet|le système) rejette la demande de changement de représentant légal pour le projet lauréat/,
  async function (
    this: PotentielWorld,
    rôle: 'le DGEC validateur' | 'la DREAL associée au projet' | 'le système',
  ) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const { rejetéeLe, rejetéePar, motif } =
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.rejeterChangementReprésentantLégalFixture.créer();

    try {
      await mediator.send<ReprésentantLégal.RejeterChangementReprésentantLégalUseCase>({
        type: 'Lauréat.ReprésentantLégal.UseCase.RejeterChangementReprésentantLégal',
        data: {
          identifiantProjetValue: identifiantProjet,
          identifiantUtilisateurValue: rejetéePar,
          dateRejetValue: rejetéeLe,
          motifRejetValue: motif,
          rejetAutomatiqueValue: rôle === 'le système',
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
