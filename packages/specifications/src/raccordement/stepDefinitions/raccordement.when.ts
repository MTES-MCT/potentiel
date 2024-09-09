import { When as Quand, DataTable } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Raccordement } from '@potentiel-domain/reseau';
import { DateTime } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { convertStringToReadableStream } from '../../helpers/convertStringToReadable';
import { PotentielWorld } from '../../potentiel.world';

Quand(
  `le porteur transmet une demande complète de raccordement pour le projet lauréat {string} auprès du gestionnaire de réseau {string} avec :`,
  async function (
    this: PotentielWorld,
    nomProjet: string,
    raisonSocialeGestionnaire: string,
    table: DataTable,
  ) {
    const exemple = table.rowsHash();
    const dateQualification = new Date(exemple['La date de qualification']).toISOString();
    const référenceDossierRaccordement = exemple['La référence du dossier de raccordement'];
    const format = exemple[`Le format de l'accusé de réception`];
    const content = exemple[`Le contenu de l'accusé de réception`];

    const accuséRéception = {
      format,
      content: convertStringToReadableStream(content),
    };

    const identifiantProjet = this.lauréatWorld
      .rechercherLauréatFixture(nomProjet)
      .identifiantProjet.formatter();

    const identifiantGestionnaireRéseau =
      raisonSocialeGestionnaire === 'Inconnu'
        ? 'Code EIC inconnu'
        : this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
            raisonSocialeGestionnaire,
          ).codeEIC;

    try {
      this.raccordementWorld.dateQualification = DateTime.convertirEnValueType(dateQualification);
      this.raccordementWorld.référenceDossierRaccordement =
        Raccordement.RéférenceDossierRaccordement.convertirEnValueType(
          référenceDossierRaccordement,
        );
      this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement = {
        format,
        content,
      };
      await mediator.send<Raccordement.RaccordementUseCase>({
        type: 'Réseau.Raccordement.UseCase.TransmettreDemandeComplèteRaccordement',
        data: {
          accuséRéceptionValue: accuséRéception,
          dateQualificationValue: dateQualification,
          identifiantGestionnaireRéseauValue: identifiantGestionnaireRéseau,
          identifiantProjetValue: identifiantProjet,
          référenceDossierValue: référenceDossierRaccordement,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `le porteur transmet la date de mise en service {string} pour le dossier de raccordement du le projet lauréat {string} ayant pour référence {string}`,
  async function (
    this: PotentielWorld,
    dateMiseEnService: string,
    nomProjet: string,
    référenceDossierRaccordement: string,
  ) {
    const { identifiantProjet, dateDésignation } =
      this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    this.raccordementWorld.dateMiseEnService = DateTime.convertirEnValueType(
      new Date(dateMiseEnService).toISOString(),
    );
    this.raccordementWorld.référenceDossierRaccordement =
      Raccordement.RéférenceDossierRaccordement.convertirEnValueType(référenceDossierRaccordement);

    try {
      await mediator.send<Raccordement.RaccordementUseCase>({
        type: 'Réseau.Raccordement.UseCase.TransmettreDateMiseEnService',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          référenceDossierValue: référenceDossierRaccordement,
          dateMiseEnServiceValue: new Date(dateMiseEnService).toISOString(),
          dateDésignationValue: new Date(dateDésignation).toISOString(),
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `le porteur transmet une proposition technique et financière pour le dossier de raccordement du projet lauréat {string} ayant pour référence {string} avec :`,
  async function (
    this: PotentielWorld,
    nomProjet: string,
    référenceDossierRaccordement: string,
    table: DataTable,
  ) {
    const exemple = table.rowsHash();
    const dateSignature = exemple['La date de signature'];
    const format = exemple[`Le format de la proposition technique et financière`];
    const content = exemple[`Le contenu de proposition technique et financière`];

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const propositionTechniqueEtFinancièreSignée = {
      format,
      content: convertStringToReadableStream(content),
    };

    this.raccordementWorld.dateSignature = DateTime.convertirEnValueType(
      new Date(dateSignature).toISOString(),
    );
    this.raccordementWorld.référenceDossierRaccordement =
      Raccordement.RéférenceDossierRaccordement.convertirEnValueType(référenceDossierRaccordement);
    this.raccordementWorld.propositionTechniqueEtFinancièreSignée = {
      format,
      content,
    };

    try {
      await mediator.send<Raccordement.RaccordementUseCase>({
        type: 'Réseau.Raccordement.UseCase.TransmettrePropositionTechniqueEtFinancière',
        data: {
          dateSignatureValue: new Date(dateSignature).toISOString(),
          référenceDossierRaccordementValue: référenceDossierRaccordement,
          identifiantProjetValue: identifiantProjet.formatter(),
          propositionTechniqueEtFinancièreSignéeValue: propositionTechniqueEtFinancièreSignée,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `l'utilisateur avec le rôle {string} modifie la demande complète de raccordement pour le projet lauréat {string} ayant pour référence {string} auprès du gestionnaire de réseau {string} avec :`,
  async function (
    this: PotentielWorld,
    rôleUtilisateur: string,
    nomProjet: string,
    référenceDossierRaccordement: string,
    raisonSocialeGestionnaire: string,
    table: DataTable,
  ) {
    const exemple = table.rowsHash();
    const dateQualification = new Date(exemple['La date de qualification']).toISOString();
    const format = exemple[`Le format de l'accusé de réception`];
    const content = exemple[`Le contenu de l'accusé de réception`];

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    const { codeEIC } =
      this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(raisonSocialeGestionnaire);

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

    try {
      await mediator.send<Raccordement.RaccordementUseCase>({
        type: 'Réseau.Raccordement.UseCase.ModifierDemandeComplèteRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          identifiantGestionnaireRéseauValue: codeEIC,
          référenceDossierRaccordementValue: référenceDossierRaccordement,
          dateQualificationValue: dateQualification,
          accuséRéceptionValue: accuséRéception,
          rôleValue: rôleUtilisateur,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `le porteur modifie la proposition technique et financière pour le dossier de raccordement du projet lauréat {string} ayant pour référence {string} avec :`,
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

    const propositionTechniqueEtFinancièreSignée = {
      format,
      content: convertStringToReadableStream(content),
    };

    this.raccordementWorld.dateSignature = DateTime.convertirEnValueType(dateSignature);
    this.raccordementWorld.référenceDossierRaccordement =
      Raccordement.RéférenceDossierRaccordement.convertirEnValueType(référenceDossierRaccordement);
    this.raccordementWorld.propositionTechniqueEtFinancièreSignée = {
      format,
      content,
    };

    try {
      await mediator.send<Raccordement.RaccordementUseCase>({
        type: 'Réseau.Raccordement.UseCase.ModifierPropositionTechniqueEtFinancière',
        data: {
          dateSignatureValue: dateSignature,
          référenceDossierRaccordementValue: référenceDossierRaccordement,
          identifiantProjetValue: identifiantProjet.formatter(),
          propositionTechniqueEtFinancièreSignéeValue: propositionTechniqueEtFinancièreSignée,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `un porteur modifie le gestionnaire de réseau du projet {string} avec un gestionnaire non référencé`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    try {
      await mediator.send<Raccordement.ModifierGestionnaireRéseauRaccordementUseCase>({
        type: 'Réseau.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          identifiantGestionnaireRéseauValue: 'GESTIONNAIRE NON RÉFÉRENCÉ',
          rôleValue: Role.porteur.nom,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `le système modifie le gestionnaire de réseau du projet {string} avec un gestionnaire inconnu`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    try {
      await mediator.send<Raccordement.ModifierGestionnaireRéseauRaccordementUseCase>({
        type: 'Réseau.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          identifiantGestionnaireRéseauValue: 'inconnu',
          rôleValue: Role.admin.nom,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `un porteur modifie le gestionnaire de réseau du projet {string} avec le gestionnaire {string}`,
  async function (this: PotentielWorld, nomProjet: string, raisonSocialGestionnaireRéseau: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    const { codeEIC } = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
      raisonSocialGestionnaireRéseau,
    );

    try {
      await mediator.send<Raccordement.ModifierGestionnaireRéseauRaccordementUseCase>({
        type: 'Réseau.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          identifiantGestionnaireRéseauValue: codeEIC,
          rôleValue: Role.porteur.nom,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `une dreal modifie le gestionnaire de réseau du projet {string} avec le gestionnaire {string}`,
  async function (this: PotentielWorld, nomProjet: string, raisonSocialGestionnaireRéseau: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    const { codeEIC } = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
      raisonSocialGestionnaireRéseau,
    );

    try {
      await mediator.send<Raccordement.ModifierGestionnaireRéseauRaccordementUseCase>({
        type: 'Réseau.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          identifiantGestionnaireRéseauValue: codeEIC,
          rôleValue: Role.dreal.nom,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `l'utilisateur avec le rôle {string} modifie la demande complète de raccordement pour le projet lauréat {string} ayant pour référence {string} avec la référence {string}`,
  async function (
    this: PotentielWorld,
    rôleUtilisateur: string,
    nomProjet: string,
    référenceDossierRaccordementActuelle: string,
    nouvelleRéférenceDossierRaccordement: string,
  ) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    try {
      this.raccordementWorld.référenceDossierRaccordement =
        Raccordement.RéférenceDossierRaccordement.convertirEnValueType(
          nouvelleRéférenceDossierRaccordement,
        );
      await mediator.send<Raccordement.RaccordementUseCase>({
        type: 'Réseau.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          nouvelleRéférenceDossierRaccordementValue: nouvelleRéférenceDossierRaccordement,
          référenceDossierRaccordementActuelleValue: référenceDossierRaccordementActuelle,
          rôleValue: rôleUtilisateur,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `le gestionnaire de réseau {string} est attribué au raccordement du projet {lauréat-éliminé} {string}`,
  async function (
    this: PotentielWorld,
    nomGestionnaireRéseau: string,
    statutProjet: 'lauréat' | 'éliminé',
    nomProjet: string,
  ) {
    const { identifiantProjet } =
      statutProjet === 'lauréat'
        ? this.lauréatWorld.rechercherLauréatFixture(nomProjet)
        : this.eliminéWorld.rechercherÉliminéFixture(nomProjet);

    const { codeEIC } =
      this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(nomGestionnaireRéseau);

    try {
      await mediator.send<Raccordement.RaccordementUseCase>({
        type: 'Réseau.Raccordement.UseCase.AttribuerGestionnaireRéseau',
        data: {
          identifiantGestionnaireRéseauValue: codeEIC,
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `un gestionnaire de réseau non référencé est attribué au raccordement du projet {lauréat-éliminé} {string}`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé', nomProjet: string) {
    const { identifiantProjet } =
      statutProjet === 'lauréat'
        ? this.lauréatWorld.rechercherLauréatFixture(nomProjet)
        : this.eliminéWorld.rechercherÉliminéFixture(nomProjet);

    try {
      await mediator.send<Raccordement.RaccordementUseCase>({
        type: 'Réseau.Raccordement.UseCase.AttribuerGestionnaireRéseau',
        data: {
          identifiantGestionnaireRéseauValue: 'GESTIONNAIRE NON RÉFÉRENCÉ',
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `le gestionnaire de réseau inconnu est attribué au raccordement du projet {lauréat-éliminé} {string}`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé', nomProjet: string) {
    const { identifiantProjet } =
      statutProjet === 'lauréat'
        ? this.lauréatWorld.rechercherLauréatFixture(nomProjet)
        : this.eliminéWorld.rechercherÉliminéFixture(nomProjet);

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
  },
);

Quand(
  `le porteur supprime le dossier ayant pour référence {string} du raccordement pour le projet lauréat {string}`,
  async function (this: PotentielWorld, référenceDossier: string, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    try {
      await mediator.send<Raccordement.SupprimerDossierDuRaccordementUseCase>({
        type: 'Réseau.Raccordement.UseCase.SupprimerDossierDuRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          référenceDossierValue: référenceDossier,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);
