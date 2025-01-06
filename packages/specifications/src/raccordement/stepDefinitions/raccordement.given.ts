import { Given as EtantDonné, DataTable } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { expect } from 'chai';

import { DateTime } from '@potentiel-domain/common';
import { GestionnaireRéseau, Raccordement } from '@potentiel-domain/reseau';
import { ListerTâchesQuery } from '@potentiel-domain/tache';

import { convertStringToReadableStream } from '../../helpers/convertStringToReadable';
import { PotentielWorld } from '../../potentiel.world';
import { RechercherTypeTâche } from '../../tâche/tâche.world';
import { waitForEvents } from '../../helpers/waitForEvents';

EtantDonné(
  'le gestionnaire de réseau {string} attribué au raccordement du projet lauréat',
  async function (this: PotentielWorld, raisonSocialeGestionnaireRéseau: string) {
    await waitForEvents();
    const { codeEIC } = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
      raisonSocialeGestionnaireRéseau,
    );
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
    await waitForEvents();

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
  'une demande complète de raccordement pour le projet lauréat transmise auprès du gestionnaire de réseau avec :',
  async function (this: PotentielWorld, table: DataTable) {
    const exemple = table.rowsHash();
    const dateQualification = new Date(exemple['La date de qualification']).toISOString();
    const référenceDossierRaccordement = exemple['La référence du dossier de raccordement'];
    const format = exemple[`Le format de l'accusé de réception`];
    const content = exemple[`Le contenu de l'accusé de réception`];

    const { identifiantProjet } = this.lauréatWorld;

    const accuséRéception = {
      format,
      content: convertStringToReadableStream(content),
    };

    this.raccordementWorld.dateQualification = DateTime.convertirEnValueType(dateQualification);
    this.raccordementWorld.référenceDossierRaccordement =
      Raccordement.RéférenceDossierRaccordement.convertirEnValueType(référenceDossierRaccordement);
    this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement = {
      format,
      content,
    };

    // le raccordement est créé par une saga
    await waitForEvents();

    await mediator.send<Raccordement.RaccordementUseCase>({
      type: 'Réseau.Raccordement.UseCase.TransmettreDemandeComplèteRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        référenceDossierValue: référenceDossierRaccordement,
        dateQualificationValue: dateQualification,
        accuséRéceptionValue: accuséRéception,
      },
    });
  },
);

EtantDonné(
  'une proposition technique et financière pour le dossier ayant comme référence {string} du raccordement pour le projet lauréat avec :',
  async function (this: PotentielWorld, référenceDossier: string, table: DataTable) {
    const exemple = table.rowsHash();
    const dateSignature = new Date(exemple['La date de signature']).toISOString();
    const format = exemple[`Le format de la proposition technique et financière`];
    const content = exemple[`Le contenu de proposition technique et financière`];

    const { identifiantProjet } = this.lauréatWorld;

    this.raccordementWorld.dateSignature = DateTime.convertirEnValueType(dateSignature);
    this.raccordementWorld.propositionTechniqueEtFinancièreSignée = {
      content,
      format,
    };

    const propositionTechniqueEtFinancièreSignée = {
      format,
      content: convertStringToReadableStream(content),
    };

    await mediator.send<Raccordement.RaccordementUseCase>({
      type: 'Réseau.Raccordement.UseCase.TransmettrePropositionTechniqueEtFinancière',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        référenceDossierRaccordementValue: référenceDossier,
        dateSignatureValue: dateSignature,
        propositionTechniqueEtFinancièreSignéeValue: propositionTechniqueEtFinancièreSignée,
      },
    });
  },
);

EtantDonné(
  'une date de mise en service {string} pour le dossier ayant comme référence {string} du raccordement pour le projet lauréat',
  async function (this: PotentielWorld, dateMiseEnService: string, référenceDossier: string) {
    const dateMiseEnServiceValueType = new Date(dateMiseEnService).toISOString();

    const { identifiantProjet } = this.lauréatWorld;

    this.raccordementWorld.dateMiseEnService = DateTime.convertirEnValueType(
      dateMiseEnServiceValueType,
    );
    this.raccordementWorld.référenceDossierRaccordement =
      Raccordement.RéférenceDossierRaccordement.convertirEnValueType(référenceDossier);

    try {
      await mediator.send<Raccordement.RaccordementUseCase>({
        type: 'Réseau.Raccordement.UseCase.TransmettreDateMiseEnService',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          référenceDossierValue: référenceDossier,
          dateMiseEnServiceValue: dateMiseEnServiceValueType,
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

    await waitForEvents();
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
