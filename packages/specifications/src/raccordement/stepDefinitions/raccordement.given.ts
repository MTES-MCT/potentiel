import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { expect } from 'chai';

import { DateTime } from '@potentiel-domain/common';
import { GestionnaireRéseau, Raccordement } from '@potentiel-domain/reseau';
import { ListerTâchesQuery } from '@potentiel-domain/tache';

import { PotentielWorld } from '../../potentiel.world';
import { RechercherTypeTâche } from '../../tâche/tâche.world';

import { transmettreDemandeComplèteRaccordement } from './raccordement.when';

EtantDonné(
  'le gestionnaire de réseau {string} attribué au raccordement du projet lauréat',
  async function (this: PotentielWorld, raisonSocialeGestionnaireRéseau: string) {
    const { codeEIC } = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
      raisonSocialeGestionnaireRéseau,
    );
    this.raccordementWorld.identifiantGestionnaireRéseau = codeEIC;
    await mediator.send<Raccordement.ModifierGestionnaireRéseauRaccordementUseCase>({
      type: 'Réseau.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
      data: {
        identifiantGestionnaireRéseauValue: codeEIC,
        identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
        rôleValue: this.utilisateurWorld.adminFixture.role,
      },
    });
  },
);

EtantDonné(
  'le gestionnaire de réseau inconnu attribué au raccordement du projet lauréat',
  async function (this: PotentielWorld) {
    this.raccordementWorld.identifiantGestionnaireRéseau =
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu.formatter();
    await mediator.send<Raccordement.ModifierGestionnaireRéseauRaccordementUseCase>({
      type: 'Réseau.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
      data: {
        identifiantGestionnaireRéseauValue:
          GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu.formatter(),
        identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
        rôleValue: this.utilisateurWorld.adminFixture.role,
      },
    });
  },
);

EtantDonné(
  'une demande complète de raccordement pour le projet lauréat',
  async function (this: PotentielWorld) {
    await transmettreDemandeComplèteRaccordement.call(this, this.lauréatWorld.identifiantProjet);
  },
);

EtantDonné(
  'une demande complète de raccordement pour le projet lauréat avec :',
  async function (this: PotentielWorld, datatable: DataTable) {
    await transmettreDemandeComplèteRaccordement.call(
      this,
      this.lauréatWorld.identifiantProjet,
      datatable.rowsHash(),
    );
  },
);

EtantDonné(
  'une proposition technique et financière pour le dossier de raccordement du projet lauréat',
  async function (this: PotentielWorld) {
    const { identifiantProjet, référenceDossier } =
      this.raccordementWorld.transmettreDemandeComplèteRaccordementFixture;

    const { dateSignature, propositionTechniqueEtFinancièreSignée } =
      this.raccordementWorld.transmettrePropositionTechniqueEtFinancièreFixture.créer({
        identifiantProjet,
        référenceDossier,
      });

    await mediator.send<Raccordement.RaccordementUseCase>({
      type: 'Réseau.Raccordement.UseCase.TransmettrePropositionTechniqueEtFinancière',
      data: {
        identifiantProjetValue: identifiantProjet,
        référenceDossierRaccordementValue: référenceDossier,
        dateSignatureValue: dateSignature,
        propositionTechniqueEtFinancièreSignéeValue: propositionTechniqueEtFinancièreSignée,
      },
    });
  },
);

EtantDonné(
  'une date de mise en service pour le dossier de raccordement pour le projet lauréat',
  async function (this: PotentielWorld) {
    const { identifiantProjet, référenceDossier } = this.raccordementWorld;
    const { dateMiseEnService } = this.raccordementWorld.transmettreDateMiseEnServiceFixture.créer({
      identifiantProjet,
      référenceDossier,
    });

    try {
      await mediator.send<Raccordement.RaccordementUseCase>({
        type: 'Réseau.Raccordement.UseCase.TransmettreDateMiseEnService',
        data: {
          identifiantProjetValue: identifiantProjet,
          référenceDossierValue: référenceDossier,
          dateMiseEnServiceValue: dateMiseEnService,
          transmiseLeValue: DateTime.now().formatter(),
          transmiseParValue: this.utilisateurWorld.adminFixture.email,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

EtantDonné(
  'une tâche indiquant de {string} pour le projet lauréat avec gestionnaire inconnu',
  async function (this: PotentielWorld, tâche: RechercherTypeTâche) {
    const actualTypeTâche = this.tâcheWorld.rechercherTypeTâche(tâche);
    const { identifiantProjet } = this.lauréatWorld;

    await mediator.send<Raccordement.RaccordementUseCase>({
      type: 'Réseau.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
      data: {
        identifiantGestionnaireRéseauValue: 'inconnu',
        identifiantProjetValue: identifiantProjet.formatter(),
        rôleValue: this.utilisateurWorld.porteurFixture.role,
      },
    });

    await waitForExpect(async () => {
      const tâches = await mediator.send<ListerTâchesQuery>({
        type: 'Tâche.Query.ListerTâches',
        data: {
          email: this.utilisateurWorld.porteurFixture.email,
        },
      });

      const tâche = tâches.items.find((t) => t.typeTâche.estÉgaleÀ(actualTypeTâche));
      expect(tâche).not.to.be.undefined;
    });
  },
);
