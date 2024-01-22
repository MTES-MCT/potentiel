import { When as Quand, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../../potentiel.world';
import { convertStringToReadableStream } from '../../helpers/convertStringToReadable';
import { mediator } from 'mediateur';
import { Raccordement } from '@potentiel-domain/reseau';
import { DateTime } from '@potentiel-domain/common';

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

    this.raccordementWorld.dateQualification = DateTime.convertirEnValueType(dateQualification);
    this.raccordementWorld.référenceDossierRaccordement =
      Raccordement.RéférenceDossierRaccordement.convertirEnValueType(référenceDossierRaccordement);
    this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement = {
      format,
      content,
    };

    try {
      await mediator.send<Raccordement.RaccordementUseCase>({
        type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
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
        type: 'TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE',
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
        type: 'TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
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
  `le porteur modifie la demande complète de raccordement pour le dossier de raccordement du projet lauréat {string} ayant pour référence {string} auprès du gestionnaire de réseau {string} avec :`,
  async function (
    this: PotentielWorld,
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
        type: 'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          identifiantGestionnaireRéseauValue: codeEIC,
          référenceDossierRaccordementValue: référenceDossierRaccordement,
          dateQualificationValue: dateQualification,
          accuséRéceptionValue: accuséRéception,
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
        type: 'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
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
        type: 'MODIFIER_GESTIONNAIRE_RÉSEAU_RACCORDEMENT_USE_CASE',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          identifiantGestionnaireRéseauValue: 'GESTIONNAIRE NON RÉFÉRENCÉ',
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
        type: 'MODIFIER_GESTIONNAIRE_RÉSEAU_RACCORDEMENT_USE_CASE',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          identifiantGestionnaireRéseauValue: codeEIC,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);
