import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Abandon } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../potentiel.world';

Quand(
  /le porteur demande l'abandon(.*)pour le projet lauréat/,
  async function (this: PotentielWorld, etat: string) {
    try {
      const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

      const { demandéLe, demandéPar, pièceJustificative, raison, recandidature } =
        this.lauréatWorld.abandonWorld.demanderAbandonFixture.créer({
          recandidature: etat.includes('avec recandidature'),
          demandéPar: this.utilisateurWorld.porteurFixture.email,
        });

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'Lauréat.Abandon.UseCase.DemanderAbandon',
        data: {
          identifiantProjetValue: identifiantProjet,
          raisonValue: raison,
          pièceJustificativeValue: etat.includes('sans transmettre de pièce justificative')
            ? undefined
            : pièceJustificative,
          recandidatureValue: recandidature,
          dateDemandeValue: demandéLe,
          identifiantUtilisateurValue: demandéPar,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
