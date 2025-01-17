import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Raccordement } from '@potentiel-domain/reseau';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { PotentielWorld } from '../../potentiel.world';

Quand(
  'le porteur transmet une demande complète de raccordement pour le projet lauréat',
  async function (this: PotentielWorld) {
    await transmettreDemandeComplèteRaccordement.call(this, this.lauréatWorld.identifiantProjet);
  },
);
Quand(
  'le porteur transmet une demande complète de raccordement pour le projet éliminé',
  async function (this: PotentielWorld) {
    await transmettreDemandeComplèteRaccordement.call(this, this.eliminéWorld.identifiantProjet);
  },
);

Quand(
  'le porteur transmet une demande complète de raccordement pour le projet lauréat avec :',
  async function (this: PotentielWorld, datatable: DataTable) {
    await transmettreDemandeComplèteRaccordement.call(
      this,
      this.lauréatWorld.identifiantProjet,
      datatable.rowsHash(),
    );
  },
);

Quand(
  `le gestionnaire de réseau transmet la date de mise en service {string} pour le dossier de raccordement du projet lauréat`,
  async function (this: PotentielWorld, date: string) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;

    const { dateMiseEnService } = this.raccordementWorld.transmettreDateMiseEnServiceFixture.créer({
      identifiantProjet: identifiantProjet.formatter(),
      référenceDossier,
      dateMiseEnService: new Date(date).toISOString(),
    });
    try {
      await mediator.send<Raccordement.RaccordementUseCase>({
        type: 'Réseau.Raccordement.UseCase.TransmettreDateMiseEnService',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          référenceDossierValue: référenceDossier,
          dateMiseEnServiceValue: dateMiseEnService,
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
  `le porteur transmet une proposition technique et financière pour le dossier de raccordement du projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;

    await transmettrePropositionTechniqueEtFinancière.call(
      this,
      identifiantProjet.formatter(),
      référenceDossier,
    );
  },
);

Quand(
  `le porteur transmet une proposition technique et financière pour le dossier de raccordement du projet éliminé`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.eliminéWorld;
    const { référenceDossier } = this.raccordementWorld;

    await transmettrePropositionTechniqueEtFinancière.call(
      this,
      identifiantProjet.formatter(),
      référenceDossier,
    );
  },
);

Quand(
  `le porteur transmet une proposition technique et financière pour le dossier de raccordement du projet lauréat avec :`,
  async function (this: PotentielWorld, datatable: DataTable) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;

    await transmettrePropositionTechniqueEtFinancière.call(
      this,
      identifiantProjet.formatter(),
      référenceDossier,
      datatable.rowsHash(),
    );
  },
);

Quand(
  /(le porteur|la dreal) modifie la demande complète de raccordement$/,
  async function (this: PotentielWorld, rôleUtilisateur: 'le porteur' | 'la dreal') {
    const { role } = match(rôleUtilisateur)
      .with('le porteur', () => this.utilisateurWorld.porteurFixture)
      .with('la dreal', () => this.utilisateurWorld.drealFixture)
      .exhaustive();

    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;
    await modifierDemandeComplèteRaccordement.call(
      this,
      identifiantProjet.formatter(),
      référenceDossier,
      role,
    );
  },
);

Quand(
  /(le porteur|la dreal) modifie la demande complète de raccordement avec :/,
  async function (
    this: PotentielWorld,
    rôleUtilisateur: 'le porteur' | 'la dreal',
    datatable: DataTable,
  ) {
    const { role } = match(rôleUtilisateur)
      .with('le porteur', () => this.utilisateurWorld.porteurFixture)
      .with('la dreal', () => this.utilisateurWorld.drealFixture)
      .exhaustive();

    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } =
      this.raccordementWorld.transmettreDemandeComplèteRaccordementFixture;
    await modifierDemandeComplèteRaccordement.call(
      this,
      identifiantProjet.formatter(),
      référenceDossier,
      role,
      datatable.rowsHash(),
    );
  },
);

Quand(
  `le porteur modifie la proposition technique et financière pour le dossier de raccordement du projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;

    const { dateSignature, propositionTechniqueEtFinancièreSignée } =
      this.raccordementWorld.modifierPropositionTechniqueEtFinancièreFixture.créer({
        identifiantProjet: identifiantProjet.formatter(),
        référenceDossier,
      });

    try {
      await mediator.send<Raccordement.RaccordementUseCase>({
        type: 'Réseau.Raccordement.UseCase.ModifierPropositionTechniqueEtFinancière',
        data: {
          dateSignatureValue: dateSignature,
          référenceDossierRaccordementValue: référenceDossier,
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
  /(le porteur|la dreal|l'administrateur) modifie la référence de la demande complète de raccordement pour le projet lauréat$/,
  async function (
    this: PotentielWorld,
    rôleUtilisateur: 'le porteur' | 'la dreal' | "l'administrateur",
  ) {
    const { role } = match(rôleUtilisateur)
      .with('le porteur', () => this.utilisateurWorld.porteurFixture)
      .with('la dreal', () => this.utilisateurWorld.drealFixture)
      .with("l'administrateur", () => this.utilisateurWorld.adminFixture)
      .exhaustive();
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;
    await modifierRéférenceDossierRaccordement.call(
      this,
      identifiantProjet.formatter(),
      référenceDossier,
      role,
    );
  },
);

Quand(
  /(le porteur|la dreal) modifie la référence de la demande complète de raccordement pour le projet lauréat avec :/,
  async function (
    this: PotentielWorld,
    rôleUtilisateur: 'le porteur' | 'la dreal',
    datatable: DataTable,
  ) {
    const { role } = match(rôleUtilisateur)
      .with('le porteur', () => this.utilisateurWorld.porteurFixture)
      .with('la dreal', () => this.utilisateurWorld.drealFixture)
      .exhaustive();
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;
    await modifierRéférenceDossierRaccordement.call(
      this,
      identifiantProjet.formatter(),
      référenceDossier,
      role,
      datatable.rowsHash(),
    );
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

async function transmettrePropositionTechniqueEtFinancière(
  this: PotentielWorld,
  identifiantProjet: string,
  référence: string,
  data: Record<string, string> = {},
) {
  const { dateSignature, propositionTechniqueEtFinancièreSignée, référenceDossier } =
    this.raccordementWorld.transmettrePropositionTechniqueEtFinancièreFixture.créer({
      identifiantProjet,
      référenceDossier: référence,
      ...this.raccordementWorld.transmettrePropositionTechniqueEtFinancièreFixture.mapExempleToFixtureValues(
        data,
      ),
    });

  try {
    await mediator.send<Raccordement.RaccordementUseCase>({
      type: 'Réseau.Raccordement.UseCase.TransmettrePropositionTechniqueEtFinancière',
      data: {
        dateSignatureValue: dateSignature,
        référenceDossierRaccordementValue: référenceDossier,
        identifiantProjetValue: identifiantProjet,
        propositionTechniqueEtFinancièreSignéeValue: propositionTechniqueEtFinancièreSignée,
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
}

export async function transmettreDemandeComplèteRaccordement(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  data: Record<string, string> = {},
) {
  const { accuséRéception, dateQualification, référenceDossier } =
    this.raccordementWorld.transmettreDemandeComplèteRaccordementFixture.créer({
      identifiantProjet: identifiantProjet.formatter(),
      ...this.raccordementWorld.transmettreDemandeComplèteRaccordementFixture.mapExempleToFixtureValues(
        data,
      ),
    });

  try {
    await mediator.send<Raccordement.RaccordementUseCase>({
      type: 'Réseau.Raccordement.UseCase.TransmettreDemandeComplèteRaccordement',
      data: {
        accuséRéceptionValue: accuséRéception,
        dateQualificationValue: dateQualification,
        identifiantProjetValue: identifiantProjet.formatter(),
        référenceDossierValue: référenceDossier,
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
}

async function modifierDemandeComplèteRaccordement(
  this: PotentielWorld,
  identifiantProjet: string,
  référence: string,
  role: Role.RawType,
  data: Record<string, string> = {},
) {
  const { accuséRéception, dateQualification, référenceDossier } =
    this.raccordementWorld.modifierDemandeComplèteRaccordementFixture.créer({
      identifiantProjet,
      référenceDossier: référence,
      ...this.raccordementWorld.transmettreDemandeComplèteRaccordementFixture.mapExempleToFixtureValues(
        data,
      ),
    });

  try {
    await mediator.send<Raccordement.RaccordementUseCase>({
      type: 'Réseau.Raccordement.UseCase.ModifierDemandeComplèteRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet,
        référenceDossierRaccordementValue: référenceDossier,
        dateQualificationValue: dateQualification,
        accuséRéceptionValue: accuséRéception,
        rôleValue: role,
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
}

async function modifierRéférenceDossierRaccordement(
  this: PotentielWorld,
  identifiantProjet: string,
  référence: string,
  role: Role.RawType,
  data: Record<string, string> = {},
) {
  const { référenceDossier, nouvelleRéférenceDossier } =
    this.raccordementWorld.modifierRéférenceDossierRaccordement.créer({
      identifiantProjet,
      référenceDossier: référence,
      ...this.raccordementWorld.modifierRéférenceDossierRaccordement.mapExempleToFixtureValues(
        data,
      ),
    });

  try {
    await mediator.send<Raccordement.RaccordementUseCase>({
      type: 'Réseau.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet,
        nouvelleRéférenceDossierRaccordementValue: nouvelleRéférenceDossier,
        référenceDossierRaccordementActuelleValue: référenceDossier,
        rôleValue: role,
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
}
