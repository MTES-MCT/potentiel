import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';

import { PotentielWorld } from '../../../potentiel.world.js';
import { getRôle, RôleUtilisateur } from '../../../helpers/index.js';

Quand(
  'le porteur transmet une demande complète de raccordement pour le projet lauréat',
  async function (this: PotentielWorld) {
    await transmettreDemandeComplèteRaccordement.call(
      this,
      this.lauréatWorld.identifiantProjet,
      Email.convertirEnValueType(this.utilisateurWorld.porteurFixture.email),
    );
  },
);

Quand(
  'le système transmet une demande complète de raccordement sans accusé de réception pour le projet lauréat',
  async function (this: PotentielWorld) {
    await transmettreDemandeComplèteRaccordementSansAccuséRéception.call(
      this,
      this.lauréatWorld.identifiantProjet,
      Email.système,
    );
  },
);

Quand(
  'le porteur transmet une demande complète de raccordement pour le projet éliminé',
  async function (this: PotentielWorld) {
    await transmettreDemandeComplèteRaccordement.call(
      this,
      this.éliminéWorld.identifiantProjet,
      Email.convertirEnValueType(this.utilisateurWorld.porteurFixture.email),
    );
  },
);

Quand(
  'le porteur transmet une demande complète de raccordement pour le projet lauréat avec :',
  async function (this: PotentielWorld, datatable: DataTable) {
    await transmettreDemandeComplèteRaccordement.call(
      this,
      this.lauréatWorld.identifiantProjet,
      Email.convertirEnValueType(this.utilisateurWorld.porteurFixture.email),
      datatable.rowsHash(),
    );
  },
);

Quand(
  /(le porteur|la dreal|l'administrateur) modifie la demande complète de raccordement$/,
  async function (this: PotentielWorld, rôleUtilisateur: RôleUtilisateur) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;
    await modifierDemandeComplèteRaccordement.call(
      this,
      identifiantProjet.formatter(),
      référenceDossier,
      getRôle.call(this, rôleUtilisateur),
    );
  },
);

Quand(
  /(le porteur|la dreal|l'administrateur) modifie la demande complète de raccordement avec :/,
  async function (this: PotentielWorld, rôleUtilisateur: RôleUtilisateur, datatable: DataTable) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } =
      this.raccordementWorld.demandeComplèteDeRaccordement.transmettreFixture;
    await modifierDemandeComplèteRaccordement.call(
      this,
      identifiantProjet.formatter(),
      référenceDossier,
      getRôle.call(this, rôleUtilisateur),
      datatable.rowsHash(),
    );
  },
);

Quand(
  /(le porteur|la dreal|l'administrateur) modifie la référence de la demande complète de raccordement pour le projet lauréat$/,
  async function (this: PotentielWorld, rôleUtilisateur: RôleUtilisateur) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;
    await modifierRéférenceDossierRaccordement.call(
      this,
      identifiantProjet.formatter(),
      référenceDossier,
      getRôle.call(this, rôleUtilisateur),
    );
  },
);

Quand(
  /(le porteur|la dreal|l'administrateur) modifie la référence de la demande complète de raccordement pour le projet lauréat avec :/,
  async function (this: PotentielWorld, rôleUtilisateur: RôleUtilisateur, datatable: DataTable) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;
    await modifierRéférenceDossierRaccordement.call(
      this,
      identifiantProjet.formatter(),
      référenceDossier,
      getRôle.call(this, rôleUtilisateur),
      datatable.rowsHash(),
    );
  },
);

