import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { DateTime } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../potentiel.world.js';
import { convertStringToReadableStream, getRôle, RôleUtilisateur } from '../../../helpers/index.js';

Quand(
  `le porteur transmet une proposition technique et financière pour le projet lauréat`,
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
  `le porteur transmet une proposition technique et financière pour le projet lauréat avec :`,
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
  /(le porteur|la dreal|l'administrateur) modifie la proposition technique et financière$/,
  async function (this: PotentielWorld, rôleUtilisateur: RôleUtilisateur) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;

    await modifierPropositionTechniqueEtFinancière.call(
      this,
      identifiantProjet,
      référenceDossier,
      getRôle.call(this, rôleUtilisateur),
    );
  },
);

Quand(
  /(le porteur|la dreal|l'administrateur) modifie la proposition technique et financière avec :$/,
  async function (this: PotentielWorld, rôleUtilisateur: RôleUtilisateur, datatable: DataTable) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;

    await modifierPropositionTechniqueEtFinancière.call(
      this,
      identifiantProjet,
      référenceDossier,
      getRôle.call(this, rôleUtilisateur),
      datatable.rowsHash(),
    );
  },
);

Quand(
  'le porteur modifie la proposition technique et financière avec les mêmes valeurs',
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    await modifierPropositionTechniqueEtFinancièreAvecLesMêmesValeurs.call(this, identifiantProjet);
  },
);

async function transmettrePropositionTechniqueEtFinancière(
  this: PotentielWorld,
  identifiantProjet: string,
  référence: string,
  data: Record<string, string> = {},
) {
  const { dateSignature, propositionTechniqueEtFinancièreSignée, référenceDossier } =
    this.raccordementWorld.propositionTechniqueEtFinancière.transmettreFixture.créer({
      identifiantProjet,
      référenceDossier: référence,
      ...this.raccordementWorld.propositionTechniqueEtFinancière.transmettreFixture.mapExempleToFixtureValues(
        data,
      ),
    });

  try {
    await mediator.send<Lauréat.Raccordement.TransmettrePropositionTechniqueEtFinancièreUseCase>({
      type: 'Lauréat.Raccordement.UseCase.TransmettrePropositionTechniqueEtFinancière',
      data: {
        dateSignatureValue: dateSignature,
        référenceDossierRaccordementValue: référenceDossier,
        identifiantProjetValue: identifiantProjet,
        propositionTechniqueEtFinancièreSignéeValue: {
          format: propositionTechniqueEtFinancièreSignée.format,
          content: convertStringToReadableStream(propositionTechniqueEtFinancièreSignée.content),
        },
        transmiseLeValue: new Date().toISOString(),
        transmiseParValue: this.utilisateurWorld.porteurFixture.email,
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
}

async function modifierPropositionTechniqueEtFinancière(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  référence: string,
  role: Role.RawType,
  data: Record<string, string> = {},
) {
  const { dateSignature, propositionTechniqueEtFinancièreSignée, référenceDossier } =
    this.raccordementWorld.propositionTechniqueEtFinancière.modifierFixture.créer({
      identifiantProjet: identifiantProjet.formatter(),
      référenceDossier: référence,
      ...this.raccordementWorld.propositionTechniqueEtFinancière.modifierFixture.mapExempleToFixtureValues(
        data,
      ),
    });

  try {
    await mediator.send<Lauréat.Raccordement.RaccordementUseCase>({
      type: 'Lauréat.Raccordement.UseCase.ModifierPropositionTechniqueEtFinancière',
      data: {
        dateSignatureValue: dateSignature,
        référenceDossierRaccordementValue: référenceDossier,
        identifiantProjetValue: identifiantProjet.formatter(),
        propositionTechniqueEtFinancièreSignéeValue: propositionTechniqueEtFinancièreSignée && {
          format: propositionTechniqueEtFinancièreSignée.format,
          content: convertStringToReadableStream(propositionTechniqueEtFinancièreSignée.content),
        },
        rôleValue: role,
        modifiéeLeValue: DateTime.now().formatter(),
        modifiéeParValue: this.utilisateurWorld.récupérerEmailSelonRôle(role),
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
}

async function modifierPropositionTechniqueEtFinancièreAvecLesMêmesValeurs(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
) {
  const { dateSignature, propositionTechniqueEtFinancièreSignée, référenceDossier } =
    this.raccordementWorld.propositionTechniqueEtFinancière.modifierFixture.créer({
      identifiantProjet: identifiantProjet.formatter(),
      référenceDossier:
        this.raccordementWorld.propositionTechniqueEtFinancière.transmettreFixture.référenceDossier,
      dateSignature:
        this.raccordementWorld.propositionTechniqueEtFinancière.transmettreFixture.dateSignature,
      propositionTechniqueEtFinancièreSignée: undefined,
    });

  try {
    await mediator.send<Lauréat.Raccordement.RaccordementUseCase>({
      type: 'Lauréat.Raccordement.UseCase.ModifierPropositionTechniqueEtFinancière',
      data: {
        dateSignatureValue: dateSignature,
        référenceDossierRaccordementValue: référenceDossier,
        identifiantProjetValue: identifiantProjet.formatter(),
        propositionTechniqueEtFinancièreSignéeValue: propositionTechniqueEtFinancièreSignée && {
          format: propositionTechniqueEtFinancièreSignée.format,
          content: convertStringToReadableStream(propositionTechniqueEtFinancièreSignée.content),
        },
        rôleValue: this.utilisateurWorld.porteurFixture.role,
        modifiéeLeValue: DateTime.now().formatter(),
        modifiéeParValue: this.utilisateurWorld.porteurFixture.email,
      },
    });
  } catch (e) {
    this.error = e as Error;
  }
}
