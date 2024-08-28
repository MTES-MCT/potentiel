import { Given as EtantDonné, DataTable } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { expect } from 'chai';

import { DateTime } from '@potentiel-domain/common';
import { Raccordement } from '@potentiel-domain/reseau';
import { ListerTâchesQuery } from '@potentiel-domain/tache';

import { convertStringToReadableStream } from '../../helpers/convertStringToReadable';
import { PotentielWorld } from '../../potentiel.world';
import { RechercherTypeTâche } from '../../tâche/tâche.world';

EtantDonné(
  'une demande complète de raccordement pour le projet lauréat {string} transmise auprès du gestionnaire de réseau {string} avec :',
  async function (
    this: PotentielWorld,
    nomProjet: string,
    raisonSocialeGestionnaireRéseau: string,
    table: DataTable,
  ) {
    const exemple = table.rowsHash();
    const dateQualification = new Date(exemple['La date de qualification']).toISOString();
    const référenceDossierRaccordement = exemple['La référence du dossier de raccordement'];
    const format = exemple[`Le format de l'accusé de réception`];
    const content = exemple[`Le contenu de l'accusé de réception`];

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    const { codeEIC } = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
      raisonSocialeGestionnaireRéseau,
    );

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

    await mediator.send<Raccordement.RaccordementUseCase>({
      type: 'Réseau.Raccordement.UseCase.TransmettreDemandeComplèteRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        identifiantGestionnaireRéseauValue: codeEIC,
        référenceDossierValue: référenceDossierRaccordement,
        dateQualificationValue: dateQualification,
        accuséRéceptionValue: accuséRéception,
      },
    });
  },
);

EtantDonné(
  'une propositon technique et financière pour le dossier de raccordement pour le projet lauréat {string} ayant pour référence {string} avec :',
  async function (
    this: PotentielWorld,
    nomProjet: string,
    référenceDossierRaccordement: string,
    table: DataTable,
  ) {
    const exemple = table.rowsHash();
    const dateSignature = new Date(exemple['La date de signature']).toISOString();
    const format = exemple[`Le format de la proposition technique et financière`];
    const content = exemple[`Le contenu de proposition technique et financière`];

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

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
        référenceDossierRaccordementValue: référenceDossierRaccordement,
        dateSignatureValue: dateSignature,
        propositionTechniqueEtFinancièreSignéeValue: propositionTechniqueEtFinancièreSignée,
      },
    });
  },
);

EtantDonné(
  'une date de mise en service {string} pour le dossier de raccordement pour le projet lauréat {string} ayant pour référence {string}',
  async function (
    this: PotentielWorld,
    dateMiseEnService: string,
    nomProjet: string,
    référenceDossierRaccordement: string,
  ) {
    const dateMiseEnServiceValueType = new Date(dateMiseEnService).toISOString();

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    this.raccordementWorld.dateMiseEnService = DateTime.convertirEnValueType(
      dateMiseEnServiceValueType,
    );
    this.raccordementWorld.référenceDossierRaccordement =
      Raccordement.RéférenceDossierRaccordement.convertirEnValueType(référenceDossierRaccordement);

    try {
      await mediator.send<Raccordement.RaccordementUseCase>({
        type: 'Réseau.Raccordement.UseCase.TransmettreDateMiseEnService',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          référenceDossierValue: référenceDossierRaccordement,
          dateMiseEnServiceValue: dateMiseEnServiceValueType,
          dateDésignationValue: new Date('2020-01-01').toISOString(),
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

EtantDonné(
  'le gestionnaire de réseau {string} attribué au raccordement du projet lauréat {string}',
  async function (
    this: PotentielWorld,
    raisonSocialeGestionnaireRéseau: string,
    nomProjet: string,
  ) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    const { codeEIC } = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
      raisonSocialeGestionnaireRéseau,
    );

    await mediator.send<Raccordement.RaccordementUseCase>({
      type: 'Réseau.Raccordement.UseCase.AttribuerGestionnaireRéseau',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        identifiantGestionnaireRéseauValue: codeEIC,
      },
    });
  },
);

EtantDonné(
  'une tâche indiquant de {string} pour le projet lauréat {string} avec gestionnaire inconnu',
  async function (this: PotentielWorld, tâche: RechercherTypeTâche, nomProjet: string) {
    const actualTypeTâche = this.tâcheWorld.rechercherTypeTâche(tâche);
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    try {
      await mediator.send<Raccordement.RaccordementUseCase>({
        type: 'Réseau.Raccordement.UseCase.AttribuerGestionnaireRéseau',
        data: {
          identifiantGestionnaireRéseauValue: 'inconnu',
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });
    } catch (e) {
      this.error = e as Error;
    }

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