export async function transmettreDemandeComplèteRaccordement(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  transmisePar: Email.ValueType,
  data: Record<string, string> = {},
) {
  const { accuséRéception, dateQualification, référenceDossier } =
    this.raccordementWorld.demandeComplèteDeRaccordement.transmettreFixture.créer({
      identifiantProjet: identifiantProjet.formatter(),
      ...this.raccordementWorld.demandeComplèteDeRaccordement.transmettreFixture.mapExempleToFixtureValues(
        data,
      ),
    });

  try {
    await mediator.send<Lauréat.Raccordement.TransmettreDemandeComplèteRaccordementUseCase>({
      type: 'Lauréat.Raccordement.UseCase.TransmettreDemandeComplèteRaccordement',
      data: {
        accuséRéceptionValue: accuséRéception,
        dateQualificationValue: dateQualification,
        identifiantProjetValue: identifiantProjet.formatter(),
        référenceDossierValue: référenceDossier,
        transmiseParValue: transmisePar.formatter(),
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
}

export async function transmettreDemandeComplèteRaccordementSansAccuséRéception(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  transmisePar: Email.ValueType,
) {
  const { dateQualification, référenceDossier, accuséRéception } =
    this.raccordementWorld.demandeComplèteDeRaccordement.transmettreFixture.créer({
      identifiantProjet: identifiantProjet.formatter(),
      accuséRéception: undefined,
    });

  await mediator.send<Lauréat.Raccordement.TransmettreDemandeComplèteRaccordementUseCase>({
    type: 'Lauréat.Raccordement.UseCase.TransmettreDemandeComplèteRaccordement',
    data: {
      dateQualificationValue: dateQualification,
      identifiantProjetValue: identifiantProjet.formatter(),
      référenceDossierValue: référenceDossier,
      transmiseParValue: transmisePar.formatter(),
      accuséRéceptionValue: accuséRéception,
    },
  });
}

export async function transmettreDemandeComplèteRaccordementSansDateDeQualification(
  this: PotentielWorld,
  identifiantProjetValueType: IdentifiantProjet.ValueType,
) {
  const identifiantProjet = identifiantProjetValueType.formatter();

  const { référenceDossier, accuséRéception } =
    this.raccordementWorld.demandeComplèteDeRaccordement.transmettreFixture.créer({
      dateQualification: undefined,
      identifiantProjet,
    });

  const event: Lauréat.Raccordement.DemandeComplèteRaccordementTransmiseEventV2 = {
    type: 'DemandeComplèteDeRaccordementTransmise-V2',
    payload: {
      identifiantProjet,
      accuséRéception,
      identifiantGestionnaireRéseau: this.raccordementWorld.identifiantGestionnaireRéseau,
      référenceDossierRaccordement: référenceDossier,
      dateQualification: undefined,
    },
  };

  await publish(`raccordement|${identifiantProjet}`, event);
}

async function modifierDemandeComplèteRaccordement(
  this: PotentielWorld,
  identifiantProjet: string,
  référence: string,
  role: Role.RawType,
  data: Record<string, string> = {},
) {
  const { accuséRéception, dateQualification, référenceDossier } =
    this.raccordementWorld.demandeComplèteDeRaccordement.modifierFixture.créer({
      identifiantProjet,
      référenceDossier: référence,
      ...this.raccordementWorld.demandeComplèteDeRaccordement.transmettreFixture.mapExempleToFixtureValues(
        data,
      ),
    });

  try {
    await mediator.send<Lauréat.Raccordement.ModifierDemandeComplèteRaccordementUseCase>({
      type: 'Lauréat.Raccordement.UseCase.ModifierDemandeComplèteRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet,
        référenceDossierRaccordementValue: référenceDossier,
        dateQualificationValue: dateQualification,
        accuséRéceptionValue: accuséRéception,
        rôleValue: role,
        modifiéeLeValue: DateTime.now().formatter(),
        modifiéeParValue: this.utilisateurWorld.récupérerEmailSelonRôle(role),
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
    this.raccordementWorld.modifierRéférenceDossierRaccordementFixture.créer({
      identifiantProjet,
      référenceDossier: référence,
      ...this.raccordementWorld.modifierRéférenceDossierRaccordementFixture.mapExempleToFixtureValues(
        data,
      ),
    });

  try {
    await mediator.send<Lauréat.Raccordement.ModifierRéférenceDossierRaccordementUseCase>({
      type: 'Lauréat.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet,
        nouvelleRéférenceDossierRaccordementValue: nouvelleRéférenceDossier,
        référenceDossierRaccordementActuelleValue: référenceDossier,
        rôleValue: role,
        modifiéeLeValue: DateTime.now().formatter(),
        modifiéeParValue: this.utilisateurWorld.récupérerEmailSelonRôle(role),
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
}
