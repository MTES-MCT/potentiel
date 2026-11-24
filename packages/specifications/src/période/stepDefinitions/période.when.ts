import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import type { Période } from '@potentiel-domain/periode';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import type { PotentielWorld } from '../../potentiel.world.js';

Quand(/la DGEC initié l'import d'une période/, async function (this: PotentielWorld) {
  await importerPériode.call(this);
});

Quand(
  /.* DGEC validateur notifie la période d'un appel d'offres/,
  async function (this: PotentielWorld) {
    await notifierPériode.call(this);
  },
);

export async function notifierPériode(this: PotentielWorld) {
  try {
    const identifiantPériode = this.périodeWorld.identifiantPériode.formatter();

    const { lauréats, éliminés, notifiéeLe, notifiéePar } =
      this.périodeWorld.notifierPériodeFixture.créer({
        notifiéePar: this.utilisateurWorld.validateurFixture.email,
      });

    const tousProjets = lauréats.concat(éliminés);
    for (const { emailContact } of tousProjets) {
      this.utilisateurWorld.porteurFixture.créer({
        email: emailContact,
      });
    }

    await mediator.send<Période.NotifierPériodeUseCase>({
      type: 'Période.UseCase.NotifierPériode',
      data: {
        identifiantPériodeValue: identifiantPériode,
        notifiéeLeValue: DateTime.convertirEnValueType(notifiéeLe).formatter(),
        notifiéeParValue: notifiéePar,
        validateurValue: {
          fonction: this.utilisateurWorld.validateurFixture.fonction,
          nomComplet: this.utilisateurWorld.validateurFixture.nom,
        },
        identifiantCandidatureValues: tousProjets.map((projet) =>
          IdentifiantProjet.bind(projet).formatter(),
        ),
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}

export async function importerPériode(this: PotentielWorld) {
  try {
    const identifiantPériode = this.périodeWorld.identifiantPériode.formatter();

    const { candidatsImportés, importéeLe, importéePar } =
      this.périodeWorld.importerPériodeFixture.créer({
        importéePar: this.utilisateurWorld.dgecFixture.email,
      });

    await mediator.send<Période.InitierImportPériodeUseCase>({
      type: 'Période.UseCase.InitierImportPériode',
      data: {
        identifiantPériodeValue: identifiantPériode,
        initiéLeValue: DateTime.convertirEnValueType(importéeLe).formatter(),
        initiéParValue: importéePar,
        instructionValue: candidatsImportés.map((candidat) => ({
          identifiantProjet: candidat.identifiant,
          ...candidat.instruction,
        })),
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}
