import { When as Quand, DataTable } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Raccordement } from '@potentiel-domain/reseau';
import { DateTime } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { convertStringToReadableStream } from '../../helpers/convertStringToReadable';
import { PotentielWorld } from '../../potentiel.world';
import { waitForEvents } from '../../helpers/waitForEvents';

Quand(
  `le porteur transmet une demande complète de raccordement pour le projet {lauréat-éliminé} auprès du gestionnaire de réseau avec :`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé', table: DataTable) {
    const exemple = table.rowsHash();
    const dateQualification = new Date(exemple['La date de qualification']).toISOString();
    const référenceDossierRaccordement = exemple['La référence du dossier de raccordement'];
    const format = exemple[`Le format de l'accusé de réception`];
    const content = exemple[`Le contenu de l'accusé de réception`];

    const accuséRéception = {
      format,
      content: convertStringToReadableStream(content),
    };

    const identifiantProjet =
      statutProjet === 'lauréat'
        ? this.lauréatWorld.identifiantProjet.formatter()
        : this.eliminéWorld.identifiantProjet.formatter();

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
  `le gestionnaire de réseau transmet la date de mise en service {string} pour le dossier de raccordement du projet lauréat ayant pour référence {string}`,
  async function (
    this: PotentielWorld,
    dateMiseEnService: string,
    référenceDossierRaccordement: string,
  ) {
    const { identifiantProjet } = this.lauréatWorld;

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
          transmiseLeValue: DateTime.now().formatter(),
          transmiseParValue: this.utilisateurWorld.grdFixture.email,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `le porteur transmet une proposition technique et financière pour le dossier de raccordement du projet lauréat ayant pour référence {string} avec :`,
  async function (this: PotentielWorld, référenceDossierRaccordement: string, table: DataTable) {
    const exemple = table.rowsHash();
    const dateSignature = exemple['La date de signature'];
    const format = exemple[`Le format de la proposition technique et financière`];
    const content = exemple[`Le contenu de proposition technique et financière`];

    const { identifiantProjet } = this.lauréatWorld;

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
  `l'utilisateur avec le rôle {string} modifie la demande complète de raccordement pour le projet lauréat ayant pour référence {string} auprès du gestionnaire de réseau avec :`,
  async function (
    this: PotentielWorld,
    rôleUtilisateur: string,
    référenceDossierRaccordement: string,
    table: DataTable,
  ) {
    const exemple = table.rowsHash();
    const dateQualification = new Date(exemple['La date de qualification']).toISOString();
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

    try {
      await mediator.send<Raccordement.RaccordementUseCase>({
        type: 'Réseau.Raccordement.UseCase.ModifierDemandeComplèteRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
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
  `le porteur modifie la proposition technique et financière pour le dossier de raccordement du projet lauréat ayant pour référence {string} avec :`,
  async function (this: PotentielWorld, référenceDossierRaccordement: string, table: DataTable) {
    const exemple = table.rowsHash();
    const dateSignature = new Date(exemple['La date de signature']).toISOString();
    const format = exemple[`Le format de la proposition technique et financière`];
    const content = exemple[`Le contenu de proposition technique et financière`];

    const { identifiantProjet } = this.lauréatWorld;

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
  `un porteur modifie le gestionnaire de réseau du projet avec un gestionnaire non référencé`,
  async function (this: PotentielWorld) {
    await waitForEvents();
    const { identifiantProjet } = this.lauréatWorld;

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
  `le système modifie le gestionnaire de réseau du projet avec un gestionnaire inconnu`,
  async function (this: PotentielWorld) {
    await waitForEvents();
    const { identifiantProjet } = this.lauréatWorld;

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
  `un porteur modifie le gestionnaire de réseau du projet avec le gestionnaire {string}`,
  async function (this: PotentielWorld, raisonSocialGestionnaireRéseau: string) {
    await waitForEvents();
    const { identifiantProjet } = this.lauréatWorld;
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
  `une dreal modifie le gestionnaire de réseau du projet avec le gestionnaire {string}`,
  async function (this: PotentielWorld, raisonSocialGestionnaireRéseau: string) {
    const { identifiantProjet } = this.lauréatWorld;
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
  `l'utilisateur avec le rôle {string} modifie la demande complète de raccordement pour le projet lauréat ayant pour référence {string} avec la référence {string}`,
  async function (
    this: PotentielWorld,
    rôleUtilisateur: string,
    référenceDossierRaccordementActuelle: string,
    nouvelleRéférenceDossierRaccordement: string,
  ) {
    const { identifiantProjet } = this.lauréatWorld;

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
  `le porteur supprime le dossier ayant pour référence {string} du raccordement pour le projet lauréat`,
  async function (this: PotentielWorld, référenceDossier: string) {
    const { identifiantProjet } = this.lauréatWorld;

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
